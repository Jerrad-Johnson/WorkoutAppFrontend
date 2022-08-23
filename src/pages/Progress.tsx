import {Dispatch, SetStateAction, useState, useEffect} from "react";
import {FormattedSesssionHeatmapData} from "../utilities/interfaces";
import Heatmap, {handleGetWorkoutsForHeatmap} from "../components/Heatmap";
import Nav from "../components/Nav.js";
import OneRMLineGraph from "../components/OneRMLineGraph";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from "@mui/material/FormControl";
import ConditionalCircularProgress from "../components/ConditionalCircularProgress";
import FailedToLoadAlert from "../components/FailedToLoadAlert";
import {handleOneRMSelection, handleGetListOfExercises, handleGetListOfSessionsByName, handleOneSessionNameAllDataSelection} from "./progress/specificFunctions";

let cc = console.log;

function Progress(){
    const [heatmapState, setHeatmapState] = useState<FormattedSesssionHeatmapData | undefined>(undefined);
    const [yearsOfEntriesState, setYearsOfEntriesState] = useState<string[] | undefined>(undefined);
    const [selectedYearOfEntriesState, setSelectedYearOfEntriesState] = useState<string>("Last 365 Days");

    const [exerciseListState, setExerciseListState] = useState<string[]>([""]);
    const [oneRMExerciseSelectorState, setOneRMExerciseSelectorState] = useState<string>("");
    const [oneRMExerciseListLoadingState, setOneRMExerciseListLoadingState] = useState<string>("Loading");
    
    const [oneRMExerciseData, setOneRMExerciseData] = useState<any>(undefined); //TODO Add type
    const [oneRMExerciseDataLoadingState, setOneRMExerciseDataLoadingState] = useState<string>("Loading");

    const [workoutListState, setWorkoutListState] = useState<string[]>([""]);
    const [workoutSessionSelectorState, setWorkoutSessionSelectorState] = useState<string>("");
    const [workoutSessionSelectorLoadingState, setWorkoutSessionSelectorLoadingState] = useState<string>("Loading");

    const [workoutSessionState, setWorkoutSessionState] = useState<any>();
    const [workoutSessionLoadingState, setWorkoutSessionLoadingState] = useState<string>("Loading");


    useEffect(() => {
        handleGetWorkoutsForHeatmap(setHeatmapState, "Last 365 Days");
        handleGetListOfExercises(setExerciseListState, setOneRMExerciseSelectorState, setOneRMExerciseListLoadingState);
        handleGetListOfSessionsByName(setWorkoutListState, setWorkoutSessionSelectorState, setWorkoutSessionSelectorLoadingState);
    }, []);

    useEffect(() => {
        handleOneRMSelection(setOneRMExerciseData, oneRMExerciseSelectorState, setOneRMExerciseDataLoadingState);
    }, [oneRMExerciseSelectorState]);
    
    useEffect(() => {
        handleOneSessionNameAllDataSelection(setWorkoutSessionState, workoutSessionSelectorState, setWorkoutSessionLoadingState);
    }, [workoutSessionSelectorState]);

    let exerciseOptions: JSX.Element[] = exerciseListState.map((entry, k) => {
       return (<MenuItem key={k} value={entry}>{entry}</MenuItem>);
    });

    let sessionOptions: JSX.Element[] = workoutListState.map((entry, k) => {
        return (<MenuItem key={k} value={entry}>{entry}</MenuItem>);
    });

    let chosenSessionTableRows: JSX.Element[] = [];

    let rowKey = 9000001;

    if (workoutSessionState !== undefined){

        chosenSessionTableRows = workoutSessionState.map((entry: any, k: number) => {
            let specificSessionData: JSX.Element[] = [];

            for (let i = 0; i < entry.reps.length; i++){
                let row: JSX.Element = (
                    <tr key={rowKey} className={"tableSessionRow"}>
                       <td>{entry.exercises[i]}</td>
                       <td>{entry.weights[i]}</td>
                       <td>{entry.reps[i]}</td>
                   </tr>
                )

                specificSessionData.push(row);
                rowKey += 1;
            }

           return (
               <tbody key={k}>
                    <tr className={"tableSessionRow"}>
                       <td className={"tableSessionDate"}>{entry.session_date}</td>
                    </tr>
                    {specificSessionData}
               </tbody>
           )
        });
    }

    const oneRMSelectForm: JSX.Element = (
        <FormControl className={"center"} variant={"standard"} placeholder={"Exercise"}>
            <Select value={oneRMExerciseSelectorState} className={"genericBottomMargin"} onChange={(e) => {
                setOneRMExerciseSelectorState(e.target.value);
            }}>
                <MenuItem value={""}></MenuItem>
                {exerciseOptions}
            </Select>
        </FormControl>
    )

    const workoutSessionSelector: JSX.Element = (
        <FormControl className={"center"} variant={"standard"}>
            <Select value={workoutSessionSelectorState}  className={"genericBottomMargin"} onChange={(e) => {
                setWorkoutSessionSelectorState(e.target.value);
            }}>
                <MenuItem value={""}></MenuItem>
                {sessionOptions}
            </Select>
        </FormControl>
    );

    const workoutSessionDataTable: JSX.Element = (
        <div className={"genericBottomMargin"}>
            {workoutSessionState?.length !== 0 &&
                <table className={"tableOfSession"}>
                    <thead>
                    <tr className={"tableOfSession"}>
                        <th className={"tableSessionHeader"}>Exercise</th>
                        <th className={"tableSessionHeader"}>Weight Lifted</th>
                        <th className={"tableSessionHeader"}>Reps</th>
                    </tr>
                    </thead>
                    {chosenSessionTableRows}
                </table>
            }
        </div>
        );

    const oneRMSelector: JSX.Element = (
        <>
            <h2>Find 1RM across time</h2>
            {oneRMExerciseListLoadingState === "Loaded" && oneRMSelectForm}
            {oneRMExerciseListLoadingState === "Loading" && <ConditionalCircularProgress sizeInPx={50}/>}
            {oneRMExerciseListLoadingState === "Failed" && <FailedToLoadAlert/>}
        </>
    )

    const oneRMGraph: JSX.Element = (
        <>
            {oneRMExerciseDataLoadingState === "Loaded" && <OneRMLineGraph oneRMExerciseData = {oneRMExerciseData}/>}
            {oneRMExerciseDataLoadingState === "Loading" && <><br /><ConditionalCircularProgress sizeInPx={400}/></>}
            {oneRMExerciseDataLoadingState === "Failed" && <FailedToLoadAlert/>}
        </>
    );

    const sessionSelectorForTable: JSX.Element = (
        <>
            <h2>Session Data by Title</h2>
            {workoutSessionSelectorLoadingState === "Loaded" && workoutSessionSelector}
            {workoutSessionSelectorLoadingState === "Loading" && <><br /><ConditionalCircularProgress sizeInPx={50}/></>}
            {workoutSessionSelectorLoadingState === "Failed" && <FailedToLoadAlert/>}
        </>
    );

    const sessionTable: JSX.Element = (
        <>
            {workoutSessionLoadingState === "Loaded" && workoutSessionDataTable}
            {workoutSessionLoadingState === "Loading" && <><br /><ConditionalCircularProgress sizeInPx={50}/></>}
            {workoutSessionLoadingState === "Failed" && <FailedToLoadAlert/>}
        </>
    );

    return (
        <>
            <Nav title={"Progress"}/>
            <div className={"basicContainer"}>
                <Heatmap
                    heatmapState = {heatmapState}
                    setHeatmapState = {setHeatmapState}
                    yearsOfEntriesState = {yearsOfEntriesState}
                    setYearsOfEntriesState = {setYearsOfEntriesState}
                    selectedYearOfEntriesState = {selectedYearOfEntriesState}
                    setSelectedYearOfEntriesState = {setSelectedYearOfEntriesState}
                />

                {oneRMSelector}
                {oneRMGraph}
                {sessionSelectorForTable}
                {sessionTable}
            </div>
        </>
    )
}

export default Progress;
