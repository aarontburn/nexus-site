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


export function imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result as string);
        };
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}

export function readUploadedText(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => {
            resolve(fr.result as string);
        };
        fr.onerror = reject;
        fr.readAsText(file);
    });
}