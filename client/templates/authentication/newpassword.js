Template.newpassword.events({
	"submit #newpassword-form": function (e) {
		e.preventDefault();


  
    Meteor.methods({
    newpassword: function (user) {
    var userEmail = $("newpassword-email").val();  
    var newpassword = $("newpassword-password").val();
    







}

		Accounts.createUser({
			email: $(e.target).find("#register-email").val(),
			password: $(e.target).find("#register-password").val(),
			profile: {
				fullName: $(e.target).find("#register-full-name").val(),
				community: $(e.target).find("#register-community").val(),
				favoriteActivities: [],
				favoritePrograms: [],
			}
		}, function (error) {
			if (error) {
				alert("There was an error creating your account. Please try again later.");
			} else {
				Router.go("welcome");
			}
		});
	}
});

