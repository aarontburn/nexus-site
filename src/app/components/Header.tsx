import { NavButton, openLink, Spacer } from './Components';
import githubLogo from '../res/github.png';
import linkedInLogo from '../res/linkedin.png';
import './Header.css';


const FONT_SIZE: string = '1.5em';

export function Header({ callback }: { callback: (v: any) => void }) {
    return <>
        <div id='header'>

            <NavButton displayText={"Aaron Burnham"} callback={() => callback('/')} fontSize={FONT_SIZE} />
            <NavButton displayText={"About"} callback={() => callback('/about')} fontSize={FONT_SIZE} />
            <NavButton displayText={"Projects"} callback={() => callback('/projects')} fontSize={FONT_SIZE} />
            <NavButton displayText={"Nexus"} callback={() => callback('/nexus')} fontSize={FONT_SIZE} />

            <Spacer />

            <div className='header-group external'>
                <NavButton displayText={"LinkedIn"} image={linkedInLogo} callback={() => openLink("LinkedIn")} fontSize={FONT_SIZE} />
                <NavButton displayText={"GitHub"} image={githubLogo} callback={() => openLink("GitHub")} fontSize={FONT_SIZE} />
            </div>


        </div>

    </>
} 