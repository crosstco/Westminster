Accounts.config
  sendVerificationEmail: true
  forbidClientAccountCreation: false

Accounts.emailTemplates.siteName = "blabla.com"
Accounts.emailTemplates.from = "blabla.com site Admin <admin@blabla.com>"

Accounts.emailTemplates.verifyEmail.subject = (user) ->
  "Confirm registration on " + Accounts.emailTemplates.siteName;

Accounts.emailTemplates.verifyEmail.text = (user, url) ->
   "To confirm your registration, please, click this link " + url 
