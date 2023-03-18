// @ts-ignore
import {JsonEditor as Editor} from "jsoneditor-react";
// @ts-ignore
import ace from 'brace';
import 'brace/mode/json';
interface JSONFormProps{
    name: string,
    id: string,
    onChange: any
}
export function JsonForm({name, id, onChange}: JSONFormProps) {
    const data = {
        "name": "John",
    }
    return (
        <>
            <div className="form">
                <label htmlFor={id}>{name}</label>
                <Editor value={data} name="properties" mode="code"
                        ace={ace}
                        onChange={(e: any) =>onChange(e)} />
            </div>
        </>
    )
}