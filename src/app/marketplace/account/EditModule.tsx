import styles from "./account.module.css"


import { SessionContextValue } from "next-auth/react";
import { Ref, useEffect, useRef, useState } from "react";
import { VerticalSpacer, Spinner, HorizontalSpacer } from "../../components/Components";
import { imageToBase64, readUploadedText } from "../../utils/utils";
import { ModuleInfo, editRemoteModule, insertModule } from "../module-database";
import { getGitHubModuleInfo, Response } from "./github-handler";

interface EditModuleScreenProps {
    session: SessionContextValue;
    editTarget: ModuleInfo | null;
    editModule: (moduleInfo: ModuleInfo | null | undefined) => void;
    setNotificationText: (message: string) => void;
}


export type RemoteModuleInfoJSON =
    Omit<ModuleInfo, "module-id" | "repo" | "image" | "readme">
    & {
        "id": string,
    }


export default function EditModuleScreen({ session, editTarget, editModule, setNotificationText }: EditModuleScreenProps) {
    const isNewModule: boolean = editTarget === null;

    /* Refs */
    const githubRepoInputRef: Ref<HTMLInputElement> = useRef(null);
    const imageUploadRef: Ref<HTMLInputElement> = useRef(null);
    const readmeTextRef: Ref<HTMLTextAreaElement> = useRef(null);
    const readmeUploadRef: Ref<HTMLInputElement> = useRef(null);

    /* State */
    const [uploadedImage, setUploadedImage] = useState<File | undefined>(undefined);
    const [uploadedReadme, setUploadedReadme] = useState<File | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [remoteModuleInfo, setRemoteModuleInfo] = useState<RemoteModuleInfoJSON | undefined>(undefined);
    const [useReadmeUpload, setUseReadmeUpload] = useState<boolean>(isNewModule);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);

    const checkGitHubRepo = (repoLink: string | undefined) => {
        if (repoLink) {
            setIsLoading(true);
            getGitHubModuleInfo(repoLink, editTarget?.["module-id"])
                .then((response: Response<RemoteModuleInfoJSON, { code: number, message: string }>) => {

                    setIsLoading(false);
                    if (response.type === "success") {

                        if (response.body["author-id"] === undefined) {
                            setNotificationText("module-info.json doesn't contain 'author-id'. Make sure this is set to your user ID in the latest release.");
                        } else if (response.body["author-id"] !== session.data?.user.id) {
                            setNotificationText("Mismatched author-id; If this is your module, ensure the 'author-id' field of your latest release's module-info.json is correctly set to your user ID.")
                        } else {
                            setNotificationText("Successfully retrieved module-info.json from the GitHub repository.")
                            setRemoteModuleInfo(response.body);
                        }

                    } else {
                        setRemoteModuleInfo(undefined);
                        setNotificationText(response.body.code + " " + response.body.message)
                    }

                })
        } else {
            setNotificationText("Provide a valid link to your GitHub repository (e.g. https://github.com/aarontburn/nexus-debug-console).")
        }
    }

    const onPublishPressed = async () => {
        if (!remoteModuleInfo) {
            console.error("Remote module info is undefined.")
            return;
        }

        setIsPublishing(true);

        const base64Image: string | undefined = await (async () => {
            const uploadedImage: File | undefined = imageUploadRef.current?.files?.[0];
            if (uploadedImage === undefined) { // no image uploaded
                return editTarget?.image; // return the remote image, can be undefined
            }
            return await imageToBase64(uploadedImage);
        })();


        const readme: string | undefined = await (async () => {
            if (useReadmeUpload) {
                const uploadedReadme: File | undefined = readmeUploadRef.current?.files?.[0];
                if (uploadedReadme) {
                    return await readUploadedText(uploadedReadme);
                }
                return editTarget?.image;

            } else {
                return readmeTextRef.current?.value ?? undefined;
            }
        })();

        // author-id should be added in server-side
        const moduleInfo: Omit<ModuleInfo, "_id" | "author-id"> = {
            name: remoteModuleInfo.name,
            "module-id": remoteModuleInfo["id"],
            author: remoteModuleInfo.author,
            version: remoteModuleInfo.version,
            description: remoteModuleInfo.description,
            readme: readme,
            image: base64Image,
            platforms: remoteModuleInfo.platforms,
            repository: githubRepoInputRef.current?.value
        }
        if (isNewModule) {
            insertModule(moduleInfo).then((result: string | undefined) => {
                if (result === undefined) { // success
                    setNotificationText(`Successfully published ${moduleInfo["module-id"]}`)
                    editModule(undefined);
                } else {
                    setNotificationText("Error: " + result);
                }
            })
        } else {
            editRemoteModule(moduleInfo).then((result: string | undefined) => {
                if (result === undefined) { // success
                    setNotificationText("Successfully edited module.")
                    editModule(undefined);
                } else {
                    setNotificationText("Error: " + result);
                }
            })
        }
        setIsPublishing(false);
    }

    useEffect(() => {
        if (editTarget) {
            checkGitHubRepo(editTarget.repository)
        }
    }, []);

    return <div className={styles["edit-screen"]}>

        <div className={styles["aligned"]}>
            <button onClick={() => editModule(undefined)}>
                {'<'} Back
            </button>

            < HorizontalSpacer size="2rem" />

            <p>User ID: <span
                className={styles["user-id"]}
                onClick={() => {
                    if (session.data?.user?.id) {
                        navigator.clipboard.writeText(session.data.user.id);
                    }
                    setNotificationText("Copied user ID to clipboard.");
                }}
            >
                {session.data?.user.id}
            </span>
            </p>

            < HorizontalSpacer />

            <a
                style={{ backgroundColor: "transparent" }}
                className={styles["help-link"]}
                href="/develop/Publishing your Module on the Marketplace.md"
                target="_blank"
            >
                Help
            </a>


        </div>





        <div className={styles["edit-fields"]}>

            <VerticalSpacer size={"1rem"} />

            <div className={styles['edit-field']}>
                <label>GitHub Repository</label>
                <VerticalSpacer size="0.25rem" />
                <input ref={githubRepoInputRef} type="text" disabled={!isNewModule} defaultValue={editTarget?.repository ?? ''} />
            </div>
            <VerticalSpacer size="1rem" />

            <button onClick={() => checkGitHubRepo(githubRepoInputRef.current?.value)}>Check</button>

            <VerticalSpacer size={"1rem"} />
            {isLoading && <Spinner />}

            {remoteModuleInfo && <>

                <VerticalSpacer size={"1rem"} />

                <h1>{remoteModuleInfo.name}</h1>

                <p>{remoteModuleInfo.author}</p>
                <p style={{ color: "gray" }}>{remoteModuleInfo.id} (v{remoteModuleInfo.version})</p>

                <p>{remoteModuleInfo.description}</p>
                <p>{remoteModuleInfo.platforms ?? []}</p>

                <VerticalSpacer size={"1rem"} />


                <p><span style={{ color: "gray" }}>(Optional)</span> Upload an image for your module.</p>
                <VerticalSpacer size={"0.25rem"} />



                <div className={styles["aligned"]}>
                    <input
                        ref={imageUploadRef}
                        type='file'
                        style={{ display: "none" }}
                        onChange={(event) => setUploadedImage((event.target.files ?? [])[0])}
                    />

                    <button onClick={() => { imageUploadRef.current?.click() }}>
                        Upload
                    </button>
                    <HorizontalSpacer size={"1rem"} />
                    <span style={{ color: "gray" }}>{uploadedImage ? `(${uploadedImage.name})` : ''}</span>
                </div>


                <VerticalSpacer size={"1.25rem"} />

                <p><span style={{ color: "gray" }}>(Optional)</span> Upload or type a README.</p>
                <VerticalSpacer size={"0.25rem"} />

                <p className={styles["upload-or-text"]}>
                    <span style={{ color: !useReadmeUpload ? "" : "var(--accent-color)" }} onClick={() => setUseReadmeUpload(true)}>Upload</span>
                    |
                    <span style={{ color: !useReadmeUpload ? "var(--accent-color)" : "" }} onClick={() => setUseReadmeUpload(false)}>Text</span>
                </p>
                <VerticalSpacer size={"0.5rem"} />

                {
                    useReadmeUpload
                        ? <>
                            <input
                                ref={readmeUploadRef}
                                type='file'
                                style={{ display: "none" }}
                                onChange={(event) => setUploadedReadme((event.target.files ?? [])[0])}

                            />

                            <div className={styles["aligned"]}>
                                <button onClick={() => { readmeUploadRef.current?.click() }}>
                                    Upload
                                </button>
                                <HorizontalSpacer size={"1rem"} />
                                <span style={{ color: "gray" }}>{uploadedReadme ? `(${uploadedReadme.name})` : ''}</span>
                            </div>
                        </>
                        : <>
                            <textarea ref={readmeTextRef} defaultValue={editTarget?.readme}></textarea>
                        </>
                }
                <VerticalSpacer size={"2rem"} />

                {isPublishing ? <Spinner /> :
                    <button onClick={() => {
                        onPublishPressed();
                    }}
                        disabled={isPublishing} >
                        Publish
                    </button>
                }

                <VerticalSpacer size={"2rem"} />

            </>}

        </div>


    </div >
}