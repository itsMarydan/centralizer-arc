import EditContentEditor from "../editor/ReactQuilEditEditor";

interface RichTextFormEditProps{
    onChange: any
    defaultValue: any
    name: string
}
export function RichTextFormEdit({onChange, name, defaultValue}: RichTextFormEditProps){

    return(
        <>
            <div className="form">
                <div className="mt-3">
                    {name}
                </div>
                <EditContentEditor onChange={onChange} defaultValue={defaultValue}/>
            </div>
        </>
    )
}