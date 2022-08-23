import {
    FormattedSesssionHeatmapData,
    HeatmapByDate,
    SessionDateHashmap,
    StandardBackendResponse
} from "../utilities/interfaces";
import {Dispatch, SetStateAction} from "react";
import {CircularProgress} from "@mui/material";
import ActivityCalendar from "react-activity-calendar";
import ReactTooltip from "react-tooltip";
import {getWorkoutsForHeatmap, getYearsOfAllEntries} from "../utilities/queries";
import {eachDayOfInterval} from "date-fns";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from "@mui/material/FormControl";
let cc = console.log;

// Graph docs: https://grubersjoe.github.io/react-activity-calendar/?path=/docs/activity-calendar--default

function Heatmap({heatmapState, setHeatmapState, yearsOfEntriesState, setYearsOfEntriesState, selectedYearOfEntriesState, setSelectedYearOfEntriesState}: {
    heatmapState: FormattedSesssionHeatmapData | undefined,
    setHeatmapState: Dispatch<SetStateAction<any>>,
    yearsOfEntriesState: string[] | undefined,
    setYearsOfEntriesState: Dispatch<SetStateAction<any>>
    selectedYearOfEntriesState: string,
    setSelectedYearOfEntriesState: Dispatch<SetStateAction<any>>}){

    let inactiveDaysColor: string = "#ccc" //Set dynamically
    let activeDaysColor: string = "#f00";

    let heatmapChart: JSX.Element;
    let yearsOfEntries: JSX.Element[] | undefined = undefined;

    if (yearsOfEntriesState === undefined) handleGetYearsOfAllEntries(setYearsOfEntriesState);
    if (yearsOfEntriesState !== undefined) {
        yearsOfEntries = yearsOfEntriesState.map((e: string, k: number) => {
            return (
                <MenuItem key={k} value={e}>{e}</MenuItem>
            );
        });
    }

    if (heatmapState === undefined){
        heatmapChart = (
            <>
            <h2>Workout History</h2>
            <CircularProgress size={150}/>
            </>
        );
    } else { //TODO Add overlay upon changing year
        heatmapChart = (
            <div className={"genericBottomMarginLarge"}>
                <h2>Workout History</h2>
                {yearsOfEntries &&
                    <FormControl className={"centerAndFullWidth"} variant={"standard"} placeholder={"Exercise"}>
                        <Select value={selectedYearOfEntriesState} onChange={(e) => {
                            setSelectedYearOfEntriesState(e.target.value);
                            handleGetWorkoutsForHeatmap(setHeatmapState, e.target.value);
                        }}>
                            {yearsOfEntries}
                            <MenuItem value={"Last 365 Days"}>Last 365 Days</MenuItem>
                        </Select>
                    </FormControl>
                }
                <br />
                <br />
                <ActivityCalendar
                    data={heatmapState}
                    labels={{
                        totalCount: `{{count}} workouts in ${selectedYearOfEntriesState}`, /*TODO Add date range*/
                        tooltip: '<strong>{{count}} workouts</strong>  {{date}}'
                    }}
                    theme={{
                        level0: inactiveDaysColor,
                        level1: activeDaysColor,
                        level2: activeDaysColor,
                        level3: activeDaysColor,
                        level4: activeDaysColor,
                    }}
                    hideColorLegend={true}
                    blockRadius={2}
                    blockSize={12}
                >
                    <ReactTooltip html />
                </ActivityCalendar>
            </div>
        )
    }

    return (
        <>
            {heatmapChart}
        </>
    );
}

export async function handleGetWorkoutsForHeatmap(setHeatmapState: Dispatch<SetStateAction<FormattedSesssionHeatmapData | undefined>>,
                                                  selectedYearOfEntriesState: string){
    setHeatmapState(undefined);
    let response = await getWorkoutsForHeatmap(selectedYearOfEntriesState);

    let sessionDatesAndCount: SessionDateHashmap = {};
    response.data.forEach((e: {session_date: string; session_title: string}) => {
        sessionDatesAndCount[e.session_date] ? sessionDatesAndCount[e.session_date] += 1 : sessionDatesAndCount[e.session_date] = 1;
    });

    let formattedSesssionData: FormattedSesssionHeatmapData = [];

    for (let entry in sessionDatesAndCount){
        let tempEntry: any = {};
        tempEntry.date = entry;
        tempEntry.count = sessionDatesAndCount[entry];
        sessionDatesAndCount[entry] > 4 ? tempEntry.level = 4 : tempEntry.level = sessionDatesAndCount[entry];
        formattedSesssionData.push(tempEntry);
    }

    let sortedAndFormattedSessionHeatmapData: FormattedSesssionHeatmapData =
        formattedSesssionData.sort((a: HeatmapByDate, b: HeatmapByDate) => {
            if (a.date > b.date) return 1;
            if (a.date < b.date) return -1;
            return 0;
        });

    let emptyEntries: HeatmapByDate[] = getEmptySetOfHashmapData(selectedYearOfEntriesState);
    let allEntriesCombined: HeatmapByDate[] = combineEmptyAndRealHashmapData(emptyEntries, sortedAndFormattedSessionHeatmapData);

    setHeatmapState(allEntriesCombined);

    //response().then(createDataForHeatmap(response, yearOrLast365, setHeatmapState));
    //response.then(createDataForHeatmap(response, yearOrLast365, setHeatmapState));

}

function createDataForHeatmap(response: any, yearOrLast365: string, setHeatmapState: Dispatch<SetStateAction<FormattedSesssionHeatmapData | undefined>>){
    let sessionDatesAndCount: SessionDateHashmap = {};
    response.data.forEach((e: {session_date: string; session_title: string}) => {
        sessionDatesAndCount[e.session_date] ? sessionDatesAndCount[e.session_date] += 1 : sessionDatesAndCount[e.session_date] = 1;
    });

    let formattedSesssionData: FormattedSesssionHeatmapData = [];

    for (let entry in sessionDatesAndCount){
        let tempEntry: any = {};
        tempEntry.date = entry;
        tempEntry.count = sessionDatesAndCount[entry];
        sessionDatesAndCount[entry] > 4 ? tempEntry.level = 4 : tempEntry.level = sessionDatesAndCount[entry];
        formattedSesssionData.push(tempEntry);
    }

    let sortedAndFormattedSessionHeatmapData: FormattedSesssionHeatmapData =
        formattedSesssionData.sort((a: HeatmapByDate, b: HeatmapByDate) => {
            if (a.date > b.date) return 1;
            return -1;
        });

    let emptyEntries: HeatmapByDate[] = getEmptySetOfHashmapData(yearOrLast365);
    let allEntriesCombined: HeatmapByDate[] = combineEmptyAndRealHashmapData(emptyEntries, sortedAndFormattedSessionHeatmapData);

    setHeatmapState(allEntriesCombined);

}

function getEmptySetOfHashmapData(yearOrLast365: string){
    if (yearOrLast365 === "Last 365 Days") {
        let oneYearBack: Date = new Date();
        oneYearBack.setDate(oneYearBack.getDate() - 364);

        let allDates: Date[] = eachDayOfInterval({
            start: oneYearBack,
            end: new Date(),
        });

        let allDatesFormatted: HeatmapByDate[] = allDates.map((e: Date) => {
            return {date: e.toISOString().slice(0, 10), count: 0, level: 0}
        });
        return allDatesFormatted;
    } else {
        //@ts-ignore
        let beginDate: Date = new Date(yearOrLast365, "00", "01"); //@ts-ignore
        let endDate: Date = new Date(yearOrLast365, "11", "31");

        let allDates: Date[] = eachDayOfInterval({
            start: beginDate,
            end: endDate,
        });

        let allDatesFormatted: HeatmapByDate[] = allDates.map((e: Date) => {
            return {date: e.toISOString().slice(0, 10), count: 0, level: 0}
        });
        return allDatesFormatted;
    }
}

function combineEmptyAndRealHashmapData(emptyEntries: HeatmapByDate[], sortedAndFormattedSessionHeatmapData: HeatmapByDate[]){
    let combinedHeatmapData: HeatmapByDate[] = Array.from(emptyEntries);

    for (let i = 0; i < sortedAndFormattedSessionHeatmapData.length; i++){
        let index: number = emptyEntries.findIndex((emptyEntry: HeatmapByDate) => emptyEntry.date === sortedAndFormattedSessionHeatmapData[i].date);
        combinedHeatmapData[index] = sortedAndFormattedSessionHeatmapData[i];
    }

    return combinedHeatmapData;
}

async function handleGetYearsOfAllEntries(setYearsOfEntriesState: Dispatch<SetStateAction<string[] | undefined>>){
    let response = await getYearsOfAllEntries();

    setYearsOfEntriesState(response.data);
}


export default Heatmap;
