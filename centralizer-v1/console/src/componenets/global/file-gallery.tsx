import {retrieveFileExt} from "../../helper/retrieve";
import {srcGenerator} from "../../static/types";

interface Props{
    files: any,
    onSelect?: any,
}
export function FileGallery(props: Props){
    return(
        <>
            <div className="div">
                {props.files ?
                    <div className="row">
                        {props.files.map((file: any, key: number) => (
                            <div key={key} onClick={() => props.onSelect(file.fileId)} className="col-md-3 col-sm-6 mt-3">
                                <img key={key} className={"m-2"} alt={file.fileName} width={150} height={100} src={srcGenerator(retrieveFileExt(file.fileName), file)} />
                                <div className={"px-2 overflow-word"}><span className="fw-bold">File Name:  </span><span className="text-muted">{file.fileName}</span></div>
                                <div className={"px-2 overflow-word"}><span className="fw-bold">File Path:  </span><span className="color-blue"> /files/api/files/{file.fileName}</span></div>
                            </div>
                        ))}
                    </div>:
                    null
                }
            </div>
        </>
    )
}