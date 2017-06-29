define([ ], function() {

/*****************************************************************/
/* Represents a List of Card, stored in LocalStorage by the User */
/*****************************************************************/
  function cardsDeck(data) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.uniqueId = data.uniqueId;
    self.description = data.description;
    self.templateKey = data.templateKey;
    self.cardsData = data.cardsData;

    /*************************/
    /* Functions declaration */
    /*************************/



    /*******************************/
    /*End of Functions declaration */
    /*******************************/
  }
  return {
    getCardsDeck: function(data) { return new cardsDeck(data); },
    createCardsDeck: function(cardsData, templateKey, description) {
      var id = 1;
      var data = {
        description: description,
        cardsData: cardsData,
        templateKey: templateKey,
        uniqueId: id
      }
      return new cardsDeck(data);
    }
  }
});
