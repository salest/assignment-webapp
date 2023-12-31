export async function draw(reports, startDate, endDate) {
    // and just rendering very simple chart according to tutorial page: https://www.chartjs.org/docs/latest/getting-started/usage.html
    const ctx = document.getElementById('chartCanvas');

    //Data set to hold the dates and maintenance minutes
    const dataSet = createDataSet(startDate, endDate);

    //Updates the maintenance numbers for dates within range
    calculateMaintenanceMinutes(reports, dataSet);

    //Create chart
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            //Gets the dates from the dataSet and sets as label
            labels: Object.keys(dataSet),
            datasets: [{
                //Updates Vertical Axis label
                label: '# of minutes for maintenance',
                //Plots the data points of the maintenance minutes
                data: Object.values(dataSet),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

//Exported function to call and refresh Chart js when change is invoked on date picker
export async function update(reports, startDate, endDate) {
    deleteChart();
    draw(reports, startDate, endDate);
};

//Deletes the current myChart
function deleteChart() {
    window.myChart.destroy();
}

//Creates a dataSet object to hold days for the chart and maintenance minutes
function createDataSet(startDate, endDate) {
    //Data set to hold the dates and maintenance minutes
    const dataSet = {};

    //Creates start/end dates and creates key/value pair for each date within the range
    let start = new Date(startDate);
    let end = new Date(endDate);
    for (let i = start; i <= end; start.setDate(start.getDate() + 1)) {
        const formattedDate = i.toLocaleDateString('en-GB');
        dataSet[formattedDate] = 0;
    }
    return dataSet;
}

 //Updates the maintenance numbers for dates within range
function calculateMaintenanceMinutes(reports, dataSet) {
    reports.map((r) => {
        //Get the date from reports object
        const date = new Date(r["workDate"]);
        //Get maintenance minutes from report object
        const maintenance = r["workTime"]["maintenance"];
        //Convert date time string to yyyy-mm-dd format
        const formattedDate = date.toLocaleDateString('en-GB');
        //Combine maintenance minutes if multiple visits happen on the same day
        if (dataSet[formattedDate]) {
            dataSet[formattedDate] += maintenance
        }
        else {
            dataSet[formattedDate] = maintenance;
        }
    });
}