import {Dispatch, SetStateAction, useReducer, useState} from "react";
import {formInterface, formActionInterface, OptionsData, OptionsAction, SessionData, GenericAction} from "./utilities/interfaces";
import {arrayOfOptions} from "./utilities/sharedFns";
let cc = console.log;

function Home(){
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

    const defaultSession: SessionData = { //TODO Update to useLocalStorage
        title: "Session Title",
        date: "2022-02-02", //TODO Correct this value
        exerciseCount: optionsState.exercises,
        exerciseNames: undefined, //TODO Set an unnamed top Option in DOM.
        sets: getStartingValuesArray(optionsState.exercises, optionsState.sets),
        reps: getStartingValuesNestedArray(optionsState.exercises, optionsState.sets, optionsState.reps),
        weights: getStartingValuesNestedArray(optionsState.exercises, optionsState.sets, optionsState.weights),
        notes: undefined,
    }

    const [sessionState, sessionDispatch] = useReducer(sessionReducer, defaultSession);

    function sessionReducer(state: SessionData, action: GenericAction){
        switch (action.type){
            case "exercises":
                let newSession: SessionData = handleExerciseCountChange({...state}, action.payload);
                return {...state, exerciseCount: action.payload}
            case "reps":
                let newReps: number[][] = [...state.reps];
                newReps[action.payload.topIndex][action.payload.bottomIndex] = action.payload.value;
                return {...state, newReps};
            case "sets":
                let newSets: number[] = [...state.sets];
                newSets[action.payload.topIndex] = action.payload.value;
                return {...state, sets: newSets};
            case "weights":
                let newWeights: number[][] = [...state.weights];
                newWeights[action.payload.topIndex][action.payload.bottomIndex] = action.payload.value;
                return {...state, weights: newWeights};
            default:
                return state;
        }
    }

    function handleExerciseCountChange(session: SessionData, newExerciseCount: number){
            cc(session.sets)
            cc(session.reps)

            while (session.reps.length > newExerciseCount){
                session.reps.pop();
                session.weights.pop();
                session.sets.pop();
            }


/*            while (session.reps.length < newExerciseCount){

            }*/

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
                />
            </div>
        );
    });

    return (
        <div className={"container"}>
            <Options
                optionsDispatch={optionsDispatch}
                optionsState = {optionsState}
            />
            <span>Number of Exercises</span>
            <select value={+sessionState.exerciseCount || +optionsState.exercises} onChange={(e) => {
                sessionDispatch({type: "exercises", payload: +e.target.value});
                cc(sessionState.reps)
            }}>
                {exerciseOptionElements}
            </select>
                {exerciseDataElements}
        </div>
    )
}

function Options({optionsDispatch, optionsState}: {optionsDispatch: Dispatch<OptionsAction>, optionsState: OptionsData}) {
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

export default Home;

function ExerciseElements({parentIndex, sessionState, sessionDispatch}: 
                              {parentIndex: number, sessionState: SessionData, sessionDispatch: Dispatch<GenericAction>}){

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


    /*TODO Add increment number input and apply button. Add auto-increment checkbox (database).
    TODO Add Notes field.*/

    return (
      <>
          <br />
          <span>Exercise Name</span>
          <select>
              <option>placeholder</option>
          </select>
          <span>Set Count</span>
          <select value={sessionState.sets[parentIndex]} onChange={(e) => {
              cc(sessionState.sets)
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