var data=[10,30,60];
d3.select('header').selectAll('.test-bar').data(data)
  .enter().append('div')

    .style('width', function(d) {
      return d + '%';
    })
    .attr('class', 'test-bar');



$('#choice').on('change', function() {
  console.log('New selection...', $('#choice').val());
  switch ($('#choice').val()) {
    case '1':
      if (!barChart) {
        var barChart = new BarChart();
      }
      barChart.create();
      break;

    case '2':
      if (!scatterPlot) {
        var scatterPlot = new ScatterPlot();
      }
      scatterPlot.create();
      break;

    default:
      if (!barChart) {
        var barChart = new BarChart();
      }
      barChart.create();
  }
})

var barChart = new BarChart();
barChart.create();
