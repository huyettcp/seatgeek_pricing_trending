import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';
 
import './body.html';
import './chart.html';
 
Template.body.helpers({
	teams() {
		return Teams.find({})
	},
	sportingEvents() {
		return SportingEvents.find({})
	}
});

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