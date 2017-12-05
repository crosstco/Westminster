import { Template } from 'meteor/templating';

import './program-display.html';

var PDFJS = require('pdfjs-dist');


// The workerSrc property shall be specified.
PDFJS.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

var documentURLS = [];

  var pdfDocs = [];
  var current = {};
  var totalPageCount = 0;
  var pageNum = 1;
  var pageRendering = false;
  var pageNumPending = null;
  var scale = 0.8;
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

    document.getElementById('next').addEventListener('click', onNextPage);
    document.getElementById('prev').addEventListener('click', onPrevPage);


    pdfDocs = [];
    current = {};
    totalPageCount = 0;
    pageNum = 1;
    pageRendering = false;
    pageNumPending = null;
    scale = 0.8;
    canvas = document.getElementById('the-canvas');
    ctx = canvas.getContext('2d');

    load();
});

    function renderPage(num) {
        console.log('Render called');
    	pageRendering = true;
    	current = getPageInfo(num);
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

    	document.getElementById('page_num').textContent = pageNum;
    }

    function queueRenderPage(num) {
        console.log('QR called');
    	if (pageRendering) {
    		pageNumPending = num;
    	} else {
    		renderPage(num);
    	}
    }

    function onPrevPage() {
        console.log('Prev called');
    	if (pageNum <= 1) {
    		return;
    	}
    	pageNum--;
    	queueRenderPage(pageNum);
    }
    

    function onNextPage() {
        console.log('Next called');
    	if (pageNum >= totalPageCount && current.documentIndex + 1 === pdfDocs.length) {
    		return;
    	}

    	pageNum++;
    	queueRenderPage(pageNum);
    }
    

    function getPageInfo (num) {
        console.log('PageInfo called');
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
        console.log('TPC called');
    	var totalPageCount = 0;
    	for (var docIdx = 0; docIdx < pdfDocs.length; docIdx++) {
    		totalPageCount += pdfDocs[docIdx].numPages;
    	}
    	return totalPageCount;
    }

    var loadedCount = 0;
    function load() {
        console.log('Load called');
        console.log(documentURLS[loadedCount + 1]);
    	PDFJS.getDocument(documentURLS[loadedCount]).then(function (pdfDoc_) {
    		console.log('loaded PDF ' +  loadedCount);
    		pdfDocs.push(pdfDoc_);
    		loadedCount++;
    		if (loadedCount !== documentURLS.length) {
    			return load();
    		}

    		console.log('Finished loading');
    		totalPageCount =  getTotalPageCount();
    		document.getElementById('page_count').textContent = totalPageCount;

    		renderPage(pageNum);
    	});
    }
