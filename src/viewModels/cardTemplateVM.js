function cardTemplateVM(jsonTemplate) {
  var self = this;

  self.fields = ko.observableArray(jsonTemplate.fields);
  self.canvasFields = ko.observableArray(jsonTemplate.canvasFields);

  self.canvasBackground = ko.observable(jsonTemplate.canvasBackground);
  self.canvasWidth = ko.observable(jsonTemplate.canvasWidth);
  self.canvasHeight = ko.observable(jsonTemplate.canvasHeight);

  self.currentTemplate = ko.observable(jsonTemplate);
  self.editableTemplate = ko.observable(JSON.stringify(jsonTemplate));

  self.generateTemplate = function(cardVM) {
    var generated = { "objects" : [], "backgroundColor": self.canvasBackground() };

    for (var iObject = 0; iObject < self.canvasFields().length; iObject++) {
      var field = self.canvasFields()[iObject];
      var generatedObject = self.processObject(cardVM, field);
      generated.objects.push(generatedObject);
    }

    return generated;
  }

  self.processObject = function(cardVM, jsonObject) {

    // A null value is returned as-iss
    if (jsonObject === null) {
      return null;
    }
    // The object is an Array : the Array is rebuilt by processing each element of the Array
    // and then rebuilding the Array
    if (Array.isArray(jsonObject)) {
      var array = [];
      for(var iElement = 0; iElement < jsonObject.length; iElement++) {
        var itemValue = self.processObject(cardVM, jsonObject[iElement]);
        array.push(itemValue);
      }
      return array;
    }
    // The object is a Boolean : he's returned as-is
    if (typeof(jsonObject) == "boolean") {
      return jsonObject;
    }
    // The object is a number : he's returned as-is
    if (isNumber(jsonObject)) {
      return jsonObject;
    }
    // The object is a string : it is processed with card values
    if (typeof(jsonObject) == "string") {
      return cardVM.processString(jsonObject);
    }
    // The object is a JSON object : each key-value is processed recursively
    if (typeof(jsonObject) == "object") {
      var generatedObject = { };
      for(var key in jsonObject) {
        generatedObject[key] = self.processObject(cardVM, jsonObject[key]);
      }
      return generatedObject;
    }

    return jsonObject;
  }

  self.generateText = function(cardVM) {
    var retour = "My name is " + cardVM.getValue('name') + ' and I am ' + cardVM.getValue('age') + ' years old.'
    return retour;
  }

  /* Template management */
  self.resetTemplate = function() {
    self.editableTemplate(JSON.stringify(self.currentTemplate()));
  }
  self.setTemplate = function() {
    self.currentTemplate(JSON.parse(self.editableTemplate()));
    self.fields(self.currentTemplate().fields);
    self.canvasFields(self.currentTemplate().canvasFields);

    self.updateFonts();

    self.canvasBackground(self.currentTemplate().canvasBackground);
    self.canvasWidth(self.currentTemplate().canvasWidth);
    self.canvasHeight(self.currentTemplate().canvasHeight);

    // Updating the cards, the canvas
    self.updateCards();
    self.updateCanvas();
  }
  self.saveTemplate = function() {
    var blob = new Blob([JSON.stringify(self.currentTemplate())], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "template.json");
  }
  self.loadTemplate = function() {
    $("#file-load-template").click();
  }
  self.importTemplate = function(data) {
    self.editableTemplate(data);
  }

  /*********/
  /* Fonts */
  /*********/
  self.updateFonts = function() {
    $('.canvas-fonts').remove();

    if ((self.currentTemplate() != null) && (self.currentTemplate().fonts != null)) {
      var canvasFontsStyle = document.createElement('style');
      canvasFontsStyle.setAttribute('class', 'canvas-fonts');
      for(var iFont = 0; iFont < self.currentTemplate().fonts.length; iFont++) {
        var currentFont = self.currentTemplate().fonts[iFont];
        if ((currentFont != null) && (currentFont.fontFamily != null) && (currentFont.src != null)) {
          canvasFontsStyle.appendChild(document.createTextNode("\
            @font-face {\
                font-family: '" + currentFont.fontFamily + "';\
                src: url(" + currentFont.src + ");\
            }\
          "));
        }
      }

      document.head.appendChild(canvasFontsStyle);
    }

  }
}
