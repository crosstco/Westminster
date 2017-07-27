var activityFilesStore = new FS.Store.GridFS("activityFiles");

ActivityFiles = new FS.Collection("activityFiles", {
  stores: [activityFilesStore]
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
    }
  });
}
