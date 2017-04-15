import { Mongo } from 'meteor/mongo';

export const SportingEvents = new Mongo.Collection('sportingEvents');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('sportingEvents', function sportingEventsPublication() {
    return SportingEvents.find();
  });
}