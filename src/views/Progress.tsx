import Chart from "react-apexcharts";
import {Dispatch, SetStateAction, useState, useEffect} from "react";
import {FormattedSesssionHeatmapData} from "../utilities/interfaces";
import Heatmap, {handleGetWorkoutsForHeatmap} from "../components/Heatmap";
import {getExercises, getExercisesFromSessionTable, getSessionDataForOneRMCalculation} from "../utilities/queries";
let cc = console.log;

function Progress(){
    let mock1RM = [120, 140, 140, 140, 140, 145];
    const [heatmapState, setHeatmapState] = useState<FormattedSesssionHeatmapData | undefined>(undefined);
    const [yearsOfEntriesState, setYearsOfEntriesState] = useState<string[] | undefined>(undefined);
    const [selectedYearOfEntriesState, setSelectedYearOfEntriesState] = useState<string>("Last 365");

    const [exerciseListState, setExerciseListState] = useState<string[]>([""]);
    const [oneRMExerciseChosenState, setOneRMExerciseChosenState] = useState<string | undefined>(undefined);
    const [oneRMExerciseData, setOneRMExerciseData] = useState<any>(undefined); //TODO Add type

    useEffect(() => {
        handleGetWorkoutsForHeatmap(setHeatmapState, "Last 365");
        handleGetListOfExercises(setExerciseListState);
    }, []);

    useEffect(() => {
        handleOneRMSelection(setOneRMExerciseData, oneRMExerciseChosenState);
    }, [oneRMExerciseChosenState]);

    let exerciseOptions: JSX.Element[] = exerciseListState.map((entry, k) => {
       return (<option key={k}>{entry}</option>);
    });



    return (
        <div className={"progressContainer"}>
            <button onClick={(e) => {
                e.preventDefault();
                cc(heatmapState);
                cc(yearsOfEntriesState);
                cc(selectedYearOfEntriesState)
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
                    <br/>
                    Exercise
                    <select value={oneRMExerciseChosenState} onChange={(e) => {
                        setOneRMExerciseChosenState(e.target.value);
                        //handleOneRMSelection(setOneRMExerciseData, e.target.value);
                    }}>
                        <option></option>
                        {exerciseOptions}
                    </select>
                </div>

                {/*TODO Add a table to display hard data for session by name*/}
{/*
                <Chart
                    series = {[
                        {
                            data: mock1RM
                        }
                    ]}
                    type="bar"
                    height={400}
                    options = {{
                        plotOptions: {
                            bar: {
                                horizontal: true,
                            }
                        },
                        xaxis: {
                            //categories: job.yearsNumbered,
                        },
                    }}
                />*/}
            </div>
        </div>
    )
}

async function handleOneRMSelection(setOneRMExerciseData: Dispatch<SetStateAction<any>>,
                              oneRMExerciseChosenState: string | undefined){
    if (oneRMExerciseChosenState !== undefined){
        let response = await getSessionDataForOneRMCalculation(oneRMExerciseChosenState);
        cc(response);
    } else {
        setOneRMExerciseData(undefined);
    }
}

async function handleGetListOfExercises(setExerciseListState: Dispatch<SetStateAction<string[]>>){
    let response = await getExercisesFromSessionTable();
    setExerciseListState(response.data);
}

export default Progress;