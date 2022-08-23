import {deleteExercise, deleteSession, getAllSessions, getExercises} from "../utilities/queries";
import DeleteIcon from "@mui/icons-material/Delete";
import {useState} from "react";
import Button from "@mui/material/Button";
import toast from "react-hot-toast";
import {defaultToastMsg} from "../utilities/sharedVariables";
import {showResponseMessage} from "../utilities/sharedFns";
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
        let response = await toast.promise(getAllSessions(), defaultToastMsg);
        showResponseMessage(response);

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
            let response = await toast.promise(deleteSession(title, date), defaultToastMsg);
            showResponseMessage(response);

            if (response.message === "Success") handleGetSessions();
        });

        setDeleteFunctionState(deleteSessionFunction);
        setConfirmationBoxState(true);
    }

    return (
        <>
            <Button variant={"contained"} size={"small"} onClick={() => {
                handleGetSessions();
            }}>Get List of Sessions</Button>
            <br /><br />

            {dataState && displaySessionList}
        </>
    );
}

export default GetAndDisplaySessions;