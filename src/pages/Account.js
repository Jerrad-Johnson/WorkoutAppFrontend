import {changeEmail, changePassword, deleteExercise, deleteSession, getExercises, logout} from "../utilities/queries";
import Nav from "../components/Nav";
import {useReducer, useState} from "react";
import {getAllSessions} from "../utilities/queries";
import {HandleActionsData, GenericAction} from "../utilities/interfaces";
import {verifyEmailForm, verifyPasswordChangeForms} from "../utilities/sharedFns";
import Button from "@mui/material/Button";
import CustomizedMenus from "../components/DropdownMenu";
import {TextField} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
let cc = console.log;
//TODO Add session default options

function Account(){
    const [dataState, setDataState] = useState(undefined);
    const [oldPasswordState, setOldPasswordState] = useState("");
    const [newPasswordState, setNewPasswordState] = useState("");
    const [newPasswordVerifyState, setNewPasswordVerifyState] = useState("");
    const [newEmailState, setNewEmailState] = useState("");
    const [newEmailVerifyState, setNewEmailVerifyState] = useState("");

    const handleActionsDefaultState: HandleActionsData = {
        confirmationBox: false,
        functionToPerform: undefined,
        changePassword: false,
        changeEmail: false,
    }

    const [handleActionsState, handleActionsDispatch] = useReducer(handleActionsReducer, handleActionsDefaultState)
    const confirmationPopup = (
        <>
            <Button variant={"contained"} size={"small"} onClick={(e) => {
                e.preventDefault();
                handleActionsDispatch({type: "cancel"});
            }}>Cancel</Button> &nbsp;

            <Button variant={"contained"} size={"small"} onClick={(e) => {
                e.preventDefault();
                handleActionsDispatch({type: "performFunction"});
            }}>Confirm</Button>
       </>
    );

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

    const displaySessionOrExerciseList = (
        <div className={"basicContainer"}>
            <h2>List</h2>
            {dataState}
            <br />
            <Button variant={"contained"} size={"small"} sx={{marginRight: "9px"}} onClick={(e) => {
                e.preventDefault();
                setDataState(undefined);
            }}>Close</Button>
            {handleActionsState.confirmationBox === true && <>{confirmationPopup}</>}
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
                cc("failed");
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

    async function handleGetSessions(){
        let response = await getAllSessions();

        if (response.message === "Success") {
            let listOfSessions: JSX.Element[] = response.data.map((entry, k) => {
                return (
                    <div key={k}>
                        <DeleteIcon onClick={(event) => {
                            event.preventDefault();
                            handleDeleteSessionRequest(entry.session_title, entry.session_date);
                        }}>Delete</DeleteIcon>
                        <span className={"listQuery"}>{entry.session_title + " --- " + entry.session_date}</span> &nbsp;
                    </div>
                );
            });
            setDataState(listOfSessions);
        } else {
            setDataState(<span className={"listQuery"}>No Results.</span>) //TODO Test this
        }
    }

    function handleDeleteSessionRequest(title: string, date: string){
        handleActionsDispatch({type: "defineFunctionToPerform", payload: async () => {
            let response = await deleteSession(title, date);

            if (response.message === "Success") {
                handleGetSessions(); //TODO Add mui
            } else {
                //TODO Add mui
            }
        }});

        handleActionsDispatch({type: "confirmation", payload: true});
    }

    async function handleGetAllExercises(){
        let response = await getExercises();

        if (response.data[0]) {
            let listOfExercises: JSX.Element[] = response.data.map((e, k) => {
                return (
                    <div key={k}>
                        <DeleteIcon onClick={(event) => {
                            handleActionsDispatch({type: "confirmation", payload: true})
                            handleDeleteExerciseRequest(e);
                        }}/>
                        <span className={"listQuery"}>{e}</span>
                    </div>
                );
            });
            setDataState(listOfExercises);
        } else {
            setDataState(<span className={"listQuery"}>No Results.</span>) //TODO Test this
        }
    }

    function handleDeleteExerciseRequest(exercise: string){
        handleActionsDispatch({type: "defineFunctionToPerform", payload: async () => {
            let response = await deleteExercise(exercise);

            if (response.message === "Success") {
                handleGetAllExercises(); //TODO Add mui
            } else {
                //TODO Add mui
            }
        }});
    }

    let title = "Account";

    return (
        <>
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
                <br />
                <br />

                <Button variant={"contained"} size={"small"} onClick={() => {
                    handleGetSessions();
                }}>Get List of  Sessions</Button>

                <Button variant={"contained"} size={"small"} onClick={() => {
                    handleGetAllExercises();
                }}>Get List of Exercises</Button>
            </div>

            {handleActionsState.changePassword === true && <>{changePasswordForm}</>}
            {handleActionsState.changeEmail === true && <>{changeEmailForm}</>}

            {dataState && displaySessionOrExerciseList}

        </>
    );
}

async function handleLogout(){
    await logout().then(response => {
      if (response.data.loggedout === "true") window.location.href="/";
    });


}

export default Account