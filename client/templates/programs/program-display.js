import { Template } from 'meteor/templating';

import './program-display.html';

var PDFJS = require('pdfjs-dist');


// If someone can figure out how to localize this file rather than referencing it from
// github... please.
PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';


//Following rendering implementation is an adaptation taken from here:
//https://stackoverflow.com/questions/9809001/is-there-a-way-to-combine-pdfs-in-pdf-js


//Declare globals needed for render function
var documentURLS = [];

  var pdfDocs = [];
  var current = {};
  var totalPageCount = 0;
  var pageNum = 1;
  var pageRendering = false;
  var pageNumPending = null;
  var scale = 1.5;
  var canvas = null;
  var ctx = null;

Template.programDisplay.onRendered(function() {

	var programId = Router.current().url.split('/').pop();
    var programObj = Programs.findOne(programId);
    

    programObj.activityIds.forEach(function(activityId) {

      var activityObj = Activities.findOne(activityId);
      var documentObj = ActivityFiles.findOne(activityObj.documents.pop()._id);
      //insertedDocuments.push(documentObj);
      console.log(documentObj.url());

      var url = documentObj.url();
      documentURLS.push(url);
  });

    load();

});

    function renderPage(num) {
        //console.log('Render called');
    	pageRendering = true;
    	current = getPageInfo(num);

        // Add new canvas element for this page
        var canv = document.createElement('canvas');
        //Give the new canvas element an id of 'the-canvas' + current page
        canv.id = 'the-canvas' + num;
        //Apply styling to new canvas object (center it and give it a black border)
        canv.style = 'border: 1px solid black; padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block; width: 800px;';
        document.getElementById('canvasSection').appendChild(canv);

        canvas = document.getElementById('the-canvas' + num);
        ctx = canvas.getContext('2d');

    	pdfDocs[current.documentIndex].getPage(current.pageNumber).then(function (page) {
    		var viewport = page.getViewport(scale);
    		canvas.height = viewport.height;
    		canvas.width = viewport.width;

    		var renderContext = {
    			canvasContext: ctx,
    			viewport: viewport
    		};
    		var renderTask = page.render(renderContext);

    		renderTask.promise.then(function () {
    			pageRendering = false;
    			if (pageNumPending !== null) { 
    				renderPage(pageNumPending);
    				pageNumPending = null;
    			}
    		});
    	});

    	renderNext();
    }

    //If a page is currently rendering, store the number and call the render
    //function for this page at the end of renderPage, otherwise render it now.
    function queueRenderPage(num) {
        //console.log('QR called');
    	if (pageRendering) {
    		pageNumPending = num;
    	} else {
    		renderPage(num);
    	}
    }

    //Queue the next page to be rendered if the page exists
    function renderNext() {
        if(pageNum >= totalPageCount && current.documentIndex + 1 === pdfDocs.length) {
            return;
        }
        pageNum++;
        queueRenderPage(pageNum);
    }
    
    function getPageInfo (num) {
        //console.log('PageInfo called');
    	var totalPageCount = 0;
    	for (var docIdx = 0; docIdx < pdfDocs.length; docIdx++) {
    		totalPageCount += pdfDocs[docIdx].numPages;
    		if (num <= totalPageCount) {
    			return {documentIndex: docIdx, pageNumber: num};
    		}
    		num -= pdfDocs[docIdx].numPages;
    	}
    	return false;
    };

    function getTotalPageCount() {
        //console.log('TPC called');
    	var totalPageCount = 0;
    	for (var docIdx = 0; docIdx < pdfDocs.length; docIdx++) {
    		totalPageCount += pdfDocs[docIdx].numPages;
    	}
    	return totalPageCount;
    }

    var loadedCount = 0;
    function load() {
        // console.log('Load called');
        // console.log(documentURLS[loadedCount + 1]);
    	PDFJS.getDocument(documentURLS[loadedCount]).then(function (pdfDoc_) {
    		console.log('loaded PDF ' +  loadedCount);
    		pdfDocs.push(pdfDoc_);
    		loadedCount++;

            //Load all documents recursively
    		if (loadedCount !== documentURLS.length) {
    			return load();
    		}

    		console.log('Finished loading');
    		totalPageCount =  getTotalPageCount();

    		renderPage(pageNum);
    	});
    }
