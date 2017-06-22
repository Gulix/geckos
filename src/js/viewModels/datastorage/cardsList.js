define([ ], function() {

/*************************************************/
/* Managing the DataStorage functions for Geckos */
/*************************************************/
  function cardsList(data) {
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
    getCardsList: function(data) { return new cardsList(data); }, 
    createCardsList: function(cardsData, templateKey, description) {
      var id = 1;
      var data = {
        description: description,
        cardsData: cardsData,
        templateKey: templateKey,
        uniqueId: id
      }
      return new cardsList(data);
    }
  }
});
