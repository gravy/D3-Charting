// Initialize Chart library
var C = C$();

$('.choice').on('click', function(e) {
  d3.select("svg").remove();
  d3.select(".sort-button").remove();

  switch (e.target.text) {
    case 'Bar':
      var donutOptions = {
        title: "Donut Sales (JSON)",
        data: "./data/donut_data.json",
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

    case 'Time Series':
      var timeOptions = {
        title: "Time Series",
        data: './data/time_data.json'
      };
      C.plotChart('line', timeOptions);
      break;

    case 'Scatter':
      var scatterOptions = {
        title: "Donut Ratings by Age",
        data: './data/survey_data.json',
        dataKeys: {
          glazed: true,
          jelly: true,
          powdered: true,
          sprinkles: true,
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

