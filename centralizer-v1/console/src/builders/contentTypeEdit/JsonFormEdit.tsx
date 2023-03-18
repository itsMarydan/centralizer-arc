// @ts-ignore
import {JsonEditor as Editor} from "jsoneditor-react";
// @ts-ignore
import ace from 'brace';
import 'brace/mode/json';
interface JSONFormEditProps{
    name: string,
    id: string,
    onChange: any,
    defaultValue: any
}
export function JsonFormEdit({name, id, onChange, defaultValue}: JSONFormEditProps) {


    return (
        <>
            <div className="form">
                <label htmlFor={id}>{name}</label>
                {defaultValue &&
                    <Editor value={defaultValue ? defaultValue : {}}
                            name="properties" mode="code"
                            ace={ace}
                            onChange={(e: any) =>onChange(e)} />
                }
            </div>
        </>
    )
}