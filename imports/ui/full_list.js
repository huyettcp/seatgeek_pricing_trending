import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';


import './team.html';
import './sportingEvent.html';
import './league.html';
import './league.js';

Template.fullList.onCreated(function() {
Session.set('leagueSelected', 'ALL')
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
		var leagueSelected = Session.get('leagueSelected')
		if (leagueSelected !== 'ALL') {
			return SportingEvents.find({league: leagueSelected}, {limit: 20})
		} else {
			return SportingEvents.find({}, {limit: 20})
		}
	},
	leagues() {
		return Leagues.find({})
	}
});

Template.fullList.events({
	'click .league_button': function() {
		Session.set('leagueSelected', this.league)
	}
});

