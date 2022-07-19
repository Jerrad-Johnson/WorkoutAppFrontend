import checkLogin from "./utilities/checkLogin";
import {standardBackendResponse} from "./utilities/interfaces";
let cc = console.log;
checkLogin().then((response) => handleCheckLogin(response));

function handleCheckLogin(response: standardBackendResponse){
    cc(response)
}

function Login(){

    return (
        <div>
            <span>Test</span>
        </div>
    )
}

export default Login