define(['knockout', 'cropper'], function(ko, cropper) {

  function fieldImage(jsonField) {
    var self = this;

    self.name = jsonField.name;
    self.label = jsonField.label;
    self.ratio = 1;
    if (jsonField.ratio != undefined) {
      self.ratio = jsonField.ratio;
    } else if ((jsonField.height != undefined) && (jsonField.width != undefined)) {
      self.ratio = jsonField.width / jsonField.height;
    }
    self.isNameField = false;
    if (jsonField.isNameField != undefined) {
      self.isNameField = jsonField.isNameField;
    }

    self.textValue = ko.observable(jsonField.default);
    // TODO : default value of an image field ?
    self.dataUrl = ko.observable('');
    self.editedDataUrl = ko.observable('');
    self.isDisabled = ko.pureComputed(function() {
      return ((self.dataUrl() == undefined) || (self.dataUrl() == null) || (self.dataUrl().length == 0))
        && ((self.editedDataUrl() == undefined) || (self.editedDataUrl() == null) || (self.editedDataUrl().length == 0));
    });

    /*******************************/
    /* --- Image Editor / Crop --- */
    /*******************************/
    self.uniqueCropId = ko.pureComputed(function() {
      return "img_crop_" + self.name;
    });
    self.isCropShown = ko.observable(false);

    self.editImage = function() {
      if (!self.isDisabled())
      {
        self.isCropShown(true);
        if ((self.editedDataUrl() == null) || (self.editedDataUrl().length <= 0)) {
          self.editedDataUrl(self.dataUrl());
        }

        $('#' + self.uniqueCropId()).cropper(
          {
            aspectRatio: self.ratio
          }
        );
      }
    }
    self.closeCrop = function() {
      $('#' + self.uniqueCropId()).cropper('destroy');
      self.editedDataUrl('');
      self.isCropShown(false);
    }
    self.crop = function() {
      var canvas = $('#' + self.uniqueCropId()).cropper('getCroppedCanvas');
      self.dataUrl(canvas.toDataURL('image/jpg'));

      self.closeCrop();
    }
    self.clearImage = function() {
      self.dataUrl('');
    }

    /****************************/
    /* --- Loading the File --- */
    /****************************/
    self.uniqueInputId = ko.pureComputed(function() {
      return "img_input_" + self.name;
    });
    self.loadImage = function() {
      $('#' + self.uniqueInputId()).click();
    }

    self.uploadImage = function(file) {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
        self.editedDataUrl(reader.result);
        self.editImage();
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
