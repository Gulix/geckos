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
        'simplecolorpicker': 'vendor/jquery.simplecolorpicker'
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
         'defaultTemplate',
         'tabs',
         'knockoutExtensions',
         'components/registration',
         'domReady!'
       ], function(ko, CardTemplateVM, EngineVM, defaultTemplate, tabs, koExt, components){

  var jsonTemplate = defaultTemplate.getTemplate();

  window.CKEDITOR_BASEPATH = './vendor/ckeditor/';

  components.register();

  var template = CardTemplateVM.newObject(jsonTemplate);
  var engineVM = EngineVM.newObject(template);

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

 $("#file-load-template").change(function (evt) {

    if (evt.target.files.length == 1)
    {
      var file = evt.target.files[0];
      var reader = new FileReader();

      reader.onload = function (reader) {
        var data = this.result;
        engineVM.cardTemplate().importTemplate(data);
      };

      reader.readAsText(file);

      // Reset file input
      $("#file-load-template-form")[0].reset();
    }
  });
});
