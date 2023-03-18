interface  DateFormEditProps{
    id: string,
    name: string,
    onChange: any,
    defaultValue: any
}

export function DateFormEdit({id, name, onChange, defaultValue}: DateFormEditProps){

    const date = new Date(defaultValue ? defaultValue : Date.now());
    return(
        <>
            <div className="form">
                <label htmlFor={id} className="form-label">{name} </label>
                <input value={date.toISOString() ? date.toISOString().split('T')[0] : new Date( Date.now()).toISOString().split('T')[0]} className="form-control" type="date" id={id}
                       onChange={onChange}/>
            </div>
        </>
    )
}