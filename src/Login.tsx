import checkLogin from "./utilities/checkLogin";
import {standardBackendResponse} from "./utilities/interfaces";
import {Dispatch, SetStateAction, useState} from "react";
import {CircularProgress} from "@mui/material";
let cc = console.log;

function handleCheckLogin(response: standardBackendResponse, setLoginState: Dispatch<SetStateAction<string>>){
    if (response.data.loggedin === true) window.location.href="Home";
    setLoginState("false");
}

function Login(){
    let [loginState, setLoginState] = useState("pending");
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
                <div className={"loginContainer"}>
                    <CircularProgress size={150}/>
                    <span>Checking login.</span>
                </div>
            }
            <div className={"loginContainer"}>
                <span> Please Login.</span>
                <form>
                    <input type={"text"} className={"loginInputs"} />
                    <input type={"password"} className={"loginInputs"} />
                </form>
                <span> Don't have an account? Create one here.</span>
            </div>
            </>
        )
    }
}

export default Login