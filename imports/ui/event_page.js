import Highcharts from 'highcharts';
import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';

import './event_page.html';

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



Template.eventPage.onCreated(function() {

  var self = this;
  self.autorun(function() {
    var eventId = FlowRouter.getParam('id');
    self.subscribe('singleEvent', eventId, function() {
         var eventData = SportingEvents.find({}).count()
        console.log(eventData)
        createHigh()
    });  
  });

});



Template.eventPage.helpers({
	sportingEvent() {
		var eventData = SportingEvents.find({}).count()
		return eventData
	}
});
