import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';


import './team.html';
import './sportingEvent.html';

Template.fullList.onCreated(function() {

var self = this;
self.autorun(function() {
self.subscribe('sportingEvents');  
self.subscribe('teams');
self.subscribe('leagues');
});

});


Template.fullList.helpers({
	teams() {
		return Teams.find({})
	},
	sportingEvents() {
		return SportingEvents.find({})
	}
});
