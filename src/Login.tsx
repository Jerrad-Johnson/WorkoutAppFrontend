import checkLogin from "./utilities/checkLogin";
import {StandardBackendResponse, LoginCredentials} from "./utilities/interfaces";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";
import {login} from "./utilities/queries";
let cc = console.log;

function handleCheckLogin(response: StandardBackendResponse, setLoginState: Dispatch<SetStateAction<string>>){
    if (response.data.loggedin === true) window.location.href="Home";
    setLoginState("false");
}

function handleCheckFormEntry(usernameState: string, passwordState: string, setLoginState: Dispatch<SetStateAction<string>>){
    cc(usernameState, passwordState)

    doLogin(usernameState, passwordState);
    checkLogin().then((response) => {
        handleCheckLogin(response, setLoginState);
    });
}

function doLogin(usernameState: string, passwordState: string){
    let data: LoginCredentials = {
        username: usernameState,
        password: passwordState,
    }

    login(data);

}

function Login(){

    let [loginState, setLoginState] = useState("pending");
    let [usernameState, setUsernameState] = useState("");
    let [passwordState, setPasswordState] = useState("");
    checkLogin().then((response) => handleCheckLogin(response, setLoginState));
    useEffect(() => {
        loginState === "pending" ? cc(5) : cc(7); //TODO Set to change opacity of loginContainer
    }, [loginState]);

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
                <div className={"overlay"}>
                    <CircularProgress size={150}/>
                    <span>Checking login.</span>
                </div>
            }
            <div className={"loginContainer"}>
                <span> Please Login.</span>
                <form onKeyPress={(e) => {
                    if (e.key === 'Enter') handleCheckFormEntry(usernameState, passwordState, setLoginState) //TODO Does not redirect if login is attempted too quickly. Fix this.
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
                        handleCheckFormEntry(usernameState, passwordState, setLoginState)
                    }}>Submit</button>
                </form>
                <span> Don't have an account? Create one here.</span>
            </div>
            </>
        )
    }
}

export default Login