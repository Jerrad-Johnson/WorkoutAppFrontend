import {useState} from "react";

function CreateAccount(){
    const [usernameState, setUsernameState] = useState("");
    const [emailAddressState, setEmailAddressState] = useState("");
    const [emailAddressVerifyState, setEmailAddressVerifyState] = useState("");
    const [passwordState, setPasswordState] = useState("");
    const [passwordVerifyState, setPasswordVerifyState] = useState("");

    return (
        <div>
            <form>
                <input type={"text"} value={usernameState} onChange={(e) => {
                    setUsernameState(e.target.value);
                }}/>
                <br />
                <input type={"text"} value={emailAddressState} onChange={(e) => {
                    setEmailAddressState(e.target.value);
                }}/>
                <br />
                <input type={"text"} value={emailAddressVerifyState} onChange={(e) => {
                    setEmailAddressVerifyState(e.target.value);
                }}/>
                <br />
                <input type={"password"} value={passwordState} onChange={(e) => {
                    setPasswordState(e.target.value);
                }}/>
                <br />
                <input type={"password"} value={passwordVerifyState} onChange={(e) => {
                    setPasswordVerifyState(e.target.value);
                }}/>
                <br />
                <button onClick={(e) => {
                    e.preventDefault();

                }}>Submit</button>
            </form>
        </div>
    );
}


export default CreateAccount;