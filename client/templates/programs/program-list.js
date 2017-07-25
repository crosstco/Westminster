/*
 * Templates define the working parts of a Meteor application.
 * Templates are defined in a HTML file, but the functionality can be added in
 * a JavaScript file of the same name. This file implements the functionality
 * required for the Program List page.
 */

 /*
  * Enable all filters on startup so that all progams show on list.
  */
Template.programList.onCreated(function () {
  Session.set("query-filter", [
    "Attention", "Language", "Visual-Spatial", "Sensory", "Planning/Judgement",
    "Computation", "Working Memory", "Long Term Memory", "Emotional Memory",
  ]);
});

/*
 * Expose programs and index variables after applying EasySearch fitlers.
 */
Template.programList.helpers({
  programs: function () {
    return Programs.find({
      brainTargets: { $in: Session.get("query-filter") }
    });
  },
  programIndex() {
    return ProgramIndex;
  },
});


/*
 * Define actions upon change of filter checkbox.
 */
Template.programList.events({
  "change .filter-checkbox": function (e) {
    e.preventDefault();
    // Get status of each checkbox.
    var filterChecklist = {
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
    // Reset active filter list.
    var activeFilterList = [];
    // Check if all filters are disabled.
    var noFilters = true;
    for (filter in filterChecklist) {
      if (filterChecklist[filter]) {
        noFilters = false;
      }
    }
    // If no filters are checked, then show all programs.
    if (noFilters) {
      Session.set("query-filter", [
        "Attention", "Language", "Visual-Spatial", "Sensory", "Planning/Judgement",
        "Computation", "Working Memory", "Long Term Memory", "Emotional Memory"
      ]);
    } else {
      for (filter in filterChecklist) {
        if (filterChecklist[filter]) {
          activeFilterList.push(filter);
        }
      }
      Session.set("query-filter", activeFilterList);
    }
  }
});

/*
 * Add logout function.
 */
Template.layout.events({
  "click #logout-button": function (e) {
    e.preventDefault();
    Meteor.logout(function (error) {
      if (error) {
        alert("We could not log you out at the moment. Please try again later.");
      } else {
        Router.go("login");
      }
    });
  }
});
