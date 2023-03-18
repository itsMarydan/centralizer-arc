export function retrieveFileExt(fileName: string){
    const ext = fileName
        .split('.')
        .filter(Boolean) // removes empty extensions (e.g. `filename...txt`)
        .slice(1)
        .join('.')
    return ext;
}