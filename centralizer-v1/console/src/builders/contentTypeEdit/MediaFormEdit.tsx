interface MediaFormEditProps{
    onChange: any
    name: string,
    id: string,
    defaultValue: any
}



export function MediaFormEdit({ onChange,name,defaultValue, id}: MediaFormEditProps){

    return(
        <>
            <div className="form">
                <div className="form-group">
                    <label htmlFor={id}>{name}</label>
                    <input type="file" name="file" onChange={onChange} className="form-control-file" id={id} />
                </div>
                <div className="display-current-image">
                    <img src={defaultValue} alt={name}/>
                </div>
            </div>
        </>
    )
}