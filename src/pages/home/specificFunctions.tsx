import React, {Dispatch, useState} from "react";
import {DatabaseData, GenericAction, OptionsData, SessionData} from "../../utilities/interfaces";
import {arrayOfOptions} from "../../utilities/sharedFns";
import {changeSessionDefaults} from "../../utilities/queries";
import MenuItem from "@mui/material/MenuItem";
import {Fab} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Home from "../Home";
import DeleteIcon from "@mui/icons-material/Delete";
import swal from "sweetalert";
let cc = console.log;

export function OptionsDropdown({optionsDispatch, optionsState, optionsDropdownState}: {optionsDispatch: Dispatch<GenericAction>, optionsState: OptionsData,
    optionsDropdownState: boolean}) {
    const exerciseOptions: JSX.Element[] = arrayOfOptions(12);
    const setOptions: JSX.Element[] = arrayOfOptions(12);
    const repOptions: JSX.Element[] = arrayOfOptions(20);

    async function handleSaveDefaults(){
        let response = await changeSessionDefaults(optionsState.reps, optionsState.sets,
            optionsState.exercises, optionsState.weights);

        cc(response); //TODO Handle response
    }

    let optionsHTML: JSX.Element = (
        <div className={"optionsContainer"}>
            <span>Default exercise count</span>
            <select value={optionsState.exercises} onChange={(e) => {
                optionsDispatch({type: "exercises", payload: +e.target.value});
                localStorage.setItem("defaultExercises", JSON.stringify(+e.target.value));
            }}>
                {exerciseOptions}
            </select>
            <span>Default set count</span>
            <select value={optionsState.sets} onChange={(e) => {
                optionsDispatch({type: "sets", payload: +e.target.value});
                localStorage.setItem("defaultSets", JSON.stringify(+e.target.value));
            }}>
                {setOptions}
            </select>
            <span>Default rep count</span>
            <select value={optionsState.reps} onChange={(e) => {
                optionsDispatch({type: "reps", payload: +e.target.value});
                localStorage.setItem("defaultReps", JSON.stringify(+e.target.value));
            }}>
                {repOptions}
            </select>
            <span>Default weight</span>
            <input type={"number"} value={optionsState.weights} onChange={(e) => {
                optionsDispatch({type: "weights", payload: +e.target.value});
                localStorage.setItem("defaultWeight", JSON.stringify(+e.target.value));
            }}/>
            <br />
            <button onClick={(e) => {
                e.preventDefault();
                handleSaveDefaults();
            }}>Save Defaults</button>
        </div>
    );

    return (
        <>
            {optionsDropdownState === true && optionsHTML}

        </>

    );
}

export function getStartingValuesNestedArray(exercises: number, sets: number, value: number){
    let arrayOfValues: number[][] = [];

    for (let i = 0; i < exercises; i++){
        let temp: number[] = Array.from({length: sets}).map((_e) => {
            return value;
        });
        arrayOfValues.push(temp);
    }

    return arrayOfValues;
}

export function getStartingValuesArray(sets: number, value: number){
    let arrayOfValues: number[] = Array.from({length: sets}).map((_e) => {
        return value;
    });

    return arrayOfValues;
}

export function getStartingValuesStringArray(sets: number, value: string){
    let arrayOfValues: string[] = Array.from({length: sets}).map((_e) => {
        return value;
    });

    return arrayOfValues;
}

export function getDefaultExerciseKeysArray(exerciseCount: number){
    let arrayOfKeys: number[] = [];

    for (let i = 0; i < exerciseCount; i++){
        arrayOfKeys.push(i);
    }

    return arrayOfKeys;
}

export function ExerciseElements({parentIndex, sessionState, sessionDispatch, loaderDispatcher, loaderState}:
                              {parentIndex: number, sessionState: SessionData, sessionDispatch: Dispatch<GenericAction>,
                                  loaderDispatcher: Dispatch<GenericAction>, loaderState: DatabaseData}){

    const [counterState, setCounterState] = useState<number>(0);

    const repOptions: JSX.Element[] = Array.from({length: 20}).map((_e, k) => {
        return (<MenuItem key={k} value={k+1}>{k+1}</MenuItem>);
    })

    const repAndWeightInputs: JSX.Element[] = Array.from({length: sessionState.sets[parentIndex]}).map((_element, childIndex) => {
        return (
            <div className={"exerciseInputsContainer"} key={childIndex}>
                <div className={"leftSideOfExerciseInputs"}>
                    <span className={"exerciseInputsTitles"}>Reps</span>
                    <Fab variant="extended" size="small" color="primary" aria-label="add" className={"addAndSubtractButtons subtractButton"}
                         onClick={(event) => {
                             event.preventDefault();
                             sessionDispatch({ type: "repsClickedToChange", payload: {
                                     topIndex: parentIndex,
                                     bottomIndex: childIndex,
                                     value: -1
                                 }});
                         }}>-</Fab>
                    <FormControl variant={"standard"} sx={{width: "60px;"}}>
                        <Select value={sessionState.reps[parentIndex][childIndex]} className={"exerciseNumberSelector"}
                                onChange={(event) => {
                                    sessionDispatch({ type: "reps", payload: {
                                            topIndex: parentIndex,
                                            bottomIndex: childIndex,
                                            value: +event.target.value
                                        }});
                                }}>
                            {repOptions}
                        </Select>
                    </FormControl>
                    <Fab variant="extended" size="small" color="primary" aria-label="add" className={"addAndSubtractButtons addButton"}
                         onClick={(event) => {
                             event.preventDefault();
                             sessionDispatch({ type: "repsClickedToChange", payload: {
                                     topIndex: parentIndex,
                                     bottomIndex: childIndex,
                                     value: 1
                                 }});
                         }}>+</Fab>
                </div>

                <div className={"rightSideOfExerciseInputs"}>
                    <span className={"exerciseInputsTitles"}>Weight</span>
                    <Fab variant="extended" size="small" color="primary" aria-label="add" className={"addAndSubtractButtons subtractButton"}
                         onClick={(event) => {
                             event.preventDefault();
                             sessionDispatch({ type: "weightsClickedToChange", payload: {
                                     topIndex: parentIndex,
                                     bottomIndex: childIndex,
                                     value: -1
                                 }});
                         }}>-</Fab>
                    <TextField type={"number"} variant={"standard"} sx={{width: "72px", "marginLeft": "6px",
                        "marginRight": "6px"}} value={sessionState.weights[parentIndex][childIndex]} key={childIndex}
                               className={"exerciseNumberInput"} onChange={(event) => {
                        sessionDispatch({type: "weights", payload: {
                                topIndex: parentIndex,
                                bottomIndex: childIndex,
                                value: +event.target.value,
                            }});
                    }}/>
                    <Fab variant="extended" size="small" color="primary" aria-label="add" className={"addAndSubtractButtons addButton"}
                         onClick={(event) => {
                             event.preventDefault();
                             sessionDispatch({ type: "weightsClickedToChange", payload: {
                                     topIndex: parentIndex,
                                     bottomIndex: childIndex,
                                     value: 1
                                 }});
                         }}>+</Fab>
                </div>
            </div>
        );
    });

    let previousExercises: JSX.Element[] = [];

    if (Array.isArray(sessionState.staticExerciseNames)) {
        previousExercises = sessionState.staticExerciseNames.map((e, k) => {
            return (
                <MenuItem key={k} value={e}>{e}</MenuItem>
            );
        });
    }

    let exerciseSelectorOrInput: JSX.Element[] = [0].map((_e, k) => {
            return (
                <div key={k}>
                    <div className={"tripleWidthFlex"}>
                        <div className={"threeEqualWidth"}>
                            {/*<button onClick={(e) => {
                                cc(sessionState)
                            }}>Log</button>*/}
                        </div>
                        <div className={"threeEqualWidth"}>
                            <span className={"exerciseHeading"}>Exercise Title</span>
                        </div>
                        <div className={"threeEqualWidth"}>
                            <DeleteIcon onClick={(_e) => {
                                swal({
                                    title: "Are you sure?",
                                    text: "Do you want to remove this exercise from your current workout?",
                                    icon: "warning", //@ts-ignore
                                    buttons: true,
                                    dangerMode: true,
                                })
                                    .then((willDelete) => {
                                        if (willDelete) {
                                            sessionDispatch({type: "removeThisExercise", payload: parentIndex})

                                            swal("Exercise removed.", {
                                                icon: "success",
                                            });
                                        }
                                    });
                            }}/>
                        </div>
                    </div>

                    <div className={"exerciseOptionsContainer"} key={k}>
                        {sessionState.exerciseSelectorOrInput[parentIndex] === 0 &&
                            <>
                                <div className={"leftSideOfExerciseInputs"}>
                                    <FormControl variant={"standard"}>
                                        <Select label={"Exercise"} value={sessionState.exerciseNames[parentIndex] || ""}
                                                className={"selectOrAddExercise selectOrAddExerciseSelector"}
                                                onChange={(e) => {
                                                    sessionDispatch({
                                                        type: "exerciseNameChange",
                                                        payload: {index: parentIndex, value: e.target.value}
                                                    })
                                                }}>
                                            <MenuItem value={""}></MenuItem>
                                            {previousExercises}
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className={"rightSideOfExerciseInputs"}>
                                    <Button variant={"contained"} size={"small"} className={"selectOrAddExerciseFieldChangeButton"} onClick={(e) => {
                                            sessionDispatch({ type: "addOrSelectExercise", payload: {value: 1, index: parentIndex }});
                                            sessionDispatch({type: "changedExerciseEntryToSelector", payload: { index: parentIndex, value: ""}})
                                        }}>Add Title
                                    </Button>
                                </div>
                            </>
                        }

                        {sessionState.exerciseSelectorOrInput[parentIndex] !== 0 &&
                            <>
                                <div className={"leftSideOfExerciseInputs"}>
                                    <TextField variant={"standard"} defaultValue={""} className={"selectOrAddExercise selectOrAddExerciseInput"}
                                       onChange={(e) => {
                                           sessionDispatch({type: "exerciseNameChange", payload: { index: parentIndex, value: e.target.value }})
                                       }}
                                    />
                                </div>

                                <div className={"rightSideOfExerciseInputs"}>
                                    <Button variant={"contained"} size={"small"} className={"selectOrAddExerciseFieldChangeButton"} onClick={(e) => {
                                        sessionDispatch({ type: "addOrSelectExercise", payload: {value: 0, index: parentIndex }});
                                        sessionDispatch({type: "changedExerciseEntryToSelector", payload: { index: parentIndex, value: ""}})
                                    }}>Select Existing</Button>
                                </div>
                            </>
                        }
                    </div>
                    <br/>
                </div>
            );
    });

    /*TODO Add increment number input and apply button. Add auto-increment checkbox (database).
    TODO Add Notes field.*/

    // loaderState.exercises[parentIndex] ||
    return (
        <>
            {exerciseSelectorOrInput}
            {repAndWeightInputs}
            <div className={"setOptionContainer"}>
                <br />
                <span className={"exerciseHeading"}>Sets</span>
                <Fab variant="extended" size="medium" color="primary" aria-label="add" className={"addAndSubtractButtons subtractButton"}
                     onClick={(e) => {
                         sessionDispatch({ type: "sets", payload: {
                                 topIndex: parentIndex,
                                 value: -1,
                             }});
                     }}>-</Fab>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Fab variant="extended" size="medium" color="primary" aria-label="add" className={"addAndSubtractButtons subtractButton"}
                     onClick={(e) => {
                         sessionDispatch({ type: "sets", payload: {
                                 topIndex: parentIndex,
                                 value: 1,
                             }});
                     }}>+</Fab>
            </div>
            <div className={"setsCompletedCounter"}>
                {/*Sets Completed Counter goes here*/}
            </div>
        </>
    );
}

export function addArrayEntryToSession(arrayLength: number, value: number){
    let temp: number[] = [];

    for (let i = 0; i < arrayLength; i++){
        temp[i] = value;
    }

    return temp;
}