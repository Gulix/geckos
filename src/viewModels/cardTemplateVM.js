function cardTemplateVM(jsonTemplate) {
  var self = this;

  self.fields = ko.observableArray(jsonTemplate.fields);
  self.canvasFields = ko.observableArray(jsonTemplate.canvasFields);

  self.canvasBackground = ko.observable(jsonTemplate.canvasBackground);
  self.canvasWidth = ko.observable(jsonTemplate.canvasWidth);
  self.canvasHeight = ko.observable(jsonTemplate.canvasHeight);

  self.generateTemplate = function(cardVM) {
    var generated = { "objects" : [], "background": self.canvasBackground() };

    for (var iObject = 0; iObject < self.canvasFields().length; iObject++) {
      var field = self.canvasFields()[iObject];
      var generatedObject = { };
      for(var key in field) {
        var value = field[key];
        if (isNumber(value)) {
          value = parseFloat(value);
        } else if (typeof(value) == "boolean") {
          value = (value === 'true');
        } else if (value.indexOf('$') >= 0) {
          var valueField = value.replace('$', '');
          value = cardVM.getValue(valueField);
        } else if (value.indexOf('?') >= 0) {
          var valueField = value.replace('?', '');
          value = cardVM.getBoolValue(valueField);
        }
        generatedObject[key] = value;
      }
      generated.objects.push(generatedObject);
    }

    return generated;
  }

  self.generateText = function(cardVM) {
    var retour = "My name is " + cardVM.getValue('name') + ' and I am ' + cardVM.getValue('age') + ' years old.'
    return retour;
  }
}
