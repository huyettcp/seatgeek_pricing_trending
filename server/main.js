import {Teams} from '../imports/api/teams.js';
import {SportingEvents} from '../imports/api/sportingEvents.js';
import {Leagues} from '../imports/api/leagues.js';
import { Match } from 'meteor/check'

var updateSchedule = later.parse.text('every 30 minutes');
var priceUpdater = new ScheduledTask(updateSchedule, updatePrices);

function updatePrices (argument) {
	var result = HTTP.get('https://api.seatgeek.com/2/events?taxonomies.name=sports&per_page=3000&client_id=Mjc0MzYwNHwxNDU1OTg0MTEz')
	var numberOfEvents = result.data.meta.per_page

	for (counter=0; counter<numberOfEvents; counter++) {
		var seatGeekId = result.data.events[counter].id
		var sportingEvent = SportingEvents.findOne({seatGeekId: seatGeekId});

		if (sportingEvent) {
			var avgPrice = result.data.events[counter].stats.average_price
			var minPrice = result.data.events[counter].stats.lowest_price
			var maxPrice = result.data.events[counter].stats.highest_price
			var avgIsNumber = Match.test(avgPrice, Number)
			var minIsNumber = Match.test(minPrice, Number)
			var maxIsNumber = Match.test(maxPrice, Number)

			if (avgIsNumber && minIsNumber && maxIsNumber) {
				SportingEvents.update(sportingEvent._id, {
						$set: {
							avgPrice: avgPrice,
							minPrice: minPrice,
							maxPrice: maxPrice

						},
	      				$push: { 
	      					prices: { 
	      						$each: [{ "priceTime":  new Date(), "avgPrice": avgPrice, "minPrice": minPrice, "maxPrice": maxPrice}]}
	      				},
	      				$inc: {
	      					priceCount: 1
	      				}

				})
			} else {
				console.log("deleting")
				console.log("sportingEvent._id")
				SportingEvents.remove(sportingEvent._id)
			}
		} else {

			var listingCount = result.data.events[counter].stats.listing_count
			var avgPrice = result.data.events[counter].stats.average_price
			var minPrice = result.data.events[counter].stats.lowest_price
			var maxPrice = result.data.events[counter].stats.highest_price
			var league = (result.data.events[counter].type).toUpperCase()
			var title = result.data.events[counter].title
			var shortTitle = result.data.events[counter].short_title
			var venue = result.data.events[counter].venue.name
			var venueId = result.data.events[counter].venue.id
			var city = result.data.events[counter].venue.city
			var state = result.data.events[counter].venue.state
			var lat = result.data.events[counter].venue.location.lat
			var lon = result.data.events[counter].venue.location.lon
			var homeTeam = result.data.events[counter].performers[0]
			var awayTeam = result.data.events[counter].performers[1]
			var announceDate = result.data.events[counter].announce_date
			var datetimeLocal = result.data.events[counter].datetime_local
			var visibleUntilUtc = result.data.events[counter].visible_until_utc
			var trackingStartTime = new Date()
			var prices = {"priceTime": trackingStartTime, "avgPrice": avgPrice, "minPrice": minPrice, "maxPrice": maxPrice}
			var visibleUntil = new Date(visibleUntilUtc)
			var datetimeLocal = new Date(datetimeLocal)
			var url = result.data.events[counter].url
			var venueUrl = result.data.events[counter].venue.url
			var avgIsNumber = Match.test(avgPrice, Number)
			var minIsNumber = Match.test(minPrice, Number)
			var maxIsNumber = Match.test(maxPrice, Number)

			if (homeTeam != null && (league === "NBA" || league === "NHL" || league === "MLB")) {
			var homeTeam = homeTeam.name
			if (Teams.find({teamName: homeTeam}).count() === 0) {
				Teams.insert({
					teamName: homeTeam,
					league: league
				})
			}
			} else {
				homeTeam = "N/A"
			}

			if (awayTeam != null) {
				var awayTeam = awayTeam.name
			} else {
				awayTeam = "N/A"
			}

			if (avgIsNumber && minIsNumber && maxIsNumber  && homeTeam != null && awayTeam != null && (league === "NBA" || league === "NHL" || league === "MLB")) {
				console.log("adding" + seatGeekId)
			SportingEvents.insert({
	
				seatGeekId: seatGeekId,
				listingCount: listingCount,
				avgPrice: avgPrice,
				minPrice: minPrice,
				maxPrice: maxPrice,
				league: league,
				title: title,
				shortTitle: shortTitle,
				venue: venue,
				venueId: venueId,
				city: city,
				state: state,
				lat: lat,
				lon: lon, 
				announceDate: announceDate,
				datetimeLocal: datetimeLocal,
				visibleUntilUtc: visibleUntil,
				trackingStartTime: trackingStartTime,
				prices: [prices],
				priceCount: 1,
				teams: [awayTeam, homeTeam],
				url: url,
				venueUrl: venueUrl

			});
			}
			
			
		}
 	}
}


priceUpdater.start();

if (Leagues.find().count() === 0) {

	Leagues.insert({
		league: 'ALL'
	})
	
	Leagues.insert({
		league: 'MLB'

	})

	Leagues.insert({
		league: 'NBA'

	})

	Leagues.insert({
		league: 'NHL'
	})
}

var newLeague = Leagues.find({league: "MLB"}).count()

if (newLeague == false) {
	Leagues.insert({
		league: 'MLB'
	})
}



if (SportingEvents.find({}).count() === 0) {

	var result = HTTP.get('https://api.seatgeek.com/2/events?taxonomies.name=sports&per_page=500&client_id=Mjc0MzYwNHwxNDU1OTg0MTEz')
	var numberOfEvents = result.data.meta.per_page


	for (counter=0; counter<numberOfEvents; counter++) {
		var seatGeekId = result.data.events[counter].id
		var listingCount = result.data.events[counter].stats.listing_count
		var avgPrice = result.data.events[counter].stats.average_price
		var minPrice = result.data.events[counter].stats.lowest_price
		var maxPrice = result.data.events[counter].stats.highest_price
		var league = (result.data.events[counter].type).toUpperCase()
		var title = result.data.events[counter].title
		var shortTitle = result.data.events[counter].short_title
		var venue = result.data.events[counter].venue.name
		var venueId = result.data.events[counter].venue.id
		var city = result.data.events[counter].venue.city
		var state = result.data.events[counter].venue.state
		var lat = result.data.events[counter].venue.location.lat
		var lon = result.data.events[counter].venue.location.lon
		var homeTeam = result.data.events[counter].performers[0]
		var awayTeam = result.data.events[counter].performers[1]
		var announceDate = result.data.events[counter].announce_date
		var datetimeLocal = result.data.events[counter].datetime_local
		var visibleUntilUtc = result.data.events[counter].visible_until_utc
		var trackingStartTime = new Date()
		var prices = {"priceTime": trackingStartTime, "avgPrice": avgPrice, "minPrice": minPrice, "maxPrice": maxPrice}
		var visibleUntil = new Date(visibleUntilUtc)
		var datetimeLocal = new Date(datetimeLocal)
		var url = result.data.events[counter].url
		var venueUrl = result.data.events[counter].venue.url


		if (homeTeam != null && (league === "NBA" || league === "NHL" || league === "MLB")) {
			var homeTeam = homeTeam.name
			if (Teams.find({teamName: homeTeam}).count() === 0) {
				Teams.insert({
					teamName: homeTeam,
					league: league
				})
			}
		} else {
			homeTeam = "N/A"
		}

		if (awayTeam != null) {
			var awayTeam = awayTeam.name
		} else {
			homeTeam = "N/A"
		}



		if (isNaN(parseInt(avgPrice)) === false && homeTeam != null && awayTeam != null && (league === "NBA" || league === "NHL" || league === "MLB")) {
			SportingEvents.insert({
				seatGeekId: seatGeekId,
				listingCount: listingCount,
				avgPrice: avgPrice,
				minPrice: minPrice,
				maxPrice: maxPrice,
				league: league,
				title: title,
				shortTitle: shortTitle,
				venue: venue,
				venueId: venueId,
				city: city,
				state: state,
				lat: lat,
				lon: lon, 
				announceDate: announceDate,
				datetimeLocal: datetimeLocal,
				visibleUntilUtc: visibleUntil,
				trackingStartTime: trackingStartTime,
				prices: [prices],
				priceCount: 1,
				teams: [awayTeam, homeTeam],
				url: url,
				venueUrl: venueUrl
			});


		}



}
}