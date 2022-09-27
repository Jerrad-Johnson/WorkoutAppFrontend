import {Dispatch, SetStateAction} from "react";
import {
    getAllSessionNames, getAllSessionsByName,
    getExercisesFromSessionTable,
    getSessionDataForOneRMCalculation
} from "../../utilities/queries";
let cc = console.log;

export async function handleOneRMSelection(setOneRMExerciseData: Dispatch<SetStateAction<any>>,
                                           oneRMExerciseSelectorState: string,
                                           setOneRMExerciseDataLoadingState: Dispatch<SetStateAction<string>>){

    if (oneRMExerciseSelectorState !== ""){
        setOneRMExerciseDataLoadingState("Loading");
        try {
            let response = await getSessionDataForOneRMCalculation(oneRMExerciseSelectorState);
            formatOneRMData(response.data, setOneRMExerciseData, setOneRMExerciseDataLoadingState);
        } catch (e) {
            cc(e);
            setOneRMExerciseDataLoadingState("Failed");
        }
    } else {
        setOneRMExerciseData(undefined);
    }
}

export async function handleGetListOfExercises(setExerciseListState: Dispatch<SetStateAction<string[]>>,
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

export function formatOneRMData(response: any, setOneRMExerciseData: Dispatch<SetStateAction<any>>,
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

export function getPercentageOf1RM(rep: number){
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

export async function handleGetListOfSessionsByName(setWorkoutListState: Dispatch<SetStateAction<string[]>>,
                                             setWorkoutSessionSelectorState: Dispatch<SetStateAction<string>>,
                                             setWorkoutSessionSelectorLoadingState: Dispatch<SetStateAction<string>>,
){
    try {
        let response = await getAllSessionNames();

        let listOfSesssionsByName: string[] = response?.data?.data?.map((e: any) => {
            return (e.session_title);
        });

        setWorkoutListState(listOfSesssionsByName);
        if (response?.data?.data) {
            setWorkoutSessionSelectorState(response?.data?.data[0]?.session_title);
            setWorkoutSessionSelectorLoadingState("Loaded");
        }
    } catch (e) {
        cc(e);
        setWorkoutSessionSelectorLoadingState("Failed");
    }
}

export async function handleOneSessionNameAllDataSelection(setWorkoutSessionState: Dispatch<SetStateAction<any>>,
                                                    workoutSessionSelectorState: string,
                                                    setWorkoutSessionLoadingState: Dispatch<SetStateAction<string>>){
    cc(5)
    if (workoutSessionSelectorState === "") return;
    setWorkoutSessionLoadingState("Loading");

    try {
        let response = await getAllSessionsByName(workoutSessionSelectorState);
        cc(response)
        let reformattedData = reformatSessionData(response.data.data);
        setWorkoutSessionState(reformattedData);
        setWorkoutSessionLoadingState("Loaded");
    } catch (e) {
        cc(e);
        setWorkoutSessionLoadingState("Failed");
    }

}

export function reformatSessionData(data: any){
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