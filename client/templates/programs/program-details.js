const activityIds = new ReactiveVar();
const id = new ReactiveVar();


Template.programDetails.onRendered(() => {
  Tracker.autorun(() => {
    if (this.activityIds) activityIds.set(this.activityIds);

  });
  
  //initIcons();
});

Template.programDetails.helpers({
  owner() {
    const user = Meteor.users.findOne({
      _id: this.userId,
    });
	id.one=this._id;
    return user && user.profile;
  },
  activities() {
    return this.activityIds && Activities.find({
      _id: {
        $in: this.activityIds,
      },
    }) || [];
  }
});

Template.programDetails.events({
  'click .favorite-icon': (e) => {
    $('.favorite-icon').toggleClass('favorited');

    const favorited = $('.favorite-icon').hasClass('favorited');
    Meteor.call('updateFavoriteProgram', id.one, favorited, (error, result) => {
      if (error) return console.error(`Did not update favorites. Reason: ${error.reason}`);
      console.log(`Favorites: ${Meteor.user().profile.favoritePrograms}`);
    });
  }
});

function initIcons() {
  if (Meteor.user() && this.get()) {
    if (_.indexOf(Meteor.user().profile.favoritePrograms, this.get()._id) !== -1) {
      $('.favorite-icon').addClass('favorited');
    }
  }
}
