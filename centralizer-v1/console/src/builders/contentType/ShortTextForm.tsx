import { useFormContext } from "react-hook-form";
interface ShortTextFormProps{
    onChange?: any,
    name: string,
    id: string,
    options?: any
}
export function ShortTextForm(props : ShortTextFormProps){
    const { register } = useFormContext();
    return(
        <>
            <div className="form">
                <label htmlFor={props.id} className="form-label">{props.name}</label>
                <input type="text"  className="form-control" id={props.id} {...register(props.id, props.options ? props.options : {} )}
                       onChange={props.onChange? props.onChange : null}
                />
            </div>
        </>
    )
}
