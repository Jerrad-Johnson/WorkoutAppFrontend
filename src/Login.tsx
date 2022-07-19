import checkLogin from "./utilities/checkLogin";
import {standardBackendResponse} from "./utilities/interfaces";
import {Dispatch, SetStateAction, useState} from "react";
let cc = console.log;

function handleCheckLogin(response: standardBackendResponse, setLoginState: Dispatch<SetStateAction<boolean>>){
    cc(response.data)
}

function Login(){
    let [loginState, setLoginState] = useState(false);
    checkLogin().then((response) => handleCheckLogin(response, setLoginState));

    return (
        <div>
            <span>Test</span>
        </div>
    )
}

export default Login