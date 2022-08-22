import {deleteExercise, deleteSession, getAllSessions, getExercises} from "../utilities/queries";
import DeleteIcon from "@mui/icons-material/Delete";
import {useState} from "react";
import Button from "@mui/material/Button";

function GetAndDisplaySessions(){
    const [dataState, setDataState] = useState<JSX.Element[] | JSX.Element | undefined>(undefined);
    const [confirmationBoxState, setConfirmationBoxState] = useState<boolean | string>(false);

    const confirmationPopup = (
        <>
            <Button variant={"contained"} size={"small"} onClick={(e) => {
                e.preventDefault();
                setConfirmationBoxState("cancel");
            }}>Cancel</Button> &nbsp;

            <Button variant={"contained"} size={"small"} onClick={(e) => {
                e.preventDefault();
                /*handleActionsDispatch({type: "performFunction"});*/
            }}>Confirm</Button>
        </>
    );

    const displaySessionList = (
        <div className={"basicContainer"}>
            <h2>List</h2>
            {dataState}
            <br />
            <Button variant={"contained"} size={"small"} sx={{marginRight: "9px"}} onClick={(e) => {
                e.preventDefault();
                setDataState(undefined);
            }}>Close</Button>
            {confirmationBoxState === true && <>{confirmationPopup}</>}
        </div>
    );

    async function handleGetSessions(){
        let response = await getAllSessions();

        if (response.message === "Success") {
            let listOfSessions: JSX.Element[] = response.data.map((entry: any, k: number) => {
                return (
                    <div key={k}>
                        <DeleteIcon onClick={() => {
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

    async function handleDeleteSessionRequest(title: string, date: string) {
        let response = await deleteSession(title, date);

        if (response.message === "Success") {
            handleGetSessions(); //TODO Add mui
        } else {
            //TODO Add mui
        }
    }

/*        handleActionsDispatch({type: "confirmation", payload: true});*/
/*

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
*/

    return (
        <>
            <Button variant={"contained"} size={"small"} onClick={() => {
                handleGetSessions();
            }}>Get List of  Sessions</Button>

            {dataState && displaySessionList}
        </>
    );
}

export default GetAndDisplaySessions;