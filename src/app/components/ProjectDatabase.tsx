import placeholderImage from '../res/placeholder_image.png';
import modulesImage from './images/modules.png';
import linkedpadImage from './images/linkedpad.png';
import wordPredictionImage from './images/fantasywordprediction.png';
import studySpaceSearchImage from './images/studyspacesearch.png';
import skillSeekerImage from './images/skillseeker.png';
import { List, openLink } from './Components';
import { ReactNode } from 'react';
import { BoldSectionHeader } from '../pages/ProjectDetailsPage';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";


export interface ProjectDetails {
    id: string,
    name: string,
    desc: string,
    image: string,
    stack: TechnologyStack
    longDesc?: string | React.ReactNode,
    features?: string | React.ReactNode,
    repoLink?: string | ReactNode
}




export interface TechnologyStack {
    languages?: string[],
    frameworksOrLibraries?: string[],
    technologies?: string[],
    others?: string[]
}

const Bold = ({ children }: { children?: ReactNode }) => <span style={{ fontWeight: 550 }}>{children}</span>;
const Italic = ({ children }: { children?: ReactNode }) => <span style={{ fontStyle: "italic" }}>{children}</span>
const Link = ({ link, children }: { link: string, children?: ReactNode }) => <span
    style={{ color: 'blue', cursor: 'pointer', fontStyle: 'italic' }}
    onClick={() => openLink(link)}>
    {children}
</span>

const projects: ProjectDetails[] = [
    {
        id: 'nexus',
        name: "Nexus",
        desc: "Cross-platform desktop to enable to creation and installation of Node.js plugins.",
        image: modulesImage,
        repoLink: 'https://github.com/aarontburn/modules',
        stack: {
            languages: ["JavaScript", "TypeScript", "HTML", "CSS", "Markdown", "JSON"],
            frameworksOrLibraries: ["Electron.JS", "Node.JS"],
            technologies: ["Git/GitHub", "Electron Builder"]
        },
        longDesc: <>
            <p>
                <Bold>Modules</Bold> is a platform for both developers and users
                to install and create <Italic>Node.JS</Italic> plugins, called a <Italic>module</Italic>.

                Unlike other widgetable applications, <Bold>Modules</Bold> was built with the idea
                that anything that could be made using <Italic>Node.JS</Italic> could be turned into
                a <Italic>module</Italic> and be able to be housed within a single application.
            </p>

            <h3 style={{ marginTop: '1em' }}><Bold>Example:</Bold> Volume Controller</h3>
            <p>
                <Link link='https://github.com/aarontburn/modules-volume_controller'>https://github.com/aarontburn/modules-volume_controller</Link>
            </p>
            <br />
            <p>
                The <Italic>Volume Controller</Italic> module is a functional example of what
                you can make using this API. It uses two external packages found on
                the <Italic>NPM</Italic> repository:
                the <Link link='https://www.npmjs.com/package/native-sound-mixer'>native-sound-mixer
                </Link> and <Link link='https://www.npmjs.com/package/node-window-manager'>node-window-manager</Link>

                . This <Italic>module</Italic> works similar to the Windows Sound Mixer, where
                you can control the volume of all sound-producing processes, as well as the
                master volume.
            </p>


        </>,
        features: <>
            <ul className='features-list'>
                <List text={<Bold>Developer Features:</Bold>}>
                    <List text='Streamlined developer API'>
                        <li>Includes scripts and tools to export modules.</li>
                        <List text={<>Includes boilerplate repository.</>}>
                            <p>
                                <Link link='https://github.com/aarontburn/modules-module-quickstart'>
                                    https://github.com/aarontburn/modules-module-quickstart
                                </Link>
                            </p>
                        </List>
                        <List text='Inter-Module Communication (IMC)'>
                            <li>
                                A <Italic>module</Italic> can expose an API that can be accessed from other <Italic>modules</Italic>.
                            </li>
                        </List>
                        <List text='Simplified setting management'>
                            <li>Streamlined state management and storage.   </li>
                        </List>
                        <li>Extensive documentation (inline, JSDoc, Markdown) for developer-relevant files, classes/objects, and functions.</li>
                    </List>

                    <List text='Zero developer restrictions'>
                        <li>Full access to <Italic>Node.JS</Italic> packages</li>
                        <li>Full access to <Italic>NPM</Italic> packages</li>
                    </List>
                </List>

                <List text={<Bold>User Features:</Bold>}>
                    <List text={<>Simplified <Italic>module</Italic> management.</>}>
                        <li>In-app features to add or remove modules</li>
                    </List>

                </List>


            </ul>
        </>

    },
    {
        id: 'linkedpad',
        name: "Linked Pad",
        desc: "A custom macropad with twenty customizable keys and an interactive LED device between another Linked Pad.",
        image: linkedpadImage,
        stack: {
            languages: ["JavaScript", "TypeScript", "HTML", "CSS", "Python", "JSON"],
            frameworksOrLibraries: ["Node.JS, Electron.JS", "Robot.JS"],
            technologies: [
                "MongoDB",
                "SSH",
                "Serial Communication",
                "Autodesk Fusion",
                "Git/GitHub",
                'Visual Studio Code',
            ],
            others: [
                "3D Modeling",
                'Soldering',
                'Raspberry Pi',
                'Linux',
            ]
        },
        repoLink: <>
            <p>
                PC: <Link link='https://github.com/aarontburn/linkedpad-pc'>
                    GitHub Repository
                </Link>
            </p>

            <p>
                Raspberry Pi: <Link link='https://github.com/aarontburn/linkedpad-raspberry-pi'>
                    GitHub Repository
                </Link>
            </p>
        </>,
        features: <>
            <ul className='features-list'>
                <List text='Programmable Macro Pad'>
                    <List text='4x5 key pad with 20 fully programmable keys'>

                        <List text={<>Two input modes: <Italic>'text'</Italic> and <Italic>'keys'</Italic></>}>
                            <li><Bold>Text: </Bold>Upon key press, types a string.</li>


                            <List text={<><Bold>Keys: </Bold>A sequence of four keys that, when pressed, execute the sequence.</>}>
                                <li><Italic>e.g.</Italic> [<Bold>"田 Win"</Bold> + <Bold>"R"</Bold>] to quickly open the 'Run' system tool.</li>
                                <li><Italic>e.g.</Italic> [<Bold>"Ctrl"</Bold> + <Bold>"+"</Bold>] and [<Bold>"Ctrl"</Bold> + <Bold>"-"</Bold>] to manage zoom on browsers.</li>
                            </List>
                        </List>
                    </List>

                    <List text='Complete key map, including:'>
                        <li>Alphanumeric keys (A-Z, 0-9)</li>
                        <li>Symbols (<Italic>e.g.</Italic> '!', '?', '@')</li>
                        <li>Modifiers (<Italic>e.g.</Italic> 'Ctrl', 'Alt', 'Shift')</li>
                        <li>Controls (<Italic>e.g.</Italic> 'Backspace', 'Delete', 'Enter')</li>
                        <li>Numpad keys</li>
                        <li>Function keys (F1 - F24)</li>
                        <li>Caps lock and Num lock</li>
                        <li>Audio controls (<Italic>e.g.</Italic> mute/unmute, volume increase/decrease, play/pause)</li>
                        <li>Mouse clicks (<Italic>e.g.</Italic> left, right, and middle)</li>
                    </List>
                </List>

                <List text={`'Linked Mode': Converts the macro functionality into a synced LED light pad.`}>
                    <li>Syncs up with another Linked Pad; any changes in the LED sequence are reflected on both ends.</li>
                    <li>Support for custom colors and brightness</li>

                    <List text='Standalone mode'>
                        <li>If WiFi is set up using a PC and the software, the Linked Pad will be able to function in 'linked mode' without a PC.</li>
                    </List>
                </List>
            </ul>
            <br />
            <h1 style={{ fontWeight: 550, fontSize: 32 }}>Planned Improvements</h1>
            <ul className='features-list'>
                <li>Rebuild the UI using React.JS</li>
                <List text='Add additional input modes, such as:'>
                    <List text='Command line: Execute command line operations.'>
                        <li>Will be useful in opening applications or doing operations quickly.</li>
                        <li>e.g. 'start chrome "www.google.com"' can be used to open Google Chrome to a specified URL.</li>
                    </List>

                    <List text='JavaScript files: creating and executing JavaScript scripts.'>
                        <li>Will be useful in creating complex macros.</li>
                        <li>e.g. Creating a macro access the Spotify API to modify the application volume.</li>
                    </List>
                </List>

            </ul>

        </>
    },
    {
        id: "imagetransformationcasestudy",
        name: "Case Study: Image Transformation in Java vs. Python",
        desc: "A case study to compare Java and Python with image processing on AWS.",
        repoLink: "https://github.com/aarontburn/Java-vs-Python-Image-Processing",
        image: placeholderImage,
        stack: {
            languages: ["Java", "Python", "JavaScript"],
            technologies: [
                "Amazon Web Services (AWS)",
                "AWS Lambda",
                "Amazon S3",
                "Amazon API Gateway",
                "AWS Identify and Access Management (IAM)",
                "Git/GitHub",
                "Visual Studio Code",
                "IntelliJ IDEA"
            ],
            frameworksOrLibraries: ["Node.JS", "PIL", "Boto3"],
            others: ["REST API"]
        },
        features: <>
            <ul className='features-list'>
                <List text={<Bold>Functional:</Bold>}>
                    <List text="Six image transformation functions, including:">
                        <List text={<Bold>Image Details</Bold>}>
                            <li>Retrieve image details (height, width, color mode, and transparency)</li>
                        </List>

                        <List text={<Bold>Image Rotation</Bold>}>
                            <li>Rotates an image 90, 180, or 270 degrees.</li>
                        </List>

                        <List text={<Bold>Image Resize</Bold>}>
                            <li>Resizes an image to a specified width and height.</li>
                        </List>

                        <List text={<Bold>Image Grayscale</Bold>}>
                            <li>Converts an image to grayscale.</li>
                        </List>

                        <List text={<Bold>Image Brightness</Bold>}>
                            <li>Modifies the brightness of an image.</li>
                        </List>

                        <List text={<Bold>Image Type Conversion</Bold>}>
                            <li>Converts an image of one file type to another (e.g. 'png' to 'jpg' ).</li>
                        </List>
                    </List>
                    <li>Includes a batch function to execute use multiple filters on a single image.</li>
                    <li>Includes a script to mass-update all AWS Lambda functions automatically.</li>
                </List>
                <List text={<Bold>Metrics:</Bold>}>
                    <List text="Metrics collected:">
                        <List text={<Bold>Runtime (ms)</Bold>}>
                            <li>Time from function invocation to completion.</li>
                        </List>
                        <List text={<Bold>Memory Usage (MB)</Bold>}>
                            <li>Total memory consumption during execution.</li>
                        </List>
                        <List text={<Bold>Throughput (images/second)</Bold>}>
                            <li>Number of images processed per second.</li>
                        </List>
                        <List text={<Bold>Cost (USD)</Bold>}>
                            <li>Estimated runtime cost.</li>
                        </List>
                    </List>
                </List>
            </ul>
            <BoldSectionHeader>Results:</BoldSectionHeader>
            {(() => {
                const docs = [{ uri: require("./pdfs/project_report.pdf") }];
                return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} className='pdf' />
            })()}
            <br />
            <BoldSectionHeader>Raw Metrics:</BoldSectionHeader>
            {(() => {
                const docs = [{ uri: require("./pdfs/project_metrics.pdf") }];
                return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} className='pdf' />
            })()}

        </>
    },


    {
        id: 'studyspacesearch',
        name: "Study Space Search",
        desc: "Locate and discover study locations around the University of Washington campus.",
        image: studySpaceSearchImage,
        stack: {
            languages: ["JavaScript", "SQL", "PHP", "HTML", "CSS"],
            technologies: ["Google Cloud Platform (GCP)", "Google Firebase", "MySQL"],
            others: ["ICEcoder"]
        },
        features: <ul className='features-list'>
            <List text="Displays various study locations around the University of Washington Tacoma campus, including:">
                <li>Location (address, building, room)</li>
                <li>Operating hours</li>
                <li>Space owner</li>
                <li>Space amenities (whiteboard, microwave, etc.)</li>
                <li>Image</li>
            </List>
            <li>Filtering specific spaces to fit a criteria.</li>
            <List text={<Bold>User Profiles</Bold>}>
                <li>Registered users can bookmark spaces and view them in a dedicated page.</li>
                <li>Registered users can leave comments and score a location by noise level,
                    availability, and busyness for other users to see.</li>
            </List>

        </ ul>
    },
    {
        id: 'fantasywordprediction',
        name: "Fantasy Language Word Prediction",
        desc: "Perform word prediction in Star Treks Vulcan language.",
        image: wordPredictionImage,
        stack: {
            languages: ["Python"],
            frameworksOrLibraries: ["NLTK", "Tkinter"],
            others: ["Natural Language Processing (NLP)"]
        },
        longDesc: <>
            <p>
                This project explored Natural Language Processing (NLP), which resulted in
                an application that allows the user to do word prediction
                in <Italic>Star Trek's</Italic> <Bold>Vulcan</Bold> language.
            </p>

            <h3 style={{ marginTop: '1em' }}><Bold>Model Summary</Bold></h3>
            <p>
                Using a dataset of ~1.5 million words, we trained both a bigram statistical model
                and a trigram statistical model.
            </p>

            <h3 style={{ marginTop: '1em' }}><Bold>Limitations</Bold></h3>
            <p>
                One of the limitations we faced was acquiring a dataset. There wasn't enough pre-translated
                Vulcan text, so we used an <Link link='https://funtranslations.com/vulcan'>English-to-Vulcan</Link> translator.
                While this seemed to work, we couldn't guarantee that this issue was accurate for complex
                words and grammatical structures due to a lack of Vulcan-to-English translators.
            </p>

        </>,
        features: <ul className='features-list'>
            <List text='Clean dataset'>
                <li>
                    Implemented a custom dataset cleaner to strip away illegal characters and replace character
                    variants with their standardized version (<Italic>e.g.</Italic> “ (U+201C) → ” (U+0022))
                </li>
            </List>
            <List text="Custom word parser">
                <li>
                    The training process uses a non-standard word tokenizer to accommodate
                    Vulcan's unique punctuation.
                </li>
            </List>
            <li>Upon typing a word in, predicts and provides the three most-common subsequent words.</li>



        </ul>
    },

    {
        id: 'skillseeker',
        name: "Skill Seeker",
        desc: "Web application to network with others and browse job opportunities.",
        image: skillSeekerImage,
        repoLink: 'https://github.com/atburn/skill_seeker',
        stack: {
            languages: ["JavaScript"],
            frameworksOrLibraries: ["React.JS, Node.JS, Express.JS", 'Axios'],
            technologies: [
                "MongoDB",
                "Google Firebase",
                'Git/GitHub',
                'Visual Studio Code',
            ],
            others: [
                'MERN Stack',
                'RESTful API'
            ]
        },
        features: <>
            <ul className='features-list'>
                <List text='Created an extensive RESTful API to manage CRUD operations.'>
                    <li><Italic>e.g.</Italic> user management, job management, etc.</li>
                </List>
                <List text='User Profiles'>
                    <li>Utilized Google Firebase authentication to create a secure login and user management system.</li>
                    <li>
                        Users can create a public profile with pertinent information for job seeking and networking, such as
                        email, education, work history, and more.

                    </li>
                </List>
                <List text='Job Postings'>
                    <li>Allowed for users to browse, filter, and apply to jobs.</li>
                </List>
                <li>Vibrant and easy-to-navigate user interface.</li>


            </ul>
        </>
    },


]

export class ProjectDatabase {

    public static getProjects(): ProjectDetails[] {
        return projects;
    }

    public static getProjectByID(id: string): ProjectDetails | undefined {
        for (const project of projects) {
            if (project.id === id) {
                return project;
            }
        }

        return undefined;
    }


}




