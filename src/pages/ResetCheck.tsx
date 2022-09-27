import {useSearchParams} from "react-router-dom";
import {Dispatch, SetStateAction, useState} from "react";
import TextFieldReusable from "../components/TextFieldReusable";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import {setNewPassword} from "../utilities/queries";
import {defaultToastMsg, defaultToastPromiseErrorMessage} from "../utilities/sharedVariables";
import {showResponseMessageWithCondition} from "../utilities/sharedFns";
import {Link} from "react-router-dom";
const cc = console.log;

function ResetCheck(){
    const [newPasswordState, setNewPasswordState] = useState<string>("");
    const [newPasswordConfirmState, setNewPasswordConfirmState] = useState<string>("");
    const [searchParams] = useSearchParams();
    const resetKey: string | null = searchParams.get("resetKey");
    const email: string | null = searchParams.get("email");

    return (
        <>
            <div className={"basicContainer"}>
                <span className={"pageTitle"}>Finish resetting password</span>
            </div>

            <div className={"basicContainer"}>
                <h2>Set your new password.</h2>
                <TextFieldReusable state={newPasswordState} setState={setNewPasswordState} placeholder={"New Password"} type={"password"}/>
                <TextFieldReusable state={newPasswordConfirmState} setState={setNewPasswordConfirmState} placeholder={"Confirm New Password"} type={"password"}/>
                <Button variant={"contained"} size={"small"} className={"selectOrAddExerciseFieldChangeButton"}
                        onClick={(e) => {
                            handleSetNewPassword(newPasswordState, newPasswordConfirmState, resetKey, email, setNewPasswordConfirmState);
                        }}
                >Submit</Button>
                <br/><br/><span>Finished? <Link to={"/"}>Return back to the login page.</Link></span>
            </div>
        </>
    );
}

async function handleSetNewPassword(newPasswordState: string, newPasswordConfirmState: string,
                                    resetKey: string | null, email: string | null, setNewPasswordConfirmState: Dispatch<SetStateAction<string>>){
    if (email === null){
        toast.error("E-mail address not set.");
        return;
    }

    if (resetKey === null){
        toast.error("Reset Key not set.");
        return;
    }

    let passwordErrorCheckResult: string = checkNewPassword(newPasswordState, newPasswordConfirmState);
    if (passwordErrorCheckResult !== "passed") {
        toast.error(passwordErrorCheckResult);
        return;
    }

    try {
        let result = await toast.promise(setNewPassword(resetKey, newPasswordState, email), {
            loading: 'Please wait',
            success: '',
            error: defaultToastPromiseErrorMessage,
        }, {
            success: {
                duration: 1,
            }
        });
        showResponseMessageWithCondition(result.data);
    } catch (e) {
        cc(e);
    }

    setNewPasswordConfirmState("");

}

function checkNewPassword(newPasswordState: string, newPasswordConfirmState: string){
    if (newPasswordState !== newPasswordConfirmState) return "Passwords must match.";
    if (newPasswordState.length > 255) return "Password is too long.";

    return "passed";
}


export default ResetCheck;