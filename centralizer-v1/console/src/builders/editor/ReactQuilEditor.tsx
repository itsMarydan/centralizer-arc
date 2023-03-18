import React, {useEffect, useState} from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.bubble.css';

interface EditorProps{
    onChange: any
    name?: string,
    reset: boolean
}

const Editor = ({onChange, name, reset}: EditorProps) => {
    const [theme] = useState('snow');

    const [editorHtml, setEditorHtml] = useState("Enter your Rich Content");
    function handleChange(html: any) {
        setEditorHtml(html);
    }

    useEffect(() => {
        if(reset){
            setEditorHtml("")
        }

    }, [reset]);

    return (
        <div className="my-1 bg-white">
            <ReactQuill
                theme={theme}
                onChange={(e: any) => {
                    handleChange(e)
                    onChange(e);
                }}
                style={{height: "400px", paddingBottom: "40px"}}
                value={editorHtml || ''}
                modules={Editor.modules}
                formats={Editor.formats}
                bounds={'.app'}
            />
            <button onClick={(e ) => {
                e.preventDefault()
                setEditorHtml("")
            }} className="btn mt-2 btn-sm btn-outline-primary">Reset {name? name : null}</button>
        </div>
    );

}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
    toolbar: [
        [{ 'header': '1'}, {'header': '2'}, {'font': []}],
        [{
            'color': ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00",
                "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc",
                "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66",
                "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100",
                "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966",
                "#3d1466", "#343a40", "#007bff"]
        }],
        [{size: ["small", false, "large", "huge"]}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{'list': 'ordered'}, {'list': 'bullet'},
            {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
}

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
    'header', 'font', 'color', 'size', 'code-block',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]


export default Editor;