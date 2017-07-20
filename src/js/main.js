require.config({
    paths: {
        'jQuery': 'vendor/jquery-3.0.0.min',
        'fabric': 'vendor/fabric.require.1.6.7', // Higher doesn't work right now
        'FileSaver': 'vendor/FileSaver.min',
        'jscolor': 'vendor/jscolor.min',
        'knockout': 'vendor/knockout-3.4.0',
        'tabs': 'vendor/cbpFWTabs',
        'ckeditor': 'vendor/ckeditor/ckeditor',
        'tinycolor': 'vendor/tinycolor',
        'simplecolorpicker': 'vendor/jquery.simplecolorpicker',
        'ddslick': 'vendor/jquery.ddslick',
        'lodash': 'vendor/lodash',
        'ajv': 'vendor/ajv.min',
        'cropper': 'vendor/cropper',
        'webfont': 'vendor/webfont',
        'jszip': 'vendor/jszip.min',
        'moment': 'vendor/moment.min',
        'pdfmake': 'vendor/vfs_fonts',
        'pdfMakeLib': 'vendor/pdfmake.min'
    },
    shim: {
        'jQuery': {
            exports: '$'
        },
        pdfMakeLib :
        {
            exports: 'pdfMake'
        },
        pdfmake :
        {
            deps: ['pdfMakeLib'],
            exports: 'pdfMake'
        }
    }
});

require(['knockout',
         'viewModels/cardTemplateVM',
         'viewModels/engineVM',
         'tabs',
         'components/registration',
         'knockoutExtensions',
         /*'ko-ext/ckeditor',*/ 'ko-ext/ddslick', 'ko-ext/fabric', 'ko-ext/jscolor', 'ko-ext/simplecolorpicker',
         'ko-ext/slideRight', 'ko-ext/progressBar', 'ko-ext/slideIn',
         'domReady!'
       ], function(ko, CardTemplateVM, EngineVM, tabs, components){


  window.CKEDITOR_BASEPATH = './vendor/ckeditor/';

  components.register();

  var engineVM = EngineVM.newEngineVM();

  ko.applyBindings(engineVM);

  tabs.create( document.getElementById( 'tabs' ) );

  $("#file-load-list").change(function (evt) {

     if (evt.target.files.length == 1)
     {
       var file = evt.target.files[0];
       var reader = new FileReader();

       reader.onload = function (reader) {
         var data = JSON.parse(this.result);
         engineVM.importList(data);
       };

       reader.readAsText(file);

       // Reset file input
       $("#file-load-list-form")[0].reset();
     }
 });

 // TODO : can it be moved elsewhere (with the import code for example) ?
 $("#file-load-template").change(function (evt) {

    if (evt.target.files.length == 1)
    {
      var file = evt.target.files[0];
      var reader = new FileReader();

      reader.onload = function (reader) {
        var data = this.result;
        engineVM.cardTemplate().saveTemplateAsJson(data);
      };

      reader.readAsText(file);

      // Reset file input
      $("#file-load-template-form")[0].reset();
    }
  });

/* Scrolling let's the Canvas on top (see also Issue #87) */
$(window).scroll(function(){
  // Difference between normal height and revised height of the canvas
  var existingDiff = $('#card-canvas-header').outerHeight();
  // Position of the scroll on the Viewport
  var scrollTop = $(window).scrollTop();
  var viewportHeight = $(window).height();
  // Top position of the Canvas
  var boxTop = $('#card-canvas-box').offset().top;
  var canvasHeight = $('#card-canvas-view').outerHeight();
  console.log("existingDiff : " + existingDiff);
  console.log("scrollTop : " + scrollTop);
  console.log("boxTop : " + boxTop);
  console.log("canvasHeight : " + canvasHeight);
  console.log("viewportHeight : " + viewportHeight);

  // If the ScrollPosition is beneath the top of the canvas, the canvas is lowered
  if (scrollTop > (boxTop + existingDiff)) {
    var diff = scrollTop - boxTop - existingDiff;
    if ((viewportHeight < canvasHeight) && (diff > (canvasHeight - viewportHeight))) {
      diff -= (canvasHeight - viewportHeight) + existingDiff;
    }
    $('#card-canvas-view').css({'margin-top': diff + 'px'});
  } else {
    $('#card-canvas-view').css({'margin-top': '0px'});
  }


  //$('#card-canvas-view').toggleClass('scrolling-position', $(window).scrollTop() > $('#card-canvas-box').offset().top);
});


});
