import {identifySchemaType} from "../utils/SchemaBuilder";
import {camelize} from "../../helper/caseChange";
import {Modal} from "react-bootstrap";
import {selectIdentifiers} from "../../features/contents/contentsSlice";
import {useAppSelector} from "../../app/hooks";
import {SelectForm} from "../contentType/SelectForm";
import {FormProvider, useForm} from "react-hook-form";
import {ClipLoader} from "react-spinners";
import React from "react";
import contentsApi from "../../api/contentsApi";
import {STATUS} from "../../static/api-request";
import {Alert} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {DATA_TYPE} from "../../static/app-values";
import {formsApi} from "../../api/formsApi";

interface Props{
    fields: any,
    show: boolean,
    handleClose: any,
    slug: string,
    appSlug: string,
    userRole: string,
    dataType: number,

}

export function BuildModal(props: Props){
const identifiers = useAppSelector(selectIdentifiers);
    const methods = useForm();
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const navigate = useNavigate();
    async function onSubmit(data : any){
        setLoading(true);
       const schemaTypes = [];
       props.fields.forEach((item: any) => {
           const type: any = identifySchemaType(item.contentType.name);
           const fieldName: string = camelize(item.fieldName);
           const schemaType = {name: fieldName, type: type};
           schemaTypes.push(schemaType);
       })
       schemaTypes.push({name: "publishedOn", type:"Date"});
       schemaTypes.push({name: "createdOn", type:"Date"});
       schemaTypes.push({name: "lastUpdate", type:"Date"});
       schemaTypes.push({name: "contentStatus", type:"Boolean"});
       schemaTypes.push({name: "createdBy", type:"Number"});

       const schema = {
           schemaTypes: schemaTypes,
           slug: props.slug,
           identifier: data.identifier
       }

       console.log(schema)
        const result = props.dataType === DATA_TYPE.content ? await contentsApi.buildContent(props.appSlug, props.userRole, schema) :
            props.dataType === DATA_TYPE.form ? await formsApi.buildForm(props.appSlug, props.userRole, schema):
                {message: "A Builder is not implemented yet",  description: "", status: 404};
       function onSuccess(){
         navigate(`/app/${props.appSlug}`)
       }

        function onError(message: string){
            setErrorMessage(message)
            setLoading(false);
            setTimeout(() => setErrorMessage(""), 4000)
        }

        result.status === STATUS.SUCCESS ? onSuccess() : onError(`${result.message}, ${result.description ? result.description : ""}`);
            setLoading(false);

   }


    return(
        <>
            <Modal show={props.show} onHide={props.handleClose}  centered>
                <Modal.Header  closeButton >Build Content {props.slug} </Modal.Header>
                <Modal.Body>
                    {errorMessage ?
                        <div className="error-message mb-2">
                            <Alert severity="error">{errorMessage}</Alert>
                        </div> :
                        null
                    }
                    <FormProvider {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="form">
                        <div>
                            {identifiers.length ?
                                <SelectForm selection={identifiers} name={"Select an identifier"} id={"identifier"} options={{required : true}} />
                                : null}
                        </div>
                       <div className="mt-2">
                           <button type="submit" className="btn bg-blue text-white">
                               <span><ClipLoader color={`#ffffff`} loading={loading} size={15}  /></span>
                               <span className="mx-1 font-15">{!loading ? "Build" : "Building"}</span>
                           </button>
                       </div>
                    </div>
                        </form>
                    </FormProvider>
                </Modal.Body>
            </Modal>
        </>
    )

}