define([], function(ko) {

  function cardEditableFields(params) {
    var self = this;

    self.currentCard = params.cardVM;
  }

  return cardEditableFields;
});
