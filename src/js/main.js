require.config({
    paths: {
        'jQuery': 'vendor/jquery-3.0.0.min',
        'fabric': 'vendor/fabric.require.1.6.3',
        'FileSaver': 'vendor/FileSaver.min',
        'jscolor': 'vendor/jscolor.min',
        'knockout': 'vendor/knockout-3.4.0',
        'tabs': 'vendor/cbpFWTabs',
        'ckeditor': 'vendor/ckeditor/ckeditor',
        'tinycolor': 'vendor/tinycolor'
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
         'knockoutExtensions',
         'components/registration',
         'domReady!'
       ], function(ko, CardTemplateVM, EngineVM, tabs, koExt, components){
  var jsonTemplate = {
    "fields": [
      {	"name": "name", "label": "Name", "default": "Captain Wolf" },
      { "name": "brawl", "label": "Brawl", "default": "3d10" },
      {	"name": "shoot", "label": "Shoot", "default": "3d10" },
      {	"name": "dodge", "label": "Dodge", "default": "2d8" },
      {	"name": "might", "label": "Might", "default": "3d10" },
      {	"name": "finesse", "label": "Finesse", "default": "2d8" },
      { "name": "cunning", "label": "Cunning", "default": "3d10" },
      { "name": "description", "label": "Description", "default": "...", "type": "richtext" },
      { "name": "characterType", "label": "Type", "type": "options", "default": "leader", "options":
        [
          { "option": "leader", "text": "Leader" },
          { "option": "sidekick", "text": "Sidekick" },
          { "option": "ally", "text": "Ally" },
          { "option": "follower", "text": "Follower" },
          { "option": "terror", "text": "Terror" },
          { "option": "gang", "text": "Gang" }
        ]
      },
      { "name": "portray", "label": "Miniature's image", "type": "image" },
      { "name": "health", "label": "Health", "type": "options", "default": "d10", "options":
        [
          { "option": "d6*", "text": "d6*" },
          { "option": "d6", "text": "d6" },
          { "option": "d8", "text": "d8" },
          { "option": "d10", "text": "d10" },
          { "option": "d12", "text": "d12" }
        ]
      }
    ],
    "canvasFields": [
      { "type": "rect",	"width": 350,	"height": 495, "fill": "#CAAB7F" },
      { "type": "text", "text": "$characterType$ :", "fontSize": 22 },
      { "type": "text", "text": "$name", "fontSize": 22, "fontWeight": "bold", "left": 80 },
      { "type": "rect", "width": 170,	"height": 106, "left": 165,	"top": 36, "fill": "#E07B4F",	"stroke": "#FFDDAA" },
      { "type": "rect", "width": 170, "height": 106, "left": 165,	"top": 146,	"fill": "#ACA497", "stroke": "#FFFFAA" },
      { "type": "text", "text": "Brawl", "fontSize": 22, "fontWeight": "bold", "left": 175, "top": 39 },
      { "type": "text", "text": "Shoot", "fontSize": 22, "fontWeight": "bold", "left": 175, "top": 74 },
      { "type": "text", "text": "Dodge", "fontSize": 22, "fontWeight": "bold", "left": 175,	"top": 109 },
      { "type": "text", "text": "Might", "fontSize": 22, "fontWeight": "bold", "left": 175, "top": 149 },
      { "type": "text", "text": "Finesse", "fontSize": 22, "fontWeight": "bold", "left": 175, "top": 184 },
      { "type": "text", "text": "Cunning", "fontSize": 22, "fontWeight": "bold", "left": 175, "top": 219 },
      { "type": "text", "text": "$brawl", "fontSize": 22,	"fontWeight": "bold",	"left": 270, "top": 39 },
      {	"type": "text",	"text": "$shoot",	"fontSize": 22,	"fontWeight": "bold",	"left": 270, "top": 74 },
      { "type": "text",	"text": "$dodge",	"fontSize": 22,	"fontWeight": "bold",	"left": 270, "top": 109 },
      {	"type": "text",	"text": "$might",	"fontSize": 22,	"fontWeight": "bold",	"left": 270, "top": 149 },
      { "type": "text", "text": "$finesse",	"fontSize": 22,	"fontWeight": "bold",	"left": 270, "top": 184	},
      { "type": "text",	"text": "$cunning",	"fontSize": 22,	"fontWeight": "bold",	"left": 270, "top": 219 },
      { "type": "rect", "left": 2, "width": 156, "top": 36, "height": 216, "fill": "#DABD9E", "stroke": "#FFDDBB"},
      {	"type": "image", "left": 6, "width": 150,	"top": 40, "height": 210,	"src": "$portray" },
      { "type": "rect", "width": 336, "left": 2, "top": 256, "height": 190, "fill": "#DABD9E", "stroke": "#FFDDBB"},
      { "type": "textbox", "width": 330, "left": 5, "top": 260, "fontSize": 18, "text": "$description$", "styles": "£description" },
      { "type": "rect",	"height": 40,	"left": 5, "top": 450, "fill": "#B1E29E", "stroke": "#000000",
        "width": "{{value = 330; if (card[health] == 'd6*') { value = 167; } else if (card[health] == 'd6') { value = 209; } else if (card[health] == 'd8') { value = 251; } else if (card[health] == 'd10') { value = 293; } else if (card[health] == 'd12') { value = 330; }}}" },
      { "type": "textbox", "width": 70, "left": 8, "textAlign": "left", "top": 460, "fontWeight": "bold", "fontSize": 20, "text": "Health :" },
      { "type": "textbox", "width": 42, "left": 76, "textAlign": "center", "top": 462, "fontWeight": "bold", "fontSize": 16,
        "text": "$health$" },
      { "type": "textbox", "width": 42, "left": 118, "textAlign": "center", "top": 462, "fontWeight": "bold", "fontSize": 16,
        "text": "{{if (card[health] == 'd6*') { value = 'Out'; } else if (card[health] == 'd6') { value = 'Down'; } else if (card[health] == 'd8') { value = 'd6'; } else if (card[health] == 'd10') { value = 'd8'; } else if (card[health] == 'd12') { value = 'd10'; }}}" },
      { "type": "textbox", "width": 42, "left": 160, "textAlign": "center", "top": 462, "fontWeight": "bold", "fontSize": 16,
        "text": "{{if (card[health] == 'd6') { value = 'Out'; } else if (card[health] == 'd8') { value = 'Down'; } else if (card[health] == 'd10') { value = 'd6'; } else if (card[health] == 'd12') { value = 'd8'; }}}" },
      { "type": "textbox", "width": 42, "left": 202, "textAlign": "center", "top": 462, "fontWeight": "bold", "fontSize": 16,
        "text": "{{if (card[health] == 'd8') { value = 'Out'; } else if (card[health] == 'd10') { value = 'Down'; } else if (card[health] == 'd12') { value = 'd6'; }}}" },
      { "type": "textbox", "width": 42, "left": 244, "textAlign": "center", "top": 462, "fontWeight": "bold", "fontSize": 16,
        "text": "{{if (card[health] == 'd10') { value = 'Out'; } else if (card[health] == 'd12') { value = 'Down'; }}}" },
      { "type": "textbox", "width": 42, "left": 286, "textAlign": "center", "top": 462, "fontWeight": "bold", "fontSize": 16,
        "text": "{{if (card[health] == 'd12') { value = 'Out'; }}}" }
    ],
    "canvasBackground": "#CAAB7F",
    "canvasWidth": 340,
    "canvasHeight": 495
  };

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
