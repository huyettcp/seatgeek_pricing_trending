import Highcharts from 'highcharts';
import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';

import './event_page.html';

function createHigh(avgData, minData, maxData, title, venue) {
  $('#container').highcharts({
 
    chart: {
        type: 'spline'
    },
    title: {
        text: ""
    },
    // subtitle: {
    //     text: "Click "
    // },
  xAxis: {
  type: 'datetime',
   dateTimeLabelFormats: {
           day: '%b %d',
           hour: '%I:%M %P'    //ex- 01 Jan 2016
        }

    },
    yAxis: {
        title: {
            text: 'Cost ($)'
        },
        min: 0
    },

    plotOptions: {
        spline: {
            marker: {
                enabled: false
            }
        }
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x: %b %d, %I:%M %P}: ${point.y:.2f}'
    },
          legend: {
            align: 'left',
            verticalAlign: 'top',
        
        },


    series: [
    {
        name: "Maximum Price",
        data: maxData,
        color: "#2185d0",
        visible: false

    }, 
    {
        name: "Average Price",
        data: avgData,
        color: "#21ba45"
  
    }, {
        name: "Minimum Price",
        data: minData,
        color: "#f2711c"
    }, 


    ]
  });
}



Template.eventPage.onCreated(function() {

  var self = this;
  self.autorun(function() {
    var eventId = FlowRouter.getParam('id');

    self.subscribe('singleEvent', eventId, function() {

        var eventData = SportingEvents.findOne({})
     console.log(eventData.visibleUntilUtc)
        var title = eventData.title
        var venue = eventData.venue
        
        var avgData = []
        var minData = []
        var maxData = []

        var counter = eventData.priceCount
        for(var i=0;i<counter;i++){
            var avgPrice = eventData.prices[i].avgPrice
            var minPrice = eventData.prices[i].minPrice
            var maxPrice = eventData.prices[i].maxPrice
            var priceTime = eventData.prices[i].priceTime
            var priceTimeToUTC = Date.parse(priceTime);
            avgData.push([priceTimeToUTC, avgPrice])
            minData.push([priceTimeToUTC, minPrice])
            maxData.push([priceTimeToUTC, maxPrice])

        }

        createHigh(avgData, minData, maxData, title, venue)
    });  
  });

});



Template.eventPage.helpers({
	sportingEvent() {
		var sportingEvent = SportingEvents.findOne({})
		return sportingEvent
	}
});
