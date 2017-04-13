import Highcharts from 'highcharts';
import { Template } from 'meteor/templating';
import './body.html';
import './chart.html';

Template.Chart.onCreated(function() {
});

Template.Chart.onRendered(function() {
  this.autorun(() => {
    createHigh();
  });
});

function createHigh() {
  $('#container').highcharts({
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Fruit Consumption'
    },
    xAxis: {
      categories: ['Apples', 'Bananas', 'Oranges']
    },
    yAxis: {
      title: {
        text: 'Fruit eaten'
      },
    },
    series: [
      {
        name: 'Jane',
        data: [1, 0, 4]
      }, {
        name: 'John',
        data: [5, 7, 3]
      }
    ]
  });
}
