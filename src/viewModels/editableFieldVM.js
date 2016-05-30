/**
 * ViewModel representing a Field that can be edited to set card data.
 * @param  {json table} json description of the Field
 */
function editableFieldVM(jsonField) {
  var self = this;

  self.name = jsonField.name;
  self.label = jsonField.label;
  self.type = "inputText";
  self.textValue = ko.observable(jsonField.default);

  // Optional - Field of type Select with Options
  if ((jsonField.type != undefined) && (jsonField.type == "options")
      && (jsonField.options != undefined) && (jsonField.options.length > 0)) {

    self.options = jsonField.options;
    self.type = "options";
    self.selectedOption = ko.observable(self.options[0]);
    for (var iOption = 0; iOption < self.options.length; iOption++) {
      if (self.options[iOption].option == jsonField.default) {
        self.selectedOption(self.options[iOption]);
      }
    }
  }

  // Optional - Field of type Image
  if ((jsonField.type != undefined) && (jsonField.type == 'image')) {

    self.type = 'image';
    self.dataUrl = ko.observable('');
    self.uploadImage = function(file) {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
        self.dataUrl(reader.result);
      }, false);

      if (file) { reader.readAsDataURL(file); }
    }
  }
  // Optional - Checkbox field
  if ((jsonField.type != undefined) && (jsonField.type == 'checkbox')) {

    self.type = 'checkbox';
    var defVal = false;
    if (jsonField.default != undefined) { defVal = jsonField.default; }
    self.checkedValue = ko.observable(defVal);
  }


  /* Types of Fields */
  self.isOptions = function() {
    return self.type == "options";
  }
  self.isInputText = function() {
    return self.type == "inputText";
  }
  self.isImage = function() {
    return self.type == 'image';
  }
  self.isCheckbox = function() {
    return self.type == 'checkbox';
  }

  /* Value to be used in the templates */
  self.getTextValue = function() {
    if (self.isInputText()) {
      return self.textValue();
    } else if (self.isOptions()) {
      return self.selectedOption().text;
    } else if (self.isImage()) {
      return self.dataUrl();
    }
  }
}
