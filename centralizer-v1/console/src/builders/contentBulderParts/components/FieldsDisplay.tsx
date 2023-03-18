import { BuilderObject } from "../../../models/contents"
import {AiOutlineHolder} from "react-icons/ai";
import {HiDotsVertical} from "react-icons/hi";
import {BsFillTrashFill} from "react-icons/bs";
import {TbMinusVertical} from "react-icons/tb";
import {capitalize} from "../../../helper/caseChange";
import {ClipLoader} from "react-spinners";
import React from "react";

interface Props {
    builder: BuilderObject,
    onDelete: any,
    onEdit: any,
    loading: boolean
}

export function FieldsDisplay(props: Props) {
    return(
        <>
            {props.builder.fields ? props.builder.fields.map((item: any, key: number) => (
                    <div className="shadow card px-2 py-2 mb-2  bg-white" key={key}>
                        <div className='d-flex justify-content-between'>
                            <div className="ident">
                                <button className="btn">
                                    <AiOutlineHolder/>
                                </button>
                                {item.fieldName} <TbMinusVertical/>  {capitalize(item.contentType.name ?  item.contentType.name : "" )}
                            </div>
                            <div className="float-right">
                                <button onClick={() => props.onEdit(item)} className="btn float-right"><HiDotsVertical/></button>
                                <button onClick={() => props.onDelete(item.fieldName)} className="btn float-right">
                                    <span><ClipLoader color={`#000000`} loading={props.loading} size={15}  /></span><BsFillTrashFill/></button>
                            </div>
                        </div>

                    </div>)):
                <div>
                    No existing fields to display
                </div>
            }
        </>
    )
}