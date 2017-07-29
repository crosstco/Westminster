import {Accounts} from 'meteor/accounts-base'


Template.reset.events({
  "submit #reset-form": function (e) {
    e.preventDefault();
    var userEmail = $("#reset-email").val();
    
  		
  Accounts.forgotPassword({email:userEmail},function(err){
        if (err) {
          window.alert("Email doesn't exist. Please check your typing.");
          //console.log('Error: ',err);
          return;

        }
        else {
          console.log('Email sent');
          Router.go('login');

        }
      });
    }}); 


  
