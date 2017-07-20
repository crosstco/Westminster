 /*
This file has the logic of the program details page. It prints the details of each program along with the links of activities and buttons to edit or favorite a program.
*/
const activityIds = new ReactiveVar();

Template.programDetails.onRendered(() => {
  Tracker.autorun(() => {
    if (this.activityIds) activityIds.set(this.activityIds);
  });
});

Template.programDetails.helpers({
  owner() {
    const user = Meteor.users.findOne({
      _id: this.userId,
    });
    return user && user.profile;
  },
  activities() {

	if (this.activityIds) {
		var temp =  Activities.find({_id: {$in: this.activityIds}});
	  var temp2 = [];
	  
	  for(var j = 0;j<this.activityIds.length;j++){
	  for(var i = 0;i<temp.fetch().length;i++){
		if(this.activityIds[j]== temp.fetch()[i]._id){
			temp2.push(temp.fetch()[i]);
			break;
		}
	  }
	  }
	  return temp2;
    }
	
  }
});

Template.programDetails.events({
  'click .favorite-icon': (e) => {
    $('.favorite-icon').toggleClass('favorited');

    const favorited = $('.favorite-icon').hasClass('favorited');
    Meteor.call('updateFavoriteProgram', data.get(), favorited, (error, result) => {
      if (error) return console.error(`Did not update favorites. Reason: ${error.reason}`);
      console.log(`Favorites: ${Meteor.user().profile.favoritePrograms}`);
    });
  }
});

function initIcons() {
  if (Meteor.user() && data.get()) {
    if (_.indexOf(Meteor.user().profile.favoritePrograms, data.get()._id) !== -1) {
      $('.favorite-icon').addClass('favorited');
    }
  }
}
