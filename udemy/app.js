// Initialize Chart library
var C = C$();

function plotJSON(key, value) {
  jQuery.get('./data/donut_data.json', function(data) {
    var options = {
      title: "Donut Sales (JSON)",
      key: key,
      value: value,
      xLabel: "Donut type",
      yLabel: "Units sold",
      showValues: true
    };

    C.bar(data, options);
  });
}

function plotCSV(key, value) {
  jQuery.get('./data/bar_data.csv', function(csvData) {
    var data = C.csvToJSON(csvData, 1);

    var options = {
      title: "Letter Frequency (CSV)",
      key: key,
      value: value,
      xLabel: "Letter",
      yLabel: "Frequency",
      showValues: false
    };

    C.bar(data, options);
  });
}

plotJSON('key', 'value');
plotCSV('letter', 'frequency');






