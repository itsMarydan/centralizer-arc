import {Modal} from "react-bootstrap";
import {useState} from "react";
import {SignUpForm} from "../../forms/signupForm";
import {PageTop} from "./page-top";

export function UserCreateModal(props: any){

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <div className={"p-4"}>
                    <PageTop handleClose={props.handleClose} />
                    <SignUpForm handleClose={props.handleClose} />
                </div>
            </Modal>
        </>
    )
}