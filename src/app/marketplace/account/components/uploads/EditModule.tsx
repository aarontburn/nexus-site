import styles from "./edit.module.css";
import globalStyles from "../../globals.module.css";

import "./tag.css"

import { SessionContextValue } from "next-auth/react";
import { Ref, RefObject, useEffect, useRef, useState } from "react";
import { VerticalSpacer, Spinner, HorizontalSpacer } from "../../../../components/Components";
import { imageToBase64, readUploadedText } from "../../../../utils/utils";
import { getGitHubModuleInfo, Response } from "../../../server/github-handler";
import { SEPARATORS, WithContext as ReactTags, Tag } from "react-tag-input";
import { ModuleInfo, ModuleInfoWithoutServerSideProperties, RemoteModuleInfoJSON } from "../../../types";
import { insertModule, editRemoteModule } from "../../../server/module-database/modules";

interface EditModuleScreenProps {
    session: SessionContextValue;
    editTarget: ModuleInfo | null;
    editModule: (moduleInfo: ModuleInfo | null | undefined) => void;
    setNotificationText: (message: string) => void;
    triggerRefresh: () => void;

}

const MAX_IMAGE_MB: number = 6;
const MAX_MARKDOWN_MB: number = 0.5; // 500 KB
const BYTES_PER_MB: number = 1_000_000;


const Gray = ({ children }: { children?: any }) => {
    return <span style={{ color: "gray" }}>{children}</span>
}


export default function EditModuleScreen({ triggerRefresh, session, editTarget, editModule, setNotificationText }: EditModuleScreenProps) {
    const isNewModule: boolean = editTarget === null;

    /* Refs */
    const githubRepoInputRef: Ref<HTMLInputElement> = useRef(null);
    const imageUploadRef: Ref<HTMLInputElement> = useRef(null);
    const readmeTextRef: Ref<HTMLTextAreaElement> = useRef(null);
    const readmeUploadRef: Ref<HTMLInputElement> = useRef(null);

    /* State */
    const [tags, setTags] = useState<Tag[]>(editTarget?.tags?.map(tag => ({ id: tag, className: '', text: tag })) ?? []);
    const [uploadedImage, setUploadedImage] = useState<File | undefined>(undefined);
    const [uploadedImageForceUpdate, forceUpdateImage] = useState<number>(0);
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

    const formatMarkdownImageURLS = () => {
        if (!readmeTextRef.current || !githubRepoInputRef.current) {
            return;
        }

        const normalizeURL = (url: string) => url.replace(/(?<!:)\/\/+/g, '/')


        const markdownImageRegex: RegExp = /(!\[.*?\]\()(.+?)(\))/g;
        const htmlImageRegex: RegExp = /(<img[^>]*\s+src=["'])(.*?)(["'])/gi;

        readmeTextRef.current.value = readmeTextRef.current.value.replace(markdownImageRegex,
            (whole: string, start: string, path: string, end: string) => {
                if (path.startsWith("https:")) {
                    return whole;
                }

                const githubLink: string = `${githubRepoInputRef.current!.value}/raw/main/`;
                return normalizeURL(start + githubLink + path.replace(/^(\.+)/, '') + end);
            });

        readmeTextRef.current.value = readmeTextRef.current.value.replace(htmlImageRegex,
            (whole: string, start: string, path: string, end: string) => {
                if (path.startsWith("https:")) {
                    return whole;
                }

                const githubLink: string = `${githubRepoInputRef.current!.value}/raw/main/`;
                return normalizeURL(start + githubLink + path.replace(/^(\.+)/, '') + end);
            });
    }



    const onPublishPressed = async () => {
        if (!remoteModuleInfo) {
            console.error("Remote module info is undefined.");
            return;
        }

        // refs that are always active
        const refs: RefObject<HTMLElement | null>[] = [
            imageUploadRef,
            githubRepoInputRef,
        ];

        if (refs.some(ref => !ref || !ref.current)) {
            return;
        }



        const base64Image: string | undefined | null = await (async () => {
            const uploadedImage: File | undefined = imageUploadRef.current!.files?.[0];
            if (uploadedImage === undefined) { // no image uploaded
                return editTarget?.image; // return the remote image, can be undefined
            }

            if (uploadedImage.size > MAX_IMAGE_MB * BYTES_PER_MB) {
                setNotificationText(`Error: Image icon exceeds the ${MAX_IMAGE_MB} MB file limit. (Got ${(uploadedImage.size / BYTES_PER_MB).toFixed(2)} MB)`);
                return null;
            }
            return await imageToBase64(uploadedImage);
        })();

        if (base64Image === null) {
            return;
        }

        const readme: string | undefined | null = await (async () => {
            if (useReadmeUpload) {
                const uploadedReadme: File | undefined = readmeUploadRef.current!.files?.[0];
                if (uploadedReadme) {
                    if (uploadedReadme.size > MAX_MARKDOWN_MB * BYTES_PER_MB) {
                        setNotificationText(`Error: README exceeds the ${MAX_MARKDOWN_MB} MB file limit. (Got ${(uploadedReadme.size / BYTES_PER_MB).toFixed(2)} MB)`);
                        return null;
                    }
                    return await readUploadedText(uploadedReadme);
                }
                return editTarget?.readme;

            } else {
                return readmeTextRef.current?.value ?? undefined;
            }
        })();
        if (readme === null) {
            return;
        }


        setIsPublishing(true);

        // author-id should be added in server-side
        const moduleInfo: ModuleInfoWithoutServerSideProperties = {
            name: remoteModuleInfo.name,
            "module-id": remoteModuleInfo["id"],
            version: remoteModuleInfo.version,
            description: remoteModuleInfo.description,
            readme: readme,
            image: base64Image,
            repository: githubRepoInputRef.current!.value,
            tags: tags.map(tag => tag.text),

            metadata: {
                platforms: remoteModuleInfo.platforms,
                "date-uploaded": editTarget?.metadata["date-uploaded"],
                "date-modified": editTarget?.metadata["date-modified"],
                "download-count": editTarget?.metadata["download-count"],
                "like-count": editTarget?.metadata["like-count"]
            }
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
        triggerRefresh();
        setIsPublishing(false);
    }

    useEffect(() => {
        if (editTarget) {
            checkGitHubRepo(editTarget.repository)
        }
    }, []);

    useEffect(() => {
        if (uploadedReadme) {
            setUseReadmeUpload(false);
            readUploadedText(uploadedReadme).then(text => {
                if (readmeTextRef.current) readmeTextRef.current.value = `${text}`
            })
        }

    }, [uploadedReadme])

    return <div className={styles["edit-screen"]}>

        <div className={styles["aligned"]}>
            <button className={globalStyles["button"]} onClick={() => editModule(undefined)}>
                {'<'} Back
            </button>

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


        <div className={styles["edit-body"]}>

            <VerticalSpacer size={"1rem"} />

            <div className={styles['edit-field']}>
                <label>GitHub Repository</label>
                <VerticalSpacer size="0.25rem" />
                <input ref={githubRepoInputRef} type="text" disabled={!isNewModule} defaultValue={editTarget?.repository ?? ''} />
            </div>
            <VerticalSpacer size="1rem" />

            <button className={globalStyles["button"]} onClick={() => checkGitHubRepo(githubRepoInputRef.current?.value)}>Check</button>

            <VerticalSpacer size={"1rem"} />
            {isLoading && <Spinner />}

            {remoteModuleInfo && <>

                <VerticalSpacer size={"1rem"} />

                <h1>{remoteModuleInfo.name}</h1>

                <p>{remoteModuleInfo.author}</p>
                <p><Gray>{remoteModuleInfo.id} (v{remoteModuleInfo.version})</Gray></p>

                <p>{remoteModuleInfo.description}</p>
                <p>{remoteModuleInfo.platforms ?? []}</p>

                <VerticalSpacer size={"1rem"} />

                <p><Gray>(Optional)</Gray> Add up to 10 tags (comma-separated). The first three will appear on the preview.</p>
                <VerticalSpacer size={"0.25rem"} />

                <ReactTags
                    placeholder="Enter tags that describe your module."
                    tags={tags}
                    inputFieldPosition="top"
                    maxTags={10}
                    maxLength={25}
                    separators={[SEPARATORS.ENTER, SEPARATORS.COMMA]}
                    handleDelete={(index: number) => setTags(tags.filter((_, i) => i !== index))}
                    handleAddition={(tag: Tag) => {
                        tag.text = tag.text.toLowerCase();
                        setTags((prevTags) => {
                            return [...prevTags, tag];
                        });
                    }}
                    handleDrag={(tag: Tag, currPos: number, newPos: number) => {
                        const newTags = tags.slice();

                        newTags.splice(currPos, 1);
                        newTags.splice(newPos, 0, tag);

                        // re-render
                        setTags(newTags);
                    }}
                    allowAdditionFromPaste={false}
                    clearAll
                    onClearAll={() => setTags([])}

                />
                <VerticalSpacer size="1rem" />


                <p><Gray>(Optional)</Gray> Upload an icon for your module <Gray>(max 6 MB)</Gray>.</p>
                <VerticalSpacer size={"0.25rem"} />

                <div className={styles["aligned"]}>
                    <input
                        ref={imageUploadRef}
                        type='file'
                        style={{ display: "none" }}
                        onChange={(event) => setUploadedImage((event.target.files ?? [])[0])}
                    />

                    <button className={globalStyles["button"]} onClick={() => { imageUploadRef.current?.click() }}>
                        Upload
                    </button>
                    <HorizontalSpacer size={"1rem"} />

                    <Gray>
                        {uploadedImage || editTarget?.image
                            ? <>{`(${uploadedImage?.name ? uploadedImage.name : (editTarget?.image ? "uploaded_image" : '')})`}{' '}
                                <span
                                    className={styles["remove-image"]}
                                    key={uploadedImageForceUpdate}
                                    onClick={() => {
                                        if (uploadedImage && imageUploadRef.current) {
                                            imageUploadRef.current.value = '';
                                        } else if (editTarget?.image) {
                                            editTarget.image = undefined;
                                        }

                                        setUploadedImage(undefined);
                                        forceUpdateImage(prev => prev + 1);
                                    }}
                                >
                                    X
                                </span></>
                            : ''}
                    </Gray>
                </div>


                <VerticalSpacer size={"1.25rem"} />

                <p><Gray>(Optional)</Gray> Upload or type a README.</p>
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
                                <button className={globalStyles["button"]} onClick={() => { readmeUploadRef.current?.click() }}>
                                    Upload
                                </button>
                                <HorizontalSpacer size={"1rem"} />
                                <Gray>{uploadedReadme ? `(${uploadedReadme.name})` : ''}</Gray>
                            </div>
                        </>
                        : <div className={styles["readme-input-area"]}>
                            <textarea ref={readmeTextRef} defaultValue={editTarget?.readme}></textarea>
                            <VerticalSpacer size="1rem" />
                            <button className={globalStyles["button"]} onClick={formatMarkdownImageURLS}>Replace relative image paths with absolute paths</button>
                        </div>
                }
                <VerticalSpacer size={"2rem"} />

                {isPublishing ? <Spinner /> :
                    <button className={globalStyles["button"]} onClick={() => {
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


