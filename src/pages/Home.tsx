import React, {useReducer, useState} from "react";
import {
    OptionsData,
    SessionData,
    GenericAction,
    DatabaseData,
    SessionEntry
} from "../utilities/interfaces";
import {
    arrayOfMenuItems,
    showResponseMessageWithoutCondition
} from "../utilities/sharedFns";
import {
    getRecentSessions,
    loginV2,
    getExercises,
    getSpecificSession,
    submitSession,
    changeSessionDefaults
} from "../utilities/queries";
import {todaysDateForHTMLCalendar} from "../utilities/generalFns";
import Nav from "../components/Nav";
import {isNumeric} from "../utilities/genericFns";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { purple, red } from '@mui/material/colors';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import toast from "react-hot-toast";
import {
    defaultToastMsg,
    defaultToastPromiseErrorMessage,
} from "../utilities/sharedVariables";
import {
    ExerciseElements,
    getStartingValuesStringArray,
    getStartingValuesArray,
    getStartingValuesNestedArray,
    addArrayEntryToSession,
    getDefaultExerciseKeysArray,
} from "./home/specificFunctions";
import {parseISO} from "date-fns";

const primary = red[500]; // #f44336
const accent = purple['A200']; // #e040fb
let cc = console.log;

//TODO !important Upon adding exercise title, selector for existing titles loses entries; they get set to empty strings.
//TODO Check if logged in. Redirect if not.
//TODO Handle user deleting an exercise; will screw up exercise selector
//TODO Handle getting logged out; script will still try to run queries.

function Home(){

    const [showPreviousSessionElementsState, setShowPreviousSessionElementsState] = useState<boolean>(false);

    let defaultExercises: number = 3; //@ts-ignore
    if (localStorage.getItem("defaultExercises") !== (null || undefined)) defaultExercises = +JSON.parse(localStorage.getItem("defaultExercises"));

    let defaultSets: number = 3; //@ts-ignore
    if (localStorage.getItem("defaultSets") !== (null || undefined)) defaultSets = +JSON.parse(localStorage.getItem("defaultSets"));

    let defaultReps: number = 5; //@ts-ignore
    if (localStorage.getItem("defaultReps") !== (null || undefined)) defaultReps = +JSON.parse(localStorage.getItem("defaultReps"));

    let defaultWeight: number = 100; //@ts-ignore
    if (localStorage.getItem("defaultWeight") !== (null || undefined)) defaultWeight = +JSON.parse(localStorage.getItem("defaultWeight"));

    const defaultOptions: OptionsData = {
        exercises: defaultExercises, //@ts-ignore
        sets: defaultSets, //@ts-ignore
        reps: defaultReps, //@ts-ignore
        weights: defaultWeight,
    } //TODO Save to / load from database.

    const [optionsState, optionsDispatch] = useReducer(optionsReducer, defaultOptions);

    function optionsReducer(state: OptionsData, action: GenericAction){
        switch (action.type){
            case "exercises":
                return {...state, exercises: action.payload}
            case "reps":
                return {...state, reps: action.payload}
            case "sets":
                return {...state, sets: action.payload}
            case "weights":
                return {...state, weights: action.payload}
            default:
                return state;
        }
    }

    const [exerciseKeyRunningValueState, setExerciseKeyRunningValueState] = useState<number>(9001);

    const defaultSession: SessionData = { //TODO Considered using localStorage, but instead: use a confirmation when trying nav away.
        title: "",
        date: todaysDateForHTMLCalendar(),
        exerciseCount: optionsState.exercises,
        exerciseNames: getStartingValuesStringArray(optionsState.exercises, ""),
        exerciseKeys: getDefaultExerciseKeysArray(optionsState.exercises),
        exerciseSelectorOrInput: [0, 0],
        sets: getStartingValuesArray(optionsState.exercises, optionsState.sets),
        reps: getStartingValuesNestedArray(optionsState.exercises, optionsState.sets, optionsState.reps),
        weights: getStartingValuesNestedArray(optionsState.exercises, optionsState.sets, optionsState.weights),
        notes: "",
        previousSessions: undefined,
        selectedSessionToLoad: "",
        staticExerciseNames: [], //TODO Remove; unused.

    }

    const [sessionState, sessionDispatch] = useReducer(sessionReducer, defaultSession);

    function sessionReducer(state: SessionData, action: GenericAction){
        switch (action.type){
            case "title":
                return {...state, title: action.payload};
            case "date":
                let reformattedDate: any = parseISO(action.payload);
                return {...state, date: reformattedDate};
            case "exercises":
                let newSession: SessionData = handleExerciseCountChange({...state}, action.payload);
                return {...newSession, exerciseCount: action.payload}
            case "removeThisExercise":
                let sessionWithOneExerciseRemoved: SessionData = handleRemoveSingleExerciseCard({...state}, action.payload);
                return {...sessionWithOneExerciseRemoved};
            case "sets":
                if (action.payload.value === -1 && state.sets[action.payload.topIndex] > 1) {
                    let newSetsCount = state.sets[action.payload.topIndex] + action.payload.value;
                    let newSets: SessionData = handleSetCountChange({...state}, newSetsCount, action.payload.topIndex);
                    return newSets;
                } else if (action.payload.value === 1 && state.sets[action.payload.topIndex] < 12){
                    let newSetsCount = state.sets[action.payload.topIndex] + action.payload.value;
                    let newSets: SessionData = handleSetCountChange({...state}, newSetsCount, action.payload.topIndex);
                    return newSets;
                } else {
                    return {...state}
                }
            case "reps":
                let newReps: number[][] = [...state.reps];
                newReps[action.payload.topIndex][action.payload.bottomIndex] = action.payload.value;
                return {...state, newReps};
            case "repsClickedToChange":
                let newReps2: number[][] = [...state.reps];

                if (state.reps[action.payload.topIndex][action.payload.bottomIndex] >= 2
                    && action.payload.value === -1){
                    newReps2[action.payload.topIndex][action.payload.bottomIndex] = state.reps[action.payload.topIndex][action.payload.bottomIndex] -1
                }

                if (state.reps[action.payload.topIndex][action.payload.bottomIndex] < 20
                    && action.payload.value === 1){
                    newReps2[action.payload.topIndex][action.payload.bottomIndex] = state.reps[action.payload.topIndex][action.payload.bottomIndex] +1
                }

                return {...state, newReps2};
            case "weights":
                let newWeights: number[][] = [...state.weights];
                newWeights[action.payload.topIndex][action.payload.bottomIndex] = action.payload.value;
                return {...state, weights: newWeights};
            case "weightsClickedToChange":
                let newWeights2: number[][] = [...state.weights];

                if (state.weights[action.payload.topIndex][action.payload.bottomIndex] > 1
                    && action.payload.value === -1){
                    newWeights2[action.payload.topIndex][action.payload.bottomIndex] = state.weights[action.payload.topIndex][action.payload.bottomIndex] -1
                }

                if (action.payload.value === 1){
                    newWeights2[action.payload.topIndex][action.payload.bottomIndex] = state.weights[action.payload.topIndex][action.payload.bottomIndex] +1
                }

                return {...state, newWeights2};
            case "notes":
                return {...state, notes: action.payload};
            case "loadedPrevSessions":
                return {...state, previousSessions: action.payload}
            case "loadedExercises":
                let decoupledArray: string[] = action.payload.slice(0);
                return {...state, exerciseNames: action.payload, staticExerciseNames: decoupledArray}
            case "exerciseNameChange":
                let newExerciseNames: string[] = state.exerciseNames;
                newExerciseNames[action.payload.index] = action.payload.value;
                return {...state, exerciseNames: newExerciseNames};
            case "addOrSelectExercise":
                let newSelectorOrInput: number[] = state.exerciseSelectorOrInput;
                newSelectorOrInput[action.payload.index] = action.payload.value
                return {...state, exerciseSelectorOrInput: newSelectorOrInput}
            case "changedExerciseEntryToSelector":
                let newExerciseNamesAfterClickingAddOrSelect: string[] = state.exerciseNames;
                newExerciseNamesAfterClickingAddOrSelect[action.payload.index] = action.payload.value;
                return {...state, exerciseNames: newExerciseNamesAfterClickingAddOrSelect};
            case "sessionLoadSelector":
                return {...state, selectedSessionToLoad: action.payload}
            case "insertPreviousSession":
                let combinedExercises = combineExerciseLists(state.staticExerciseNames, action.payload);
                let allReps: number[][] = [];
                let allWeights: number[][] = [];
                let numbersOfSets: number[] = [];
                let newTitle: string = action.payload[0]?.session_title;
                let selectorOrInput: number[] = [];

                for (let i = 0; i < action.payload.length; i++){
                    let repsSets: string[] = action.payload[i].reps.split(",");
                    let repsAsNumbers: number[] = repsSets.map((e) => +e);
                    let weightSets: string[] = action.payload[i].weight_lifted.split(",");
                    let weightsAsNumbers: number[] = weightSets.map((e) => +e);

                    selectorOrInput.push(0);
                    numbersOfSets[i] = repsSets.length;
                    allReps.push(repsAsNumbers);
                    allWeights.push(weightsAsNumbers);
                }

                return {...state, reps: allReps, weights: allWeights, exerciseNames: combinedExercises,
                    exerciseCount: allReps.length, sets: numbersOfSets, title: newTitle,
                    exerciseSelectorOrInput: selectorOrInput}
            default:
                return state;
        }
    }

    function handleExerciseCountChange(session: SessionData, newExerciseCount: number){
        let sessionAsString = JSON.stringify(session);
        let sessionAsPBV = JSON.parse(sessionAsString);
        let currentKeyValue = exerciseKeyRunningValueState;

        while (sessionAsPBV.reps.length > newExerciseCount){
            sessionAsPBV.reps.pop();
            sessionAsPBV.weights.pop();
            sessionAsPBV.sets.pop();
            sessionAsPBV.exerciseKeys.pop();
            sessionAsPBV.exerciseNames.pop();
        }

        while (sessionAsPBV.reps.length < newExerciseCount){
            sessionAsPBV.reps = [...sessionAsPBV.reps, addArrayEntryToSession(optionsState.sets, optionsState.reps)];
            sessionAsPBV.weights = [...sessionAsPBV.weights, addArrayEntryToSession(optionsState.sets, optionsState.weights)];
            sessionAsPBV.sets = [...sessionAsPBV.sets, optionsState.sets];
            sessionAsPBV.exerciseNames.push("");
            sessionAsPBV.exerciseKeys.push(+currentKeyValue);

            currentKeyValue++;
        }

        setExerciseKeyRunningValueState(currentKeyValue);

        return sessionAsPBV;
    }

    function handleRemoveSingleExerciseCard(session: SessionData, exerciseToRemove: number){
        if (session.reps.length === 1) return session;

        let sessionAsString = JSON.stringify(session);
        let sessionAsPBV = JSON.parse(sessionAsString);

        sessionAsPBV.reps.splice(exerciseToRemove, 1);
        sessionAsPBV.weights.splice(exerciseToRemove, 1);
        sessionAsPBV.sets.splice(exerciseToRemove, 1);
        sessionAsPBV.exerciseNames.splice(exerciseToRemove, 1);
        sessionAsPBV.exerciseKeys.splice(exerciseToRemove, 1);
        sessionAsPBV.exerciseCount--;

        return {...sessionAsPBV, exerciseCount: session.exerciseCount-1};
    }

    function handleSetCountChange(session: SessionData, value: number, topIndex: number){
        while (session.sets[topIndex] > value){
            session.sets[topIndex]--;
            session.reps[topIndex].pop();
            session.weights[topIndex].pop();
        }

        while (session.sets[topIndex] < value){
            let bottomIndex = session.reps[topIndex].length-1;
            session.sets[topIndex]++;
            session.reps[topIndex].push(+session.reps[topIndex][bottomIndex]);
            session.weights[topIndex].push(+session.weights[topIndex][bottomIndex]);
        }

        return session;
    }

    function combineExerciseLists(a: string[] | undefined = [], b: any){
        let newArrayOfExercises: string[] = [];
        let duplicatesRemoved: string[] = [];

        for (let entry of b){
            newArrayOfExercises.push(entry.exercise);
        }

        if (a.length > 0) {
            duplicatesRemoved = a.filter((v) => {
                return newArrayOfExercises.indexOf(v) === -1;
            });
        }

        newArrayOfExercises = newArrayOfExercises.concat(duplicatesRemoved);

        return newArrayOfExercises;
    }


    const loadedDataTemplate: DatabaseData = {
        previousSessions: [{
            session_date: undefined,
            session_title: undefined,
        }],
        exercises: [],
        loadPrevSessionsNow: true,
        loadExerciseListNow: true,
    }

    function loaderReducer(state: DatabaseData, action: GenericAction){
        switch (action.type){
            case "GetPreviousSess":
                return {...state, loadPrevSessionsNow: action.payload};
            case "GetExercises":
                return {...state, loadExerciseListNow: action.payload};
            case "loadedExercises":
                return {...state, exercises: action.payload}
            default:
                return state;
        }
    }

    const [loaderState, loaderDispatcher] = useReducer(loaderReducer, loadedDataTemplate);

    if (loaderState.loadPrevSessionsNow === true) {
        loaderDispatcher({type: "GetPreviousSess", payload: false})
        loadPrevSessions();
    }

    if (loaderState.loadExerciseListNow === true){
        loaderDispatcher({type: "GetExercises", payload: false}); // TODO Set pending until fetch. Then update.
        loadExerciseList();
    }

    async function loadPrevSessions(){
        await getRecentSessions().then(prevSessions => sessionDispatch({type: "loadedPrevSessions", payload: prevSessions.data}));
    }

    async function loadExerciseList(){
        getExercises().then(exercises => {
            sessionDispatch({type: "loadedExercises", payload: exercises.data})
        });
    }

    const exerciseOptionElements: JSX.Element[] = arrayOfMenuItems(12);
    /*const exerciseDataElements: JSX.Element[] = Array.from({length: +sessionState.exerciseCount}).map((_e, k) => {*/
    const exerciseDataElements: JSX.Element[] = Array.from({length: +sessionState.exerciseCount}).map((_e, k) => {
        return(
            <div key={sessionState.exerciseKeys[k]} className={"basicContainer exerciseContainer"}>
                <ExerciseElements
                    parentIndex = {k}
                    sessionState = {sessionState}
                    sessionDispatch = {sessionDispatch}
                    loaderDispatcher = {loaderDispatcher}
                    loaderState = {loaderState}
                />
            </div>
        );
    });

    let previousSessionOptions: JSX.Element[] = [];

    if (sessionState.previousSessions !== undefined) {
        previousSessionOptions = sessionState.previousSessions.map((e: { session_date: string, session_title: string }, k: number) => {
            return (
                <MenuItem key={k}
                          value={`${e.session_title} @ ${e.session_date}`}>{e.session_title} @ {e.session_date}</MenuItem>
            );
        });
    }

    async function applySpecificSessionHandler(){
        if (sessionState.selectedSessionToLoad !== "" && sessionState.selectedSessionToLoad.length !== 0) {
            let [sessionTitle, sessionDate]: string[] = getSelectorSession(sessionState.selectedSessionToLoad);
            let sessionResponseFromDB = await toast.promise(getSpecificSession(sessionDate, sessionTitle).then(response => {
                sessionDispatch({type: "insertPreviousSession", payload: response.data});
                setShowPreviousSessionElementsState(false);
                }), defaultToastMsg);
        }
    }

    function getSelectorSession(selectedSession: string){
        let splitSessionString: string[] = selectedSession.split(" @ ");
        return splitSessionString;
    }

    async function handleSessionSubmission(){
        let entries: SessionEntry = {
            date: sessionState.date,
            title: sessionState.title,
            reps: sessionState.reps,
            weights: sessionState.weights,
            exercises: sessionState.exerciseNames,
            notes: sessionState.notes,
        }
        let errorCheckStatus;

        try {
            errorCheckStatus = checkSessionData(entries);
        } catch (err) {
            cc(err);
        }

        if (errorCheckStatus !== "Passed") return errorCheckStatus;

        try {
            let response = await toast.promise(submitSession(entries).then(data => {
                showResponseMessageWithoutCondition(data);
            }), {
                loading: 'Please wait',
                success: 'Finished',
                error: defaultToastPromiseErrorMessage,
            }, {
                success: {
                    duration: 1, // This is hacky, but I cannot find a way to never-display the success message.
                }
            });
        } catch (e) {
            cc(e);
        }
    }

    function checkSessionData(entries: SessionEntry){
        let titleMap: any = {};
        let length: number = entries.reps.length;

        for (let i = 0; i < length; i++){
            if (titleMap[entries.exercises[i]] === 1){
                let msg: string = "Do not use the same exercise name more than once.";
                toast.error(msg);
                throw new Error(msg);
            }

            if (entries.exercises[i] === ""){
                let msg: string = "Use an exercise name in every section.";
                toast.error(msg);
                throw new Error(msg);
            }

            if (entries.exercises[i].length > 30){
                let msg: string = "Exercise name may not be longer than 30 characters.";
                toast.error(msg);
                throw new Error(msg);
            }

            titleMap[entries.exercises[i]] = 1;
        }

        for (let i = 0; i < length; i++){
            for (let j = 0; j < entries.reps[i].length; j++){
                if (entries.reps[i][j] > 20 || entries.reps[i][j] < 1){
                    let msg: string = "Rep count outside of 1-20 range.";
                    toast.error(msg);
                    throw new Error(msg);
                }
            }
        }

        for (let i = 0; i < length; i++){
            for (let j = 0; j < entries.weights[i].length; j++){
                if (!isNumeric(entries.weights[i][j])){
                    let msg: string = "Please only enter numbers in the weight fields.";
                    toast.error(msg);
                    throw new Error(msg);
                }

                if (entries.weights[i][j] === 0 || entries.weights[i][j] < 0){
                    let msg: string = "Please enter a value greater than 0 in every weight field.";
                    toast.error(msg);
                    throw new Error(msg);
                }

                let currentWeight: string = entries.weights[i][j].toString();
                if (currentWeight.length > 8){
                    let msg: string = "Weight must not be longer than eight characters.";
                    toast.error(msg);
                    throw new Error(msg);
                }
            }
        }

        if (!entries.title || entries.title === "") {
            let msg: string = "Please enter a session title.";
            toast.error(msg);
            throw new Error(msg);
        }

        if (entries.title.length > 60) {
            let msg: string = "Session title must not be longer than 60 characters.";
            toast.error(msg);
            throw new Error(msg);
        }

        if (!entries.date) {
            let msg: string = "Please enter a date.";
            toast.error(msg);
            throw new Error(msg);
        }

        if (entries.notes.length > 6000) {
            let msg: string = "Session note must not be longer than 5,000 characters.";
            toast.error(msg);
            throw new Error(msg);
        }

        return "Passed";
    }

    const previousSessionElements: JSX.Element = (
      <>
          <br/>
          <br/>
        <h2>Previous Session</h2>

        <FormControl variant={"standard"} sx={{width: "100%"}}> {/*TODO Check max length so that user can see the date of the session they chose.*/}
            <Select value={sessionState.selectedSessionToLoad} sx={{width: "100%"}} label={"Exercise"} className={"selectOrAddExercise selectOrAddExerciseSelector"}
                    onChange={(e) => {
                        sessionDispatch({type: "sessionLoadSelector", payload: e.target.value});
                    }}>
                <MenuItem value={""}></MenuItem>
                {previousSessionOptions} {/*TODO Add error handling*/}
            </Select>
        </FormControl>
        <br/><br/>

        <Button variant={"contained"} size={"small"} className={"selectOrAddExerciseFieldChangeButton"} onClick={() => {
            applySpecificSessionHandler();
        }}>Load Now</Button>
      </>
    );


    return (
        <>
            <Nav title={"Add Workout"}/>

            <div className={"basicContainer"}>
                <h2>Current Session Details</h2>

                <span className={"selectorTitle"}>Session Title</span>
                <TextField type={"text"} sx={{width: "100%"}} variant={"standard"} className={"Title"} value={sessionState.title} onChange={(e) => {
                    sessionDispatch({type: "title", payload: e.target.value});
                }}/>
                <br /><br />

                <div className={"homePageSplitFlex"}>
                    <div>
                        <span className={"selectorTitle"}>Number of Exercises</span>
                        <FormControl variant={"standard"} sx={{width: "100%"}}>
                            <Select value={+sessionState.exerciseCount || +optionsState.exercises} className={"exerciseNumberSelector"} sx={{width: "100%"}}
                                    onChange={(e) => {
                                        sessionDispatch({type: "exercises", payload: +e.target.value});
                                    }}>
                                {exerciseOptionElements}
                            </Select>
                        </FormControl>
                    </div>

                    <div>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileDatePicker
                                label="Session Date"
                                inputFormat="yyyy/MM/dd"
                                value={sessionState.date}
                                onChange={(e) => {
                                    sessionDispatch({type: "date", payload: e.toISOString().slice(0, 10)})
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <br/><br/>
                    </div>
                </div>


                <div className={"selectPreviousSessionButtonContainer"}>
                    <Button variant={"contained"} size={"small"} className={"selectPreviousSessionButton"} onClick={() => {
                        setShowPreviousSessionElementsState(!showPreviousSessionElementsState);
                    }}>Or Select Previous Session</Button>
                    {showPreviousSessionElementsState === true && previousSessionElements}
                </div>
            </div>

            {exerciseDataElements}

            <div className={"basicContainer"}>
                <span className={"selectorTitle"}>Notes</span> {/*TODO Make it possible to add notes to database*/}
                <TextField type={"text"}
                           variant={"standard"}
                           sx={{width: "100%"}}
                           value={sessionState.notes}
                           multiline
                           onChange={(e) => {
                               sessionDispatch({type: "notes", payload: e.target.value});
                           }}
                />

                <input type={"text"} className={"notes"} onChange={(e) => {
                    sessionDispatch({type: "notes", payload: e.target.value});
                }}/>
                <br />
                <Button variant={"contained"} size={"small"} onClick={(e) => {
                    handleSessionSubmission();
                }}>Submit Session</Button>
            </div>
        </>
    );
}

export default Home;