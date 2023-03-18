interface  TimeFormProps{
    id: string,
    name: string,
    onChange: any
}
export function TimeForm({id,name, onChange}: TimeFormProps){

    return(
        <>
            <div className="form">
                <label htmlFor={id}>{name}: </label>
                <input onChange={onChange}  className={"form-control ml-2"} type="time" id={id}  />
            </div>
        </>
    )
}