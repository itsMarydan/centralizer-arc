
export function validateData(builder, data,newInputs){
    builder.fields.forEach(field => {
        if(field.isUnique === true){
            const checking = newInputs[field.fieldName];
            const index = data.findIndex(function(item, i){
                return item[field.fieldName] === checking
            });
           return index < 0;
        }
    });
}
