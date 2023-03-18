interface filedOptions {
    name: string,
    icon: any,
    description: string,
    selectContentType: any,
    slug: string,
}

export const FieldOption = ({name, slug, icon, description, selectContentType}: filedOptions) => {
    return (
        <div className="mt-3">
            <button onClick={() => {
                selectContentType(slug)
            }} className="shadow text-center field-option-icon-card btn bg-white px-3 py-3">
                {icon}
            </button>
            <div className="mt-2">
                <div className="bright-text">{name}</div>
                <div className="font-10">{description}</div>
            </div>
        </div>
    )
}