import {useState} from "react";
import {createAccount} from "../utilities/queries";
import {verifyEmailForm, verifyPasswordForms} from "../utilities/sharedFns";
import {TextField} from "@mui/material";
import TextFieldReusable from "./createaccount/TextFieldReusable";
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
                <span className={"pageTitle"}>Workout Progress Tracker</span>
            </div>

            <div className={"basicContainer"}>
                <form onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleCreateAccount(passwordState, passwordVerifyState,
                            usernameState, emailAddressState, emailAddressVerifyState);
                    }
                }}>
                    <TextFieldReusable state={usernameState} setState={setUsernameState} placeholder={"Usernawme"} type={"text"}/>
                    <TextFieldReusable state={emailAddressState} setState={setEmailAddressState} placeholder={"E-mail"} type={"text"}/>
                    <TextFieldReusable state={emailAddressVerifyState} setState={setEmailAddressVerifyState} placeholder={"Re-enter E-mail"} type={"text"}/>
                    <TextFieldReusable state={passwordState} setState={setPasswordState} placeholder={"Password"} type={"password"}/>
                    <TextFieldReusable state={passwordVerifyState} setState={setPasswordVerifyState} placeholder={"Re-enter Password"} type={"password"}/>

                    <button onClick={(e) => {
                        e.preventDefault();
                        handleCreateAccount(passwordState, passwordVerifyState,
                            usernameState, emailAddressState, emailAddressVerifyState);
                    }}>Submit</button>
                </form>
            </div>
        </>
    );
}

async function handleCreateAccount(passwordState: string, passwordVerifyState: string, usernameState: string,
                                   emailAddressState: string, emailAddressVerifyState: string){
    try{
        verifyEmailForm(emailAddressState, emailAddressVerifyState);
        verifyPasswordForms(passwordState, passwordVerifyState);
        let response = await createAccount(passwordState, usernameState, emailAddressState);
        cc(response); //TODO Handle resposne
        window.location.href="/";
    } catch (e) {
        cc(e); //TODO Handle error
    }
}


export default CreateAccount;