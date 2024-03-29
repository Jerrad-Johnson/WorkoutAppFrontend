import {SessionEntry, LoginCredentials, SessionToDelete} from "./interfaces";
import {specificSessionOutput} from "./interfaces";
import httpClient from "../common/httpClient";
let cc = console.log;

export async function loginQuery(data: LoginCredentials) {
    return await httpClient.post(`login.php`, JSON.stringify(data));
}

export async function submitSession(entries: SessionEntry) {
    return await httpClient.post(`sessionentry.php`, JSON.stringify(entries));
}

export async function deleteSession(title: string, date: string) {
    let entry: SessionToDelete = {"title": title, "date": date};
    return await httpClient.post(`sessiondelete.php`, JSON.stringify(entry));
}

export async function getExercises(){
    return await httpClient.post(`getexercises.php`);
}

export async function getExercisesFromSessionTable(){
    return await httpClient.post(`getexercisesfromsessiontable.php`);
}

export async function deleteExercise(exercise: string){
    return await httpClient.post(`exercisedelete.php`, JSON.stringify(exercise));
}

export async function getRecentSessions(){
    return await httpClient.post(`getrecentsessions.php`);
}

export async function getSpecificSession(sessionDate: string, sessionTitle: string){
    let titleAndDate: specificSessionOutput = {
        title: sessionTitle,
        date: sessionDate
    }

    return await httpClient.post(`getspecificsession.php`, JSON.stringify(titleAndDate));
}

export async function getAllSessions(){
    return await httpClient.post(`getallsessions.php`);
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
    return await httpClient.post(`checklogin.php`);
}

export async function changePassword(oldPw: string, newPw: string){
    let passwords: {oldPassword: string; newPassword: string} = {
        oldPassword: oldPw,
        newPassword: newPw,
    }

    return await httpClient.post(`changepassword.php`, JSON.stringify(passwords));
}

export async function changeEmail(newEmail: string){
    let email: any = {
        newEmailAddress: newEmail,
    }

    return await httpClient.post(`changeemail.php`, JSON.stringify(email));
}

export async function getSessionDefaults(){
    return await httpClient.post(`getsessiondefaults.php`);
}

export async function changeSessionDefaults(reps: number, sets:number, exercises: number, weight: number){
    let entry: any = {
        "reps": reps,
        "sets": sets,
        "exercises": exercises,
        "weight": weight,
    }

    return await httpClient.post(`changesessiondefaults.php`, JSON.stringify(entry));
}

export async function createAccount(password: string, username: string, email: string){
    let entry: any = {
        "password": password,
        "username": username,
        "email": email,
    }

    return await httpClient.post(`createaccount.php`, JSON.stringify(entry));
}

export async function getWorkoutsForHeatmap(yearOrLast365: string){
    return await httpClient.post(`getworkoutcount.php`, JSON.stringify(yearOrLast365));
}

export async function getYearsOfAllEntries(){
    return await httpClient.post(`getallyearsofentries.php`);
}

export async function getSessionDataForOneRMCalculation(exercise: string){
    return await httpClient.post(`getsessiondataforonermcalculation.php`, JSON.stringify(exercise));
}

export async function getSessionDatesAndTitlesOfAllNotes(){
    return await httpClient.post(`getdatesofallnotes.php`);
}

export async function getSingleSessionNote(id: string){
    return await httpClient.post(`getsinglesessionnote.php`, JSON.stringify(id));
}

export async function requestPasswordReset(email: string){
    return await httpClient.post(`passwordresetrequest.php`, JSON.stringify(email));
}

export async function setNewPassword(resetKey: string, newPassword: string, email: string){
    let userData: {resetKey: string; newPassword: string; email: string} = {
        "resetKey": resetKey,
        "newPassword": newPassword,
        "email": email,
    }

    return await httpClient.post(`passwordresetsubmit.php`, JSON.stringify(userData));
}

export async function getLatestVersionOfExercise(exerciseName: string){
    return await httpClient.post(`getlatestversionofexercise.php`, JSON.stringify(exerciseName));
}