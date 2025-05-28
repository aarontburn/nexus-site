"use client";

import { useEffect, useState } from 'react';
import { getModule, ModuleInfo } from '../module-database';
import styles from "./styles.module.css"
import "../../develop/[[...markdown-id]]/markdown.css"
import Markdown from 'react-markdown'
import { getAbbreviation } from '../../utils/utils';
import { HorizontalSpacer, NexusLogo, VerticalSpacer } from '../../components/Components';
import MarketplaceHeader from '../MarketplaceHeader';
import { imageOptimizer } from 'next/dist/server/image-optimizer';

interface PageProps {
    params: Promise<{ id: string }>;
}




export default function ModulePage({ params }: PageProps) {
    const [moduleInfo, setModuleInfo] = useState<ModuleInfo | undefined>();
    useEffect(() => {
        (async () => {
            const _id: string = (await params).id;
            const [cachedModule, resolvingModule]: [ModuleInfo | undefined, Promise<ModuleInfo | undefined>] = await getModule(_id);

            if (cachedModule) {
                setModuleInfo(moduleInfo);
            }
            resolvingModule.then(moduleInfo => moduleInfo && setModuleInfo(moduleInfo));
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

function SkeletonBox({ width, height }: { width: string, height: string }) {
    return <div className={`${styles["shimmer"]} ${styles["skeleton-box"]}`} style={{ height: height, width: width }}></div>
}

function ModuleInfoBodySkeleton() {
    return <>
        <div className={styles['shimmer']} style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

            <div className={styles['image-container']}>
                <SkeletonBox width='128px' height='128px' />
            </div>

            <div>
                <SkeletonBox width='10rem' height='3rem' />
                <br />
                <SkeletonBox width='10rem' height='2rem' />
            </div>

        </div>
        <VerticalSpacer size={"0.75rem"} />

        <div id={styles['button-container']}>
            <SkeletonBox width='100%' height='2.5rem' />
        </div>

        <VerticalSpacer size={"1rem"} />


        <div className={styles['readme']}>
            <h2>README</h2>
            <hr />
            <br />
            <SkeletonBox width='10rem' height='2rem' />

        </div>

    </>
}



function ModuleInfoBody({ moduleInfo }: { moduleInfo: ModuleInfo }) {
    return <>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

            <div className={styles['image-container']}>
                {
                    moduleInfo.image
                        ? <img
                            src={moduleInfo.image}
                            alt="Module Icon"
                            style={{ width: 'auto', height: '128px' }}
                        />
                        : <p>{getAbbreviation(moduleInfo.name)}</p>

                }

            </div>
            <div>
                <h1>{moduleInfo?.name}</h1>
                <p>{moduleInfo?.description}</p>
                <br />
                <p>By {moduleInfo?.author}</p>
                <p style={{ color: "gray" }}>{moduleInfo?.["module-id"]}</p>

            </div>

        </div>

        <div id={styles['button-container']}>
            <a
                href={`nexus-app://install_${moduleInfo.repository?.replace("https://", '')}/releases/latest/download/${moduleInfo['module-id']}.zip`}
                className={styles['module-link']}
                style={{ backgroundColor: "#2d4677" }}
            >
                <NexusLogo className={styles['logo']} style={{ backgroundColor: "white" }} width={"1em"} height={"1em"} />
                <p>Install to Nexus</p>
            </a>


            <a
                href={`${moduleInfo.repository}/releases/latest/download/${moduleInfo['module-id']}.zip`}
                className={styles['module-link']}
            >
                <div className={`${styles["download-logo"]} ${styles['logo']}`}></div>
                <p>Manual Download</p>
            </a>

            <a className={styles['module-link']} href={moduleInfo?.repository} target='_blank'>
                {moduleInfo?.repository?.startsWith("https://github") ? <>
                    <div className={`${styles["git-logo"]} ${styles['logo']}`}></div>
                    <p>GitHub</p>
                </>
                    : <>
                        <p>Link</p>
                    </>
                }
            </a>
        </div>

        <VerticalSpacer size='1rem' />

        {moduleInfo.readme &&
            <div className={styles['readme']}>
                <h2>README</h2>
                <hr />
                <br />
                <div className={'markdown-body'}>
                    <Markdown>{moduleInfo.readme}</Markdown>
                </div>
                <VerticalSpacer size='5rem' />
            </div>
        }

    </>
}