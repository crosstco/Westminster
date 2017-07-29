Meteor.startup(function () {

  process.env.MAIL_URL="smtps://brainbootcamps1%40gmail.com:lrhlrh90@smtp.gmail.com:465/";

  Accounts.emailTemplates.siteName = Meteor.settings.siteName;
  Accounts.emailTemplates.from = Meteor.settings.emailFrom;
  Accounts.emailTemplates.resetPassword.subject = function (user) {
    return "Westminster Portal - Password Reset";
  };
});
