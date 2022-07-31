import {deleteExercise, getExercises, logout} from "./utilities/queries";
import Nav from "./Nav";
import {useReducer, useState} from "react";
import {getAllSessions} from "./utilities/queries";
import {SetStateAction} from "react";
import {Dispatch} from "react";
import {HandleActionsData, GenericAction} from "./utilities/interfaces";
let cc = console.log;

async function handleGetSessions(setDataState: SetStateAction<Dispatch<JSX.Element[]>>){
    let response = await getAllSessions();

    if (response.message === "Success") {
        let listOfSessions: JSX.Element[] = response.data.map((e, k) => {
            return (
                <span className={"listQuery"} key={k}>{e.session_title + " --- " + e.session_date}</span>
            )
        });
        setDataState(listOfSessions);
    } else {
        setDataState(<span className={"listQuery"}>No Results.</span>) //TODO Test this
    }
}

function Management(){
    const [dataState, setDataState] = useState(undefined);

    let handleActionsDefaultState: HandleActionsData = {
        confirmationBox: false,
        functionToPerform: undefined,
        itemToDelete: undefined,
    }

    const [handleActionsState, handleActionsDispatch] = useReducer(handleActionsReducer, handleActionsDefaultState)

    function handleActionsReducer(state: HandleActionsData, action: GenericAction){
        switch (action.type){
            case "confirmation":
                return {...state, confirmationBox: action.payload};
                break;
            case "test":
                cc(action.payload);
                break;
            case "defineItemToDelete":
                return {...state, itemToDelete: action.payload};
                break;
            case "defineFunctionAndItemToDelete":
                cc(action.payload)
                cc(state);
                return {...state, functionToPerform: action.payload};
                break;
            case "performFunction":
                if (state.functionToPerform) {
                    state.functionToPerform();
                    //handleGetAllExercises();
                } else {
                    //TODO Handle error
                }

                return {...state, functionToPerform: undefined, confirmationBox: false};
                break;
            default:
                cc("failed");
                return state;
        }
    }

    let confirmationPopup = (<div>
        <button onClick={(e) => {
            e.preventDefault();
        }}>Cancel</button> &nbsp;
        <button onClick={(e) => {
            e.preventDefault();
            handleActionsDispatch({type: "performFunction"});
        }}>Confirm</button>
    </div>);


    async function handleGetAllExercises(){
        let response = await getExercises();

        if (response.data[0]) {
            let listOfExercises: JSX.Element[] = response.data.map((e, k) => {
                return (
                    <span className={"listQuery"} key={k} onClick={(event) => {
                        handleActionsDispatch({type: "confirmation", payload: true})
                        handleDeleteExerciseRequest(e, setDataState, handleActionsDispatch);
                    }}>{e}</span>
                )
            });
            setDataState(listOfExercises);
        } else {
            setDataState(<span className={"listQuery"}>No Results.</span>) //TODO Test this
        }
    }

    function handleDeleteExerciseRequest(exercise: string){
        handleActionsDispatch({type: "defineItemToDelete", payload: exercise});

        handleActionsDispatch({type: "defineFunctionAndItemToDelete", payload: async () => {
            let response = await deleteExercise(exercise);

            if (response.message === "Success") {
                //TODO Add mui
                handleGetAllExercises();
            } else {
                //TODO Add mui
            }
        }});
        //handleActionsDispatch({type: "performFunction"});
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
                handleGetSessions(setDataState);
            }}>Get List of  Sessions</button>
            <br />

            <button onClick={() => {
                handleGetAllExercises(setDataState, handleActionsDispatch);
            }}>Get List of Exercises</button>
            <br />
            <br />

            <button onClick={() => {

            }}>Change E-mail Address</button> -- Not yet functional
            <br />

            <button>Change Password</button>
            <br />
            <br />

            {dataState &&
                <div className={"listContainer"}>
                    {dataState}
                </div>
            }

            {handleActionsState.confirmationBox === true && <>{confirmationPopup}</>}

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