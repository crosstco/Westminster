import { Template } from 'meteor/templating';

import './activity-display.html';

var pdfjsLib = require('pdfjs-dist');

// The workerSrc property shall be specified.
PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

Template.activityDisplay.onRendered(function() {

	var activityId = Router.current().url.split('/').pop();
	var activity = Activities.findOne(activityId);
	var documentObj = ActivityFiles.findOne(activity.documents.pop()._id);

	var pdfPath = documentObj.url();

	pdfjsLib.getDocument(pdfPath).then(function (doc) {

		doc.getPage(1).then(function(page) {

			var scale = 1.5;
			var viewport = page.getViewport(scale);

			var canvas = document.getElementById('the-canvas');
			
			var context = canvas.getContext('2d');
			canvas.height = viewport.height;
			canvas.width = viewport.width;
			
			var renderContext = {
				canvasContext: context,
				viewport: viewport
			};

			var renderTask = page.render(renderContext);
		});
	});
});