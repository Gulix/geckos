/**
 * ViewModel representing a Field that can be edited to set card data.
 * @param  {json table} json description of the Field
 */
function editableFieldVM(jsonField) {
  var self = this;

  self.name = jsonField.name;
  self.label = jsonField.label;
  self.isNameField = false;
  if (jsonField.isNameField != undefined) {
    self.isNameField = jsonField.isNameField;
  }
  self.type = "inputText";
  self.textValue = ko.observable(jsonField.default);

  // Optional - Multiline text
  if ((jsonField.type != undefined) && (jsonField.type == "multiline")) {
    self.type = 'multiline';
    self.nbLines = 4;
    if (jsonField.lines != undefined) {
      self.nbLines = jsonField.lines;
    }
  }
  // Optional - Field of type Select with Options
  if ((jsonField.type != undefined) && (jsonField.type == "options")
      && (jsonField.options != undefined) && (jsonField.options.length > 0)) {

    self.options = jsonField.options;
    self.type = "options";
    self.selectedOption = ko.observable(self.options[0]);
    self.setOptionFromText = function(textOption) {
      for (var iOption = 0; iOption < self.options.length; iOption++) {
        if (self.options[iOption].option == textOption) {
          self.selectedOption(self.options[iOption]);
        }
      }
    }
    self.setOptionFromText(jsonField.default);
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
  // Optional - Rich Text Field
  if ((jsonField.type != undefined) && (jsonField.type == 'richtext')) {
    self.type = 'richtext';
    self.textDisplayed = ko.observable(function() {
      var charTables = getCharsTableFromHtml(self.textValue());
      return getTextFromCharTable(charTables);
    });
    self.styles = function() {
      var charTables = getCharsTableFromHtml(self.textValue());
      return getStylesTablesFromCharTables(charTables);
    };
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
  self.isMultiLine = function() {
    return self.type == 'multiline';
  }
  self.isRichText = function() {
    return self.type == 'richtext';
  }

  /* Value to be used in the templates */
  self.getTextValue = function() {
    if (self.isInputText() || self.isMultiLine()) {
      var value = self.textValue();
      if ((value == null) || (value == undefined)) {
        value = '';
      }
      return value;
    } else if (self.isOptions()) {
      return self.selectedOption().text;
    } else if (self.isImage()) {
      return self.dataUrl();
    } else if (self.isRichText()) {
      return self.textDisplayed();
    }
  }

  /* Value to be exported to be saved */
  self.getJsonValue = function() {
    if (self.isInputText() || self.isMultiLine() || self.isRichText()) {
      return self.textValue();
    } else if (self.isOptions()) {
      return self.selectedOption().text;
    } else if (self.isImage()) {
      return self.dataUrl();
    } else if (self.isCheckbox()) {
      return self.checkedValue();
    }
    return null;
  }

  /* Setting value from Json stored data */
  self.setValue = function(value) {
    if (self.isInputText() || self.isMultiLine() || self.isRichText()) {
      self.textValue(value);
    } else if (self.isOptions()) {
      self.setOptionFromText(value);
    } else if (self.isImage()) {
      return self.dataUrl(value);
    } else if (self.isCheckbox()) {
      return self.checkedValue(value);
    }
  }
}
