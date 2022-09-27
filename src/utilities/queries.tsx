import {SessionEntry, submissionData, LoginCredentials, SessionToDelete} from "./interfaces";
import {specificSessionOutput} from "./interfaces";
import httpClient from "../common/httpClient";
import * as http from "http";
let cc = console.log;
 //let baseURL: string = "/php";
let baseURL: string = "http://localhost:80/php";

export async function loginQuery(data: LoginCredentials) {
    return await httpClient.post(`login.php`, JSON.stringify(data));
}

export async function loginV2(){
    let entry: object = {
        "password": "abc",
        "username": "elseif",
    };

    const response = await fetch(`${baseURL}/login.php`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(entry),
        credentials: "include",
        headers: {
            'Content-Type': 'application/json' }
    });

    return await response.json();
}

export async function submitSession(entries: SessionEntry) {
    let response = await fetch(`${baseURL}/sessionentry.php`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(entries),
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await response.json();
}

export async function deleteSession(title: string, date: string) {
    let entry: SessionToDelete = {"title": title, "date": date};

    let response = await fetch(`${baseURL}/sessiondelete.php`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(entry),
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await response.json();
}

export async function getExercises(){
    let response = await fetch(`${baseURL}/getexercises.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function getExercisesFromSessionTable(){
    let response = await fetch(`${baseURL}/getexercisesfromsessiontable.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function deleteExercise(exercise: string){
    let response = await fetch(`${baseURL}/exercisedelete.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(exercise),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function getRecentSessions(){
    const response = await fetch(`${baseURL}/getrecentsessions.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function getSpecificSession(sessionDate: string, sessionTitle: string){
    let titleAndDate: specificSessionOutput = {
        title: sessionTitle,
        date: sessionDate
    }

    const response = await fetch(`${baseURL}/getspecificsession.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(titleAndDate),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await response.json();
}

export async function getAllSessions(){
    const response = await fetch(`${baseURL}/getallsessions.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await response.json();
}

export async function getAllSessionNames(){
    return await httpClient.post(`getallsessionnames.php`);
}

export async function getAllSessionsByName(title: string){
    return await httpClient.post(`getallsessionsbyname.php`, JSON.stringify(title));
}

export async function logout(){
    return await httpClient.post(`logout.php`);
}

export async function queryCheckLogin(){
    const response = await fetch(`${baseURL}/checklogin.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function changePassword(oldPw: string, newPw: string){
    let passwords: {oldPassword: string; newPassword: string} = {
        oldPassword: oldPw,
        newPassword: newPw,
    }

    const response = await fetch(`${baseURL}/changepassword2.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(passwords),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function changeEmail(newEmail: string){
    let email: any = {
        newEmailAddress: newEmail,
    }

    const response = await fetch(`${baseURL}/changeemail.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(email),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function getSessionDefaults(){
    const response = await fetch(`${baseURL}/getsessiondefaults.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function changeSessionDefaults(reps: number, sets:number, exercises: number, weight: number){
    let entry: any = {
        "reps": reps,
        "sets": sets,
        "exercises": exercises,
        "weight": weight,
    }

    const response = await fetch(`${baseURL}/changesessiondefaults.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(entry),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function createAccount(password: string, username: string, email: string){
    let entry: any = {
        "password": password,
        "username": username,
        "email": email,
    }

    const response = await fetch(`${baseURL}/createaccount.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(entry),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function getWorkoutsForHeatmap(yearOrLast365: string){
    const response = await fetch(`${baseURL}/getworkoutcount.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(yearOrLast365),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function getYearsOfAllEntries(){
    const response = await fetch(`${baseURL}/getallyearsofentries.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function getSessionDataForOneRMCalculation(exercise: string){
    return await httpClient.post(`getsessiondataforonermcalculation.php`, JSON.stringify(exercise));
}

export async function getSessionDatesAndTitlesOfAllNotes(){
    const response = await fetch(`${baseURL}/getdatesofallnotes.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function getSingleSessionNote(id: string){
    const response = await fetch(`${baseURL}/getsinglesessionnote.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: id,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function requestPasswordReset(email: string){
    const response = await fetch(`${baseURL}/passwordresetrequest.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(email),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}

export async function setNewPassword(resetKey: string, newPassword: string, email: string){
    let userData: {resetKey: string; newPassword: string; email: string} = {
        "resetKey": resetKey,
        "newPassword": newPassword,
        "email": email,
    }

    const response = await fetch(`${baseURL}/passwordresetsubmit.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
}