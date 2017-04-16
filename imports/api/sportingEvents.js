import { Mongo } from 'meteor/mongo';

export const SportingEvents = new Mongo.Collection('sportingEvents');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('sportingEvents', function sportingEventsPublication() {
    var now = new Date()
	return SportingEvents.find({ priceCount: { $gte: 2 }, visibleUntilUtc: {$gte: now}}, {sort: {visibleUntilUtc: 1}})
  });
  Meteor.publish('singleEvent', function(id) {
	return SportingEvents.find(id)
});

}