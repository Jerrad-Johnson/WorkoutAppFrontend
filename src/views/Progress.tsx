import Chart from "react-apexcharts";
import ActivityCalendar, {CalendarData, Day} from "react-activity-calendar";

function Progress(){

    let mock1RM = [120, 140, 140, 140, 140, 145];
    let mockDates = [""];
    let mockHeatmapData: CalendarData = [{
        date: "2022-01-01",
        count: 1,
        level: 3
    }, {
        date: "2022-02-20",
        count: 0,
        level: 4
    }, {
        date: "2022-03-20",
        count: 2,
        level: 0
    }];

    return (
        <div className={"progressContainer"}>
            <div className={"options"}>
                test
            </div>

            <div className={"chartContainer"}>
                <ActivityCalendar data={mockHeatmapData}/>
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