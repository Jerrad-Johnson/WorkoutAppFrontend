import React, {Dispatch, ReactNode, SetStateAction, useEffect, useReducer, useState} from "react";
import {
    OptionsData,
    OptionsAction,
    SessionData,
    GenericAction,
    DatabaseData,
    SessionEntry
} from "./utilities/interfaces";
import {arrayOfOptions} from "./utilities/sharedFns";
import {getRecentSessions, loginV2, getExercises, getSpecificSession, submitSession} from "./utilities/queries";
import {todaysDateForHTMLCalendar} from "./utilities/generalFns";
import Nav from "./Nav";

//TODO Handle user deleting an exercise; will screw up exercise selector
//TODO Handle getting logged out; script will still try to run queries.

let cc = console.log;

function Home(){

    let testString: string = "810J-&J2KAn98mLwgi5on&*nuij"; //@ts-ignore
    let convertedString: string = convertString(testString);

    function convertString(testString: string){
        let strippedString: string = testString.replace(/\D/g, ''); //@ts-ignore
        let setsOfThree: string[] = strippedString.match(/.{1,3}/g);
        //@ts-ignore
        if (setsOfThree.at(-1).length === 1) { //@ts-ignore
            let stringToMoveCharacterFrom: string = setsOfThree.at(-2)
            let characterToMove: string = stringToMoveCharacterFrom.charAt(2);
            let shortenedString: string = stringToMoveCharacterFrom.substr(0, stringToMoveCharacterFrom.length -1);
            let finalString: string[] | string = setsOfThree;
            let lengthenedString: string = characterToMove + finalString.at(-1);
            finalString.splice(-2);
            finalString.push(shortenedString, lengthenedString);
            return finalString.join("-");
        } else {
            return setsOfThree.join("-");
        }
    }

    const defaultOptions: OptionsData = {
        exercises: 2,
        sets: 3,
        reps: 5,
        weights: 100,
    }

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

    const defaultSession: SessionData = { //TODO Considered using localStorage, but instead: use a confirmation when trying nav away.
        title: "Session Title",
        date: todaysDateForHTMLCalendar(),
        exerciseCount: optionsState.exercises,
        exerciseNames: getStartingValuesStringArray(optionsState.exercises, ""),
        exerciseSelectorOrInput: [0, 0],
        sets: getStartingValuesArray(optionsState.exercises, optionsState.sets),
        reps: getStartingValuesNestedArray(optionsState.exercises, optionsState.sets, optionsState.reps),
        weights: getStartingValuesNestedArray(optionsState.exercises, optionsState.sets, optionsState.weights),
        notes: undefined,
        previousSessions: undefined,
        selectedSessionToLoad: undefined,
        staticExerciseNames: undefined,
    }

    const [sessionState, sessionDispatch] = useReducer(sessionReducer, defaultSession);

    function sessionReducer(state: SessionData, action: GenericAction){
        switch (action.type){
            case "title":
                return {...state, title: action.payload};
            case "date":
                return {...state, date: action.payload};
            case "exercises":
                cc(action.payload)
                let newSession: SessionData = handleExerciseCountChange({...state}, action.payload);
                return {...newSession, exerciseCount: action.payload}
            case "sets":
                let newSets: SessionData = handleSetCountChange({...state}, action.payload.value, action.payload.topIndex);
                return newSets;
            case "reps":
                let newReps: number[][] = [...state.reps];
                newReps[action.payload.topIndex][action.payload.bottomIndex] = action.payload.value;
                return {...state, newReps};
            case "weights":
                let newWeights: number[][] = [...state.weights];
                newWeights[action.payload.topIndex][action.payload.bottomIndex] = action.payload.value;
                return {...state, weights: newWeights};
            case "notes":
                return {...state, notes: action.payload};
            case "loadedPrevSessions":
                return {...state, previousSessions: action.payload}
            case "loadedExercises":
                return {...state, exerciseNames: action.payload, staticExerciseNames: action.payload}
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
                let allExerciseNames: string[] = [];
                let numbersOfSets: number[] = [];
                let newTitle: string = action.payload[0]?.session_title;
                let selectorOrInput: number[] = [];

                for (let i = 0; i < action.payload.length; i++){
                    let repsSets: string[] = action.payload[i].reps.split(",");
                    let repsAsNumbers: number[] = repsSets.map((e) => +e);
                    let weightSets: string[] = action.payload[i].weight_lifted.split(",");
                    let weightsAsNumbers: number[] = weightSets.map((e) => +e);
                    //let exerciseName: string = action.payload[i].exercise;

                    selectorOrInput.push(0);
                    numbersOfSets[i] = repsSets.length;
                    allReps.push(repsAsNumbers);
                    allWeights.push(weightsAsNumbers);
                    //allExerciseNames.push(exerciseName);

                }

                return {...state, reps: allReps, weights: allWeights, exerciseNames: combinedExercises,
                    exerciseCount: allReps.length, sets: numbersOfSets, title: newTitle,
                    exerciseSelectorOrInput: selectorOrInput}
            default:
                return state;
        }
    }

    function combineExerciseLists(a: string[] | undefined = [], b: any){
        let newArrayOfExercises: string[] = [];
        let duplicatesRemoved: string[] = [];

        for (let entry of b){
            newArrayOfExercises.push(entry.exercise);
        }

        if (a.length > 0) {
            duplicatesRemoved = a.filter((v) => {
               return newArrayOfExercises.indexOf(v) == -1;
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

/*    function initialSessionExercises(){
        let index = 0;
        while (loaderState.exercises.length > index && sessionState.reps.length > index){
            index++;
            sessionDispatch({type: "initialExercises", payload: { exercise: loaderState.exercises[index], position: [index]}} )
        }
    }*/


    async function loadPrevSessions(){
        let prevSessions: any = await getRecentSessions().then(prevSessions => sessionDispatch({type: "loadedPrevSessions", payload: prevSessions.data}));
    }

    async function loadExerciseList(){
        getExercises().then(exercises => {
            cc(exercises)
            sessionDispatch({type: "loadedExercises", payload: exercises.data})
        });
    }

    function handleExerciseCountChange(session: SessionData, newExerciseCount: number){
            while (session.reps.length > newExerciseCount){
                session.reps.pop();
                session.weights.pop();
                session.sets.pop();
                session.exerciseNames.pop();
            }

            while (session.reps.length < newExerciseCount){
                session.reps = [...session.reps, addArrayEntryToSession(optionsState.sets, optionsState.reps)];
                session.weights = [...session.weights, addArrayEntryToSession(optionsState.sets, optionsState.weights)];
                session.sets = [...session.sets, optionsState.sets];
                session.exerciseNames = [...session.exerciseNames, ""];
            }

        return session;
    }

    function handleSetCountChange(session: SessionData, value: number, topIndex: number){
        while (session.sets[topIndex] > value){
            session.sets[topIndex]--;
            session.reps[topIndex].pop();
            session.weights[topIndex].pop();
        }

        while (session.sets[topIndex] < value){
            session.sets[topIndex]++;
            session.reps[topIndex].push(optionsState.reps);
            session.weights[topIndex].push(optionsState.weights);
        }

        return session;
    }

    const exerciseOptionElements: JSX.Element[] = arrayOfOptions(12);
    const exerciseDataElements: JSX.Element[] = Array.from({length: +sessionState.exerciseCount}).map((_e, k) => {
        return(
            <div key={k}>
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

    let previousSessionSelector: JSX.Element[] = [];
    let previousSessionOptions: JSX.Element[] = [];

    if (sessionState.previousSessions !== undefined){
        previousSessionOptions = sessionState.previousSessions.map((e: {session_date: string, session_title: string}, k: number) => {
            return (
                <option key={k}>{e.session_title} @ {e.session_date}</option>
            );
        });


        previousSessionSelector = Array.of(1).map((_e, k) => {
            return (
                <div key={k}>
                  <select key={k} onChange={(e) => {
                        sessionDispatch({type: "sessionLoadSelector", payload: e.target.value});
                  }}>
                      <option></option>
                      {previousSessionOptions}
                  </select>
                 <button onClick={() => {
                     applySpecificSessionHandler();
                 }}>Load Previous Session</button>
                </div>
            );
        });
    }

    function applySpecificSessionHandler(){
        if (sessionState.selectedSessionToLoad !== undefined && sessionState.selectedSessionToLoad.length !== 0) {
            let [sessionTitle, sessionDate]: string[] = getSelectorSession(sessionState.selectedSessionToLoad);
            let sessionResponseFromDB = getSpecificSession(sessionDate, sessionTitle).then(response =>
                sessionDispatch({type: "insertPreviousSession", payload: response.data}));
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
            exercises: sessionState.exerciseNames
        }

        let response = await submitSession(entries).then(data => cc(data));

    }


    return (
        <>
        <Nav />
        <div className={"container"}>
            <button onClick={() => {
                cc(sessionState)
                cc(loaderState)
            }}>For testing: Log sesssion state</button>
            <br />
            <br />
            <Options
                optionsDispatch = {optionsDispatch}
                optionsState = {optionsState}
            />
            {previousSessionSelector}
            <br />
            <br />
            <span>Session Title</span> {/*TODO Check entry to make sure it does not contain  " @ "*/}
            <input type={"text"} className={"Title"} value={sessionState.title} onChange={(e) => {
                sessionDispatch({type: "title", payload: e.target.value});
            }}/>
            <br />
            <span>Session Date</span>
            <input type={"date"} value={sessionState.date} onChange={(e) => {
                sessionDispatch({type: "date", payload: e.target.value});
            }}/>
            <br />
            <span>Number of Exercises</span>
            <select value={+sessionState.exerciseCount || +optionsState.exercises} onChange={(e) => {
                sessionDispatch({type: "exercises", payload: +e.target.value});
            }}>
                {exerciseOptionElements}
            </select>
                {exerciseDataElements}
            <span>Notes</span>
            <input type={"text"} className={"notes"} onChange={(e) => {
                sessionDispatch({type: "notes", payload: e.target.value});
            }}/>
            <br />
            <button onClick={() => {
                handleSessionSubmission();
            }}>Submit</button>
        </div>
        </>
    )
}

function Options({optionsDispatch, optionsState}: {optionsDispatch: Dispatch<GenericAction>, optionsState: OptionsData}) {
    const exerciseOptions: JSX.Element[] = arrayOfOptions(12);
    const setOptions: JSX.Element[] = arrayOfOptions(12);
    const repOptions: JSX.Element[] = arrayOfOptions(20);

    return (
        <div className={"optionsContainer"}>
            <span>Default exercise count</span>
            <select value={optionsState.exercises} onChange={(e) => {
                optionsDispatch({type: "exercises", payload: +e.target.value});
            }}>
                {exerciseOptions}
            </select>
            <span>Default set count</span>
            <select value={optionsState.sets} onChange={(e) => {
                optionsDispatch({type: "sets", payload: +e.target.value});
            }}>
                {setOptions}
            </select>
            <span>Default rep count</span>
            <select value={optionsState.reps} onChange={(e) => {
                optionsDispatch({type: "reps", payload: +e.target.value});
            }}>
                {repOptions}
            </select>
            <span>Default weight</span>
            <input type={"number"} value={optionsState.weights} onChange={(e) => {
                optionsDispatch({type: "weights", payload: +e.target.value});
            }}/>
        </div>
    );
}

function getStartingValuesNestedArray(exercises: number, sets: number, value: number){
    let arrayOfValues: number[][] = [];

    for (let i = 0; i < exercises; i++){
        let temp: number[] = Array.from({length: sets}).map((_e) => {
            return value;
        });
        arrayOfValues.push(temp);
    }

    return arrayOfValues;
}

function getStartingValuesArray(sets: number, value: number){
    let arrayOfValues: number[] = Array.from({length: sets}).map((_e) => {
        return value;
    });

    return arrayOfValues;
}

function getStartingValuesStringArray(sets: number, value: string){
    let arrayOfValues: string[] = Array.from({length: sets}).map((_e) => {
        return value;
    });

    return arrayOfValues;
}

export default Home;

function ExerciseElements({parentIndex, sessionState, sessionDispatch, loaderDispatcher, loaderState}:
                              {parentIndex: number, sessionState: SessionData, sessionDispatch: Dispatch<GenericAction>,
                                  loaderDispatcher: Dispatch<GenericAction>, loaderState: DatabaseData}){

    const repOptions: JSX.Element[] = Array.from({length: 20}).map((_e, k) => {
        return (<option key={k}>{k+1}</option>);
    })

    const setOptions: JSX.Element[] = Array.from({length: 12}).map((_e, k) => {
        return (<option key={k}>{k+1}</option>);
    });

    const repAndWeightInputs: JSX.Element[] = Array.from({length: sessionState.sets[parentIndex]}).map((_element, childIndex) => {
        return (
            <div key={childIndex}>
                <span>Rep Count</span>
                <select value={sessionState.reps[parentIndex][childIndex]} onChange={(event) => {
                    sessionDispatch({ type: "reps", payload: {
                        topIndex: parentIndex,
                        bottomIndex: childIndex,
                        value: +event.target.value,
                    }});
                }}>
                    {repOptions}
                </select>

                <span>Weight</span>
                <input type={"number"} value={sessionState.weights[parentIndex][childIndex]} key={childIndex}
                       className={"shortNumberInput"} onChange={(event) => {
                    sessionDispatch({type: "weights", payload: {
                        topIndex: parentIndex,
                        bottomIndex: childIndex,
                        value: +event.target.value,
                    }});
                }}/>
            </div>
        );
    });

    let previousExercises: JSX.Element[] = [];

    if (Array.isArray(sessionState.exerciseNames)) {
        previousExercises = sessionState.exerciseNames.map((e, k) => {
            return (
              <option key={k}>{e}</option>
            );
        });
    }

    let exerciseSelectorOrInput: JSX.Element[] = [0].map((_e, k) => {
        if (sessionState.exerciseSelectorOrInput[parentIndex] === 0){ // "0" just means it will return a selector. Use "1" for input-text.
            return (
                <div key={k}>
                    <select value={sessionState.exerciseNames[parentIndex]} onChange={(e) => {
                        sessionDispatch({type: "exerciseNameChange", payload: { index: parentIndex, value: e.target.value }})
                    }}>
                        <option></option>
                        {previousExercises}
                    </select>
                    <button onClick={(e) => {
                        sessionDispatch({ type: "addOrSelectExercise", payload: {value: 1, index: parentIndex }});
                        sessionDispatch({type: "changedExerciseEntryToSelector", payload: { index: parentIndex, value: ""}})
                    }}>Add Exercise Title</button>
                </div>
            );
        } else {
            return (
                <div key={k}>
                    <input type={"text"} defaultValue={""} onChange={(e) => {
                        sessionDispatch({type: "exerciseNameChange", payload: { index: parentIndex, value: e.target.value }})
                    }} />
                    <button onClick={(e) => {
                        sessionDispatch({ type: "addOrSelectExercise", payload: {value: 0, index: parentIndex }});
                        sessionDispatch({type: "changedExerciseEntryToSelector", payload: { index: parentIndex, value: ""}})
                    }}>Select Previous Exercise</button>
                </div>
            );
        }
    });

    /*TODO Add increment number input and apply button. Add auto-increment checkbox (database).
    TODO Add Notes field.*/

    // loaderState.exercises[parentIndex] ||
    return (
      <>
          <br />
          {exerciseSelectorOrInput}
          <span>Set Count</span>
          <select value={sessionState.sets[parentIndex]} onChange={(e) => {
              sessionDispatch({ type: "sets", payload: {
                  topIndex: parentIndex,
                  value: +e.target.value,
                  }})
          }}>

              {setOptions}
          </select>

          {repAndWeightInputs}
      </>
    );
}

function addArrayEntryToSession(arrayLength: number, value: number){
    let temp: number[] = [];

    for (let i = 0; i < arrayLength; i++){
        temp[i] = value;
    }

    return temp;
}