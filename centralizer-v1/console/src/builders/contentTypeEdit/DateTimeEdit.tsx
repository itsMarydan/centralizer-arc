interface  DateTimeFormEditProps{
    id: string,
    name: string,
    onChange: any,
    defaultValue: string
}
export function DateTimeFormEdit({id, name, onChange, defaultValue}: DateTimeFormEditProps){
    return(
        <>
            <div className="form">
                <label htmlFor={id}>{name}: </label>
                <input defaultValue={defaultValue} onChange={onChange} type="datetime-local" id={id}  />
            </div>
        </>
    )
}