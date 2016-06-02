/**
 * ViewModel representing a Card and its data.
 * @param  {editableFieldVM table} List of fields used to create the cards
 */
function cardVM(editableFields, fields) {
  var self = this;

  //self.fields = ko.observableArray(editableFields);
  self.fields = ko.observableArray([]);
  for (var iField = 0; iField < fields.length; iField++) {
    self.fields.push(new editableFieldVM(fields[iField]));
  }

  self.cardName = ko.pureComputed(function() {
    return self.getValue('name');
  });

  self.getValue = function(fieldName) {
    for (var iField = 0; iField < self.fields().length; iField++) {
      var field = self.fields()[iField];
      if (field.name == fieldName) {
        return field.getTextValue();
      }
    }
    return '';
  }

  self.getBoolValue = function(fieldName) {
    for (var iField = 0; iField < self.fields().length; iField++) {
      var field = self.fields()[iField];
      if (field.name == fieldName) {
        return field.checkedValue();
      }
    }
    return false;
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
}
