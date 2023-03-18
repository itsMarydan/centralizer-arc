import Editor from "../editor/ReactQuilEditor";

interface RichTextFormProps{
    onChange: any,
    name: string,
    reset: boolean
}
export function RichTextForm({onChange, name, reset}: RichTextFormProps){
    return(
        <>
            <div className="form mb-3">
                <div className="my-3">
                    {name ? name : "no name"}
                </div>
                <Editor reset={reset} name={name}  onChange={onChange}/>
            </div>
        </>
    )
}