 /*
This file has the logic of the program favorites page. It simply gives the HTML file the favorite programs of the current user to show it to the user.
*/
Template.programFavorites.helpers({
  programs() {
    return Meteor.user() && Programs.find({
      _id: {
        $in: Meteor.user().profile.favoritePrograms,
      },
    });
  },
});
