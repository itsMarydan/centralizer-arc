import {srcGenerator} from "../../static/types";
import {retrieveFileExt} from "../../helper/retrieve";

interface Props{
    file: any
}
export function FileDisplay({file}: Props){
    return (

        <>
            {file &&
                <div>
                    <img className={"m-2"} alt={file.fileName} width={250} height={150} src={srcGenerator(retrieveFileExt(file.fileName), file)} />
                    <div>{file.fileName}</div>
                </div>
            }
        </>
    )
}