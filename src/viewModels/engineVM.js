function engineVM(cardTemplateVM) {
  var self = this;

  self.canvas = new fabric.StaticCanvas('c');

  /* Card Template */
  self.cardTemplate = ko.observable(cardTemplateVM);
  self.canvas.setWidth(self.cardTemplate().canvasWidth());
  self.canvas.setHeight(self.cardTemplate().canvasHeight());

  /* Fields to edit the card value */
  var fields = [];
  for (var iField = 0; iField < self.cardTemplate().fields().length; iField++) {
    fields.push(new editableFieldVM(self.cardTemplate().fields()[iField]));
  }
  self.editableFields = ko.observableArray(fields);

  /* List of Editable Card */
  self.listCards = ko.observableArray([]);
  self.listCards().push(new cardVM(self.editableFields(), self.cardTemplate().fields()));
  self.listCards().push(new cardVM(self.editableFields(), self.cardTemplate().fields()));
  self.listCards().push(new cardVM(self.editableFields(), self.cardTemplate().fields()));
  self.editableCard = ko.observable(self.listCards()[0]);

  /* Generated template */
  self.generatedTemplate = ko.pureComputed(function() {
    var jsonCanvas = self.cardTemplate().generateTemplate(self.editableCard());

    return jsonCanvas;
  });


}
