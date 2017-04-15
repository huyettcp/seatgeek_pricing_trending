FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("layout", {content: "fullList"});
  }
});

FlowRouter.route('/event/:id', {
	name: 'eventPage',
	action: function() {
	BlazeLayout.render("layout", { content: "eventPage"});
	}
});