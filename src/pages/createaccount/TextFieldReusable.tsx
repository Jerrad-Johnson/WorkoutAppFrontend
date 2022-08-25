import TextField from "@mui/material/TextField";
import {Dispatch, SetStateAction} from "react";

function TextFieldReusable({state, setState, placeholder, type}:
                           {state: string, setState: Dispatch<SetStateAction<string>>, placeholder: string, type: string}){
    return (
        <TextField type={type} variant={"standard"} sx={{"display": "block", "marginBottom": "8px"}}
           value={state} placeholder={placeholder}
           onChange={(e) => {
               e.preventDefault();
               setState(e.target.value);
           }}
        />
    );
}

export default TextFieldReusable;