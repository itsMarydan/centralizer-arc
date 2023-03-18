import {Modal} from "react-bootstrap";
import CreateAppForm from "./create-app-form";

interface Interface {
    showCreateApp: boolean,
    handleCloseCreateApp: any
}
const CreateAppModal = (props: Interface )=> {
    return (
        <>
            <Modal show={props.showCreateApp} onHide={props.handleCloseCreateApp}  centered>
                <Modal.Header closeButton>Create Application</Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <CreateAppForm handleCloseCreateApp={props.handleCloseCreateApp} />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}


export default  CreateAppModal;