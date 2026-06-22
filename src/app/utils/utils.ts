export const getAbbreviation = (moduleName: string) => {
    const ABBREVIATION_LENGTH: number = 3;
    const abbreviation: string[] = moduleName.split(" ").map(s => s[0]);
    const out: string[] = [];

    for (let i = 0; i < ABBREVIATION_LENGTH; i++) {
        if (i >= abbreviation.length) {
            break;
        }
        out.push(abbreviation[i]);
    }
    return out.join("");
}

export function platformToDisplayText(platform: string): string {
    switch (platform) {
        case "win32": return "Windows";
        case "linux": return "Linux";
        case "darwin": return "MacOS";
        default: return '';
    }
}


export function imageToBase64(file: File): Promise<string | undefined> {
    return new Promise((resolve) => {
        var fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result as string);
        };
        fr.onerror = () => resolve(undefined);
        fr.readAsDataURL(file);
    });
}

export function readUploadedText(file: File): Promise<string | undefined> {
    return new Promise((resolve) => {
        var fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result as string);
        };
        fr.onerror = () => resolve(undefined);
        fr.readAsText(file);
    });
}

export async function getLatestClientVersion(): Promise<{ version: string, releaseDate: string } | null> {
    try {
        const response = await fetch('https://api.github.com/repos/aarontburn/nexus-core/releases/latest', {
            next: { revalidate: 3600 } // Revalidate every hour
        });

        const body = await response.json();

        const version: string = body["tag_name"];
        const releaseDate: string = body["published_at"];

        return { version, releaseDate };
    } catch (e) {
        console.error("Error fetching latest version of Nexus.");
        console.error(e);
        return null;
    }

}


const MAX_README_SIZE_KB = 5;

export async function retrieveReadmeFromRepository(githubURL: string): Promise<string | Error> {
    // https://github.com/aarontburn/nexus-core
    // https://api.github.com/repos/aarontburn/nexus-core/contents/README.md
    const apiUrl = `${githubURL.replace("github.com", "api.github.com/repos")}/contents/README.md`;

    try {
        const response = await fetch(new URL(apiUrl));
        if (!response.ok) {
            throw new Error("404 README.md not found.");
        }

        const body = await response.json();

        const byteSize = body["size"];
        const encodedContent = body["content"];
        const encoding = body["encoding"]; // usually base64

        if (byteSize > MAX_README_SIZE_KB * 1024) {
            return new Error(`README.md size exceeds 5KB limit (received ${byteSize} bytes)`);
        }

        const decodedContent = Buffer.from(encodedContent, encoding).toString('utf-8');
        return decodedContent;

    } catch (e) {
        const error: Error = e as Error;
        console.error(`Error fetching README.md for repository: ${githubURL}`);
        console.error(error.message);
        return error;
    }
}