export async function draw(reports, startDate, endDate) {
    // and just rendering very simple chart according to tutorial page: https://www.chartjs.org/docs/latest/getting-started/usage.html
    const ctx = document.getElementById('chartCanvas');
    const dataSet = {};

 

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

export async function update(reports, startDate, endDate) {
    const ctx = document.getElementById('chartCanvas');
    const dataSet = {};

    reports.map((r) => {
        const date = new Date(r["workDate"]);
        const maintenance = r["workTime"]["maintenance"];
        const formattedDate = date.toLocaleDateString('en-GB');
        if (dataSet[formattedDate]) {
            dataSet[formattedDate] += maintenance
        }
        else {
            dataSet[formattedDate] = maintenance;
        }
    });

    console.log(startDate);
    console.log(endDate);

    window.myChart.destroy();
    draw(reports, startDate, endDate);
};