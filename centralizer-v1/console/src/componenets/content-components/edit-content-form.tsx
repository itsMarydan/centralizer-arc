import React from "react";
import {FormProvider, useForm} from "react-hook-form";
import {FieldTypeName} from "../../builders/utils/filedTypes";
import {ShortTextFormEdit} from "../../builders/contentTypeEdit/ShortTextFormEdit";
import {camelize} from "../../helper/caseChange";
import {LongTextFormEdit} from "../../builders/contentTypeEdit/LongTextFormEdit";
import {CheckBoxFormEdit} from "../../builders/contentTypeEdit/CheckBoxFormEdit";
import {DateFormEdit} from "../../builders/contentTypeEdit/DateFormEdit";
import {NumberFormEdit} from "../../builders/contentTypeEdit/NumberFormEdit";
import {TimeFormEdit} from "../../builders/contentTypeEdit/TimeFormEdit";
import {MediaForm} from "../../builders/contentType/MediaForm";
import {FileDisplay} from "../global/file-display";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectFileGallery, setFileGallery} from "../../features/contents/contentsSlice";
import axiosClient from "../../api/axiosClient";
import {GLOBAL_API} from "../../static/api-url";
import {JsonFormEdit} from "../../builders/contentTypeEdit/JsonFormEdit";
import {RichTextFormEdit} from "../../builders/contentTypeEdit/RichTextFormEdit";
import {HiRefresh} from "react-icons/hi";
import {ClipLoader} from "react-spinners";
import contentsApi from "../../api/contentsApi";
import {Alert} from "antd";

interface Props {
    builder: any,
    appSlug: string,
    slug: string,
    userRole: string,
    content: any,
    identifier: string
}

export function EditContentForm(props: Props) {
    const [inputs, setInputs]: any = React.useState({});
    const methods = useForm();
    const fileGallery = useAppSelector(selectFileGallery);
    const dispatch = useAppDispatch()
    const [showMediaModal, setShowMediaModal] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [updating, setUpdating] = React.useState(false);
    const [success, setSuccess] = React.useState("");
    const [error, setError] = React.useState("");

    function onChangeBasicInputs(e: any) {
        inputs[e.target.id] = e.target.value;
    }

    async function retrieveFiles() {
        const files: any = await axiosClient.get(GLOBAL_API.GET_FILE_BY_APP());
        dispatch(setFileGallery(files));

    }

    React.useEffect(() => {
        retrieveFiles().then();
        console.log(fileGallery)

    }, [props.appSlug]);

    function onChangeCheckedInputs(e: any) {
        inputs[e.target.name] = e.target.checked;
    }

    function findFileById(id: number) {
        console.log(id, "file id")
        return fileGallery.find((file: any) => file.id === id);
    }

    function onMedia(id: string, name: string) {
        inputs [camelize(name)] = id;
        console.log(inputs);
        setShowMediaModal(false);
    }

    function onChangeEditor(e: any, name: any) {
        inputs[camelize(name)] = e;
    }

    async function update(e: any) {
        e.preventDefault();
        setUpdating(true);
        console.log(inputs)
        await contentsApi.updateContent(props.appSlug, props.slug, props.userRole, props.identifier, inputs)
            .then((response: any) => {
                console.log(response, "response");
                if (response?.status === 200){
                    setSuccess("Content Created Successfully");
                    setUpdating(false);
                    setTimeout(() => {
                        setSuccess("");
                    }, 3000)
                }
                setInputs({});
                setSuccess(response.message)
            })
            .catch((error: any) => {
                setError("Error Creating Content");
                setTimeout(() => {
                    setError("");
                }, 3000)
                setUpdating(false);
            });
        setUpdating(false);
    }

    return (
        <div>
            <FormProvider {...methods}>
                <form>
                    <div className="my-3">
                        {error ?
                            <Alert
                                message="Error On Content Creation"
                                description={`Failed to create content due to the following error : ${error}`}
                                type="error"
                                closable
                                afterClose={() => setError("")}
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
                    {props.builder.fields ?
                        <div className="form">
                            {props.builder.fields.map((field: any, key: number) => (
                                    <div key={key}>
                                        {field.contentType.name === FieldTypeName.TEXT.name && field.textType === "short" ?
                                            <div className={"mb-2"}>
                                                <ShortTextFormEdit id={camelize(field.fieldName)} name={field.fieldName}
                                                                   onChange={(e: any) => onChangeBasicInputs(e)}
                                                                   defaultValue={props.content[camelize(field.fieldName)]}/>
                                            </div>
                                            : field.contentType.name === FieldTypeName.TEXT.name && field.textType === "long" ?
                                                <div className={"mb-2"}>
                                                    <LongTextFormEdit id={camelize(field.fieldName)} name={field.fieldName}
                                                                      onChange={(e: any) => onChangeBasicInputs(e)}
                                                                      defaultValue={props.content[camelize(field.fieldName)]}/>
                                                </div>
                                                : field.contentType.name === FieldTypeName.BOOLEAN.name ?
                                                    <div className={"mb-2"}>
                                                        <CheckBoxFormEdit id={camelize(field.fieldName)}
                                                                          name={field.fieldName}
                                                                          onChange={(e: any) => onChangeCheckedInputs(e)}
                                                                          default={props.content[camelize(field.fieldName)]}/>
                                                    </div>
                                                    : field.contentType.name === FieldTypeName.DATE.name && !field.autoGenerate ?
                                                        <div className={"mb-2"}>
                                                            <DateFormEdit id={camelize(field.fieldName)}
                                                                          name={field.fieldName}
                                                                          onChange={(e: any) => onChangeCheckedInputs(e)}
                                                                          defaultValue={props.content[camelize(field.fieldName)]}/>
                                                        </div>
                                                        : field.autoGenerate ?
                                                            <div className="mb-2">
                                                                {field.fieldName} : <span
                                                                className="badge bg-secondary"> autogenerated</span>
                                                            </div>
                                                            : field.contentType.name === FieldTypeName.NUMBER.name && !field.autoGenerate ?
                                                                <div className={"mb-2"}>
                                                                    <NumberFormEdit id={camelize(field.fieldName)}
                                                                                    name={field.fieldName}
                                                                                    onChange={(e: any) => onChangeBasicInputs(e)}
                                                                                    defaultValue={props.content[camelize(field.fieldName)]}/>
                                                                </div>
                                                                : field.contentType.name === FieldTypeName.TIME.name && !field.autoGenerate ?
                                                                    <div className={"mb-2"}>
                                                                        <TimeFormEdit id={camelize(field.fieldName)}
                                                                                      name={field.fieldName}
                                                                                      onChange={(e: any) => onChangeBasicInputs(e)}
                                                                                      defaultValue={props.content[camelize(field.fieldName)]}/>
                                                                    </div>
                                                                    : field.contentType.name === FieldTypeName.MEDIA.name ?
                                                                        <div className="mb-2 mt-3">
                                                                            <MediaForm id={camelize(field.fieldName)}
                                                                                       name={field.fieldName}
                                                                                       onChange={(id: string) => onMedia(id, field.fieldName)}
                                                                                       appSlug={props.appSlug}
                                                                                       setShowMediaModal={setShowMediaModal}
                                                                                       showMediaModal={showMediaModal}/>
                                                                            {inputs[camelize(field.fieldName)] ?
                                                                                fileGallery ?
                                                                                    <FileDisplay
                                                                                        file={findFileById(inputs[camelize(field.fieldName)])}/>
                                                                                    :   "no gallery"
                                                                                : !inputs[camelize(field.fieldName)] && props.content[camelize(field.fieldName)] ?
                                                                                    fileGallery ?
                                                                                        findFileById(parseInt(props.content[camelize(field.fieldName)])) ?
                                                                                        <FileDisplay file={findFileById(parseInt(props.content[camelize(field.fieldName)]))}/>
                                                                                        : "no file available"
                                                                                        : "no gallery"
                                                                                    : `No ${field.fieldName} selected`
                                                                            }
                                                                        </div>
                                                                        : field.contentType.name === FieldTypeName.JSON_CONTENT.name ?
                                                                            <div className="mb-2">
                                                                                <JsonFormEdit id={camelize(field.fieldName)}
                                                                                              name={field.fieldName}
                                                                                              onChange={(e: any) => onChangeEditor(e, field.fieldName)}
                                                                                              defaultValue={props.content[camelize(field.fieldName)]}/>
                                                                            </div>
                                                                            : field.contentType.name === FieldTypeName.RICH_TEXT.name ?
                                                                                <div className="mb-2">
                                                                                    <RichTextFormEdit
                                                                                        onChange={(e: any) => onChangeEditor(e, field.fieldName)}
                                                                                        name={field.fieldName}
                                                                                        defaultValue={props.content[camelize(field.fieldName)]}/>
                                                                                </div>
                                                                                : null}
                                    </div>
                                )
                            )}
                            <div className="my-3">
                                {error ?
                                    <Alert
                                        message="Error On Content Creation"
                                        description={`Failed to create content due to the following error : ${error}`}
                                        type="error"
                                        closable
                                        afterClose={() => setError("false")}
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
                                <button  onClick={(e) => update(e)} className="btn mx-2 btn-success">
                                    <span><ClipLoader color={`#ffffff`} loading={updating} size={15}  /></span>
                                    <span className="mx-1 font-15">{!updating ? "Update" : "Updating"}</span>
                                </button>
                            </div>
                        </div>
                        : null}
                </form>
            </FormProvider>
        </div>
    )
}