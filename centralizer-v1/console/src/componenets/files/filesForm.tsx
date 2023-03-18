import {FileUpload} from "../global/file-upload";
import React from "react";
import {FileGallery} from "../global/file-gallery";

export function FilesFormDash(prop: any){

    return(
        <div>
            <FileUpload  appSlug={prop.appSlug}/>
            <FileGallery  files={prop.fileGallery ? prop.fileGallery : []} onSelect={prop.onSelect}/>
        </div>
    )
}