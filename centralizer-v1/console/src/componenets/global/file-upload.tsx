import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import React from 'react';
import {GLOBAL_API} from "../../static/api-url";

const { Dragger } = Upload;

const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: GLOBAL_API.FILE_UPLOAD,
    method: "POST",
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

interface  header{
    appSlug: string
}
;
export function  FileUpload(header: header){
    return(
        <Dragger {...props} headers={ {
            contentType: "multipart/form-data",
            appSlug: header.appSlug
        }}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                band files
            </p>
        </Dragger>
    )
}
