import React, {Dispatch, SetStateAction, useState} from "react";
import Nav from "../components/Nav";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useEffect} from "react";
import {NotesDateAndTitleArray, StandardBackendResponse} from "../utilities/interfaces";
import {getSessionDatesAndTitlesOfAllNotes, getSingleSessionNote} from "../utilities/queries";
import TextField from "@mui/material/TextField";
import GetAndDisplaySessions from "../components/GetAndDisplaySessions";
import GetAndDisplayExercises from "../components/GetAndDisplayExercises";
import toast from "react-hot-toast";
import {defaultToastMsg} from "../utilities/sharedVariables";
import {showResponseMessageWithCondition} from "../utilities/sharedFns";
let cc = console.log

//TODO Stop "Loaded" from displaying twice when items are deleted.


function Management(){
    const [notesListState, setNotesListState] = useState<any[]>([""]);
    const [notesSessionSelectorState, setNotesSessionSelectorState] = useState<string>("");
    const [notesDataState, setNotesDataState] = useState<string>("");

    useEffect(() => {
        handleGetListOfNotesBySessionDateAndTitle(setNotesListState);
    }, []);

    let menuItemsOfNotesDateAndTitle: JSX.Element[] = notesListState?.map((e, k) => {
        let dateAndTitleCombined: string = e.session_date + " / " + e.session_title;
        return (
           <MenuItem key={k} value={e.id}>{dateAndTitleCombined}</MenuItem>
       );
    });

    let sessionNote: JSX.Element = (
        <TextField type={"text"}
                   sx={{width: "100%"}}
                   value={notesDataState}
                   multiline
        />
    );

    return (
        <div>
            <Nav title={"View & Manage Session Data"}/>
            <div className={"basicContainer"}>
                <h2>Load Session Note</h2>
                <FormControl className={"centerAndFullWidth"} variant={"standard"}>
                    <Select value={notesSessionSelectorState} onChange={(e) => {
                        setNotesSessionSelectorState(e.target.value);
                        handleGetSessionNotes(setNotesDataState, e.target.value);
                    }}>
                        <MenuItem value={""}></MenuItem>
                        {menuItemsOfNotesDateAndTitle}
                    </Select>
                </FormControl>
                <br /><br />
                {sessionNote}
                <br /><br />
                <GetAndDisplaySessions/>
                <GetAndDisplayExercises/>
            </div>
        </div>
    )
}

async function handleGetListOfNotesBySessionDateAndTitle(setNotesListState: Dispatch<SetStateAction<string[]>>){
    let response = await getSessionDatesAndTitlesOfAllNotes();
    setNotesListState(response.data.data);
}

async function handleGetSessionNotes(setNotesDataState: Dispatch<SetStateAction<string>>, id: string){
    try {
        let response = await toast.promise(getSingleSessionNote(id), defaultToastMsg);
        setNotesDataState(response.data.data);
        showResponseMessageWithCondition(response.data);
    } catch (e) {
        cc(e);
    }
}

export default Management;