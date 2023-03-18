import { Modal } from "react-bootstrap";

import {Button} from "antd";
import {FileGallery} from "./file-gallery";
import React from "react";
import {FileUpload} from "./file-upload";


interface Props {
    showModal: boolean;
    handleCloseModal: any,
    fileGallery: any,
    appSlug: string,
    onSelect: any
}

export function FileUploadModal(prop: Props){

    return(
        <>
            <Modal
                show={prop.showModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <div className={"minh-400"}>
                        <FileUpload  appSlug={prop.appSlug}/>
                        <FileGallery  files={prop.fileGallery ? prop.fileGallery : []} onSelect={prop.onSelect}/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => prop.handleCloseModal()} type="primary">
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}