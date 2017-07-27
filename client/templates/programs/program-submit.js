 /*
This file has the logic of the program submission page. It validates the inputs user gives, and submits the valid input to the DataBase.
*/
var currentFiles = new ReactiveVar();
var selectedActivities = new ReactiveVar();
var temSelect = new ReactiveVar();
temSelect.set([]);

Template.programSubmit.onRendered(function () {
  Session.set("program-docs", []);
  Session.set("current-doc-names", []);
  currentFiles.set([]);

  selectedActivities.set([]);

  Session.set("show-activity-select-modal", false);
});

Template.programSubmit.events({
  "submit form": function (e) {
    e.preventDefault();

    var program = {
      title: $("#program-submit-title").val(),
      description: $("#program-submit-description").val(),
      activityIds: selectedActivities.get(),
      tags: $("#program-submit-tags").val().replace(/\s+/g, "").split(","),
      tutorialLink: $("#program-submit-tutorial-link").val()
    };
    var code = validateProgram(program);    
    if(code === 0) {
      /*If the program's frontend validation is true, then move on to specific restriction validation*/
      if($("#program-submit-tutorial-link").val() != "") {
        var errorCount = backendValidateProgram(program);
        if (errorCount === 1) {
          return (tutLinkErrorFunc());
        }
        else {
        }
      }
    }

    else if (code === -5) {
      window.alert("Name already exists. Please rename the program");
      return;
    }
    else if (code === -2) {
       window.alert("Please fill out the program title");
       return;
    }
    else if (code === -3) {
       window.alert("Please fill out the program description");
       return;
    }
    else if (code === -4) {
       window.alert("Please fill out the program tags");
       return;
    }
	else if (code === -1) {
       window.alert("Please choose at least one activity");
       return;
    }

    
    Meteor.call("insertProgram", program, function (error, result) {
      if (error)
        return console.log("Could not insert Program. Reason: " + error.reason);
      Session.set("program-docs", []);
      Router.go("programDetails", { _id: result._id });
    });
  }, "click .upload-btn": function (e) {
    e.preventDefault();

    /*var file = $("#file").get(0).files[0];
    var fileObj = programDocs.insert(file);
    var sessionProgramDocs = Session.get("program-docs");
    var sessionDocNames = Session.get("current-doc-names");
    sessionProgramDocs.push(fileObj);
    sessionDocNames.push(fileObj.name());
    Session.set("program-docs", sessionProgramDocs);
    Session.set("current-doc-names", sessionDocNames);*/
  },
  /* Activity Select Modal */
  "click .add-activities-btn": function (e) {
    e.preventDefault();
	temSelect.set(selectedActivities.get());
    Session.set("show-activity-select-modal", true);
  },
  "click .activity-select-cancel-btn": function (e) {
    e.preventDefault();
    Session.set("show-activity-select-modal", false);
  },
  "click .activity-select-modal-item": function (e) {
    e.preventDefault();
    var tmp = temSelect.get();
    $(e.target).toggleClass("selected");

    if ($(e.target).hasClass("selected")){
      temSelect.set(_.union(tmp, this._id));
	}
    else{
      temSelect.set(_.difference(tmp, this._id));
	}
	
  },
   "click .deleteActivity": function (e) {
   var tmp = selectedActivities.get();
   selectedActivities.set(_.difference(tmp,this._id));
   
   //var index = acts.indexOf(this._id);
   //acts.splice(index,1);
  },
  "click .activity-select-submit-btn": function (e) {
    e.preventDefault();
	
	selectedActivities.set(temSelect.get());
	
    Session.set("show-activity-select-modal", false);
  }
});


Template.programSubmit.helpers({
  fileNames: function () {
    var currentFilesReactive = Session.get("current-doc-names");
    if (sessionDocNames)
      return sessionDocNames;
  },
  /* Acitivity Select Modal */
  showActivities: function () {
    return Session.get("show-activity-select-modal");
  },
  uploadActivities: function () {
    return false;
  },
  activities: function () {
    return Activities.find();
  },
  selectedActivities: function () {
    if (selectedActivities.get()) {
      var temp =  Activities.find({_id: {$in: selectedActivities.get()}});
	  var temp2 = [];
	  
	  for(var j = 0;j<selectedActivities.get().length;j++){
	  for(var i = 0;i<temp.fetch().length;i++){
		if(selectedActivities.get()[j]== temp.fetch()[i]._id){
			temp2.push(temp.fetch()[i]);
			break;
		}
	  }
	  }
	  return temp2;
    }
  }
})


var validateProgram = function(program) {

  var duplicated = Programs.find({title: program.title}).count();
      if(duplicated != 0){
      return -5;
    }
    else if (program.title === ""){
    return -2;
  } else if (program.description == "") {
    return -3;	  
  }else if (program.tags=== "") {
    return -4;
  } else if (program.activityIds.length<=0){
	  return -1;
  }
  
    return 0;
}

var tutLinkErrorFunc = function(program) {
  if ($("#tutLinkErrorPopUp").length) {
  } else {
    var tag = document.createElement("p");
    var text = document.createTextNode("Tutorial Link is not a valid URL, please check and resubmit.");
    tag.appendChild(text);
    var element = document.getElementById("tutLinkError");
    element.appendChild(tag);
    document.getElementById("tutLinkError").id = "tutLinkErrorPopUp";
  }
}

var submitError = function(program) {
  if ($("#submitErrorPopUp").length) {
    /* Do nothing*/
  } else {
  var tag = document.createElement("p");
  var text = document.createTextNode("One or more fields have invalid data, please check and resubmit.");
  tag.appendChild(text);
  var element = document.getElementById("submitError");
  element.appendChild(tag);
  document.getElementById("submitError").id = "submitErrorPopUp";
  }
}

var backendValidateProgram = function(program) {
  var errorCount = 0;
  var normalURL = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/)
  var evaluateTutURL = document.getElementById("program-submit-tutorial-link").value;
  if(normalURL.test(evaluateTutURL) == false) {
    errorCount += 1;
  }
  /* If errorCount = 1, only Tutorial link error
  If errorCount = 2, only Document link error
  If errorCount = 3, both Tutorial and Document link error */
  return(errorCount);
}
