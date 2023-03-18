import {VscJson, VscSymbolBoolean} from "react-icons/vsc";
import {BsFillCalendarDateFill, BsJournalRichtext} from "react-icons/bs";
import {ImFileText, ImSortNumbericDesc} from "react-icons/im";
import {BiTimeFive} from "react-icons/bi";
import {FcOvertime} from "react-icons/fc";
import {FaThList} from "react-icons/fa";
import {GrConnect} from "react-icons/gr";
import {MdPermMedia} from "react-icons/md";
import {Modal} from "react-bootstrap";
import {FieldOption} from "../utils/FieldOptions";
import {FieldType} from "../utils/filedTypes";

interface Props{
    show: boolean;
    handleClose: any;
    selectFiledType: any
}
export function SelectFieldTypeModal(props: Props) {
     const filedOptionSelections = [
        {name: 'Text', slug: FieldType.TEXT,  icon: <ImFileText/>, description: 'Long or short Text'},
        {name: 'Rich Text', slug: FieldType.RICH_TEXT, icon: <BsJournalRichtext/>, description: 'Can hold dynamic content such as HTML'},
        {name: 'Number', slug: FieldType.NUMBER, icon: <ImSortNumbericDesc/>, description: 'Integers or decimals'},
        {name: 'Date', slug: FieldType.DATE, icon: <BsFillCalendarDateFill/>, description: 'Holds Dates'},
        {name: 'Time', slug: FieldType.TIME, icon: <BiTimeFive/>, description: 'Holds Time'},
        {name: 'Date Time', slug: FieldType.DATE_TIME, icon: <FcOvertime/>, description: 'Holds Date and Time'},
        {name: 'Relational Content', slug: FieldType.RELATIONAL_CONTENT, icon: <GrConnect/>, description: 'Used to hold relational Data'},
        {name: 'Json Content',slug: FieldType.JSON_CONTENT, icon: <VscJson/>, description: 'Holds Json Objects'},
        {name: 'Media',slug: FieldType.MEDIA, icon: <MdPermMedia/>, description: 'Holds Files, Image, or Videos'},
        {name: 'Component',slug: FieldType.COMPONENT, icon: <FaThList/>, description: 'Holds Groups of predefined Fields'},
        {name: 'Boolean', slug: FieldType.BOOLEAN,icon: <VscSymbolBoolean/>, description: 'Boolean Values'}
    ];



    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Field</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="field-options row">
                        {filedOptionSelections.map((item, key) => (
                            <div className="col-3 text-center" key={key}>
                                <FieldOption name={item.name} slug={item.slug} icon={item.icon} description={item.description} selectContentType={props.selectFiledType}/>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
