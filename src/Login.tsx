import checkLogin from "./utilities/checkLogin";
import {standardBackendResponse} from "./utilities/interfaces";
import {Dispatch, SetStateAction, useState} from "react";
import {CircularProgress} from "@mui/material";
import {log} from "util";
let cc = console.log;

function handleCheckLogin(response: standardBackendResponse, setLoginState: Dispatch<SetStateAction<string>>){
    if (response.data.loggedin === true) window.location.href="Home";
    setLoginState("false");
}

function Login(){
    let [loginState, setLoginState] = useState("pending");
    checkLogin().then((response) => handleCheckLogin(response, setLoginState));

    if (loginState === "pending"){
        return (
            <div className={"loginOverlay"}>
                <CircularProgress size={150}/>
                <span>Checking login.</span>
            </div>
        )
    } else if (loginState === "false"){
        return (
            <div className={"loginOverlay"}>
                    Please Login.
            </div>
        )
    } else {
        return (
            <div className={"loginOverlay"}>
            Logged in, please proceed.
        </div>
        )
    }
}

export default Login