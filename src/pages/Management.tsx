import {Dispatch, SetStateAction, useState} from "react";
import Nav from "../components/Nav";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {useEffect} from "react";
import {NotesDateAndTitleArray, StandardBackendResponse} from "../utilities/interfaces";
import {getSessionDatesAndTitlesOfAllNotes} from "../utilities/queries";
let cc = console.log


function Management(){
    const [notesListState, setNotesListState] = useState<any[]>([""]);
    const [notesSessionSelectorState, setNotesSessionSelectorState] = useState<string>("");
    const [notesDataState, setNotesDataState] = useState<any>();

    useEffect(() => {
        handleGetListOfNotesBySessionDateAndTitle(setNotesListState);
    }, []);

    let menuItemsOfNotesDateAndTitle: JSX.Element[] = notesListState.map((e, k) => {
        let dateAndTitleCombined: string = e.session_date + " / " + e.session_title;
        return (
           <MenuItem key={k} value={e.id}>{dateAndTitleCombined}</MenuItem>
       );
    });

    return (
        <div>
            <Nav title={"View & Manage Session Data"}/>
            <div className={"basicContainer"}>
                <h2>Load Session Note</h2>
                <FormControl className={"center"} variant={"standard"}>
                    <Select value={notesSessionSelectorState} onChange={(e) => {
                        setNotesSessionSelectorState(e.target.value);
                        handleGetSessionNotes(setNotesDataState);
                    }}>
                        <MenuItem value={""}></MenuItem>
                        {menuItemsOfNotesDateAndTitle}
                    </Select>
                </FormControl>
            </div>
        </div>
    )
}

async function handleGetListOfNotesBySessionDateAndTitle(setNotesListState: Dispatch<SetStateAction<string[]>>){
    let response: StandardBackendResponse = await getSessionDatesAndTitlesOfAllNotes();

    //let formattedData = formatSesssionDateAndTitleBackendData(response.data)

    setNotesListState(response.data);
}

function formatSesssionDateAndTitleBackendData(data: NotesDateAndTitleArray){
    let formattedData: string[] = [];

/*    data.forEach((e) => {
        let dateAndTitleCombined: string = e.session_date + " / " + e.session_title;
        formattedData.push(dateAndTitleCombined);
    });*/

    return data;

}

function handleGetSessionNotes(setNotesSessionState: Dispatch<SetStateAction<string[]>>){

}

export default Management;