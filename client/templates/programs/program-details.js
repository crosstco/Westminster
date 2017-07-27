/*
 * This file has the logic of the program details page.
 * It prints the details of each program along with the links of activities
 * and buttons to edit or favorite a program.
 */

var Docxtemplater = require('docxtemplater');
var JSZip = require('jszip');
var JSZipUtils = require('jszip-utils');
var saveAs = require('file-saver').saveAs;

const id = new ReactiveVar();
const data = new ReactiveVar();

Template.programDetails.onRendered(function () {
  const activityIds = new ReactiveVar();
  Tracker.autorun(() => {
    if (this.data) {
      data.set(this.data);
    }
  });
  initIcons();
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
    if (this.activityIds) {
		  var temp =  Activities.find({_id: {$in: this.activityIds}});
	    var temp2 = [];
      for (var j = 0; j < this.activityIds.length; j++) {
        for (var i = 0; i< temp.fetch().length; i++) {
          if (this.activityIds[j] == temp.fetch()[i]._id) {
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
    Meteor.call('updateFavoriteProgram', id.one, favorited, (error, result) => {
      if (error) return console.error(`Did not update favorites. Reason: ${error.reason}`);
      console.log(`Favorites: ${Meteor.user().profile.favoritePrograms}`);
    });
  },

  'click .merge-icon': (e) => {
    var programId = Router.current().url.split('/').pop();
    var programObj = Programs.findOne(programId);
    var insertedDocuments = [];
    programObj.activityIds.forEach(function(activityId) {
      var activityObj = Activities.findOne(activityId);
      var documentObj = ActivityFiles.findOne(activityObj.documents.pop()._id);
      JSZipUtils.getBinaryContent(documentObj.url(), callback);
      function callback(error, content) {
        var zip = new JSZip(content);
        var doc = new Docxtemplater().loadZip(zip);
        var xml = zip.files[doc.fileTypeConfig.textPath].asText();
        xml = xml.substring(xml.indexOf("<w:body>") + 8);
        xml = xml.substring(0, xml.indexOf("</w:body>"));
        xml = xml.substring(0, xml.indexOf("<w:sectPr"));
        insertedDocuments.push(xml);
      }
    });
    JSZipUtils.getBinaryContent('/assets/template.docx', callback);
    function callback(error, content) {
      console.log(content);
      var zip = new JSZip(content);
      var doc = new Docxtemplater().loadZip(zip);
      setData(doc);
    }


    function setData(doc) {
      doc.setData({
        body: insertedDocuments.join('<w:br/><w:br/>')
      });
      doc.render();
      useResult(doc);
    }

    function useResult(doc) {
      var out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      saveAs(out, programObj.name + '.docx');
    }
  }
});

function initIcons() {

  if (Meteor.user() && data.get()) {
    if (_.indexOf(Meteor.user().profile.favoritePrograms, data.get()._id) !== -1) {
      $('.favorite-icon').addClass('favorited');
    }
  }
}
