import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';

import './event_page.html';


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
	this.autorun(() => {
    var testee = SportingEvents.findOne({})
    console.log(testee)
  });
  //   this.autorun(function () {  
  //   	var eventId = FlowRouter.getParam("id");
		// var eventData = SportingEvents.find({}).count()
		// console.log(eventData)

// })
}


Template.eventPage.helpers({
	sportingEvent() {
		var eventData = SportingEvents.find({}).count()
		return eventData
	}
});
