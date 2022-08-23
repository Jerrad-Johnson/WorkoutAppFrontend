import {Dispatch, SetStateAction, useState, useEffect} from "react";
import {FormattedSesssionHeatmapData} from "../utilities/interfaces";
import Heatmap, {handleGetWorkoutsForHeatmap} from "../components/Heatmap";
import {
    getAllSessionNames,
    getAllSessions, getAllSessionsByName,
    getExercisesFromSessionTable,
    getSessionDataForOneRMCalculation
} from "../utilities/queries";
import Nav from "../components/Nav.js";
import OneRMLineGraph from "../components/OneRMLineGraph";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from "@mui/material/FormControl";
import {Alert} from "@mui/material";
import ConditionalCircularProgress from "../components/ConditionalCircularProgress";
import {failedToLoad} from "../utilities/sharedVariables";
import FailedToLoadAlert from "../components/FailedToLoadAlert";
let cc = console.log;

function Progress(){
    const [heatmapState, setHeatmapState] = useState<FormattedSesssionHeatmapData | undefined>(undefined);
    const [yearsOfEntriesState, setYearsOfEntriesState] = useState<string[] | undefined>(undefined);
    const [selectedYearOfEntriesState, setSelectedYearOfEntriesState] = useState<string>("Last 365 Days");

    const [exerciseListState, setExerciseListState] = useState<string[]>([""]);
    const [oneRMExerciseSelectorState, setOneRMExerciseSelectorState] = useState<string>("");
    const [oneRMExerciseListLoadingState, setOneRMExerciseListLoadingState] = useState<string>("Loading");
    
    const [oneRMExerciseData, setOneRMExerciseData] = useState<any>(undefined); //TODO Add type
    const [oneRMExerciseDataLoadingState, setOneRMExerciseDataLoadingState] = useState<string>("Failed");

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
            <Select value={oneRMExerciseSelectorState} onChange={(e) => {
                setOneRMExerciseSelectorState(e.target.value);
            }}>
                <MenuItem value={""}></MenuItem>
                {exerciseOptions}
            </Select>
        </FormControl>
    )

    const workoutSessionSelector: JSX.Element = (
        <FormControl className={"center"} variant={"standard"}>
            <Select value={workoutSessionSelectorState} onChange={(e) => {
                setWorkoutSessionSelectorState(e.target.value);
            }}>
                <MenuItem value={""}></MenuItem>
                {sessionOptions}
            </Select>
        </FormControl>
    );

    const workoutSessionDataTable: JSX.Element = (
        <>
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

            <br/><br/>
            <h2>Find 1RM across time</h2>

            {oneRMExerciseListLoadingState === "Loaded" && oneRMSelectForm}
            {oneRMExerciseListLoadingState === "Loading" && <ConditionalCircularProgress sizeInPx={50}/>}
            {oneRMExerciseListLoadingState === "Failed" && <FailedToLoadAlert/>}

            {oneRMExerciseDataLoadingState === "Loaded" && <OneRMLineGraph oneRMExerciseData = {oneRMExerciseData}/>}
            {oneRMExerciseDataLoadingState === "Loading" && <><br /><ConditionalCircularProgress sizeInPx={400}/></>}
            {oneRMExerciseDataLoadingState === "Failed" && <FailedToLoadAlert/>}

            <br/>
            <h2>Session Data by Title</h2>
            {workoutSessionSelectorLoadingState === "Loaded" && workoutSessionSelector}
            {workoutSessionSelectorLoadingState === "Loading" && <><br /><ConditionalCircularProgress sizeInPx={50}/></>}
            {workoutSessionSelectorLoadingState === "Failed" && <FailedToLoadAlert/>}
            <br/><br/>
            {workoutSessionLoadingState === "Loaded" && workoutSessionDataTable}
            {workoutSessionLoadingState === "Loading" && <><br /><ConditionalCircularProgress sizeInPx={50}/></>}
            {workoutSessionLoadingState === "Failed" && <FailedToLoadAlert/>}
        </div>
        </>
    )
}

async function handleOneRMSelection(setOneRMExerciseData: Dispatch<SetStateAction<any>>,
                                    oneRMExerciseChosenState: string,
                                    setOneRMExerciseDataLoadingState: Dispatch<SetStateAction<string>>){
    setOneRMExerciseDataLoadingState("Loading");

    if (oneRMExerciseChosenState !== ""){
        try {
            let response = await getSessionDataForOneRMCalculation(oneRMExerciseChosenState);
            formatOneRMData(response, setOneRMExerciseData, setOneRMExerciseDataLoadingState);
        } catch (e) {
            cc(e);
            setOneRMExerciseDataLoadingState("Failed");
        }
    } else {
        setOneRMExerciseData(undefined);
    }
}

async function handleGetListOfExercises(setExerciseListState: Dispatch<SetStateAction<string[]>>,
                                        setOneRMExerciseSelectorState: Dispatch<SetStateAction<string>>,
                                        setOneRMExerciseLoadingState: Dispatch<SetStateAction<string>>){

    try {
        let response = await getExercisesFromSessionTable();
        if (response?.data[0]) setExerciseListState(response.data);
        if (response?.data[0]) setOneRMExerciseSelectorState(response.data[0]);
        setOneRMExerciseLoadingState("Loaded");
    } catch (e) {
        cc(e)
        setOneRMExerciseLoadingState("Failed");
    }

}

function formatOneRMData(response: any, setOneRMExerciseData: Dispatch<SetStateAction<any>>,
                         setOneRMExerciseDataLoadingState: Dispatch<SetStateAction<string>>){

    let formattedSessionData: any = [];

    for (let i = 0; i < response.data.length; i++) {
        let repsAsArray = response.data[i].reps.split(",");
        let weightsAsArray = response.data[i].weight_lifted.split(",");
        formattedSessionData[i] = {};

        formattedSessionData[i].date = response.data[i].session_date;
        formattedSessionData[i].reps = repsAsArray.map((e: string) => {
            return +e;
        });
        formattedSessionData[i].weights = weightsAsArray.map((e: string) => {
            return +e;
        });
    }

    let formattedSessionDataWith1RM: any = [];

    for (let i = 0; i < formattedSessionData.length; i++){
        formattedSessionDataWith1RM[i] = {};
        let best1RM: number = 0;
        for (let j = 0; j < formattedSessionData[i].reps.length; j++){
            let calculated1RM = formattedSessionData[i].weights[j] * getPercentageOf1RM(formattedSessionData[i].reps[j]);
            if (calculated1RM > best1RM) best1RM = Math.round(calculated1RM);
        }
        formattedSessionDataWith1RM[i].oneRepMax = best1RM;
        formattedSessionDataWith1RM[i].date = formattedSessionData[i].date;
        formattedSessionDataWith1RM[i].exercise = response.data[0].exercise;
    }
    setOneRMExerciseDataLoadingState("Loaded");
    setOneRMExerciseData(formattedSessionDataWith1RM);
}

function getPercentageOf1RM(rep: number){
    const repsToPercentageMap: any = {
        1: 100,
        2: 97,
        3: 94,
        4: 92,
        5: 89,
        6: 86,
        7: 93,
        8: 81,
        9: 78,
        10: 75,
        11: 73,
        12: 71,
        13: 70,
        14: 68,
        15: 67,
        16: 65,
        17: 64,
        18: 63,
        19: 61,
        20: 60,
    }

    if (rep > 20) rep = 20;
    return (100 / repsToPercentageMap[rep]);
}

async function handleGetListOfSessionsByName(setWorkoutListState: Dispatch<SetStateAction<string[]>>, 
                                             setWorkoutSessionSelectorState: Dispatch<SetStateAction<string>>,
                                             setWorkoutSessionSelectorLoadingState: Dispatch<SetStateAction<string>>,
                                             ){
    try {
        let response = await getAllSessionNames();
        let listOfSesssionsByName: string[] = response.data.map((e: any) => {
            return (e.session_title);
        });

        setWorkoutListState(listOfSesssionsByName);
        if (response.data[0]?.session_title) {
            setWorkoutSessionSelectorState(response.data[0].session_title);
            setWorkoutSessionSelectorLoadingState("Loaded");
        }
    } catch (e) {
        cc(e);
        setWorkoutSessionSelectorLoadingState("Failed");
    }
}

async function handleOneSessionNameAllDataSelection(setWorkoutSessionState: Dispatch<SetStateAction<any>>,
                                                    workoutSessionSelectorState: string,
                                                    setWorkoutSessionLoadingState: Dispatch<SetStateAction<string>>){
    setWorkoutSessionLoadingState("Loading");

    try {
        let response = await getAllSessionsByName(workoutSessionSelectorState);
        let reformattedData = reformatSessionData(response.data);
        setWorkoutSessionState(reformattedData);
        setWorkoutSessionLoadingState("Loaded");
    } catch (e) {
        cc(e);
        setWorkoutSessionLoadingState("Failed");
    }

}

function reformatSessionData(data: any){
    let sessionDataCommasReplacedWithDashes: any = data.map((e: any) => {
       let weightReformatted: string = e.weight_lifted.replaceAll(',', '-');
       let repsReformatted: string = e.reps.replaceAll(',', '-');
       return {...e, weight_lifted: weightReformatted, reps: repsReformatted}
    });

    let mergedData: any = [];

    for (let i = 0; i < sessionDataCommasReplacedWithDashes.length; i++){
        let indexToPlaceData = mergedData.findIndex((e: any) => e.session_date === sessionDataCommasReplacedWithDashes[i].session_date);
        if (indexToPlaceData === -1) indexToPlaceData = mergedData.length;
        if (typeof mergedData[indexToPlaceData] !== 'object') mergedData[indexToPlaceData] = {};
        mergedData[indexToPlaceData].session_date = sessionDataCommasReplacedWithDashes[i].session_date;

        if (!Array.isArray(mergedData[indexToPlaceData].exercises)) mergedData[indexToPlaceData].exercises = [];
        mergedData[indexToPlaceData].exercises = [...mergedData[indexToPlaceData].exercises, sessionDataCommasReplacedWithDashes[i].exercise];

        if (!Array.isArray(mergedData[indexToPlaceData].weights)) mergedData[indexToPlaceData].weights = [];
        mergedData[indexToPlaceData].weights = [...mergedData[indexToPlaceData].weights, sessionDataCommasReplacedWithDashes[i].weight_lifted];

        if (!Array.isArray(mergedData[indexToPlaceData].reps)) mergedData[indexToPlaceData].reps = [];
        mergedData[indexToPlaceData].reps = [...mergedData[indexToPlaceData].reps, sessionDataCommasReplacedWithDashes[i].reps];
    }

    return mergedData;
}

export default Progress;
