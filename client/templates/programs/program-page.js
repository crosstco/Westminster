/**************************************************************************************************************************************
    summer 2017 edit. The idea to deal with activity changes is to separate orignial activities and the new ones, since I don't how to 
    get the program object. If someday someone somehow figured out a way to retreive program object, try to merge the orignial activities
     with selecteActivies directly because that might be simpler. Cheers 
***************************************************************************************************************************************/
const activityIds = new ReactiveVar();
//selectedActivities is used to store newly selected Activities
var selectedActivities = new ReactiveVar();
//bin is used to store all the deleted activities. Seems like adundant, 
//but it's crucial for initialising the acts, which holds the orignial
//activities 
var bin = new ReactiveVar();
bin.set([]);
selectedActivities.set([]);
var acts = new ReactiveVar();
acts.set([]);

var bt = new ReactiveVar();
bt.set([]);
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
    //if acts hasn't initalised, which means there is nothing being deleted yet, initialise it
    if (acts.get().length == 0 && bin.get().length==0) {
         for (var i = 0;i < this.activityIds.length;i++) {	    
            var temp = acts.get();
	    acts.set(_.union(temp,this.activityIds[i]));
	 }
      
    
    }
  
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
     if (selectedActivities.get()) {
      
     // selectedActivities.set(all);
      return Activities.find({
        _id: {
           $in: selectedActivities.get()
        }
      });
    }
  }
})

Template.programPage.events({
   //called when submit 
   "submit form": function (e) {
    e.preventDefault();
    var tmp = selectedActivities.get();
    for(var i = 0; i < tmp.length;i++) {
	var oneAct = Activities.find(tmp[i]).fetch()[0];
	var brainList = oneAct.brainTargets;
	console.log(oneAct);
        for (var j = 0;j < brainList.length;j++) {
		var tem = bt.get();
		bt.set(_.union(tem,brainList[j]));
	}
    }
    var tmp = acts.get();
         for(var i = 0; i < tmp.length;i++) {
	     var oneAct = Activities.find(tmp[i]).fetch()[0];
	     var brainList = oneAct.brainTargets;
	     //console.log(oneAct);
              for (var j = 0;j < brainList.length;j++) {
		  var tem = bt.get();
		  bt.set(_.union(tem,brainList[j]));
	      }
         }
    var program = {
      _id: this._id,
      title: $("#program-submit-title").val(),
      description: $("#program-submit-description").val(),
      brainTargets: bt.get(),
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
    var tem = acts.get();
    $(e.target).toggleClass("selected");
    if ($(e.target).hasClass("selected")) {
      var index1 = tmp.indexOf(this._id);
      var index2 = tem.indexOf(this._id);
      if (index1 < 0 && index2 < 0) {
        selectedActivities.set(_.union(tmp, this._id));
      }
      else {
	 window.alert(Activities.find(this._id).fetch()[0].title+" has been added");
      }
    }
  },
        
  "click .activity-select-submit-btn": function (e) {
    e.preventDefault();
    Session.set("show-activity-select-modal", false);
  },
  "click .deleteActivity": function (e) {
   var tmp = selectedActivities.get();
   selectedActivities.set(_.difference(tmp,this._id));
  },
  "click .deleteOriActivity":function(e) {
   var tmp = acts.get();
   var tmp2 = bin.get();
   acts.set(_.difference(tmp,this._id));
   bin.set(_.union(tmp2,this._id));
  }
});

