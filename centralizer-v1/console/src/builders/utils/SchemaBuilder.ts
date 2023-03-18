import {FieldTypeName} from "./filedTypes";

export function identifySchemaType(contentType: string) {
    if (contentType === FieldTypeName.TEXT.name) {
        return 'String';
    }
    if (contentType === FieldTypeName.RICH_TEXT.name) {
        return 'String';
    }
    if (contentType === FieldTypeName.BOOLEAN.name) {
        return 'Boolean';
    }
    if (contentType === FieldTypeName.NUMBER.name) {
        return 'Number';
    }
    if (contentType === FieldTypeName.DATE_TIME.name) {
        return 'Date';
    }
    if (contentType === FieldTypeName.DATE.name) {
        return 'Date';
    }
    if (contentType === FieldTypeName.TIME.name) {
        return 'String';
    }
    if (contentType === FieldTypeName.JSON_CONTENT.name) {
        return "Schema.Types.Mixed"
    }
    if (contentType === FieldTypeName.MEDIA.name) {
        return 'String'
    }
}