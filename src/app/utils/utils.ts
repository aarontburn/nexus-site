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
