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
        case "darwin": return "MaxOS";
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