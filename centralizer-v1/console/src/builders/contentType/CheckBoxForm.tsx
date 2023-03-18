import {useFormContext} from "react-hook-form";

interface  CheckBoxFormProps{
    onChange?: any,
    name: string,
    id: string,
    options?: any
}
export function CheckBoxForm(props: CheckBoxFormProps){
    const { register } = useFormContext();
    return (
        <>
            <div className="form">

                    <input  id={props.id} {...register(props.id, props.options ? props.options : {} )}
                            onChange={props.onChange? props.onChange : null} className="form-check-input" type="checkbox"/>
                <label className="form-check-label mx-1" htmlFor={props.id}>
                    {props.name}
                </label>
            </div>
        </>
    )
}