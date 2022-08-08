import Chart from "react-apexcharts";
import ActivityCalendar, {CalendarData, Day} from "react-activity-calendar";
import ReactTooltip from "react-tooltip";
import {getWorkoutsLast365Days, getYearsOfAllEntries} from "../utilities/queries";
import {Dispatch, SetStateAction, useState, useEffect} from "react";
import {CircularProgress} from "@mui/material";
import {
    FormattedSesssionHeatmapData, HeatmapByDate,
    SessionDateHashmap
} from "../utilities/interfaces";
import {eachDayOfInterval} from "date-fns";
let cc = console.log;

function Progress(){
    const [heatmapState, setHeatmapState] = useState<FormattedSesssionHeatmapData | undefined>(undefined);
    const [yearsOfEntriesState, setYearsOfEntriesState] = useState<string[] | undefined>(undefined);  
        
    let inactiveDaysColor: string = "#555" //Set dynamically
    let activeDaysColor: string = "#fff"
    let mock1RM = [120, 140, 140, 140, 140, 145];
    let mockDates = [""];
    let mockHeatmapData: CalendarData = [{
        date: "2022-01-01",
        count: 1,
        level: 1
    }, {
        date: "2022-02-20",
        count: 4,
        level: 4
    }, {
        date: "2022-03-20",
        count: 2,
        level: 2
    }];
    let heatmap: JSX.Element;

    handleGetYearsOfAllEntries(setYearsOfEntriesState);

    useEffect(() => {
        handleGetWorkoutsLast365Days(setHeatmapState, "last365");
    }, []);


    if (heatmapState === undefined){
        heatmap = (<CircularProgress size={150}/>);
    } else {
        heatmap = (<ActivityCalendar
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
        </ActivityCalendar>)
    }

    return (
        <div className={"progressContainer"}>
            <div className={"options"}>
                <button onClick={(e) => {
                    e.preventDefault();
                    cc(heatmapState);
                    cc(yearsOfEntriesState);
                }}>test data</button>
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

async function handleGetWorkoutsLast365Days(setHeatmapState: Dispatch<SetStateAction<FormattedSesssionHeatmapData | undefined>>,
                                            type: string){
    let response = await getWorkoutsLast365Days(type);
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

    let emptyEntries: HeatmapByDate[] = getEmptySetOfHashmapData();
    let allEntriesCombined: HeatmapByDate[] = combineEmptyAndRealHashmapData(emptyEntries, sortedAndFormattedSessionHeatmapData);

    setHeatmapState(allEntriesCombined);
}

function getEmptySetOfHashmapData(){
    let oneYearBack: Date = new Date();
    oneYearBack.setDate(oneYearBack.getDate()-364);

    let allDates: Date[] = eachDayOfInterval({
        start: oneYearBack,
        end: new Date(),
    });

    let allDatesFormatted: HeatmapByDate[] = allDates.map((e: Date) => {
        return {date: e.toISOString().slice(0, 10), count: 0, level: 0}
    });

    return allDatesFormatted;
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