interface  DateTimeFormProps{
    id: string,
    name: string,
    onChange: any
}
export function DateTimeForm({id, name, onChange}: DateTimeFormProps){
    return(
        <>
            <div className="form">
                <label htmlFor={id}>{name}: </label>
                <input onChange={onChange}  className={"form-control ml-2"} type="datetime-local" id={id}  />
            </div>
        </>
    )
}