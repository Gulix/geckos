/**
 * ViewModel representing a Card and its data.
 * @param  {editableFieldVM table} List of fields used to create the cards
 */
function cardVM(editableFields, fields) {
  var self = this;

  //self.fields = ko.observableArray(editableFields);
  self.fields = ko.observableArray([]);
  self.getFieldFromName = function(fieldName) {
    for (var iField = 0; iField < self.fields().length; iField++) {
      var field = self.fields()[iField];
      if (field.name == fieldName) {
        return field;
      }
    }
    return null;
  }

  self.updateFields = function(fieldList) {
    var fields = [];
    for (var iField = 0; iField < fieldList.length; iField++) {
      var editableField = new editableFieldVM(fieldList[iField]);
      // Getting previous values from actual field with same name
      var existingField = self.getFieldFromName(editableField.name);
      if (existingField != null) {
        editableField.setValue(existingField.getJsonValue());
      }
      fields.push(editableField);
    }
    self.fields(fields);

    /*var editor = new wysihtml5.Editor('textarea', {
      toolbar: "toolbar",
      parserRules:  wysihtml5ParserRules
    });*/
  }
  self.updateFields(fields);


  self.cardName = ko.pureComputed(function() {
    var nameFieldExists = false;
    for (var iField = 0; iField < self.fields().length; iField++) {
      var field = self.fields()[iField];
      if (field.isNameField) {
        return self.getValue(field.name);
      } else if (field.name == 'name') {
        nameFieldExists = true;
      }
    }
    if (nameFieldExists == true) {
      return self.getValue('name');
    } else {
      return self.getValue(self.fields()[0].name);
    }
  });

  self.getValue = function(fieldName) {
    var field = self.getFieldFromName(fieldName);
    if (field != null) {
        return field.getTextValue();
    }
    return '';
  }

  self.getBoolValue = function(fieldName) {
    var field = self.getFieldFromName(fieldName);
    if (field != null) {
        return field.checkedValue();
    }
    return false;
  }

  self.getStyles = function(fieldName) {
    var field = self.getFieldFromName(fieldName);
    if ((field != null) && field.isRichText()) {
      return field.styles();
    } else {
      return { };
    }
  }

  /* Returns the Card Data as Json object, ready to be saved and then loaded later */
  self.getSavedData = function() {
    var savedObject = { };
    for (var iField = 0; iField < self.fields().length; iField++) {
      var field = self.fields()[iField];
      savedObject[field.name] = field.getJsonValue();
    }
    return savedObject;
  }

  /* Load data from Json Values */
  self.loadFromJson = function(jsonData) {
    for (var data in jsonData) {
      for (var iField = 0; iField < self.fields().length; iField++) {
        var field = self.fields()[iField];
        if (field.name == data) {
          field.setValue(jsonData[data]);
        }
      }
    }
  }

  /* Processing the content of a field to get a value */
  self.processString = function(processedString) {
    if (processedString.indexOf('?') >= 0) {
      var valueField = processedString.replace('?', '');
      return self.getBoolValue(valueField);
    } else if (processedString.indexOf('£') >= 0) {
      var valueField = processedString.replace('£', '');
      return self.getStyles(valueField);
    }

    // A string that is encapsulated by {{myString}} has to be evaluated as code
    var regexFindCode = /^\{\{(.*)\}\}$/g;
    var matchCode = regexFindCode.exec(processedString);
    if (matchCode != null) {
      var evaluatedCode = matchCode[0];
      var value = null;
      // card[test] => self.getValue('test')
      var regexBasic = /card\[(.*)\]/g;
      evaluatedCode = evaluatedCode.replace(regexBasic, function(match, p1, offset, string) { return "self.getValue('" + p1 + "')"});

      eval(evaluatedCode);
      return value;
    }

    // Replacing the occurences of $variable$ by the content of the variable (text only)
    // For options fields, return the Text value.
    //                     $variable.value$ returns the stored value,
    //                     $variable.text$ returns the displayed text value
    // For Rich Text Fields, returns the text without formatting
    //                       $variable.html$ returns the html text
    //                       $variable.text$ returns the text without formatting
    var regexReplace = /\$([a-zA-Z0-9_][a-zA-Z0-9_\.]*[a-zA-Z0-9_])\$/g;
    var matchReplace = null; //regexReplace.exec(processedString);
    var replacedString = processedString;
    var hasBeenProcessed = false;
    while ((matchReplace = regexReplace.exec(processedString)) !== null) {
      var replacedElement = matchReplace[0];
      // Standard value or specific value (.value, .text, .html, ...)
      var fieldName = matchReplace[1];
      var valueType = 'text';
      var indexOfPoint = matchReplace[1].indexOf('.');
      if (indexOfPoint > 0) {
        fieldName = matchReplace[1].substring(0, indexOfPoint);
        valueType = matchReplace[1].substring(indexOfPoint + 1);
      }
      var replacingValue = '';
      var field = self.getFieldFromName(fieldName);
      if (field.isInputText() || field.isMultiLine()) {
        // These types of fields only returns text value
        if (valueType == 'text') { replacingValue = field.getTextValue(); }
      }
      else if (field.isOptions()) {
        // Two possibilites : displaying the constant value, or the displayed text
        var selectedValue = field.selectedOption();
        if (selectedValue != null) {
          if (valueType == 'text') { replacingValue = selectedValue.text; }
          if (valueType == 'value') { replacingValue = selectedValue.option; }
        }
      }
      else if (field.isRichText()) {
        // Two possibilites : displaying the constant value, or the displayed text
        if (valueType == 'text') { replacingValue = field.textDisplayed(); }
        if (valueType == 'html') { replacingValue = field.textValue(); }
      }
      replacedString = replacedString.replace(replacedElement, replacingValue);

      hasBeenProcessed = true;
    }
    if (hasBeenProcessed) { return replacedString; }

    if (processedString.indexOf('$') == 0) {
      var valueField = processedString.replace('$', '');
      return self.getValue(valueField);
    }

    return processedString;
  }
}
