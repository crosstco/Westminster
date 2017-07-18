Template.reset.events({
	"submit #reset-form": function (e) {
		e.preventDefault();
		var userEmail = $("reset-email").val();
		if (userEmail === "") {
			// Tell user to enter.
			window.alert("Please provide your email address");}
		    else {
			// Check if user email is registered.
			// If Yes, then reset. Send the user an email to reset password
			if(userEmail == Meteor.users.findOne({"emails.0.address": userEmail}))
			{
				Accounts.emailTemplates.siteName = 'Westminster brain bootcamps';
				Accounts.emailTemplates.from = '<brainbootcamps@gmail.com>';
				Accounts.emailTemplates.enrollAccount.subject = (user) => {
                return `Welcome to Westminster Brainboot Camps, ${user.profile.name}`;
                };
                Accounts.emailTemplates.enrollAccount.text = (user, url) => {
                return 'Forgot your password? Let us help you to find it!'
                + ' To activate your account, simply click the link below:\n\n'
                + url
       
                Accounts.emailTemplates.resetPassword.from = () => {
                // Overrides the value set in `Accounts.emailTemplates.from` when resetting
                // passwords.
                return 'Westminster Password Reset <accounts@westminster.com>';
                };
                Accounts.emailTemplates.verifyEmail = {
                subject() {
                return "Activate your account now!";
                },
                text(user, url) {
                return `Hey ${user}! Verify your e-mail by following this link: ${url}`;
                }
};


			}
			// If No, then show alert saying email not in database.
		}
	}
}})