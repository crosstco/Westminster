import fs from 'fs';
import { sep } from 'path';
import docxbuilder from 'docx-builder';

var activityFilesStore = new FS.Store.GridFS("activityFiles");
var programFilesStore = new FS.Store.GridFS("programFiles");

ActivityFiles = new FS.Collection("activityFiles", {
  stores: [activityFilesStore]
});

ProgramFiles = new FS.Collection("programFiles", {
  stores: [programFilesStore]
});


if (Meteor.isServer) {

  ActivityFiles.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return true;
    },
    download: function () {
      return true;
    }
  });

  ProgramFiles.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return true;
    },
    download: function () {
      return true;
    }
  });

  Meteor.methods({
    uploadFiles: function (files) {
      check(files, [Object]);

      if (files.length < 1)
        throw new Meteor.Error("invalid-files", "No files were uploaded");

      var documentPaths = [];

      _.each(files, function (file) {
        ActivityFiles.insert(file, function (error, fileObj) {
          if (error) {
            console.log("Could not upload file");
          } else {
            documentPaths.push("/cfs/files/activities/" + fileObj._id);
          }
        });
      });

      return documentPaths;
    },
    mergeProgramFiles: function(programId) {
      // Get the program by ID.
      var program = Programs.findOne(programId);
      // Create a new document.
      var docx = new docxbuilder.Document();
      // Go through all activities in the program.
      program.activityIds.forEach(function(activityId) {
        // Create a temporary server side folder to store activity files.
        const tempDir = fs.mkdtempSync('/tmp/');
        // Get the activity by ID.
        var activity = Activities.findOne(activityId);
        // Get the document by ID.
        var document = ActivityFiles.findOne(activity.documents.pop()._id);
        // Declare file path to where file will be read.
        const filePath = tempDir + sep + document.name();
        // Create stream to write to path.
        const fileStream = fs.createWriteStream(filePath);
        // Read from document, write to file.
        document.createReadStream().pipe(fileStream);
        // Insert into final document when finished writinf to file.
        fileStream.on('finish', () => {
          docx.insertDocxSync(filePath);
          // Delete file when operation is completed.
          fs.unlinkSync(filePath);
        });
      });
      // Save the merged document.
      docx.save('/tmp' + sep + 'output.docx', function (error) {
        if (error) {
          console.log(error);
        }
        // Insert into Collection so client can access merged document.
        let obj;
        Fiber = Npm.require('fibers');
        Fiber(function() {
          var file = new FS.File();
          file.attachData('/tmp' + sep + 'output.docx');
          file.metadata = {programID: programId};
          ProgramFiles.insert(file);
        }).run();

        return obj;
      });
    }
  });
}
