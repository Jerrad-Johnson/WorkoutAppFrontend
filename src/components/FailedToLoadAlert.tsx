import {Alert} from "@mui/material";
import {failedToLoad} from "../utilities/sharedVariables";

function FailedToLoadAlert(){
    return (
        <Alert severity={"warning"}>{failedToLoad}</Alert>
    );
}

export default FailedToLoadAlert;