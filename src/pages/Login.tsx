import {StandardBackendResponse, LoginCredentials} from "../utilities/interfaces";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {CircularProgress, TextField} from "@mui/material";
import {getSessionDefaults, loginQuery, queryCheckLogin} from "../utilities/queries";
import Nav from "../components/Nav";
import CustomizedMenus from "../components/DropdownMenu";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
let cc = console.log;

//TODO Add password reset option to login page

function handleLoginFormEntry(usernameState: string, passwordState: string, setLoginState: Dispatch<SetStateAction<string>>){
    if (!checkFormEntry(usernameState, passwordState)) return;
    setLoginState("pending");
    doLogin(usernameState, passwordState);
    checkLogin().then((response) => {
        handleCheckIfLoggedIn(response, setLoginState);
    });
}

function checkFormEntry(usernameState: string, passwordState: string){
    if (usernameState === "" || passwordState === "") return false; //TODO Error message
    return true;
}

async function handleCheckIfLoggedIn(response: StandardBackendResponse, setLoginState: Dispatch<SetStateAction<string>>){
    if (response.data.loggedin === true){
        response = await getSessionDefaults();
        if (response.data !== false) {
            localStorage.setItem("defaultExercises", JSON.stringify(response.data.exercises));
            localStorage.setItem("defaultSets", JSON.stringify(response.data.sets));
            localStorage.setItem("defaultReps", JSON.stringify(response.data.reps));
            localStorage.setItem("defaultWeight", JSON.stringify(response.data.weight));
        }
        window.location.href="Home";
    }
    setLoginState("false");
}

async function checkLogin(){
    let response = await queryCheckLogin();

    return response;
}

function doLogin(usernameState: string, passwordState: string){
    let data: LoginCredentials = {
        username: usernameState,
        password: passwordState,
    }

    loginQuery(data);
}

function Login(){
    let [loginState, setLoginState] = useState("pending");
    let [usernameState, setUsernameState] = useState("");
    let [passwordState, setPasswordState] = useState("");

    useEffect(() => {
        loginState === "pending" ? cc(5) : cc(7); //TODO Set to change opacity of loginContainer
    }, [loginState]);

    useEffect(() => {
        checkLogin().then((response) => handleCheckIfLoggedIn(response, setLoginState));
    }, []);

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
            <div className={"basicContainer headerContainer"}>
                <div className={"headerLeft"}>
                    <span className={"pageTitle"}>Workout Progress Tracker</span>
                </div>
                <div className={"headerRight"}>
                </div>
            </div>

            <div className={"basicContainer"}>
                <h2> Please Login.</h2>




                    <TextField type={"text"} variant={"standard"} value={usernameState} placeholder={"Username"}
                       onChange={(e) => {
                            e.preventDefault();
                            setUsernameState(e.target.value);
                    }}/>

                    <TextField type={"password"} variant={"standard"} value={passwordState} placeholder={"Password"}
                       onChange={(e) => {
                           e.preventDefault();
                           setUsernameState(e.target.value);
                   }}/>

                <Button variant={"contained"} size={"small"} className={"selectOrAddExerciseFieldChangeButton"}
                        onClick={(e) => {
                            e.preventDefault();
                            handleLoginFormEntry(usernameState, passwordState, setLoginState)
                        }}>Submit</Button>

                {/*<form onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleLoginFormEntry(usernameState, passwordState, setLoginState);
                    }//TODO Does not redirect if login is attempted too quickly. Fix this.
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
                        handleLoginFormEntry(usernameState, passwordState, setLoginState)
                    }}>Submit</button>
                </form>*/}
                <br />
                <span> Don't have an account? Create one <Link to={"CreateAccount"}>here.</Link></span>
            </div>
            </>
        )
    }
}

export default Login