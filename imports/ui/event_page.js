import Highcharts from 'highcharts';
import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';

import './event_page.html';

function createHigh(eventData) {
  $('#container').highcharts({
    chart: {
      type: 'bar'
    },
    title: {
      text: eventData.avgPrice
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
    var postId = FlowRouter.getParam('postId');
    self.subscribe('sportingEvents');

  //   var eventData = SportingEvents.find({}).count()
		// console.log(eventData)  
  });


});

Template.eventPage.rendered = function() {  
    this.autorun(function () {  
    	var eventId = FlowRouter.getParam("id");
		var eventData = SportingEvents.findOne({})

		console.log(eventData)
       createHigh(eventData);

})
}


Template.eventPage.helpers({
	sportingEvent() {
		var eventData = SportingEvents.find({}).count()
		return eventData
	}
});
