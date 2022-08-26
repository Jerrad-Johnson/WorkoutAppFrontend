import {useState} from "react";
import {createAccount} from "../utilities/queries";
import {showResponseMessageWithCondition, verifyEmailForm, verifyPasswordFormsNewAccount, isUserValid} from "../utilities/sharedFns";
import Button from "@mui/material/Button";
import TextFieldReusable from "./createaccount/TextFieldReusable";
import toast from "react-hot-toast";
import {
    defaultToastPromiseErrorMessage,
    defaultToastPromiseLoadingMessage
} from "../utilities/sharedVariables";
let cc = console.log;

function CreateAccount(){
    const [usernameState, setUsernameState] = useState("");
    const [emailAddressState, setEmailAddressState] = useState("");
    const [emailAddressVerifyState, setEmailAddressVerifyState] = useState("");
    const [passwordState, setPasswordState] = useState("");
    const [passwordVerifyState, setPasswordVerifyState] = useState("");

    return (
        <>
            <div className={"basicContainer headerContainer"}>
                <span className={"pageTitle"}>Create Account</span>
            </div>

            <div className={"basicContainer"}>
                <h2>Enter details.</h2>
                <form onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleCreateAccount(passwordState, passwordVerifyState,
                            usernameState, emailAddressState, emailAddressVerifyState);
                    }
                }}>
                    <TextFieldReusable state={usernameState} setState={setUsernameState} placeholder={"Username"} type={"text"}/>
                    <TextFieldReusable state={emailAddressState} setState={setEmailAddressState} placeholder={"E-mail"} type={"text"}/>
                    <TextFieldReusable state={emailAddressVerifyState} setState={setEmailAddressVerifyState} placeholder={"Re-enter E-mail"} type={"text"}/>
                    <TextFieldReusable state={passwordState} setState={setPasswordState} placeholder={"Password"} type={"password"}/>
                    <TextFieldReusable state={passwordVerifyState} setState={setPasswordVerifyState} placeholder={"Re-enter Password"} type={"password"}/>

                    <Button variant={"contained"} size={"small"} className={"selectOrAddExerciseFieldChangeButton"} onClick={(e) => {
                        e.preventDefault();
                        handleCreateAccount(passwordState, passwordVerifyState,
                            usernameState, emailAddressState, emailAddressVerifyState);
                    }}>Submit</Button>
                </form>
            </div>
        </>
    );
}

async function handleCreateAccount(passwordState: string, passwordVerifyState: string, usernameState: string,
                                   emailAddressState: string, emailAddressVerifyState: string){
    try{ //TODO Add query checks for existing username and email, lest a mysql error be returned.
        isUserValid(usernameState);
        verifyEmailForm(emailAddressState, emailAddressVerifyState);
        verifyPasswordFormsNewAccount(passwordState, passwordVerifyState);
        let response = await toast.promise(createAccount(passwordState, usernameState, emailAddressState), {
            loading: defaultToastPromiseLoadingMessage,
            success: "Request Sent",
            error: defaultToastPromiseErrorMessage,
        });

        if (response.message === "Success"){
            toast.success("Account Created. Redirecting.")
            setTimeout(() => { window.location.href="/" }, 2000);
        }
    } catch (e) {
        cc(e);
    }
}


export default CreateAccount;