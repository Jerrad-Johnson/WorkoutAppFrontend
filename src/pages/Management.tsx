import React, {Dispatch, SetStateAction, useState} from "react";
import Nav from "../components/Nav";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useEffect} from "react";
import {NotesDateAndTitleArray, StandardBackendResponse} from "../utilities/interfaces";
import {getSessionDatesAndTitlesOfAllNotes, getSingleSessionNote} from "../utilities/queries";
import TextField from "@mui/material/TextField";
let cc = console.log


function Management(){
    const [notesListState, setNotesListState] = useState<any[]>([""]);
    const [notesSessionSelectorState, setNotesSessionSelectorState] = useState<string>("");
    const [notesDataState, setNotesDataState] = useState<string>("");

    useEffect(() => {
        handleGetListOfNotesBySessionDateAndTitle(setNotesListState);
    }, []);

    let menuItemsOfNotesDateAndTitle: JSX.Element[] = notesListState.map((e, k) => {
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
                <FormControl className={"center"} variant={"standard"}>
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
            </div>
        </div>
    )
}

async function handleGetListOfNotesBySessionDateAndTitle(setNotesListState: Dispatch<SetStateAction<string[]>>){
    let response: StandardBackendResponse = await getSessionDatesAndTitlesOfAllNotes();
    setNotesListState(response.data);
}

async function handleGetSessionNotes(setNotesDataState: Dispatch<SetStateAction<string>>, id: string){
    let response: StandardBackendResponse = await getSingleSessionNote(id);
    cc(response)
    setNotesDataState(response.data);
}

export default Management;