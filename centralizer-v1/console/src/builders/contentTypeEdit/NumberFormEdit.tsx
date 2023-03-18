import {useFormContext} from "react-hook-form";

interface  NumberFormEditProps{
    name: string,
    id: string,
    onChange?: any,
    options?: any
    defaultValue: any,
}
export function NumberFormEdit(props: NumberFormEditProps){
    const { register } = useFormContext();
    return(
        <>
            <div className="form">
                <div className="mb-3">
                    <label htmlFor={props.id} className="form-label">{props.name}</label>
                    <input type="number"  defaultValue={(props.defaultValue)} className="form-control ml-2"
                           id={props.id}  {...register(props.id, props.options ? props.options : {})}
                           onChange={props.onChange}
                    />
                </div>
            </div>
        </>
    )
}