import {Modal} from "react-bootstrap";
import {CreateFormBuilderForm} from "./modalforms/create-form-builder-form";

interface Interface {
    show: boolean;
    handleClose: any;
    appSlug: string
}
export const FormBuilderCreateModal = ( props: Interface) => {
    return(
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header  closeButton/>
                <Modal.Body>
                    <div className="form">
                        <CreateFormBuilderForm appSlug={props.appSlug} />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}