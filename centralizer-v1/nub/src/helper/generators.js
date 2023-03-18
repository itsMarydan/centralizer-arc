
export function getFristLenghtcharacters(string, length){
        return string ?  string.slice(0, parseInt(length)): ""
}

export function generateRandomAlphabets(length){
    let text = "";
    const possible = "abcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}



export function generateApplicationSlug(string){
    return string ? `${string.slice(0,3)}-${generateRandomAlphabets(8)}` : "";
}