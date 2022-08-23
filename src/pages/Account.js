import {changeEmail, changePassword, deleteExercise, deleteSession, getExercises, logout} from "../utilities/queries";
import Nav from "../components/Nav";
import {useReducer, useState} from "react";
import {HandleActionsData, GenericAction} from "../utilities/interfaces";
import {verifyEmailForm, verifyPasswordChangeForms} from "../utilities/sharedFns";
import Button from "@mui/material/Button";
import {TextField} from "@mui/material";
import toast from "react-hot-toast";
let cc = console.log;
//TODO Add session default options

function Account(){
    const [oldPasswordState, setOldPasswordState] = useState("");
    const [newPasswordState, setNewPasswordState] = useState("");
    const [newPasswordVerifyState, setNewPasswordVerifyState] = useState("");
    const [newEmailState, setNewEmailState] = useState("");
    const [newEmailVerifyState, setNewEmailVerifyState] = useState("");
    const testToast = () => toast('toasty');
    toast('toasty');

    const handleActionsDefaultState: HandleActionsData = {
        confirmationBox: false,
        functionToPerform: undefined,
        changePassword: false,
        changeEmail: false,
    }

    const [handleActionsState, handleActionsDispatch] = useReducer(handleActionsReducer, handleActionsDefaultState)


    const changePasswordForm = (
        <div className={"basicContainer"}>
            <h2>Change Password</h2>
            <form>

                <TextField type={"password"} value={oldPasswordState} variant={"standard"} sx={{width: "100%"}} placeholder={"Old Password"} onChange={(e) => {
                    setOldPasswordState(e.target.value);
                }}/>
                <br /><br />

                <TextField type={"password"} value={newPasswordState} variant={"standard"} sx={{width: "100%"}} placeholder={"New Password"} onChange={(e) => {
                    setNewPasswordState(e.target.value);
                }}/>
                <br /><br />

                <TextField type={"password"} value={newPasswordVerifyState} variant={"standard"} sx={{width: "100%"}} placeholder={"Confirm New Password"} onChange={(e) => {
                    setNewPasswordVerifyState(e.target.value);
                }}/>
                <br /><br />

                <Button variant={"contained"} size={"small"} onClick={(e) => {
                    handleActionsDispatch({type: "displayChangePasswordForm", payload: false});
                }}>Cancel</Button> &nbsp;
                <Button variant={"contained"} size={"small"} onClick={(e) => {
                    e.preventDefault();
                    handleChangePassword();
                }}>Submit</Button>

            </form>
       </div>
    );

    const changeEmailForm = (
        <div className={"basicContainer"}>
            <h2>Change E-mail</h2>
            <form>

                <TextField type={"text"} value={newEmailState} variant={"standard"} sx={{width: "100%"}} placeholder={"New E-mail"} onChange={(e) => {
                    setNewPasswordVerifyState(e.target.value);
                }}/>
                <br/><br/>

                <TextField type={"text"} value={newEmailVerifyState} variant={"standard"} sx={{width: "100%"}} placeholder={"Confirm New E-mail"} onChange={(e) => {
                    setNewPasswordVerifyState(e.target.value);
                }}/>
                <br /><br />

                <Button variant={"contained"} size={"small"} onClick={(e) => {
                    handleActionsDispatch({type: "displayChangeEmailForm", payload: false});
                }}>Cancel</Button>  &nbsp;

                <Button variant={"contained"} size={"small"} onClick={(e) => {
                    e.preventDefault();
                    handleChangeEmail();
                }}>Submit</Button>

            </form>
        </div>
    );

    function handleActionsReducer(state: HandleActionsData, action: GenericAction){
        switch (action.type){
            case "confirmation":
                return {...state, confirmationBox: action.payload}
            case "cancel":
                return {...state, confirmationBox: false, functionToPerform: undefined}
            case "defineFunctionToPerform":
                return {...state, functionToPerform: action.payload}
            case "performFunction":
                if (state.functionToPerform) {
                    state.functionToPerform();
                } else {
                    //TODO Handle error
                }
                return {...state, functionToPerform: undefined, confirmationBox: false, itemToDelete: undefined}
            case "displayChangePasswordForm":
                if (action.payload === false){
                    setOldPasswordState("");
                    setNewPasswordState("");
                    setNewPasswordVerifyState("");
                }
                return {...state, changePassword: action.payload}
            case "displayChangeEmailForm":
                return {...state, changeEmail: action.payload}
            default:
                return state;
        }
    }

    async function handleChangePassword(){
        try {
            verifyPasswordChangeForms(oldPasswordState, newPasswordState, newPasswordVerifyState);
            let response = await changePassword(oldPasswordState, newPasswordState)
            cc(response); //TODO Display in DOM
            setOldPasswordState("");
            setNewPasswordState("");
            setNewPasswordVerifyState("");
            handleActionsDispatch({type: "displayChangePasswordForm", payload: false});
        } catch (e) {
            cc(e) //TODO handle error
        }
    }

    async function handleChangeEmail(){
        try {
            verifyEmailForm(newEmailState, newEmailVerifyState);
            let response = await changeEmail(newEmailState);
            cc(response); //TODO Print to DOM
            handleActionsDispatch({type: "displayChangeEmailForm", payload: false});
        } catch (e) {
            cc(e);
        }
    }

    let title = "Account";

    return (
        <>
            <button onClick={(e) => {
                cc(toast)
                cc(testToast)
                testToast();
            }}>toast</button>

            <Nav title={title} />
            <div className={"basicContainer"}>
                <Button variant={"contained"} size={"small"} onClick={() => {
                    handleLogout();
                }}>Log Out</Button>

                <Button variant={"contained"} size={"small"} onClick={(e) => {
                    e.preventDefault()
                    handleActionsDispatch({type: "displayChangeEmailForm", payload: true});
                }}>Change E-mail Address</Button>

                <Button variant={"contained"} size={"small"} onClick={(e) => {
                    e.preventDefault();
                    handleActionsDispatch({type: "displayChangePasswordForm", payload: true});
                }}>Change Password</Button>
                <br /><br />

{/*                <Button variant={"contained"} size={"small"} onClick={() => {
                    handleGetAllExercises();
                }}>Get List of Exercises</Button>*/}
            </div>

            {handleActionsState.changePassword === true && <>{changePasswordForm}</>}
            {handleActionsState.changeEmail === true && <>{changeEmailForm}</>}
        </>
    );
}

async function handleLogout(){
    await logout().then(response => {
      if (response.data.loggedout === "true") window.location.href="/";
    });


}

export default Account