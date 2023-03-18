import {useFormContext} from "react-hook-form";

interface ShortTextFormEditProps{
    onChange?: any,
    name: string,
    id: string,
    defaultValue: string,
    options?: any
}
export function ShortTextFormEdit(props: ShortTextFormEditProps){
    const { register } = useFormContext();
    return(
        <>
            <div className="form">
                <label htmlFor={props.id} className="form-label">{props.name}</label>
                <input defaultValue={props.defaultValue}
                       {...register(props.id, props.options ? props.options : {} )}
                       type="text" className="form-control" id={props.id}
                       onChange={props.onChange? props.onChange : null}
                />
            </div>
        </>
    )
}