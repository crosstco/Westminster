//Template.reset.events({
	//"click .submit-btn": function (e) {
		//e.preventDefault();
 // var userId = Meteor.users.findOne({'emails.address':email});
  //var userEmail = Template.find('#reset-email').value;
  //console.log(userEmail);
 // Accounts.sendResetPasswordEmail(
   // userId,
    
//)
//});






//   Accounts.sendResetPasswordEmail = function (userId, email) {
//   // Make sure the user exists, and email is one of their addresses.
//   var user = Meteor.users.findOne(userId);
//   if (!user) {
//     handleError("Can't find user");
//   }

//   // pick the first email if we weren't passed an email.
//   if (!email && user.emails && user.emails[0]) {
//     email = user.emails[0].address;
//   }

//   // make sure we have a valid email
//   if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email)) {
//     handleError("No such email for user.");
//   }

//   var token = Random.secret();
//   var when = new Date();
//   var tokenRecord = {
//     token: token,
//     email: email,
//     when: when,
//     reason: 'reset'
//   };
//   Meteor.users.update(userId, {$set: {
//     "services.password.reset": tokenRecord
//   }});
  
//   // before passing to template, update user object with new token
//   Meteor._ensure(user, 'services', 'password').reset = tokenRecord;

//   var resetPasswordUrl = Accounts.urls.resetPassword(token);

//   var options = {
//     to: email,
//     from: Accounts.emailTemplates.resetPassword.from
//       ? Accounts.emailTemplates.resetPassword.from(user)
//       : Accounts.emailTemplates.from,
//     subject: Accounts.emailTemplates.resetPassword.subject(user)
//   };

//   if (typeof Accounts.emailTemplates.resetPassword.text === 'function') {
//     options.text =
//       Accounts.emailTemplates.resetPassword.text(user, resetPasswordUrl);
//   }

//   if (typeof Accounts.emailTemplates.resetPassword.html === 'function') {
//     options.html =
//       Accounts.emailTemplates.resetPassword.html(user, resetPasswordUrl);
//   }

//   if (typeof Accounts.emailTemplates.headers === 'object') {
//     options.headers = Accounts.emailTemplates.headers;
//   }

//   Email.send(options);
// };

		
//}})