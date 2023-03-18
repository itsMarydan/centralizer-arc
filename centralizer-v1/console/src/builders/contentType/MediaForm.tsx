import {FileUploadModal} from "../../componenets/global/file-upload-modal";
import React from "react";
import {Button} from "antd";
import {AiOutlineUpload} from "react-icons/ai";
import {FileGallery} from "../../componenets/global/file-gallery";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchContentList, selectFileGallery, setFileGallery} from "../../features/contents/contentsSlice";
import axiosClient from "../../api/axiosClient";
import {GLOBAL_API} from "../../static/api-url";

interface MediaFormProps{
    onChange: any
    name: string,
    id: string,
    appSlug: string
    showMediaModal: any,
    setShowMediaModal: any
}



export function MediaForm({ onChange,name, id, appSlug,showMediaModal, setShowMediaModal}: MediaFormProps){
    const  handleCloseModal= () => setShowMediaModal(false);
    const handleShowModal = () => setShowMediaModal(true);
    const [selectedFile, setSelectedFile ] = React.useState(null);
    const fileGallery = useAppSelector(selectFileGallery);
    const dispatch = useAppDispatch();
    async function retrieveFiles() {
        const files: any = await axiosClient.get(GLOBAL_API.GET_FILE_BY_APP());
        dispatch(setFileGallery(files));

    }
    React.useEffect( () => {
       retrieveFiles().then();

    }, [ appSlug]);



    return(
        <>
            <div className="form">
                <div className="form-group">
                    <label htmlFor={id}>{name}:  {selectedFile ? `File ID:  ${selectedFile}` : "No File Selected"}</label>
                    {/*<input type="file" name="file" onChange={onChange} className="form-control-file" id={id} />*/}
                </div>
            </div>
            <div className="my-3">
                <Button onClick={() => handleShowModal()} type="primary" icon={<AiOutlineUpload />} size={"large"}>
                    Upload or Select
                </Button>
            </div>
            
            <FileUploadModal  handleCloseModal={handleCloseModal} showModal={showMediaModal} fileGallery={fileGallery} appSlug={appSlug} onSelect={onChange}/>
        </>
    )
}