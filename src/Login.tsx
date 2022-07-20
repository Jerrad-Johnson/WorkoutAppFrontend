import checkLogin from "./utilities/checkLogin";
import {StandardBackendResponse, LoginCredentials} from "./utilities/interfaces";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
let cc = console.log;


function handleCheckLogin(response: StandardBackendResponse, setLoginState: Dispatch<SetStateAction<string>>){
    if (response.data.loggedin === true) window.location.href="Home";
    setLoginState("false");
}



function handleCheckFormEntry(usernameState: string, passwordState: string){
    cc(usernameState, passwordState)
}

function Login(){


    let [loginState, setLoginState] = useState("pending");
    let [usernameState, setUsernameState] = useState("");
    let [passwordState, setPasswordState] = useState("");
    checkLogin().then((response) => handleCheckLogin(response, setLoginState));

    if (loginState === "true"){
        return (
            <div className={"loginContainer"}>
                Logged in, please proceed.
            </div>
        )
    } else {
        return (
            <>
            {loginState === "pending" &&
                <div className={"loginOverlay"}>
                    <CircularProgress size={150}/>
                    <span>Checking login.</span>
                </div>
            }
            <div className={"loginContainer"}>
                <span> Please Login.</span>
                <form onKeyPress={(e) => {
                    if (e.key === 'Enter') handleCheckFormEntry(usernameState, passwordState)
                }}>
                    <input type={"text"} value={usernameState} placeholder={"Username"} className={"textInputsShort"}
                           onChange={(e) => {
                               e.preventDefault();
                               setUsernameState(e.target.value);
                           }}/>
                    <input type={"password"} value={passwordState} placeholder={"Password"} className={"textInputsShort"}
                        onChange={(e) => {
                            e.preventDefault();
                            setPasswordState(e.target.value);
                    }}/>
                    <button onClick={(e) => {
                        e.preventDefault();
                        handleCheckFormEntry(usernameState, passwordState)
                    }}>Submit</button>
                </form>
                <span> Don't have an account? Create one here.</span>
            </div>
            </>
        )
    }
}

export default Login