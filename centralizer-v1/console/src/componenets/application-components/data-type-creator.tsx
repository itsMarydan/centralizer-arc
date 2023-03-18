import React from "react";
import {ContentBuilderCreateModal} from "../../builders/modals/ContentBuilderCreateModal";
import {FormBuilderCreateModal} from "../../builders/modals/FormBuilderCreateModal";

export function DataTypeCreator  (props: any){
    const [showContentBuilder, setShowContentBuilder] = React.useState(false);
    const [showFormBuilder, setShowFormBuilder] = React.useState(false);
    const handleCloseContentBuilder = () => setShowContentBuilder(false);
    const handleShowContentBuilder = () => setShowContentBuilder(true);
    const handleCloseFormBuilder = () => setShowFormBuilder(false);
    const handleShowFormBuilder = () => setShowFormBuilder(true);

    return (
        <>
            <div className="mb-5">
                <button onClick={() => handleShowContentBuilder() } className="btn btn-sm btn-primary">+ Content</button>
                <button onClick={() => handleShowFormBuilder()} className="btn mx-2 btn-sm btn-outline-primary">+ Form</button>
                <button className="btn btn-sm btn-outline-success">+ File</button>
            </div>
            <ContentBuilderCreateModal appSlug={props.appSlug} show={showContentBuilder} handleClose={handleCloseContentBuilder}  />
            <FormBuilderCreateModal appSlug={props.appSlug} show={showFormBuilder} handleClose={handleCloseFormBuilder}  />
        </>
    )
}

