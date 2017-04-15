import Highcharts from 'highcharts';
import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';

import './event_page.html';

function createHigh(graphData, timeTest) {
  $('#container').highcharts({
    chart: {
        type: 'spline'
    },
    title: {
        text: 'Snow depth at Vikjafjellet, Norway'
    },
    subtitle: {
        text: 'Irregular time data in Highcharts JS'
    },
    xAxis: {
      type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
        },
        title: {
            text: 'Date'
        }
    },
    yAxis: {
        title: {
            text: 'Snow depth (m)'
        },
        min: 0
    },

    plotOptions: {
        spline: {
            marker: {
                enabled: true
            }
        }
    },

    series: [{
        data: graphData,
  
    }]
  });
}



Template.eventPage.onCreated(function() {

  var self = this;
  self.autorun(function() {
    var eventId = FlowRouter.getParam('id');
    self.subscribe('singleEvent', eventId, function() {
         var eventData = SportingEvents.findOne({})
         var timeTest = eventData.datetimeLocal.toUTCString()
        console.log(timeTest)
        var graphData = [[eventData.prices[0].priceTime.toUTCString(), eventData.prices[0].minPrice], [eventData.prices[1].priceTime.toUTCString(), eventData.prices[1].minPrice], [eventData.prices[2].priceTime.toUTCString(), eventData.prices[2].minPrice]]
        createHigh(graphData, timeTest)
    });  
  });

});



Template.eventPage.helpers({
	sportingEvent() {
		var eventData = SportingEvents.find({}).count()
		return eventData
	}
});
