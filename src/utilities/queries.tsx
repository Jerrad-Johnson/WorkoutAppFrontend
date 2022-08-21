import {SessionEntry, submissionData, LoginCredentials, SessionToDelete} from "./interfaces";
import {specificSessionOutput} from "./interfaces";
let cc = console.log;
//let baseURL: string = "/php";
let baseURL: string = "http://localhost:80/php";

export function loginQuery(data: LoginCredentials) {
    fetch(`${baseURL}/login.php`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
            'Content-Type': 'application/json' }
    }).then(response => response.json())
        .then(data => cc(data));
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
    const response = await fetch(`${baseURL}/getallsessionnames.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await response.json();
}

export async function getAllSessionsByName(title: string){
    const response = await fetch(`${baseURL}/getallsessionsbyname.php`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(title),
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await response.json();
}

export async function logout(){
    const response = await fetch(`${baseURL}/logout.php`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return await response.json();
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
    let passwords: any = {
        oldPassword: oldPw,
        newPassword: newPw,
    }

    const response = await fetch(`${baseURL}/changepassword.php`, {
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
    const response = await fetch(`${baseURL}/getsessiondataforonermcalculation.php`, {
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

export async function getSessionDatesOfAllNotes(){
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