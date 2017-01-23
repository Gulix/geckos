define(['knockout', 'cropper'], function(ko, cropper) {

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

    self.uniqueId = ko.pureComputed(function() {
      return "img_crop_" + self.name;
    });
    self.isCropShown = ko.observable(false);
    self.showCrop = function() {
      self.isCropShown(true);
      var id = self.uniqueId();
      $('#' + id).cropper(
        {
          aspectRatio: 4 / 3,
          crop: function(e) {
            // Output the result data for cropping image.
            console.log(e.x);
            console.log(e.y);
            console.log(e.width);
            console.log(e.height);
            console.log(e.rotate);
            console.log(e.scaleX);
            console.log(e.scaleY);
          }
        }
      );
    }

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
