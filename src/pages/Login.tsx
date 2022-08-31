import {StandardBackendResponse, LoginCredentials} from "../utilities/interfaces";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {CircularProgress, TextField} from "@mui/material";
import {getSessionDefaults, loginQuery, queryCheckLogin} from "../utilities/queries";
import Button from "@mui/material/Button";
import {
    defaultToastPromiseErrorMessage,
    defaultToastPromiseLoadingMessage
} from "../utilities/sharedVariables";
import {showResponseMessageWithCondition} from "../utilities/sharedFns";
import toast from "react-hot-toast";
let cc = console.log;

//TODO Add password reset option to login page

async function handleLoginFormEntry(usernameState: string, passwordState: string, firstLoadState: boolean,
                                    setFirstLoadState: Dispatch<SetStateAction<boolean>>){
    if (!checkFormEntry(usernameState, passwordState)) return;

    let response = await toast.promise(doLogin(usernameState.toLowerCase(), passwordState), {
        loading: defaultToastPromiseLoadingMessage,
        success: "Checking login.",
        error: defaultToastPromiseErrorMessage,
    });
    showResponseMessageWithCondition(response)

    if (response.message === "Already logged in.") {
        window.location.href="Home";
        return;
    }

    if (response.message === "Wrong password.") return;

    let confirmLoggedIn = await checkLogin();

    await toast.promise(handleCheckIfLoggedIn(confirmLoggedIn, firstLoadState, setFirstLoadState), {
        loading: defaultToastPromiseLoadingMessage,
        success: "",
        error: defaultToastPromiseErrorMessage,
    }, {
        success: {
            duration: 1,
        }
    });

}

function checkFormEntry(usernameState: string, passwordState: string){
    if (usernameState === "" || passwordState === "") return false; //TODO Error message
    return true;
}

async function handleCheckIfLoggedIn(response: StandardBackendResponse, firstLoadState: boolean,
                                     setFirstLoadState: Dispatch<SetStateAction<boolean>>){
    if (response.data.loggedin !== true && firstLoadState === false){
        toast.error("Not logged in.");
    }

    setFirstLoadState(true);

    if (response.data.loggedin === true){
        let sessionDefaultsResponse = await getSessionDefaults();
        if (sessionDefaultsResponse.data !== false) {
            localStorage.setItem("defaultExercises", JSON.stringify(sessionDefaultsResponse.data.exercises));
            localStorage.setItem("defaultSets", JSON.stringify(sessionDefaultsResponse.data.sets));
            localStorage.setItem("defaultReps", JSON.stringify(sessionDefaultsResponse.data.reps));
            localStorage.setItem("defaultWeight", JSON.stringify(sessionDefaultsResponse.data.weight));
        }
        window.location.href="Home";
    }
}

async function checkLogin(){
    let response = await queryCheckLogin();

    return response;
}

async function doLogin(usernameState: string, passwordState: string){
    let data: LoginCredentials = {
        username: usernameState,
        password: passwordState,
    }

    let response = await loginQuery(data);
    return response;
}

function Login() {
    const [usernameState, setUsernameState] = useState("");
    const [passwordState, setPasswordState] = useState("");
    const [firstLoadState, setFirstLoadState] = useState(true);

    useEffect(() => {
        checkLogin().then((response) => handleCheckIfLoggedIn(response, firstLoadState, setFirstLoadState));
    }, []);

    return (
        <>
            <div className={"basicContainer headerContainer"}>
                <span className={"pageTitle"}>Workout Progress Tracker</span>
            </div>

            <div className={"basicContainer"}>
                <h2> Please Login.</h2>

                <form onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleLoginFormEntry(usernameState, passwordState, firstLoadState, setFirstLoadState);
                    }//TODO Does not redirect if login is attempted too quickly. Fix this.
                }}>
                    <TextField type={"text"} variant={"standard"} sx={{"display": "block", "marginBottom": "8px"}}
                               value={usernameState} placeholder={"Username"}
                               onChange={(e) => {
                                   e.preventDefault();
                                   setUsernameState(e.target.value);
                               }}/>

                    <TextField type={"password"} variant={"standard"} sx={{"display": "block", "marginBottom": "8px"}}
                               value={passwordState} placeholder={"Password"}
                               onChange={(e) => {
                                   e.preventDefault();
                                   setPasswordState(e.target.value);
                               }}/>

                    <Button variant={"contained"} size={"small"} className={"selectOrAddExerciseFieldChangeButton"}
                            onClick={(e) => {
                                e.preventDefault();
                                handleLoginFormEntry(usernameState, passwordState, firstLoadState, setFirstLoadState)
                            }}>Submit</Button>
                </form>

                <br/><span> Don't have an account? Create one <Link to={"CreateAccount"}>here.</Link></span>
                <br/><span><Link to={"PasswordReset"}>Forgot password?</Link></span>
            </div>
        </>
    );
}

export default Login