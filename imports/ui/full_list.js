import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';


import './team.html';
import './sportingEvent.html';
import './league.html';
import './league.js';
import './team.js';

Template.fullList.onCreated(function() {
Session.set('leagueSelected', 'ALL')
Session.set('teamSelected', false)
var self = this;
self.autorun(function() {
self.subscribe('sportingEvents');  
self.subscribe('teams');
self.subscribe('leagues');
});

});


Template.fullList.helpers({
	teams() {
		var leagueSelected = Session.get('leagueSelected')
		if (leagueSelected !== 'ALL') {
			return Teams.find({league: leagueSelected})
		}
	},
	sportingEvents() {
		var leagueSelected = Session.get('leagueSelected')
		
		var teamSelected = Session.get('teamSelected')
		

		if (leagueSelected !== 'ALL' && teamSelected !== false) {
			return SportingEvents.find({league: leagueSelected, teams: {$in: [teamSelected]}})
		} else if (leagueSelected !== 'ALL' && teamSelected === false) {
			return SportingEvents.find({league: leagueSelected})
		} else {
			return SportingEvents.find({}, {limit: 20})
		}
	},
	leagues() {
		return Leagues.find({})
	},
	showTeamMenu() {
		var leagueSelected = Session.get('leagueSelected')
		if (leagueSelected !== 'ALL') {
			return true
		}
	}
});

Template.fullList.events({
	'click .league_button': function() {
		Session.set('leagueSelected', this.league)
		Session.set('teamSelected', false)
	},
	'click .team_button': function() {
		Session.set('teamSelected', this.teamName)
	}
});

