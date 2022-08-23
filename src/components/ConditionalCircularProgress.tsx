import {CircularProgress} from "@mui/material";

function ConditionalCircularProgress({sizeInPx = 400}: {sizeInPx: number | string}){
    return (
        <CircularProgress size={sizeInPx} />
    );
}

export default ConditionalCircularProgress;