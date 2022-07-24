import {getExercises, logout} from "./utilities/queries";
import Nav from "./Nav";
import {useReducer, useState} from "react";
import {getAllSessions} from "./utilities/queries";
import {SetStateAction} from "react";
import {Dispatch} from "react";
let cc = console.log;

async function handleGetSessions(setDataState: SetStateAction<Dispatch<JSX.Element[]>>){
    let response = await getAllSessions();
    let listOfSessions: JSX.Element[] = response.data.map((e, k) => {
        return (
            <span className={"sessionSpan"} key={k}>{e.session_title + " --- " + e.session_date}</span>
        )
    });
    setDataState(listOfSessions);
}

async function handleGetAllExercises(setDataState: SetStateAction<Dispatch<JSX.Element[]>>){
    let response = await getExercises();
    let listOfExercises: JSX.Element[] = response.data.map((e, k) => {
        return (
            <span className={"sessionSpan"} key={k}>{e}</span>
        )
    });
    setDataState(listOfExercises);
}

function Management(){
    const [dataState, setDataState] = useState(undefined);

    return (
        <>
        <Nav />
        <div>
            <button onClick={() => {
                handleLogout();
            }}>Log Out</button>
            <br />

            <button onClick={() => {
                handleGetSessions(setDataState);
            }}>Get List of  Sessions</button>
            <br />

            <button onClick={() => {
                handleGetAllExercises(setDataState);
            }}>Get List of Exercises</button>
            <br />
            <br />

            <button onClick={() => {

            }}>Change E-mail Address</button>
            <br />

            <button>Change Password</button>

            {dataState &&
                <div className={"listContainer"}>
                    {dataState}
                </div>
            }


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