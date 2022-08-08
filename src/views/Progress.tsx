import Chart from "react-apexcharts";
import ActivityCalendar, {CalendarData, Day} from "react-activity-calendar";
import ReactTooltip from "react-tooltip";
import {getWorkoutsForHeatmap, getYearsOfAllEntries} from "../utilities/queries";
import {Dispatch, SetStateAction, useState, useEffect} from "react";
import {CircularProgress} from "@mui/material";
import {
    FormattedSesssionHeatmapData, HeatmapByDate,
    SessionDateHashmap
} from "../utilities/interfaces";
import {eachDayOfInterval, format, parseISO} from "date-fns";
let cc = console.log;

function Progress(){
    const [heatmapState, setHeatmapState] = useState<FormattedSesssionHeatmapData | undefined>(undefined);
    const [yearsOfEntriesState, setYearsOfEntriesState] = useState<string[] | undefined>(undefined);
    const [selectedYearOfEntriesState, setSelectedYearOfEntriesState] = useState<string>("Last 365");
    useEffect(() => {
        handleGetWorkoutsForHeatmap(setHeatmapState, "Last 365");
    }, []);

    let inactiveDaysColor: string = "#555" //Set dynamically
    let activeDaysColor: string = "#fff"
    let mock1RM = [120, 140, 140, 140, 140, 145];
    let heatmap: JSX.Element;
    let yearsOfEntries: JSX.Element[] | undefined = undefined;

    if (yearsOfEntriesState === undefined) handleGetYearsOfAllEntries(setYearsOfEntriesState);
    if (yearsOfEntriesState !== undefined) {
        yearsOfEntries = yearsOfEntriesState.map((e: string, k: number) => {
            return (
                <option key={k}>{e}</option>
            );
        });
    }

    if (heatmapState === undefined){
        heatmap = (<CircularProgress size={150}/>);
    } else {
        heatmap = (
            <div className={"heatmap"}>
                {yearsOfEntries &&
                    <select value={selectedYearOfEntriesState} onChange={(e) => {
                        e.preventDefault();
                        setSelectedYearOfEntriesState(e.target.value);
                        handleGetWorkoutsForHeatmap(setHeatmapState, selectedYearOfEntriesState);
                    }}>
                        {yearsOfEntries}
                        <option>Last 365</option>
                    </select>
                }
                <ActivityCalendar
                    data={heatmapState}
                    labels={{
                        totalCount: `{{count}} workouts in the last year`, /*TODO Add date range*/
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
        <div className={"progressContainer"}>
            <button onClick={(e) => {
                e.preventDefault();
                cc(heatmapState);
                cc(yearsOfEntriesState);
                cc(yearsOfEntries);
                cc(selectedYearOfEntriesState)
            }}>test data</button>

            <div className={"options"}>

            </div>

            <div className={"chartContainer"}>
                {heatmap}

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
                />
            </div>
        </div>
    )
}

async function handleGetWorkoutsForHeatmap(setHeatmapState: Dispatch<SetStateAction<FormattedSesssionHeatmapData | undefined>>,
                                            yearOrLast365: string){

    setHeatmapState(undefined);
    let response = await getWorkoutsForHeatmap(yearOrLast365);
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
    if (yearOrLast365 === "Last 365") {
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

export default Progress;