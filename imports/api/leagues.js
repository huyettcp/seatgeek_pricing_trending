import { Mongo } from 'meteor/mongo';

export const Leagues = new Mongo.Collection('leagues');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('leagues', function leaguesPublication() {
    return Leagues.find();
  });
}