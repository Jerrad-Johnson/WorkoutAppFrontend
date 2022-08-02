import {useState} from "react";
import {createAccount} from "./utilities/queries";
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
                    handleCreateAccount();
                }}>Submit</button>
            </form>
        </div>
    );
}

async function handleCreateAccount(){
    let response = await createAccount();
    cc(response);
}


export default CreateAccount;