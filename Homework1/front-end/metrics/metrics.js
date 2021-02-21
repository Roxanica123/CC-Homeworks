// Load the Visualization API and the corechart package.
google.charts.load('current', { 'packages': ['corechart'] });

google.charts.setOnLoadCallback(load_data);
// Set a callback to run when the Google Visualization API is loaded.
// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawCharts(metrics) {
    const data_json = JSON.parse(metrics);

    console.log(data_json);
    const rows_number = Object.keys(data_json.per_request_metrics).map(key => [key, data_json.per_request_metrics[key].number]);
    const rows_latency = Object.keys(data_json.per_request_metrics).map(key => [key, data_json.per_request_metrics[key].latency/data_json.per_request_metrics[key].number]);

        // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Requests');
    data.addColumn('number', 'Routes');
    data.addRows(rows_number);


    var data_latency = new google.visualization.DataTable();
    data_latency.addColumn('string', 'Requests');
    data_latency.addColumn('number', 'Routes');
    data_latency.addRows(rows_latency);
    // Set chart options
    var options = {
        'title': 'Requests distribution',
        'width': 400,
        'height': 300
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);

    var chart_latency = new google.visualization.BarChart(document.getElementById('latency'));
    chart_latency.draw(data_latency, options);
}



async function load_data() {

    const xmlRequest = new XMLHttpRequest();
    xmlRequest.onload = () => {
        drawCharts(xmlRequest.response);
    }
    xmlRequest.open("GET", "http://localhost:5000/metrics");
    xmlRequest.send()
}
