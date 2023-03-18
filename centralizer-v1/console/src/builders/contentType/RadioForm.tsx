import {useFormContext} from "react-hook-form";

interface  RadioFormProps{
    radioSelections: Array<any>;
    name: string,
    id: string,
    options?: any,
    onChange?: any
}


export  function RadioForm (props: RadioFormProps) {
    const { register } = useFormContext();
    return(
        <>
            <label htmlFor={props.id} className="form-label">{props.name}</label>
            {props.radioSelections.map((option: any, key: any) => (
                <div key={key} className="form-check">
                    <input id={option.value} {...register(props.id)} onChange={props.onChange? props.onChange(option.value): null} type="radio" value={option.value} />
                    <label className="form-check-label mx-1" htmlFor={option.value}>
                         {option.name}
                    </label>
                </div>
            ))}
        </>
    )
}