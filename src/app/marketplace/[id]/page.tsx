"use client";

import { useEffect, useState } from 'react';
import { getModule, ModuleInfo } from '../NexusDatabase';
import "./styles.css";
import "../marketplace.css"
import Markdown from 'react-markdown'
import { getAbbreviation } from '../../utils/utils';
import "../../page.css"

interface PageProps {
    params: Promise<{ id: string }>;
}


export default function ModulePage({ params }: PageProps) {
    const [moduleInfo, setModuleID] = useState<ModuleInfo | undefined>();
    useEffect(() => {
        (async () => {
            const id: string = (await params).id;
            const module: ModuleInfo | undefined = await getModule(id);
            console.log(module)

            if (module) {
                setModuleID(module);
            }

        })();
    }, []);

    return !moduleInfo ? <></> :
        <div className="page">
            <div className="body mbody">
                <div className="left"></div>
                <div className="right"></div>
                <div className="main">
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                        <div className='image-container'>
                            {
                                moduleInfo.image
                                    ? <img
                                        src={'data:image/png;base64,' + moduleInfo.image}
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
                            <p style={{ color: "gray" }}><span >{moduleInfo?.id}</span><span> (v{moduleInfo?.version})</span></p>

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
                            <div className='md-container'>
                                <Markdown>{moduleInfo.readme}</Markdown>

                            </div>
                        </div>
                    }


                </div>



            </div>
        </div>


}