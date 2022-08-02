import {useState} from "react";
import {createAccount} from "./utilities/queries";
import {verifyEmailForm, verifyPasswordForms} from "./utilities/sharedFns";
let cc = console.log;

function CreateAccount(){
    const [usernameState, setUsernameState] = useState("");
    const [emailAddressState, setEmailAddressState] = useState("");
    const [emailAddressVerifyState, setEmailAddressVerifyState] = useState("");
    const [passwordState, setPasswordState] = useState("");
    const [passwordVerifyState, setPasswordVerifyState] = useState("");

    return (
        <div>
            <form>
                <input type={"text"} value={usernameState} placeholder={"Username"} onChange={(e) => {
                    setUsernameState(e.target.value);
                }}/>
                <br />
                <input type={"text"} value={emailAddressState} placeholder={"E-mail"} onChange={(e) => {
                    setEmailAddressState(e.target.value);
                }}/>
                <br />
                <input type={"text"} value={emailAddressVerifyState} placeholder={"Re-enter E-mail"} onChange={(e) => {
                    setEmailAddressVerifyState(e.target.value);
                }}/>
                <br />
                <input type={"password"} value={passwordState} placeholder={"Password"} onChange={(e) => {
                    setPasswordState(e.target.value);
                }}/>
                <br />
                <input type={"password"} value={passwordVerifyState} placeholder={"Re-enter Password"} onChange={(e) => {
                    setPasswordVerifyState(e.target.value);
                }}/>
                <br />
                <button onClick={(e) => {
                    e.preventDefault();
                    handleCreateAccount(passwordState, passwordVerifyState,
                        usernameState, emailAddressState, emailAddressVerifyState);
                }}>Submit</button>
            </form>
        </div>
    );
}

async function handleCreateAccount(passwordState: string, passwordVerifyState: string, usernameState: string,
                                   emailAddressState: string, emailAddressVerifyState: string){
    try{
        verifyEmailForm(emailAddressState, emailAddressVerifyState);
        verifyPasswordForms(passwordState, passwordVerifyState);
        let response = await createAccount(passwordState, usernameState, emailAddressState);
        cc(response);
    } catch (e) {
        cc(e); //TODO Handle error
    }
}


export default CreateAccount;