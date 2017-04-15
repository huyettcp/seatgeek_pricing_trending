import { Mongo } from 'meteor/mongo';

export const Teams = new Mongo.Collection('teams');


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('teams', function teamsPublication() {
    return Teams.find();
  });
}