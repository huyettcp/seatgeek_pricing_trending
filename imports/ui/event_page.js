import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';

import './event_page.html';


Template.eventPage.onRendered(function() {

});


Template.eventPage.helpers({
	sportingEvent() {
		var event_id = FlowRouter.getParam("id");
		return SportingEvents.findOne({_id: event_id})
	}
});
