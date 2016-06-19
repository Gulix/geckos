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
    if (processedString.indexOf('$') >= 0) {
      var valueField = processedString.replace('$', '');
      return self.getValue(valueField);
    } else if (processedString.indexOf('?') >= 0) {
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

    return processedString;
  }
}
