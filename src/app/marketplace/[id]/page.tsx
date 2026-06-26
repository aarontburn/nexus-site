"use client";

import { useEffect, useState } from 'react';
import styles from "./styles.module.css"
import "../../develop/[[...markdown-id]]/markdown.css"
import Markdown from 'react-markdown'
import { getAbbreviation, platformToDisplayText } from '../../utils/utils';
import { NexusLogo, VerticalSpacer } from '../../components/Components';
import MarketplaceHeader from '../MarketplaceHeader';
import rehypeRaw from 'rehype-raw';
import { ModuleInfo } from '../types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { isModuleLiked, removeModuleLike, onModuleLiked } from '../server/module-database/likes';
import { getModule, onModuleDownloaded } from '../server/module-database/modules';
import { bookmarkModule, isModuleBookmarked, removeBookmarkedModule } from '../server/module-database/bookmarks';
import { Metadata, ResolvingMetadata } from 'next';

interface PageProps {
    params: Promise<{ id: string }>;
}



export default function ModulePage({ params }: PageProps) {
    const [moduleInfo, setModuleInfo] = useState<ModuleInfo | undefined>();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const _id: string = (await params).id;
            const [cachedModule, resolvingModule]: [ModuleInfo | undefined, Promise<ModuleInfo | undefined>] = await getModule(_id);

            if (cachedModule) {
                setModuleInfo(moduleInfo);
            }
            resolvingModule.then(moduleInfo => {
                if (moduleInfo === undefined) {
                    router.push("/marketplace");
                    return;
                }
                setModuleInfo(moduleInfo)
            });
        })();
    }, []);


    return <>
        <MarketplaceHeader />
        <VerticalSpacer size={"4rem"} />

        <div className={styles["mbody"]}>
            <div className={styles["left"]}></div>
            <div className={styles["right"]}></div>
            <div className={styles["main"]}>
                {
                    !moduleInfo
                        ? <ModuleInfoBodySkeleton />
                        : <ModuleInfoBody moduleInfo={moduleInfo} />
                }

            </div>

        </div>

    </>
}


function ModuleInfoBody({ moduleInfo }: { moduleInfo: ModuleInfo }) {
    const [isModuleLikedStatus, setIsModuleLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(moduleInfo.metadata['like-count']);
    const [moduleIsBookmarked, setIsModuleBookmarked] = useState<boolean>(false);

    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        isModuleLiked(moduleInfo._id).then(setIsModuleLiked);
        isModuleBookmarked(moduleInfo._id).then(setIsModuleBookmarked);
    }, []);


    return <>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

            <div className={styles['image-container']}>
                {
                    moduleInfo.image
                        ? <img
                            src={moduleInfo.image}
                            alt="Module Icon"
                            loading="lazy"
                        />
                        : <p>{getAbbreviation(moduleInfo.name)}</p>

                }

            </div>
            <div className={styles['module-info']}>
                <h1>{moduleInfo?.name}</h1>
                <p>{moduleInfo?.description}</p>
                <div className={styles['tag-container']}>
                    {moduleInfo.tags?.map(tag => <p key={tag}>{tag}</p>)}
                </div>
                <VerticalSpacer size='0.5rem' />
                <p>By {moduleInfo?.author}</p>
                <p style={{ color: "gray" }}>{moduleInfo["module-id"]}</p>
            </div>
        </div>



        <div id={styles['button-container']}>
            <a
                href={`nexus-app://install_${moduleInfo.repository?.replace("https://", '')}/releases/latest/download/${moduleInfo['module-id']}.zip`}
                className={styles['module-link']}
                style={{ backgroundColor: "#2d4677" }}
                onClick={() => onModuleDownloaded(moduleInfo._id, "client")}
            >
                <NexusLogo className={styles['logo']} style={{ backgroundColor: "white" }} width={"1em"} height={"1em"} />
                <p>Install to Nexus</p>
            </a>


            <a
                href={`${moduleInfo.repository}/releases/latest/download/${moduleInfo['module-id']}.zip`}
                className={styles['module-link']}
                target='_blank'
                onClick={() => onModuleDownloaded(moduleInfo._id, "package")}
            >
                <div className={`${styles["download-logo"]} ${styles['logo']}`}></div>
                <p>Manual Download</p>
            </a>

            <a className={styles['module-link']} href={moduleInfo?.repository} target='_blank'>
                <div className={`${styles["git-logo"]} ${styles['logo']}`}></div>
                <p>GitHub</p>
            </a>
        </div>
        <VerticalSpacer size='1rem' />

        <div className={styles["extra-info"]}>
            <div className={styles['like-container']}>
                <span>Likes:</span>
                {likeCount}

                <div className={styles['like-button']} onClick={() => {
                    if (session.status === "authenticated") {
                        if (isModuleLikedStatus) {
                            removeModuleLike(moduleInfo._id)
                                .then(result => {
                                    if (result === undefined) {
                                        setIsModuleLiked(false);
                                        setLikeCount(prev => prev - 1);
                                    }
                                })
                        } else {
                            onModuleLiked(moduleInfo._id)
                                .then(result => {
                                    if (result === undefined) {
                                        setIsModuleLiked(true);
                                        setLikeCount(prev => prev + 1);
                                    }
                                })
                        }
                    } else if (session.status === "unauthenticated") {
                        router.push("/marketplace/login");
                    }
                }}>
                    <p>{!isModuleLikedStatus ? "Like" : "Liked"}</p>
                    <span className={`${styles['logo']} ${styles['like-logo']}`}></span>
                </div>

                <div className={styles['bookmark-button']} onClick={() => {
                    if (session.status === "authenticated") {
                        if (moduleIsBookmarked) {
                            removeBookmarkedModule(moduleInfo._id)
                                .then(result => {
                                    if (result === undefined) {
                                        setIsModuleBookmarked(false);
                                    }
                                })
                        } else {
                            bookmarkModule(moduleInfo._id)
                                .then(result => {
                                    if (result === undefined) {
                                        setIsModuleBookmarked(true);
                                    }
                                })
                        }
                    } else if (session.status === "unauthenticated") {
                        router.push("/marketplace/login");
                    }
                }}>
                    <p>{!moduleIsBookmarked ? "Save" : "Saved"}</p>
                    <span className={`${styles['logo']} ${styles['bookmark-logo']}`}></span>
                </div>


            </div>

            <p><span>Downloads:</span>{moduleInfo.metadata['download-count']}</p>
            <p><span>Upload Date:</span>{moduleInfo.metadata['date-uploaded']?.toLocaleString()}</p>
            <p><span>Modify Date:</span>{moduleInfo.metadata['date-modified']?.toLocaleString()}</p>
            <p><span>Platforms:</span>{moduleInfo.metadata.platforms?.length ? moduleInfo.metadata.platforms.map(platformToDisplayText).join(" ") : "No platform information found."}</p>
        </div>

        <VerticalSpacer size='1rem' />

        {moduleInfo.readme &&
            <div className={styles['readme']}>
                <h2>README</h2>
                <hr />
                <br />
                <div className={'markdown-body'}>
                    <Markdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            a: ({ href, children }) => (
                                <a
                                    href={href}
                                    target={"_blank"}
                                >
                                    {children}
                                </a>
                            ),
                        }}

                    >
                        {moduleInfo.readme}
                    </Markdown>
                </div>
                <VerticalSpacer size='5rem' />
            </div>
        }

    </>
}


function SkeletonBox({ width, height }: { width: string, height: string }) {
    return <div className={`${styles["shimmer"]} ${styles["skeleton-box"]}`} style={{ height: height, width: width }}></div>
}

function ModuleInfoBodySkeleton() {

    return <>
        <div className={styles['shimmer']} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

            <div className={styles['image-container']}>
                <SkeletonBox width='7.5rem' height='7.5rem' />
            </div>

            <div>
                <SkeletonBox width='10rem' height='5rem' />
                <VerticalSpacer size='0.5rem' />

                <SkeletonBox width='10rem' height='2rem' />
            </div>

        </div>
        <VerticalSpacer size={"1rem"} />

        <div id={styles['button-container']}>
            <SkeletonBox width='100%' height='2.5rem' />
        </div>

        <VerticalSpacer size={"1rem"} />

        <SkeletonBox width='15rem' height='5rem' />

        <VerticalSpacer size={"1rem"} />

        <div className={styles['readme']}>
            <h2>README</h2>
            <hr />
            <br />
            <SkeletonBox width='10rem' height='2rem' />

        </div>

    </>
}
