// Initialize Chart library
var C = C$();

var scatterOptions = {
  title: "Auto Preferences by Age",
  data: autos,
  dataKeys: {
    ford: true,
    chevrolet: true,
    toyota: true,
    chrysler: true,
    age: 'xvalue',
    responses: 'yvalue'
  },
  tickValues: [18, 25, 32, 39, 46, 53, 60, 67, 74]
};
C.plotChart('scatter', scatterOptions);


$('.choice').on('click', function(e) {
  d3.select("svg").remove();
  d3.select(".sort-button").remove();
  d3.select("#controls").remove();

  switch (e.target.text) {
    case 'Bar':
      var donutOptions = {
        title: "Donut Sales (JSON)",
        data: donuts,
        key: "key",
        value: "value",
        xLabel: "Donut type",
        yLabel: "Units sold",
        showValues: true
      };
      C.plotChart('bar', donutOptions);
      break;

    case 'Bar(CSV)':
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
      C.plotChart('bar', letterOptions);
      break;

    case 'Grouped Bar':
      var groupedOptions = {
        title: "Sales by Person and Month",
        data: './data/sales.js'
      };
      C.plotChart('grouped', groupedOptions);
      break;

    case 'Time Series':
      var timeOptions = {
        title: "Jelly Donut Sales by Date",
        data: jelly
      };
      C.plotChart('line', timeOptions);
      break;

    case 'Scatter':
      var scatterOptions = {
        title: "Auto Preferences by Age",
        data: autos,
        dataKeys: {
          ford: true,
          chevrolet: true,
          toyota: true,
          chrysler: true,
          age: 'xvalue',
          responses: 'yvalue'
        },
        tickValues: [18, 25, 32, 39, 46, 53, 60, 67, 74]
      };
      C.plotChart('scatter', scatterOptions);

      break;

    default:

  }
});


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
//plotChart(C.bar, cerealOptions, "csv");

