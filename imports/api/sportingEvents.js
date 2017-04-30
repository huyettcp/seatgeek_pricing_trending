import { Mongo } from 'meteor/mongo';

export const SportingEvents = new Mongo.Collection('sportingEvents');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('sportingEvents', function sportingEventsPublication(eventLimit, league) {
  	if (league === 'ALL') {
		return SportingEvents.find({ priceCount: { $gte: 2 }}, {sort: {visibleUntilUtc: 1}, limit: eventLimit})
	} else {
		return SportingEvents.find({ priceCount: { $gte: 2 }, league: league}, {sort: {visibleUntilUtc: 1}, limit: eventLimit})
	}
  });
  Meteor.publish('singleEvent', function(id) {
	return SportingEvents.find(id)
});

}
