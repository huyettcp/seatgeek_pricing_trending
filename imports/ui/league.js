import './league.html';
import './full_list.html';

Template.league.helpers({
	activeLeague() {
		var activeLeague = Session.get('leagueSelected')
		var leagueName = this.league
		if (activeLeague === leagueName) {
			return "active" 
		}
	}
});
