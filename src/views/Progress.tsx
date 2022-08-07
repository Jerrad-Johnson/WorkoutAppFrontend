import Chart from "react-apexcharts";
import ActivityCalendar, {CalendarData, Day} from "react-activity-calendar";
import ReactTooltip from "react-tooltip";

function Progress(){

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

    return (
        <div className={"progressContainer"}>
            <div className={"options"}>
                test
            </div>

            <div className={"chartContainer"}>
                <ActivityCalendar
                    data={mockHeatmapData}
                    labels={{
                        totalCount: `{{count}} workouts in `, /*TODO Add date range*/
                        tooltip: '<strong>{{count}} workouts</strong> on {{date}}'
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

export default Progress;