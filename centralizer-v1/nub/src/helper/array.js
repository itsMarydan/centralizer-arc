 export const removeByFieldName = (arr, fieldName) => {
    const requiredIndex = arr.findIndex(el => {
       return el.fieldName === String(fieldName);
    });
    if(requiredIndex === -1){
       return false;
    };
    return !!arr.splice(requiredIndex, 1);
 };