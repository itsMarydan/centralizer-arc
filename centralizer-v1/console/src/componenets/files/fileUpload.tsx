import React, { useState } from 'react';

interface Props {
    onSubmit: (file: File) => Promise<void>;
}

const FileUploadForm: React.FC<Props> = ({ onSubmit }) => {
    const [file, setFile] = useState<File | any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError('No file selected.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await onSubmit(file);
        } catch (error) {
            setError('Failed to upload file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>
                Upload
            </button>
        </form>
    );
};

export default FileUploadForm;
