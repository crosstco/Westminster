Template.reset.events({
	"submit #reset-form": function (e) {
		e.preventDefault();
		var userEmail = $("reset-email").val();
		if (userEmail === "") {
			// Tell user to enter.
		} else {
			// Check if user email is registered.
			// If Yes, then reset.
			// If No, then show alert saying email not in database.
		}
	}
})