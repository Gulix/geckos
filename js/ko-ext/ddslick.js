define(['knockout', 'ddslick', 'jQuery'], function(ko) {


  /************************/
  /* Binding with ddslick */
  /************************/
  ko.bindingHandlers.ddslick = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var modelValue = ko.utils.unwrapObservable(valueAccessor()) || {};
      // Id of the element (found or generated)
      var id = $(element).attr('id');
      if(id == undefined || id == '') {
        $(element).attr('id','id_' + Math.floor(new Date().valueOf()));
        id = $(element).attr('id');
      }

      var optionsList = [ ];
      for (var iOption = 0; iOption < modelValue.options.length; iOption++) {
        var optionElement = { };
        optionElement.value = modelValue.options[iOption].option;
        optionElement.text = modelValue.options[iOption].text;
        if (modelValue.options[iOption].miniature != undefined) {
          optionElement.imageSrc = modelValue.options[iOption].miniature;
        } else if (modelValue.options[iOption].image != undefined) {
          optionElement.imageSrc = modelValue.options[iOption].image;
        }
        optionElement.selected = (modelValue.options[iOption].option == modelValue.getJsonValue());
        optionsList.push(optionElement);
      }

      $('#' + id).ddslick(
        {
          data: optionsList,
          imagePosition: 'right',
          onSelected: function(selectedData){
            var observable;
            var fieldObject = ko.utils.unwrapObservable(valueAccessor()) || {};

            if (fieldObject.setOptionFromText != undefined) {
                observable = fieldObject.setOptionFromText;
            } else {
                observable = valueAccessor();
            }

            observable(selectedData.selectedData.value);
          }
        }
      );
    }
  };

});
