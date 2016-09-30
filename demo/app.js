// Initialize Chart library
var C = C$();

function plotChart(chartFunction, options, format) {
  if (format === "csv") {
    jQuery.get(options.data, function (csvData) {
      var data = C.csvToJSON(csvData, options.valuePosition);
      chartFunction(data, options);
    });
  } else {
    jQuery.get(options.data, function(data) {
      chartFunction(data, options);
    });
  }
}

// Bar Charts
var donutOptions = {
  title: "Donut Sales (JSON)",
  data: "./data/donut_data.json",
  key: "key",
  value: "value",
  xLabel: "Donut type",
  yLabel: "Units sold",
  showValues: true
};
plotChart(C.bar, donutOptions, "json" );

var letterOptions = {
  title: "Letter Frequency (CSV)",
  data: './data/bar_data.csv',
  key: "letter",
  value: "frequency",
  valuePosition: 1,
  xLabel: "Letter",
  yLabel: "Frequency",
  showValues: false
};
plotChart(C.bar, letterOptions, "csv");

var cerealOptions = {
  title: "Cereal Calories",
  dimensions: {
    width: 1400,
    height: 500
  },
  data: './data/cereal.csv',
  key: "Cereal Name",
  value: "Calories",
  valuePosition: 3,
  xLabel: "Cereal",
  yLabel: "Calories",
  showValues: false
};
plotChart(C.bar, cerealOptions, "csv");

// Line chart
var timeOptions = {
  title: "Time Series",
  data: './data/time_data.json'
};
plotChart(C.line, timeOptions, "json");






