import {useFormContext} from "react-hook-form";

interface LongTextFormEditProps{
    onChange: any,
    name: string,
    id: string,
    defaultValue: string
    options?: any
}
export function LongTextFormEdit( props: LongTextFormEditProps){
    const { register } = useFormContext();

    return(
        <>
            <div className="form">
                <label htmlFor={props.id} className="form-label">{props.name}</label>
                <textarea defaultValue={props.defaultValue}  className="form-control" id={props.id} {...register(props.id, props.options ? props.options : {} )}
                           onChange={props.onChange? props.onChange : null}
                />
            </div>
        </>
    )
}