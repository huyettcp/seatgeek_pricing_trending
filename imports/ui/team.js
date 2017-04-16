import './full_list.html';

Template.team.helpers({
	activeTeam() {
		var activeTeam = Session.get('teamSelected')
		var teamName = this.teamName
		if (activeTeam === teamName) {
			return "active" 
		}
	}
});