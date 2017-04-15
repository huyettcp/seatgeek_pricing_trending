import Highcharts from 'highcharts';
import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';

import './event_page.html';

function createHigh(avgData, minData, maxData ) {
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
        name: "Average Price",
        data: avgData
  
    }, {
        name: "Minimum Price",
        data: minData
    }, {
        name: "Maximum Price",
        data: maxData
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

        var avgData = []
        var minData = []
        var maxData = []

        var counter = eventData.priceCount
        for(var i=0;i<counter;i++){
            var avgPrice = eventData.prices[i].avgPrice
            var minPrice = eventData.prices[i].minPrice
            var maxPrice = eventData.prices[i].maxPrice
            var priceTime = eventData.prices[i].priceTime
            avgData.push([eventData.prices[i].priceTime.toUTCString(), avgPrice])
            minData.push([eventData.prices[i].priceTime.toUTCString(), minPrice])
            maxData.push([eventData.prices[i].priceTime.toUTCString(), maxPrice])
            
        }

        console.log(avgData, minData, maxData)
        createHigh(avgData, minData, maxData)
    });  
  });

});



Template.eventPage.helpers({
	sportingEvent() {
		var eventData = SportingEvents.find({}).count()
		return eventData
	}
});
