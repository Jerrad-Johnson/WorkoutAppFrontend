import {useSearchParams} from "react-router-dom";
import {useState} from "react";
import TextFieldReusable from "../components/TextFieldReusable";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
const cc = console.log;

function ResetCheck(){
    const [newPasswordState, setNewPasswordState] = useState<string>("");
    const [newPasswordConfirmState, setNewPasswordConfirmState] = useState<string>("");
    const [searchParams] = useSearchParams();
    const resetKey: string | null = searchParams.get("resetKey")

    return (
        <>
            <div className={"basicContainer"}>
                <span className={"pageTitle"}>Finish resetting password</span>
            </div>

            <div className={"basicContainer"}>
                <h2>Set your new password.</h2>
                <TextFieldReusable state={newPasswordState} setState={setNewPasswordState} placeholder={"New Password"} type={"text"}/>
                <TextFieldReusable state={newPasswordConfirmState} setState={setNewPasswordConfirmState} placeholder={"Confirm New Password"} type={"text"}/>
                <Button variant={"contained"} size={"small"} className={"selectOrAddExerciseFieldChangeButton"}
                        onClick={(e) => {
                            handleSetNewPassword(newPasswordState, newPasswordConfirmState);
                        }}
                >Submit</Button>
            </div>
        </>
    );
}

function handleSetNewPassword(newPasswordState: string, newPasswordConfirmState: string){
    let errorCheckResult: string = checkNewPassword(newPasswordState, newPasswordConfirmState);
    if (errorCheckResult !== "passed") {
        toast.error(errorCheckResult);
        return;
    }



}

function checkNewPassword(newPasswordState: string, newPasswordConfirmState: string){
    if (newPasswordState !== newPasswordConfirmState) return "Passwords must match.";
    if (newPasswordState.length > 255) return "Password is too long.";

    return "passed";
}


export default ResetCheck;