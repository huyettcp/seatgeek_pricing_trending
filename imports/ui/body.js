import { Template } from 'meteor/templating';
import { Teams } from '../api/teams.js';
import { SportingEvents } from '../api/sportingEvents.js';
import { Leagues } from '../api/leagues.js';
 
import './body.html';
import './layout.html';
import './team.html';
import './layout.js';

import './sportingEvent.html';
import './full_list.html'
 
Template.body.onCreated(function() {

});


Template.body.helpers({

});
