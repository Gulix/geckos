define(['knockout'], function(ko) {

  function fieldImage(jsonField) {
    var self = this;

    self.name = jsonField.name;
    self.label = jsonField.label;
    self.isNameField = false;
    if (jsonField.isNameField != undefined) {
      self.isNameField = jsonField.isNameField;
    }

    self.textValue = ko.observable(jsonField.default);
    // TODO : default value of an image field ?
    self.dataUrl = ko.observable('');


    self.uploadImage = function(file) {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
        self.dataUrl(reader.result);
      }, false);

      if (file) { reader.readAsDataURL(file); }
    }

    /* Value to be used in the templates */
    self.getTextValue = function() {
      return self.dataUrl();
    }

    /* Value to be exported to be saved */
    self.getJsonValue = function() {
      return self.dataUrl();
    }

    /* Setting value from Json stored data */
    self.setValue = function(value) {
      self.dataUrl(value);
    }

    self.getComponentName = function() {
      return "input-image";
    }

    /* Advanced String variables, with specific "valueType" */
    self.getAdvancedValue = function(valueType) {
      return '';
    }

  }



  return {
    build: function(jsonField) { return new fieldImage(jsonField); }
  }
});
