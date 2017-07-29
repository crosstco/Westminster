/*
 * Template to reset the password, in case a user forgets their login password.
 */

import {Accounts} from 'meteor/accounts-base'

Template.reset.events({
  "submit #reset-form": function (e) {
    e.preventDefault();
    var userEmail = $("#reset-email").val();
    Accounts.forgotPassword({email:userEmail},function(err) {
      if (err) {
        window.alert("Unregistered email.");
        return;
      } else {
        Router.go('login');
      }
    });
  }
});
