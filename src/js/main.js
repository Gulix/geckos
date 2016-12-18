require.config({
    paths: {
        'jQuery': 'vendor/jquery-3.0.0.min',
        'fabric': 'vendor/fabric.require.1.6.3',
        'FileSaver': 'vendor/FileSaver.min',
        'jscolor': 'vendor/jscolor.min',
        'knockout': 'vendor/knockout-3.4.0',
        'tabs': 'vendor/cbpFWTabs',
        'ckeditor': 'vendor/ckeditor/ckeditor',
        'tinycolor': 'vendor/tinycolor',
        'simplecolorpicker': 'vendor/jquery.simplecolorpicker',
        'ddslick': 'vendor/jquery.ddslick',
        'lodash': 'vendor/lodash'
    },
    shim: {
        'jQuery': {
            exports: '$'
        }
    }
});

require(['knockout',
         'viewModels/cardTemplateVM',
         'viewModels/engineVM',
         'tabs',
         'components/registration',
         'templates/load-templates',
         'knockoutExtensions',
         /*'ko-ext/ckeditor',*/ 'ko-ext/ddslick', 'ko-ext/fabric', 'ko-ext/jscolor', 'ko-ext/simplecolorpicker',
         'ko-ext/slideBottomListItem',
         'domReady!'
       ], function(ko, CardTemplateVM, EngineVM, tabs, components, Templates){


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
  var existingDiff = $('#card-canvas-header').outerHeight();
  console.log(existingDiff);
  var scrollTop = $(window).scrollTop();
  var boxTop = $('#card-canvas-box').offset().top;
  if (scrollTop > (boxTop + existingDiff)) {
    var diff = scrollTop - boxTop - existingDiff;
    $('#card-canvas-view').css({'margin-top': diff + 'px'});
  } else {
    $('#card-canvas-view').css({'margin-top': '0px'});
  }


  //$('#card-canvas-view').toggleClass('scrolling-position', $(window).scrollTop() > $('#card-canvas-box').offset().top);
});


});
