import {useFormContext} from "react-hook-form";

interface  BooleanFormEditProps{
    defaultValue: any
    onChange: any,
    name: string,
    id: string,
    options?: any,
    selection: any
}
export function SelectFormEdit(props: BooleanFormEditProps){
    const { register } = useFormContext();
    return (
        <>
            <div className="form">
                <label>
                    {props.name}
                    <select defaultValue={props.defaultValue}  {...register(props.id, props.options ? props.options : {} )}  onChange={props.onChange}  className="form-select" aria-label="Default select example">
                        {props.selection.map((item: any, key: any) => (
                            <option key={key} value={item.value}>{item.name}</option>
                        ))}
                    </select>
                </label>
            </div>
        </>
    )
}