interface  TimeFormEditProps{
    id: string,
    name: string,
    onChange: any,
    defaultValue: any
}
export function TimeFormEdit({id,name, onChange, defaultValue}: TimeFormEditProps){



    return(
        <>
            <div className="form">
                <label htmlFor={id}>{name}:
                </label>
                <input
                  className={"mx-2"}   defaultValue={defaultValue}
                    onChange={onChange} type="time" id={id}  />
            </div>
        </>
    )
}