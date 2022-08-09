import Chart from "react-apexcharts";
let cc = console.log;

function OneRMLineGraph({oneRMExerciseData}: {oneRMExerciseData: any}){
    let oneRMValues: number[] = [];
    let exerciseNames: string[] = [];
    let exerciseDates: string[] = [];

    if (oneRMExerciseData !== undefined) {
        oneRMValues = oneRMExerciseData.map((e: any) => {
            return e.oneRepMax;
        });
        exerciseNames = oneRMExerciseData.map((e: any) => {
            return e.exercise;
        });
        exerciseDates = oneRMExerciseData.map((e: any) => {
            return e.date;
        });

    }


    return (
        <Chart
            series = {[
                {
                    data: oneRMValues
                }
            ]}
            type="line"
            /*                    stroke={{
                                    curve: 'stepline'
                                }}*/
            height={400}
            options = {{
                plotOptions: {
                    bar: {
                        horizontal: true,
                    }
                },
                xaxis: {
                    categories: exerciseDates,
                },
            }}
        />
    );
}

export default OneRMLineGraph;