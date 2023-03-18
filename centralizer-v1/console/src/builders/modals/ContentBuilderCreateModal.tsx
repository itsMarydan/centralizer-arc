import {Modal} from "react-bootstrap";
import {ContentBuilderCreateForm} from "./modalforms/create-content-builder-form";

interface Interface {
    show: boolean;
    handleClose: any;
    appSlug: string
}
export const ContentBuilderCreateModal = ( props: Interface) => {
    return(
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header  closeButton/>
                <Modal.Body>
                    <div className="form">
                        <ContentBuilderCreateForm appSlug={props.appSlug} />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}