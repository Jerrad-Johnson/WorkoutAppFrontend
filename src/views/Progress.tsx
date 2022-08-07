import Chart from "react-apexcharts";
import ActivityCalendar, {CalendarData, Day} from "react-activity-calendar";
import ReactTooltip from "react-tooltip";
import {getWorkoutsLast365Days} from "../utilities/queries";
import {Dispatch, SetStateAction, useState, useEffect} from "react";
import {CircularProgress} from "@mui/material";
import {
    FormattedSesssionHeatmapData, HeatmapByDate,
    SessionDateHashmap
} from "../utilities/interfaces";
let cc = console.log;

function Progress(){
    const [heatmapState, setHeatmapState] = useState<FormattedSesssionHeatmapData | undefined>(undefined);

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

    useEffect(() => {
        handleGetWorkoutsLast365Days(setHeatmapState);
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
                    cc(heatmapState)
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

async function handleGetWorkoutsLast365Days(setHeatmapState: Dispatch<SetStateAction<FormattedSesssionHeatmapData | undefined>>){
    let response = await getWorkoutsLast365Days();
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



    //setHeatmapState(sortedAndFormattedSessionHeatmapData);
}

export default Progress;