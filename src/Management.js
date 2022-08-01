import {changeEmail, changePassword, deleteExercise, deleteSession, getExercises, logout} from "./utilities/queries";
import Nav from "./Nav";
import {useReducer, useState} from "react";
import {getAllSessions} from "./utilities/queries";
import {HandleActionsData, GenericAction} from "./utilities/interfaces";
let cc = console.log;

function Management(){
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
    const confirmationPopup = (<div>
        <button onClick={(e) => {
            e.preventDefault();
            handleActionsDispatch({type: "cancel"});
        }}>Cancel</button> &nbsp;

        <button onClick={(e) => {
            e.preventDefault();
            handleActionsDispatch({type: "performFunction"});
        }}>Confirm</button>
    </div>);
    const changePasswordForm = (<div>
        {/*<span>Change password</span>*/}
        <br />
        <form>
            <input type={"password"} value={oldPasswordState} onChange={(e) => {
                setOldPasswordState(e.target.value);
            }}/>
            <br />
            <input type={"password"} value={newPasswordState} onChange={(e) => {
                setNewPasswordState(e.target.value);
            }}/>
            <br />
            <input type={"password"} value={newPasswordVerifyState} onChange={(e) => {
                setNewPasswordVerifyState(e.target.value);
            }}/>
            <br />
            <button onClick={(e) => {
                handleActionsDispatch({type: "displayChangePasswordForm", payload: false});
            }}>Cancel</button> &nbsp;
            <button onClick={(e) => {
                e.preventDefault();
                handleChangePassword();
            }}>Submit</button>
        </form>
    </div>);
    const changeEmailForm = (<div>
        <form>
            <input type={"text"} value={newEmailState} onChange={(e) => {
                setNewEmailState(e.target.value);
            }}/>
            <br />
            <input type={"text"} value={newEmailVerifyState} onChange={(e) => {
                setNewEmailVerifyState(e.target.value);
            }}/>
            <br />
            <button onClick={(e) => {
                handleActionsDispatch({type: "displayChangeEmailForm", payload: false});
            }}>Cancel</button>  &nbsp;
            <button onClick={(e) => {
                e.preventDefault();
                handleChangeEmail();
            }}>Submit</button>

        </form>
    </div>);

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
            verifyPasswordForms();
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
            verifyEmailForm();
            let response = await changeEmail(newEmailState);
            cc(response); //TODO Print to DOM
            handleActionsDispatch({type: "displayChangeEmailForm", payload: false});
        } catch (e) {
            cc(e);
        }

    }

    function verifyPasswordForms(){
        if (newPasswordState !== newPasswordVerifyState) throw new Error("New passwords must match");
        if (oldPasswordState === "") throw new Error("Old password field must not be blank.");
        if (newPasswordState === "") throw new Error("New password must not be blank.");
        //return true;
    }

    function verifyEmailForm(){
        if (newEmailState !== newEmailVerifyState) throw new Error("E-mail address must match in both fields.");
        if (!String(newEmailState).toLowerCase().match(                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            throw new Error("Invalid e-mail address");
        }
    }


    async function handleGetSessions(){
        let response = await getAllSessions();

        if (response.message === "Success") {
            let listOfSessions: JSX.Element[] = response.data.map((entry, k) => {
                return (
                    <div key={k}>
                        <span className={"listQuery"}>{entry.session_title + " --- " + entry.session_date}</span> &nbsp;
                        <button onClick={(event) => {
                            event.preventDefault();
                            handleDeleteSessionRequest(entry.session_title, entry.session_date);
                        }}>Delete</button>
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
                    <span className={"listQuery"} key={k} onClick={(event) => {
                        handleActionsDispatch({type: "confirmation", payload: true})
                        handleDeleteExerciseRequest(e);
                    }}>{e}</span>
                )
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

    return (
        <>
        <Nav />
        <div>
            <button onClick={() => {
                cc(handleActionsState);
            }}>Log Data</button>
            <br />
            <br />

            <button onClick={() => {
                handleLogout();
            }}>Log Out</button>
            <br />

            <button onClick={() => {
                handleGetSessions();
            }}>Get List of  Sessions</button>
            <br />

            <button onClick={() => {
                handleGetAllExercises();
            }}>Get List of Exercises</button>
            <br />
            <br />

            <button onClick={(e) => {
                e.preventDefault()
                handleActionsDispatch({type: "displayChangeEmailForm", payload: true});
            }}>Change E-mail Address</button>
            <br />

            <button onClick={(e) => {
                e.preventDefault();
                handleActionsDispatch({type: "displayChangePasswordForm", payload: true});
                cc(handleActionsState)
            }}>Change Password</button>
            <br />
            <br />

            {handleActionsState.changePassword === true && <>{changePasswordForm}</>}
            {handleActionsState.changeEmail === true && <>{changeEmailForm}</>}
            {handleActionsState.confirmationBox === true && <>{confirmationPopup}</>}

            {dataState &&
                <div className={"listContainer"}>
                    <button onClick={(e) => {
                        e.preventDefault();
                        setDataState(undefined);
                    }}>Close</button>
                    {dataState}
                </div>
            }
        </div>
        </>
    );
}

async function handleLogout(){
    await logout().then(response => {
      if (response.data.loggedout === "true") window.location.href="/";
    });


}

export default Management