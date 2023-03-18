import {useFormContext} from "react-hook-form";

interface  BooleanFormProps{
    onChange?: any,
    name: string,
    id: string,
    options?: any,
    selection: any
}
export function SelectForm(props: BooleanFormProps){
    const { register } = useFormContext();
    return (
        <>
            <div className="form">
                <label>
                    <div className="mb-2">{props.name}</div>
                    <select  {...register(props.id, props.options ? props.options : {} )}
                             onChange={props.onChange? props.onChange : null}
                             className="form-select" aria-label="select field">
                        {props.selection.map((item: any, key: any) => (
                            <option key={key} value={item.value}>{item.name}</option>
                        ))}
                    </select>
                </label>
            </div>
        </>
    )
}