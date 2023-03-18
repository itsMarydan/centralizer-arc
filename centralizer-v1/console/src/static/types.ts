export const fileTypes = [ "jpg", "pdf", "doc", "svg", "gif", "mp3", "mp4", "eps",
    "tiff", "docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt", ".csv", ".zip", ".tar" ]
export const fileTypesNoDisplay = ["csv", "doc", "mp3", "mp4", "pdf", "ppt", "tar", "tiff", "txt", "xls", "zip"];
export const fileTypesWithDisplay = ["jpg", "png", 'svg'];

export function fileDisplayable(ext: string){
    return fileTypesWithDisplay.includes(ext);
}

export function  fileNonDisplayable(ext: string){
    return fileTypesNoDisplay.includes(ext);
}

export function srcGenerator(ext: string, file: any){
    return fileDisplayable(ext) ? `data:${file.fileType};base64,${file.fileData}` : fileNonDisplayable(ext) ? `/extensions/${ext}.png` : `/extensions/file.png`;
}