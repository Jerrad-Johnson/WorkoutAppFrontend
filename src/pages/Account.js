import {
    changeEmail,
    changePassword,
    changeSessionDefaults,
    deleteExercise,
    deleteSession,
    getExercises,
    logout
} from "../utilities/queries";
import Nav from "../components/Nav";
import {useReducer, useState} from "react";
import {HandleActionsData, GenericAction} from "../utilities/interfaces";
import {showResponseMessageWithCondition, verifyEmailForm, verifyPasswordChangeForms} from "../utilities/sharedFns";
import Button from "@mui/material/Button";
import {TextField} from "@mui/material";
import toast from "react-hot-toast";
import {defaultToastMsg} from "../utilities/sharedVariables";
import {defaultToastPromiseErrorMessage, defaultToastPromiseLoadingMessage} from "../utilities/sharedVariables";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
let cc = console.log;
//TODO Add session default options

function Account(){
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

//    localStorage.setItem("defaultWeight", 20);

    const [handleActionsState, handleActionsDispatch] = useReducer(handleActionsReducer, handleActionsDefaultState)

    let defaultExercises: number = 3; //@ts-ignore
    if (localStorage.getItem("defaultExercises") !== null) defaultExercises = +JSON.parse(localStorage.getItem("defaultExercises"));

    let defaultSets: number = 3; //@ts-ignore
    if (localStorage.getItem("defaultSets") !== null) defaultSets = +JSON.parse(localStorage.getItem("defaultSets"));

    let defaultReps: number = 5; //@ts-ignore
    if (localStorage.getItem("defaultReps") !== null) defaultReps = +JSON.parse(localStorage.getItem("defaultReps"));

    let defaultWeight: number = 100; //@ts-ignore
    if (localStorage.getItem("defaultWeight") !== null) defaultWeight = +JSON.parse(localStorage.getItem("defaultWeight"));

    const [defaultExercisesState, setDefaultExercisesState] = useState(defaultExercises);
    const [defaultSetsState, setDefaultSets] = useState(defaultSets);
    const [defaultRepsState, setDefaultRepsState] = useState(defaultReps);
    const [defaultWeightState, setDefaultWeight] = useState(defaultWeight);


    const exerciseSelectorMenuItems = new Array(12).fill(0).map((_e, k) => {
        return (
            <MenuItem value={k+1} key={k}>{k+1}</MenuItem>
        );
    });

    const setSelectorMenuItems = new Array(12).fill(0).map((_e, k) => {
        return (
            <MenuItem value={k+1} key={k}>{k+1}</MenuItem>
        );
    });

    const repSelectorMenuItems = new Array(20).fill(0).map((_e, k) => {
        return (
            <MenuItem value={k+1} key={k}>{k+1}</MenuItem>
        );
    });

    const defaultOptionsSelectors = (
      <>
          <h2>Change defaults</h2>
          <div className={"defaultsSelectorsFlexbox"}>
              <div>
                  <span className={"selectorTitle"}>Exercises</span>
                  <FormControl className={"changeSessionDefaults"} variant={"standard"} placeholder={"Exercise"}>
                      <Select value={defaultExercisesState} className={"genericBottomMargin smallerSelect"} onChange={(e) => {
                          setDefaultExercisesState(+e.target.value);
                          localStorage.setItem("defaultExercises", e.target.value);
                      }}>
                          {exerciseSelectorMenuItems}
                      </Select>
                  </FormControl>
              </div>

              <div>
                  <span className={"selectorTitle"}>Sets</span>
                  <FormControl className={"changeSessionDefaults"} variant={"standard"} placeholder={"Sets"}>
                      <Select value={defaultSetsState} className={"genericBottomMargin smallerSelect"} onChange={(e) => {
                          setDefaultSets(+e.target.value);
                          localStorage.setItem("defaultSets", e.target.value);
                      }}>
                          {setSelectorMenuItems}
                      </Select>
                  </FormControl>
              </div>

              <div>
                  <span className={"selectorTitle"}>Reps</span>
                  <FormControl className={"changeSessionDefaults"} variant={"standard"} placeholder={"Reps"}>
                      <Select value={defaultRepsState} className={"genericBottomMargin smallerSelect"} onChange={(e) => {
                          setDefaultRepsState(+e.target.value);
                          localStorage.setItem("defaultReps", e.target.value);
                      }}>
                          {repSelectorMenuItems}
                      </Select>
                  </FormControl>
              </div>
              <div>
                  <span className={"selectorTitle"}>Weight</span>
                  <TextField type={"number"}
                         variant={"standard"}
                         sx={{width: "60px"}}
                         value={defaultWeightState}
                         onChange={(e) => {
                             if (e.target.value === '') return;
                             let leadingZerosRemoved = e.target.value.replace(/^0+/, '');
                             let isValue = /^[0-9.]*$/.test(leadingZerosRemoved);
                             if (isValue) {
                                setDefaultWeight(+e.target.value);
                                cc(e.target.value)
                                localStorage.setItem("defaultWeight", e.target.value);
                             } else {
                                 toast.error("Please only enter numbers.")
                             }
                         }}
                  />
              </div>
          </div>
          <div>
              <Button variant={"contained"} size={"small"} onClick={(e) => {
                  e.preventDefault();
                  handleSaveDefaults(+defaultRepsState, +defaultSetsState, +defaultExercisesState, +defaultWeightState);

              }}>Save Defaults</Button>

          </div>
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
            let response = await toast.promise(changePassword(oldPasswordState, newPasswordState), {
                loading: defaultToastPromiseLoadingMessage,
                success: () => {
                    handleActionsDispatch({type: "displayChangePasswordForm", payload: false});
                    return "Finished";
                },
                error: defaultToastPromiseErrorMessage,
            });
            showResponseMessageWithCondition(response);
        } catch (e) {
            cc(e) //TODO handle error
        }
    }

    async function handleChangeEmail(){
        try {
            verifyEmailForm(newEmailState, newEmailVerifyState);
            let response = await toast.promise(changeEmail(newEmailState), {
                loading: defaultToastPromiseLoadingMessage,
                success: () => {
                    handleActionsDispatch({type: "displayChangeEmailForm", payload: false});
                    return "Finished";
                },
                error: defaultToastPromiseErrorMessage,
            });
            showResponseMessageWithCondition(response);
        } catch (e) {
            cc(e);
        }
    }

    let title = "Account";

    return (
        <>
            <Nav title={title} />
            <div className={"basicContainer"}>
                {defaultOptionsSelectors}
                <br/>
                <h2>Account Security</h2>
                <Button variant={"contained"} size={"small"} onClick={() => {
                    handleLogout();
                }}>Log Out</Button>

                <Button variant={"contained"} size={"small"} sx={{marginLeft: "8px"}} onClick={(e) => {
                    e.preventDefault()
                    handleActionsDispatch({type: "displayChangeEmailForm", payload: true});
                }}>Change E-mail Address</Button>

                <Button variant={"contained"} size={"small"} sx={{marginLeft: "8px"}} onClick={(e) => {
                    e.preventDefault();
                    handleActionsDispatch({type: "displayChangePasswordForm", payload: true});
                }}>Change Password</Button>
                <br /><br />
            </div>

            {handleActionsState.changePassword === true && <>{changePasswordForm}</>}
            {handleActionsState.changeEmail === true && <>{changeEmailForm}</>}
        </>
    );
}

async function handleLogout(){
    let response = await toast.promise(logout().then(response => {
        if (response.data.loggedout === "true") window.location.href="/";
    }), defaultToastMsg);
    showResponseMessageWithCondition(response);
}

async function handleSaveDefaults(reps: number, sets: number, exercises: number, weight: number){
    try {
        let response = await toast.promise(changeSessionDefaults(reps, sets, exercises, weight), {
            loading: defaultToastPromiseLoadingMessage,
            success: "Saved",
            error: defaultToastPromiseErrorMessage,
        });
        showResponseMessageWithCondition(response);
    } catch (e) {
        cc(e);
    }
}

export default Account