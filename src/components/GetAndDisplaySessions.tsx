import {deleteExercise, deleteSession, getAllSessions, getExercises} from "../utilities/queries";
import DeleteIcon from "@mui/icons-material/Delete";
import {useState} from "react";
import Button from "@mui/material/Button";
let cc = console.log;

function GetAndDisplaySessions(){
    const [dataState, setDataState] = useState<JSX.Element[] | JSX.Element | undefined>(undefined);
    const [confirmationBoxState, setConfirmationBoxState] = useState<undefined | string | boolean>(false);
    const [deleteFunctionState, setDeleteFunctionState] = useState<any>(undefined);

    const confirmationPopup = (
        <>
            <Button variant={"contained"} size={"small"} onClick={(e) => {
                e.preventDefault();
                setConfirmationBoxState("cancel");
            }}>Cancel</Button> &nbsp;

            <Button variant={"contained"} size={"small"} onClick={(e) => {
                e.preventDefault();
                deleteFunctionState();
                handleGetSessions();
            }}>Confirm</Button>
        </>
    );

    const displaySessionList = (
        <div className={"basicContainer"}>
            <h2>Session List</h2>
            {dataState}
            <br />
            <Button variant={"contained"} size={"small"} sx={{marginRight: "9px"}} onClick={(e) => {
                e.preventDefault();
                setDataState(undefined);
                setConfirmationBoxState(false);
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

    function handleDeleteSessionRequest(title: string, date: string) {
        let deleteSessionFunction = (() => async () => {
            let response = await deleteSession(title, date);

            if (response.message === "Success") {
                handleGetSessions(); //TODO Add mui
            } else {
                //TODO Add mui
            }

        });

        setDeleteFunctionState(deleteSessionFunction);
        setConfirmationBoxState(true);

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
            }}>Get List of Sessions</Button>
            <Button variant={"contained"} size={"small"} onClick={() => {
                cc(deleteFunctionState)
            }}>Test Data</Button>

            {dataState && displaySessionList}
        </>
    );
}

export default GetAndDisplaySessions;