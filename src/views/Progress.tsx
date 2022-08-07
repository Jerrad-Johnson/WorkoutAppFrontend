import Chart from "react-apexcharts";

function Progress(){

    let mock1RM = [120, 140, 140, 140, 140, 145];
    let mocklDates = [""];

    return (
        <div className={"progressContainer"}>
            <div className={"options"}>
                test
            </div>

            <div className={"chartContainer"}>
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