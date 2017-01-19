define(['knockout'], function(ko) {

  function fieldsGroup(jsonField) {
    var self = this;

    self.name = jsonField.name;
    self.label = jsonField.label;
    self.isNameField = false;

    // Is the Group expanded ?
    var isExpanded = false;
    if (jsonField.expanded != null) {
      isExpanded = jsonField.expanded;
    }
    self.isExpanded = ko.observable(isExpanded);

    self.componentsFields = ko.observableArray([]);

    /* Value to be used in the templates */
    self.getTextValue = function() {
      return null;
    }

    /* Value to be exported to be saved */
    self.getJsonValue = function() {
      return null;
    }

    /* Setting value from Json stored data */
    self.setValue = function(value) {

    }

    self.getComponentName = function() {
      return "fields-group";
    }

    /**********************/
    /* Specific functions */
    /**********************/
    self.addField = function(field) {
      self.componentsFields.push(field);
    }

    self.toggleExpanded = function() {
      self.isExpanded(!self.isExpanded());
    }
  }

  return {
    build: function(jsonField) { return new fieldsGroup(jsonField); },
    getTextAdvancedValue: function(valueType, textValue) { return null; }
  }
});
