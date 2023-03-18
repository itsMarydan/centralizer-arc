import React from "react"
import {ShortTextForm} from "../../builders/contentType/ShortTextForm";
import {FieldTypeName} from "../../builders/utils/filedTypes";
import {camelize} from "../../helper/caseChange";
import {FormProvider, useForm} from "react-hook-form";
import {LongTextForm} from "../../builders/contentType/LongTextForm";
import {HiRefresh} from "react-icons/hi";
import {CheckBoxForm} from "../../builders/contentType/CheckBoxForm";
import {DateForm} from "../../builders/contentType/DateForm";
import {NumberForm} from "../../builders/contentType/NumberForm";
import {TimeForm} from "../../builders/contentType/TimeForm";
import {MediaForm} from "../../builders/contentType/MediaForm";
import {JsonForm} from "../../builders/contentType/JsonForm";
import {RichTextForm} from "../../builders/contentType/RichTextForm";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectFileGallery, setFileGallery} from "../../features/contents/contentsSlice";
import axiosClient from "../../api/axiosClient";
import {GLOBAL_API} from "../../static/api-url";
import {FileDisplay} from "../global/file-display";
import contentsApi from "../../api/contentsApi";
import {ClipLoader} from "react-spinners";
import {Alert, Space, Spin} from "antd";
import {addInputs, selectInputs} from "../../features/forms/formsSlice";

interface Props{
    builder: any,
    appSlug: string,
    slug: string,
    userRole: string,
    userId: number
}


export function CreateContentForm(props: Props){

    const [inputs, setInputs]: any = React.useState({});
    const methods = useForm();
    const [showMediaModal, setShowMediaModal] = React.useState(false);
    const [ creating, setCreating] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [success, setSuccess] = React.useState("");
    const [reset, setReset] = React.useState(false);
    const fileGallery = useAppSelector(selectFileGallery);
    const inputsStore = useAppSelector(selectInputs);
    const dispatch = useAppDispatch();
    async function retrieveFiles() {
        const files: any = await axiosClient.get(GLOBAL_API.GET_FILE_BY_APP());
        dispatch(setFileGallery(files));

    }
    React.useEffect( () => {
        retrieveFiles().then();
        console.log(fileGallery)
        // dispatch(addInputs(inputs));
        console.log(inputsStore, "inputsStore")
    }, [ props.appSlug]);

   function onChangeBasicInputs(e: any){
        inputs[e.target.name] = e.target.value;
    }
   function onChangeCheckedInputs(e: any){
        inputs[e.target.name] = e.target.checked;
    }
   function onChangeDateInputs(e: any, name: string){
       inputs[name] = e.target.value;
    }

   function onChangeEditor(e : any, name: any){
       inputs[camelize(name)] = e;
   }

   function onMedia(id: string, name: string){
       inputs [camelize(name)] = id;
       console.log(inputs);
       dispatch(addInputs(inputs));
       console.log(inputsStore, "inputsStore")
       setShowMediaModal(false);
   }
   async function create(e: any) {
        e.preventDefault();
        setCreating(true);
        console.log(inputs)

        await contentsApi.createContent(props.appSlug, props.slug, props.userRole, props.userId, inputs)
            .then((response: any) => {
                if (response?.status === 200){
                    setSuccess("Content Created Successfully");
                    setCreating(false);
                    setError(false);
                    setTimeout(() => {
                        setSuccess("");
                    }, 3000)
                }
                setInputs({});
                methods.reset();
                resetFunction();
            })
            .catch((error: any) => {
                setError(true);
                setErrorMessage("Error Creating Content");
                setTimeout(() => {
                    setError(false);
                    setErrorMessage("");
                }, 3000)
                setCreating(false);
            })
    }
    
   function findFileById(id: number){
        return fileGallery.find((file: any) =>  file.id === id);
    }

    function resetFunction() {
        setReset(true);
        setTimeout(() => {
            setReset(false);
        }, 100)
    }

    return (
        <div>
            {success ?
                <Alert
                    message="Content Created Successfully"
                    description={success}
                    type="success"
                    closable
                    afterClose={() => setSuccess("")}
                /> : null}
            <FormProvider {...methods}>
                <form>
            {props.builder.fields ?
                <div className="form">
                    {props.builder.fields.map((field: any, key: any) => (
                        <div key={key}>
                            {field.contentType.name === FieldTypeName.TEXT.name && field.textType === "short" ?
                                <div className="mb-2">
                                    <ShortTextForm id={camelize(field.fieldName)} name={field.fieldName} onChange={(e: any) => onChangeBasicInputs(e)} />
                                </div>
                                : field.contentType.name === FieldTypeName.TEXT.name && field.textType === "long" ?
                                    <div className="mb-2">
                                        <LongTextForm id={camelize(field.fieldName)} name={field.fieldName} onChange={(e: any) => onChangeBasicInputs(e)} />
                                    </div>
                                    :  field.contentType.name === FieldTypeName.BOOLEAN.name ?
                                        <div className="mb-2">
                                            <CheckBoxForm  id={camelize(field.fieldName)} name={field.fieldName} onChange={(e: any) => onChangeCheckedInputs(e)} />
                                        </div>
                                        : field.autoGenerate ?
                                            <div className="mb-2">
                                                {field.fieldName} : <span className="badge bg-secondary"> autogenerated</span>
                                            </div>
                                            : field.contentType.name === FieldTypeName.DATE.name && !field.autoGenerate ?
                                                <div className="mb-2">
                                                    <DateForm id={camelize(field.fieldName)} name={field.fieldName} onChange={(e: any) => onChangeDateInputs(e, camelize(field.fieldName))} />
                                                </div>
                                                : field.contentType.name === FieldTypeName.NUMBER.name && !field.autoGenerate ?
                                                    <div>
                                                        <NumberForm  id={camelize(field.fieldName)} name={field.fieldName} onChange={(e : any) => onChangeBasicInputs(e)}/>
                                                    </div>
                                                    : field.contentType.name === FieldTypeName.TIME.name && !field.autoGenerate ?
                                                        <div className="mb-2">
                                                            <TimeForm id={camelize(field.fieldName)}  name={field.fieldName} onChange={(e : any) => onChangeBasicInputs(e)}/>
                                                        </div>
                                                        : field.contentType.name === FieldTypeName.MEDIA.name ?
                                                            <div className="mb-2 mt-3">
                                                                <MediaForm id={camelize(field.fieldName)}  name={field.fieldName} onChange={(id : string) => onMedia(id, field.fieldName)}  appSlug={props.appSlug}
                                                                           setShowMediaModal={setShowMediaModal} showMediaModal={showMediaModal}/>
                                                                {inputsStore[camelize(field.fieldName)] ?
                                                                    fileGallery ?
                                                                        <FileDisplay  file={findFileById(inputs[field.fieldName])}/>
                                                                        :
                                                                        "no gallery" :
                                                                    `No input for ${field.fieldName}`}
                                                            </div>
                                                            : field.contentType.name === FieldTypeName.JSON_CONTENT.name ?
                                                                <div className="mb-2">
                                                                    <JsonForm id={camelize(field.fieldName)}  name={field.fieldName} onChange={(e : any) => onChangeEditor(e, field.fieldName)} />
                                                                </div>
                                                                : field.contentType.name === FieldTypeName.RICH_TEXT.name ?
                                                                    <div className="mb-2">
                                                                        <RichTextForm onChange={(e : any) => onChangeEditor(e, field.fieldName)}  name={field.fieldName}  reset={reset}/>
                                                                    </div>
                                    : null
                            }
                        </div>
                        ))
                    }
                    <div className="my-3">
                        {error ?
                        <Alert
                            message="Error On Content Creation"
                            description={`Failed to create content due to the following error : ${errorMessage}`}
                            type="error"
                            closable
                            afterClose={() => setError(false)}
                        />
                        : null}
                        {success ?
                            <Alert
                            message="Content Created Successfully"
                            description={success}
                            type="success"
                            closable
                            afterClose={() => setSuccess("")}
                        /> : null}
                    </div>
                    <div className="mt-3">
                        <button type="reset" onClick={() => resetFunction()} className="btn btn-outline-primary"><HiRefresh /></button>
                        <button  onClick={(e) => create(e)} className="btn mx-2 btn-success">
                            <span><ClipLoader color={`#ffffff`} loading={creating} size={15}  /></span>
                            <span className="mx-1 font-15">{!creating ? "Create" : "Creating"}</span>
                        </button>
                    </div>
                </div>
                :
                <div className={"loading-component"}>
                    <Space  size="large">
                        <Spin size="large" />
                    </Space>
                </div>
            }
                </form>
            </FormProvider>
        </div>
    )
}