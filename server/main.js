import {Teams} from '../imports/api/teams.js';
import {SportingEvents} from '../imports/api/sportingEvents.js';
import {Leagues} from '../imports/api/leagues.js';

var updateSchedule = later.parse.text('every 15 minutes');
var priceUpdater = new ScheduledTask(updateSchedule, updatePrices);



function updatePrices (argument) {
	var priceTime = new Date()
	var sportingEvents = SportingEvents.find({visibleUntilUtc: {$gte: priceTime}}).fetch()

	var oldSportingEvents = SportingEvents.find({visibleUntilUtc: {$lte: priceTime}}).fetch()

	oldSportingEvents.forEach(function(oldSportingEvent){
		SportingEvents.remove(oldSportingEvent._id)

	})


  	sportingEvents.forEach(function(sportingEvent){
  	var seatGeekId = sportingEvent.seatGeekId
  	
  	HTTP.call( 'GET', 'http://api.seatgeek.com/2/events/' + seatGeekId +'?client_id=Mjc0MzYwNHwxNDU1OTg0MTEz', {}, function( error, response ) {
  		if ( error ) {
    		SportingEvents.remove(sportingEvent._id)
  		} else {
    		var avgPrice = response.data.stats.average_price
			var minPrice = response.data.stats.lowest_price
			var maxPrice = response.data.stats.highest_price
			if (isNaN(parseInt(avgPrice)) === false) {
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
				SportingEvents.remove(sportingEvent._id)
			}

			}
		});

  	})
}

priceUpdater.start();

var insertEventSchedule = later.parse.text('every 2 hours');
var eventUpdater = new ScheduledTask(insertEventSchedule, insertEvents)

function insertEvents (argument) {
	var result = HTTP.get('https://api.seatgeek.com/2/events?taxonomies.name=sports&per_page=2000&client_id=Mjc0MzYwNHwxNDU1OTg0MTEz')
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

		var exists = SportingEvents.findOne({seatGeekId: seatGeekId})

		if (isNaN(parseInt(avgPrice)) === false && homeTeam != null && awayTeam != null && (league === "NBA" || league === "NHL" || league === "MLB") && !exists) {
			SportingEvents.insert({
				avgPrice: avgPrice,
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

eventUpdater.start();



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

	var result = HTTP.get('https://api.seatgeek.com/2/events?taxonomies.name=sports&per_page=2000&client_id=Mjc0MzYwNHwxNDU1OTg0MTEz')
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
				avgPrice: avgPrice,
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