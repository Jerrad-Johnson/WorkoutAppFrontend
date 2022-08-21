import {useState} from "react";
import Nav from "../components/Nav";

function Management(){
    const [notesListState, setNotesListState] = useState<string[]>([""]);
    const [notesSessionSelectorState, setNotesSessionSelectorState] = useState<string>("");
    const [notesSessionState, setNotesSessionState] = useState<any>();


    return (
        <div>
            <Nav title={"View & Manage Session Data"}/>
            <div className={"basicContainer"}>
                test
            </div>
        </div>
    )
}

export default Management;