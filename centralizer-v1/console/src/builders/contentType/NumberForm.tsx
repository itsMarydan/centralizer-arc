import {useFormContext} from "react-hook-form";

interface  NumberFormProps{
    name: string,
    id: string,
    onChange?: any,
    options?: any
}
export function NumberForm(props: NumberFormProps){
    const { register } = useFormContext();
    return(
        <>
            <div className="form">
                <div className="mb-3">
                    <label htmlFor={props.id} className="form-label">{props.name}</label>
                    <input type="number"  className="form-control ml-2"
                           id={props.id}  {...register(props.id, props.options ? props.options : {})}
                           onChange={props.onChange}
                    />
                </div>
            </div>
        </>
    )
}