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
                setConfirmationBoxState(false);
            }}>Cancel</Button> &nbsp;

            <Button variant={"contained"} size={"small"} onClick={(e) => {
                e.preventDefault();
                deleteFunctionState();
                setConfirmationBoxState(false);
                handleGetExercises();
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

    async function handleGetExercises(){
        let response = await getExercises();

        if (response.data[0]) {
            let listOfExercises: JSX.Element[] = response.data.map((e: string, k: number) => {
                return (
                    <div key={k}>
                        <DeleteIcon onClick={(event) => {
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

    function handleDeleteExerciseRequest(exercise: string) {
        let deleteSessionFunction = (() => async () => {
            let response = await deleteExercise(exercise);

            if (response.message === "Success") {
                handleGetExercises(); //TODO Add mui
            } else {
                //TODO Add mui
            }
        });

        setDeleteFunctionState(deleteSessionFunction);
        setConfirmationBoxState(true);
    }

    return (
        <>
            <Button variant={"contained"} size={"small"} onClick={() => {
                handleGetExercises();
            }}>Get List of Exercises</Button>
            <br /><br />

            {dataState && displaySessionList}
        </>
    );
}

export default GetAndDisplaySessions;