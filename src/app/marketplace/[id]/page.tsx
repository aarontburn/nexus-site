"use client";

import { useEffect, useState } from 'react';
import { getModule, ModuleInfo } from '../NexusDatabase';
import "./styles.css";
import "../../develop/[[...markdown-id]]/markdown.css"
import Markdown from 'react-markdown'
import { getAbbreviation } from '../../utils/utils';
import "../../page.css"
import { VerticalSpacer } from '../../components/Components';
import MarketplaceHeader from '../MarketplaceHeader';

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

        <div className="page">

            <div className={"body mbody"}>
                <div className="left"></div>
                <div className="right"></div>
                <div className="main">
                    {
                        !moduleInfo
                            ? <ModuleInfoBodySkeleton />
                            : <ModuleInfoBody moduleInfo={moduleInfo} />
                    }

                </div>



            </div>
        </div>

    </>
}

function SkeletonBox({ width, height }: { width: string, height: string }) {
    return <div className='shimmer skeleton-box' style={{ height: height, width: width }}></div>
}

function ModuleInfoBodySkeleton() {
    return <>
        <div className='shimmer' style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

            <div className='image-container'>
                <SkeletonBox width='128px' height='128px' />
            </div>

            <div>
                <SkeletonBox width='10rem' height='3rem' />
                <br />
                <SkeletonBox width='10rem' height='2rem' />
            </div>

        </div>
        <VerticalSpacer size={"0.75rem"} />

        <div id='button-container'>
            <button className='module-link' style={{ width: "50%", backgroundColor: "#2d4677" }}>
                <div className='nexus-logo logo'></div>
                <p>Install to Nexus</p>
            </button>


            <button className='module-link' style={{ width: "50%" }}>
                <div className='download-logo logo'></div>
                <p>Manual Download</p>
            </button>
        </div>

        <VerticalSpacer size={"0.5rem"} />
        <SkeletonBox width='13rem' height='2.5rem' />


        <br />

        <div className='readme'>
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

            <div className='image-container'>
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

        <div id='button-container'>
            <button className='module-link' style={{ width: "50%", backgroundColor: "#2d4677" }}>
                <div className='nexus-logo logo'></div>
                <p>Install to Nexus</p>
            </button>


            <button className='module-link' style={{ width: "50%" }}>
                <div className='download-logo logo'></div>
                <p>Manual Download</p>
            </button>


        </div>

        <a className='module-link' href={moduleInfo?.link} target='_blank'>
            {moduleInfo?.link?.startsWith("https://github") ? <>
                <div className='git-logo logo'></div>
                <p>GitHub</p>
            </>
                : <>
                    <p>Link</p>
                </>
            }
        </a>
        <br />

        {moduleInfo.readme &&
            <div className='readme'>
                <h2>README</h2>
                <hr />
                <br />
                <div className='markdown-body'>
                    <Markdown>{moduleInfo.readme}</Markdown>

                </div>
            </div>
        }

    </>
}