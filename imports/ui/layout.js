import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';
 
import './body.html';
import './layout.html';
import './full_list.html';
import './full_list.js';
import './event_page.html';
import './event_page.js';
 

Template.layout.helpers({
	teams() {
		return Teams.find({})
	},
	sportingEvents() {
		return SportingEvents.find({})
	}
});
