define(['knockout', 'jscolor', 'simplecolorpicker', 'ckeditor', 'jQuery'], function(ko, jscolor, simplecolorpicker) {

  /*************************/
  /* Binding with CKEditor */
  /*************************/
  ko.bindingHandlers.CKEDITOR = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var modelValue = ko.utils.unwrapObservable(valueAccessor()) || {};
      // Id of the element (found or generated)
      var id = $(element).attr('id');
      if(id == undefined || id == '') {
        $(element).attr('id','id_' + Math.floor(new Date().valueOf()));
        id = $(element).attr('id');
      }

      var editorElement = CKEDITOR.document.getById(id);
      editorElement.setHtml(modelValue);
      editorElement.setAttribute( 'contenteditable', 'true' );
      // Configuration needed for the EnterMode (not having breakline plus new paragraphs)

      var editor = CKEDITOR.replace(id);
      editor.on( 'change', function( evt ) {

        var observable;
        var content = ko.utils.unwrapObservable(valueAccessor()) || {};

        if (content.data != undefined) {
            observable = valueAccessor().data;
        } else {
            observable = valueAccessor();
        }
        observable(evt.editor.getData());
      });


      /* Handle disposal if KO removes an editor
       * through template binding */
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        editor.updateElement();
        editor.destroy();
      });

    }
  };

  /* Allows to bind a canvas for FabricJS, with the Json Generated template value */
  ko.bindingHandlers.fabric = {

      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
          var viewModel = bindingContext.$data;
          var jsonValue = viewModel.generatedTemplate();
          var canvas = viewModel.canvas;
          canvas.loadFromJSON(jsonValue, canvas.renderAll.bind(canvas));
      }
  };

  /************************/
  /* Binding with JSColor */
  /************************/
  ko.bindingHandlers.jscolor = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var modelValue = ko.utils.unwrapObservable(valueAccessor()) || {};
      // Id of the element (found or generated)
      var id = $(element).attr('id');
      if(id == undefined || id == '') {
        $(element).attr('id','id_' + Math.floor(new Date().valueOf()));
        id = $(element).attr('id');
      }

      var input = document.getElementById(id);
      var picker = jscolor.create(input);
      picker.fromString(modelValue);

      input.onchange = function() {
        var jscolorInput = document.getElementById(id);
        var color = jscolorInput.value;

        var observable;
        var content = ko.utils.unwrapObservable(valueAccessor()) || {};

        if (content.data != undefined) {
            observable = valueAccessor().data;
        } else {
            observable = valueAccessor();
        }
        observable(color);
      }
    }
  };

  /**********************************/
  /* Binding with SimpleColorPicker */
  /**********************************/
  ko.bindingHandlers.simplecolorpicker = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var modelValue = ko.utils.unwrapObservable(valueAccessor()) || {};
      // Id of the element (found or generated)
      var id = $(element).attr('id');
      if(id == undefined || id == '') {
        $(element).attr('id','id_' + Math.floor(new Date().valueOf()));
        id = $(element).attr('id');
      }

      var selectInput = document.getElementById(id);
      // Populating the select input with the color options
      for (var iColor = 0; iColor < modelValue.colorOptions.length; iColor++) {
        var optionNode = document.createElement('option');
        optionNode.text = modelValue.colorOptions[iColor].text;
        optionNode.value = modelValue.colorOptions[iColor].colorValue;
        selectInput.appendChild(optionNode);
      }

      $('#' + id).simplecolorpicker({ picker: true, theme: 'fontawesome' })
        .on('change', function() {
            $(document.body).css('background-color', $('select[name="colorpicker"]').val());
            var colorSelect = document.getElementById(id);
            var color = colorSelect.value;

            var observable;
            var fieldObject = ko.utils.unwrapObservable(valueAccessor()) || {};

            if (fieldObject.textValue != undefined) {
                observable = fieldObject.textValue;
            } else {
                observable = valueAccessor();
            }
            observable(color);
          });
      $('#' + id).simplecolorpicker('selectColor', modelValue.textValue());
    }
  };
});
