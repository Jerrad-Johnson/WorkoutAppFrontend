import {deleteExercise, getExercises, logout} from "./utilities/queries";
import Nav from "./Nav";
import {useReducer, useState} from "react";
import {getAllSessions} from "./utilities/queries";
import {SetStateAction} from "react";
import {Dispatch} from "react";
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

async function handleGetAllExercises(setDataState: SetStateAction<Dispatch<JSX.Element[]>>){
    let response = await getExercises();

    if (response.data[0]) {
        let listOfExercises: JSX.Element[] = response.data.map((e, k) => {
            return (
                <span className={"listQuery"} key={k} onClick={(event) => {
                    handleDeleteExercise(e, setDataState);
                }}>{e}</span>
            )
        });
        setDataState(listOfExercises);
    } else {
        setDataState(<span className={"listQuery"}>No Results.</span>) //TODO Test this
    }
}

async function handleDeleteExercise(exercise: string, setDataState: SetStateAction<Dispatch<JSX.Element[]>>){
    let response = await deleteExercise(exercise);

    if (response.message === "Success"){
        //TODO Add mui
        handleGetAllExercises(setDataState);
    } else {
        //TODO Add mui
    }
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