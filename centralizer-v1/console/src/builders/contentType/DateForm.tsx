import TextField from '@mui/material/TextField';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import React from "react";
import DateFnsUtils from "@date-io/date-fns";

interface  DateFormProps{
    id: string,
    name: string,
    onChange: any,
  
}

export function DateForm(props: DateFormProps){
    const [value, setValue] = React.useState<Date | null>(new Date());
    return(
        <>
            <div className="form">
                <label htmlFor={props.id}>{props.name} :  </label>
                <input type="date" className={"form-control ml-2"} onChange={(e: any) => props.onChange(e)} id={props.id}  />
            </div>
        </>
    )
}