const activityIds = new ReactiveVar();
var selectedActivities = new ReactiveVar();
var bin = new ReactiveVar();
bin.set([]);
selectedActivities.set([]);
var acts = new ReactiveVar();
acts.set([]);
//window.location.reload(true);
//acts.push(activityIds);
//selectedActivities.set(acts);
//console.log(this);

Template.programPage.onRendered(() => {
  Tracker.autorun(() => {
    if (this.data) data.set(this.data);    
  });
  
});

Template.programPage.helpers({
  owner() {
    const user = Meteor.users.findOne({
      _id: this.userId,
      
    });
    return user && user.profile;
  },
  originalActivities() {
    if (acts.get().length == 0 && bin.get().length==0) {
         for (var i = 0;i < this.activityIds.length;i++) {	    
            var temp = acts.get();
	    acts.set(_.union(temp,this.activityIds[i]));
	 }
      
    }
    console.log(this.activityIds);
    console.log(acts.get());
    return this.activityIds && Activities.find({
      _id: {
        $in: acts.get(),
      },
      
    }) || [];
  },
    // Appropriately sets brain targets to checked/unchecked
  attentionChecked: function () {
    return this.brainTargets.indexOf("Attention") >= 0;
  },
  languageChecked: function () {
    return this.brainTargets.indexOf("Language") >= 0;
  },
  visualspatialChecked: function () {
    return this.brainTargets.indexOf("Visual-Spatial") >= 0;
  },
  sensoryChecked: function () {
    return this.brainTargets.indexOf("Sensory") >= 0;
  },
  planningChecked: function () {
    return this.brainTargets.indexOf("Planning/Judgement") >= 0;
  },
  computationChecked: function () {
    return this.brainTargets.indexOf("Computation") >= 0;
  },
  workingChecked: function () {
    return this.brainTargets.indexOf("Working Memory") >= 0;
  },
  longtermChecked: function () {
    return this.brainTargets.indexOf("Long Term Memory") >= 0;
  },
  emotionalChecked: function () {
    return this.brainTargets.indexOf("Emotional Memory") >= 0;
  },
    /* Acitivity Select Modal */
  showActivities: function () {
    return Session.get("show-activity-select-modal");
  },
  uploadActivities: function () {
    return false;
  },
  allActivities: function () {
    return Activities.find();
  },
  selectedActivities: function () {
     //acts = selectedActivities.get().concat(this.activityIds);
     if (selectedActivities.get()) {
      
     // selectedActivities.set(all);
      return Activities.find({
        _id: {
           $in: selectedActivities.get()
	  //$in:acts
        }
      });
    }
  }
})

Template.programPage.events({
   "submit form": function (e) {
    e.preventDefault();
    var filterObject = {
    "Attention": $("#Attention-filter").is(':checked'),
    "Language": $("#Language-filter").is(':checked'),
    "Visual-Spatial": $("#VisualSpatial-filter").is(':checked'),
    "Sensory": $("#Sensory-filter").is(':checked'),
    "Planning/Judgement": $("#Planning-filter").is(':checked'),
    "Computation": $("#Computation-filter").is(':checked'),
    "Working Memory": $("#Working-filter").is(':checked'),
    "Long Term Memory": $("#Longterm-filter").is(':checked'),
    "Emotional Memory": $("#Emotional-filter").is(':checked'),
    };
    
    var filterList = [];
    for (filter in filterObject) {
      if (filterObject[filter])
        filterList.push(filter);
    }

    var program = {
      _id: this._id,
      title: $("#program-submit-title").val(),
      description: $("#program-submit-description").val(),
      brainTargets: filterList,
      activityIds: acts.get().concat(selectedActivities.get()),
      tags: $("#program-submit-tags").val().replace(/\s+/g, "").split(","),
      tutorialLink: $("#program-submit-tutorial-link").val(),
      userId: this.userId
    };

    console.log(program);

    Meteor.call("updateProgram", program, function (error, result) {
      if (error)
        return console.log("Could not update program.");
      Router.go("programDetails", { _id: result._id });
      
    });
  },
  "click .delete-btn": function (e) {
    e.preventDefault();

    Meteor.call("deleteProgram", this._id, this.userId, function (error, result) {
      if (error)
        return console.log("Could not remove program.");
      Router.go("programList");
    });
  },
  "click .add-activities-btn": function (e) {
    e.preventDefault();
    Session.set("show-activity-select-modal", true);
  },
  "click .activity-select-cancel-btn": function (e) {
    e.preventDefault();
    Session.set("show-activity-select-modal", false);
  },
  "click .activity-select-modal-item": function (e) {
    e.preventDefault();
    if (!selectedActivities.get()) {
	selectedActivities.set(program.activityIds);
    }
    var tmp = selectedActivities.get();
    $(e.target).toggleClass("selected");

    if ($(e.target).hasClass("selected"))
      selectedActivities.set(_.union(tmp, this._id));
    else
      selectedActivities.set(_.difference(tmp, this._id));
  },
  "click .activity-select-submit-btn": function (e) {
    e.preventDefault();
    Session.set("show-activity-select-modal", false);
  },
  "click .deleteActivity": function (e) {
   var tmp = selectedActivities.get();
   selectedActivities.set(_.difference(tmp,this._id));
   
   //var index = acts.indexOf(this._id);
   //acts.splice(index,1);
  },
  "click .deleteOriActivity":function(e) {
   var tmp = acts.get();
   var tmp2 = bin.get();
   acts.set(_.difference(tmp,this._id));
   bin.set(_.union(tmp2,this._id));
  }
});

