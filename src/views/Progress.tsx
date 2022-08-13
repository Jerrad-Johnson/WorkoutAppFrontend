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
let cc = console.log;

function Progress(){
    const [heatmapState, setHeatmapState] = useState<FormattedSesssionHeatmapData | undefined>(undefined);
    const [yearsOfEntriesState, setYearsOfEntriesState] = useState<string[] | undefined>(undefined);
    const [selectedYearOfEntriesState, setSelectedYearOfEntriesState] = useState<string>("Last 365");

    const [exerciseListState, setExerciseListState] = useState<string[]>([""]);
    const [oneRMExerciseSelectorState, setOneRMExerciseSelectorState] = useState<string | undefined>(undefined);
    const [oneRMExerciseData, setOneRMExerciseData] = useState<any>(undefined); //TODO Add type

    const [workoutListState, setWorkoutListState] = useState<string[]>([""]);
    const [workoutSessionSelectorState, setWorkoutSessionSelectorState] = useState<string>("");
    const [workoutSessionState, setWorkoutSessionState] = useState<any>();

    useEffect(() => {
        handleGetWorkoutsForHeatmap(setHeatmapState, "Last 365");
        handleGetListOfExercises(setExerciseListState);
        handleGetListOfSessionsByName(setWorkoutListState);
    }, []);

    useEffect(() => {
        handleOneRMSelection(setOneRMExerciseData, oneRMExerciseSelectorState);
    }, [oneRMExerciseSelectorState]);
    
    useEffect(() => {
        handleOneSessionAllDataSelection(setWorkoutSessionState, workoutSessionSelectorState);
    }, [workoutSessionSelectorState]);

    let exerciseOptions: JSX.Element[] = exerciseListState.map((entry, k) => {
       return (<option key={k}>{entry}</option>);
    });

    let sessionOptions: JSX.Element[] = workoutListState.map((entry, k) => {
        return (<option key={k}>{entry}</option>);
    });

    let chosenSessionTableRows: JSX.Element[] = [];

    if (workoutSessionState !== undefined){
        chosenSessionTableRows = workoutSessionState.map((entry: any, k: number) => {
           return (
               <tr key={k}>
                   <td>{entry.exercise}</td>
                   <td>{entry.weight_lifted}</td>
                   <td>{entry.reps}</td>
               </tr>
           )
        });
    }

    return (
        <>
        <Nav/>
        <div className={"progressContainer"}>
            <button onClick={(e) => {
                e.preventDefault();
                cc(workoutListState);
                cc(workoutSessionSelectorState);
                cc(workoutSessionState)
                cc(chosenSessionTableRows)
            }}>test data</button>

            <div className={"options"}>
            </div>

            <div className={"chartContainer"}>
                <Heatmap
                    heatmapState = {heatmapState}
                    setHeatmapState = {setHeatmapState}
                    yearsOfEntriesState = {yearsOfEntriesState}
                    setYearsOfEntriesState = {setYearsOfEntriesState}
                    selectedYearOfEntriesState = {selectedYearOfEntriesState}
                    setSelectedYearOfEntriesState = {setSelectedYearOfEntriesState}
                />

                <div>
                    <br/>
                    <br/>
                    Find 1RM across time
                    <br/>
                    Exercise
                    <select value={oneRMExerciseSelectorState} onChange={(e) => {
                        setOneRMExerciseSelectorState(e.target.value);
                    }}>
                        <option></option>
                        {exerciseOptions}
                    </select>
                    <OneRMLineGraph oneRMExerciseData = {oneRMExerciseData}/>
                    <br/>


                    <br/>
                    Show a table of all date for sessions named ...
                    <br/>
                    Session
                    <select value={workoutSessionSelectorState} onChange={(e) => {
                        setWorkoutSessionSelectorState(e.target.value);
                    }}>
                        <option></option>
                        {sessionOptions}
                    </select>
                    <br/>
                    {workoutSessionState !== undefined &&
                        <table>
                            <thead>
                                <tr>
                                    <th>Exercise</th>
                                    <th>Weight Lifted</th>
                                    <th>Reps</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chosenSessionTableRows}
                            </tbody>
                        </table>
                    }
                </div>

                {/*TODO Add a table to display hard data for session by name*/}

            </div>
        </div>
        </>
    )
}

async function handleOneRMSelection(setOneRMExerciseData: Dispatch<SetStateAction<any>>,
                              oneRMExerciseChosenState: string | undefined){
    if (oneRMExerciseChosenState !== undefined){
        let response = await getSessionDataForOneRMCalculation(oneRMExerciseChosenState);
        formatOneRMData(response, setOneRMExerciseData);
    } else {
        setOneRMExerciseData(undefined);
    }
}

async function handleGetListOfExercises(setExerciseListState: Dispatch<SetStateAction<string[]>>){
    let response = await getExercisesFromSessionTable();
    setExerciseListState(response.data);
}

function formatOneRMData(response: any, setOneRMExerciseData: Dispatch<SetStateAction<any>>){
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

/*    let formattedAndSortedSessionDataWith1RM: any = formattedSessionDataWith1RM.sort((a: any, b: any) => {
       if (a.date > b.date) return 1;
       if (a.date < b.date) return -1;
       return 0;
    }); Replaced with ORDER BY in MySQL. Test more.*/

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

async function handleGetListOfSessionsByName(setWorkoutListState: Dispatch<SetStateAction<string[]>>){
    let response = await getAllSessionNames();
    let listOfSesssionsByName: string[] = response.data.map((e: any) => {
        return (e.session_title);
    });
    setWorkoutListState(listOfSesssionsByName);
}

async function handleOneSessionAllDataSelection(setWorkoutSessionState: Dispatch<SetStateAction<any>>, workoutSessionSelectorState: string){
    let response = await getAllSessionsByName(workoutSessionSelectorState);

    let reformattedData = reformatSessionData(response.data);
    setWorkoutSessionState(reformattedData);
}

function reformatSessionData(data: any){
    let reformattedData: any = data.map((e: any) => {
       let weightReformatted: string = e.weight_lifted.replaceAll(',', '-');
       let repsReformatted: string = e.weight_lifted.replaceAll(',', '-');
       return {...e, weight_lifted: weightReformatted, reps: repsReformatted}
    });

    return reformattedData

}

export default Progress;