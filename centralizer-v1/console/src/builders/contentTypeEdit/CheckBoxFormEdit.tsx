import {useFormContext} from "react-hook-form";

interface  Props{
    onChange?: any,
    name: string,
    id: string,
    options?: any,
    default: any
}
export function CheckBoxFormEdit(props: Props){
    const { register } = useFormContext();
    return (
        <>
            <div className="form">

                    <input defaultChecked={props.default}  id={props.id} {...register(props.id, props.options ? props.options : {} )}
                            onChange={props.onChange? props.onChange : null} className="form-check-input" type="checkbox"/>
                <label className="form-check-label mx-1" htmlFor={props.id}>
                    {props.name}
                </label>
            </div>
        </>
    )
}