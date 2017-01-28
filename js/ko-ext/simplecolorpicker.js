define(['knockout', 'simplecolorpicker', 'jQuery'], function(ko, simplecolorpicker) {



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
