
export function arrayRemoveByValue(arr: any, value: any) { 
    
    return arr.filter(function(ele: any){ 
        return ele != value; 
    });
}