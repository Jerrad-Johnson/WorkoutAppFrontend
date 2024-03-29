import React, {Dispatch, SetStateAction, useState} from "react";
import {DatabaseData, GenericAction, SessionData} from "../../utilities/interfaces";
import MenuItem from "@mui/material/MenuItem";
import {Fab} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import swal from "sweetalert";
import {getLatestVersionOfExercise} from "../../utilities/queries";
import Divider from "@mui/material/Divider";
let cc = console.log;

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

    const [counter, setCounter] = useState(0);

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
                                        <Select label={"Exercise"} value={sessionState.exerciseNames?.[parentIndex] || ""}
                                                className={"selectOrAddExercise selectOrAddExerciseSelector"}
                                                onChange={(e) => {
                                                    sessionDispatch({
                                                        type: "exerciseNameChange",
                                                        payload: {index: parentIndex, value: e.target.value}
                                                    })
                                                }}>
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
                     }}> -
                </Fab>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Fab variant="extended" size="medium" color="primary" aria-label="add" className={"addAndSubtractButtons subtractButton"}
                     onClick={(e) => {
                         sessionDispatch({ type: "sets", payload: {
                                 topIndex: parentIndex,
                                 value: 1,
                             }});
                     }}> +
                </Fab>
            </div>

            <Divider sx={{marginTop: "20px"}}/>
            <div className={"exerciseContainerOptions"}>
                <div className={"mt-8"}>
                    {sessionState.exerciseSelectorOrInput[parentIndex] === 0 &&
                        <Button variant={"contained"} size={"small"} className={"selectOrAddExerciseFieldChangeButton"} onClick={(e) => {
                            handleLoadLatestVersionOfExercise(parentIndex, sessionState.exerciseNames[parentIndex], sessionDispatch);
                        }}>Load Latest</Button>
                    }
                </div>
                <div className={"setsFinishedCounter"}>
                    <div>
                        Sets Finished
                    </div>
                    <div className={"mt-2"}>
                        <Fab variant="extended" size="small" color="primary" aria-label="add" className={"addAndSubtractButtons subtractButton"}
                             onClick={(e) => {
                                 if (counter === 0) return;
                                 setCounter((prev) => prev - 1);
                             }}> -
                        </Fab>
                        <span className={"setsFinishedText"}>{counter}</span>
                        <Fab variant="extended" size="small" color="primary" aria-label="add" className={"addAndSubtractButtons subtractButton"}
                             onClick={(e) => {
                                 if (counter === sessionState.sets[parentIndex]) return;
                                 setCounter((prev) => prev + 1)
                             }}> +
                        </Fab>
                    </div>
                </div>
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

async function handleLoadLatestVersionOfExercise(parentIndex: number, exerciseName: string, sessionDispatch: Dispatch<GenericAction>){
    let result = await getLatestVersionOfExercise(exerciseName);
    if (!result?.data?.data?.[0]?.weight_lifted) return;

    let [weights, reps]: number[][] = splitCountsInSessionData(result.data.data[0]);
    let sets: number = reps.length;

    sessionDispatch({type: "loadLatestOfOneExercise", payload: {index: parentIndex, "reps": reps,
            "weights": weights, "sets": sets }});
}

function splitCountsInSessionData(results: {weight_lifted: string; reps: string;}){
    let weights: string[] = results.weight_lifted.split(",");
    let weightsAsNumberArr: number[] = weights.map((e) => { return +e; })
    let reps: string[] = results.reps.split(",");
    let repsAsNumberArr: number[] = reps.map((e) => { return +e; })

    return [weightsAsNumberArr, repsAsNumberArr] ;
}