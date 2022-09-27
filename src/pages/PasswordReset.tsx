import TextFieldReusable from "../components/TextFieldReusable";
import Button from "@mui/material/Button";
import {Dispatch, SetStateAction} from "react";
import {useState} from "react";
import toast from "react-hot-toast";
import {requestPasswordReset} from "../utilities/queries";
import {defaultToastMsg} from "../utilities/sharedVariables";
import {showResponseMessageWithoutCondition} from "../utilities/sharedFns";
let cc = console.log;

function PasswordReset(){
    const [emailState, setEmailState] = useState<string>("");

    return (
        <>
            <div className={"basicContainer"}>
                <span className={"pageTitle"}>Reset Password</span>
            </div>

            <div className={"basicContainer"}>
                <h2>Enter details</h2>
                <TextFieldReusable state={emailState} setState={setEmailState} placeholder={"E-mail address"} type={"text"}/>
                <Button variant={"contained"} size={"small"} className={"selectOrAddExerciseFieldChangeButton"}
                    onClick={(e) => {
                        handleResetPasswordRequest(emailState, setEmailState);
                    }}
                >Submit</Button>
            </div>
        </>
    );
}

async function handleResetPasswordRequest(emailState: string, setEmailState: Dispatch<SetStateAction<string>>){
    let response = await requestPasswordReset(emailState);
    showResponseMessageWithoutCondition(response.data);
    setEmailState("");
}

export default PasswordReset;