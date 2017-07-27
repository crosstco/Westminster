Meteor.startup(function () {

  process.env.MAIL_URL="smtps://brainbootcamps1%40gmail.com:lrhlrh90@smtp.gmail.com:465/"; 

  Accounts.emailTemplates.siteName = Meteor.settings.siteName;
  Accounts.emailTemplates.from = Meteor.settings.emailFrom;
});

// Welcome and Email Verification

Accounts.emailTemplates.verifyEmail.subject = function(user) {
  return 'Welcome to Funkytown.io :-)';
};
Accounts.emailTemplates.verifyEmail.html = function (user, url) {
  // return html string
  return Handlebars.templates.verifyEmail_html({
    emailAddress: user.email(),
    url: url,
  });
};
Accounts.emailTemplates.verifyEmail.text = function (user, url) {
  // return text string
  return Handlebars.templates.verifyEmail_text({
    emailAddress: user.email(),
    url: url,
  });
};