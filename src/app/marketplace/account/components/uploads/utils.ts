import { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react";
import { readUploadedText, retrieveReadmeFromRepository } from "../../../../utils/utils";

const MAX_MARKDOWN_MB: number = 0.5; // 500 KB
const BYTES_PER_MB: number = 1_000_000;


export const onReadmeUploaded = async ({ setReadmeValue, sendNotification, event }: {
    setReadmeValue: Dispatch<SetStateAction<{value: string | undefined}>>, 
    sendNotification: (s: string) => void, 
    event: ChangeEvent<HTMLInputElement>
}) => {

    if (!event.target.files?.length) {
        return;
    }

    const uploadedFile: File | undefined = event.target.files[0];

    if (!uploadedFile) {
        return;
    }

    if (uploadedFile.size > MAX_MARKDOWN_MB * BYTES_PER_MB) {
        sendNotification(`Error: README exceeds the ${MAX_MARKDOWN_MB} MB file limit. (Got ${(uploadedFile.size / BYTES_PER_MB).toFixed(2)} MB)`);
        return;
    }
    const uploadedText: string | undefined = await readUploadedText(uploadedFile);
    setReadmeValue({value: uploadedText});
}


export const retrieveReadmeFromGithub = async ({ setReadmeValue, sendNotification, githubRepoInputRef }: {
    setReadmeValue: Dispatch<SetStateAction<{value: string | undefined}>>,
    sendNotification: (s: string) => void
    githubRepoInputRef: RefObject<HTMLInputElement | null>,
}) => {

    if (!githubRepoInputRef.current) {
        return;
    }

    const githubURL: string = githubRepoInputRef.current.value;

    const readme: string | Error = await retrieveReadmeFromRepository(githubURL);
    if (typeof readme === "string") {
        const readmeByteSize: number = new TextEncoder().encode(readme).length;
        if (readmeByteSize > MAX_MARKDOWN_MB * BYTES_PER_MB) {
            sendNotification(`Error: README exceeds the ${MAX_MARKDOWN_MB} MB file limit. (Got ${(readmeByteSize / BYTES_PER_MB).toFixed(2)} MB)`);
            return;
        }
        sendNotification(`Successfully retrieved README.md`);
        setReadmeValue({ value: readme });
        return;
    }

    sendNotification(`Error: Could not retrieve README.md from ${githubURL}. Reason: ${readme.message}`);
};


const normalizeURL = (url: string) => url.replace(/(?<!:)\/\/+/g, '/');
const markdownImageRegex: RegExp = /(!\[.*?\]\()(.+?)(\))/g;
const htmlImageRegex: RegExp = /(<img[^>]*\s+src=["'])(.*?)(["'])/gi;

export const formatMarkdownImageURLS = ({ readmeTextRef, githubRepoInputRef }: {
    readmeTextRef: RefObject<HTMLTextAreaElement | null>,
    githubRepoInputRef: RefObject<HTMLInputElement | null>
}) => {
    if (!readmeTextRef.current || !githubRepoInputRef.current) {
        return;
    }

    const replacementFunction = (whole: string, start: string, path: string, end: string): string => {
        if (path.startsWith("https:")) {
            return whole;
        }

        const githubLink: string = `${githubRepoInputRef.current!.value}/raw/main/`;
        return normalizeURL(start + githubLink + path.replace(/^(\.+)/, '') + end);
    }

    readmeTextRef.current.value = readmeTextRef.current.value
        .replace(markdownImageRegex, replacementFunction)
        .replace(htmlImageRegex, replacementFunction);
}