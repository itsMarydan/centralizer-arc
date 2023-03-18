
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';
import React from "react";

interface RichTextFormProps{
    onChange?: any,
    name: string
}
export function MarkDownForm({onChange, name}: RichTextFormProps){

    const editorRef: React.LegacyRef<Editor> = React.createRef();
    return(
        <>
            <div className="form mb-3">
                <div className="my-3">
                    {name ? name : "no name"}
                </div>
                <Editor
                    initialValue="hello world!"
                    previewStyle="vertical"
                    height="600px"
                    initialEditType="markdown"
                    useCommandShortcut={true}
                    ref={editorRef}
                    onChange={() => {
                        // @ts-ignore
                        console.log( editorRef.current.getInstance().getHTML());
                        // @ts-ignore
                        console.log(editorRef.current.getInstance().getMarkdown());
                    }}
                />
            </div>
        </>
    )
}