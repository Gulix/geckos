define([ 'moment', 'knockout' ], function(moment, ko) {

/*****************************************************************/
/* Represents a List of Card, stored in LocalStorage by the User */
/*****************************************************************/
  function cardsDeck(data) {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.uniqueId = data.uniqueId;
    self.name = data.name;
    self.templateKey = data.templateKey;
    self.cardsData = data.cardsData;
    self.lastUpdateTime = data.lastUpdateTime;
    self.completeLabel = "--";

    /*************************/
    /* Functions declaration */
    /*************************/
    self.initLabel = function() {
      var nbCards = self.cardsData.length;
      var date = moment(self.uniqueId);
      var displayedDate = date.format("DD/MM/YYYY");

      self.completeLabel = self.name + " (" + nbCards + " card" + (nbCards > 1 ? "s" : "") + ") - created on " + displayedDate;
      if (self.lastUpdateTime != null) {
        var updTime = moment(self.lastUpdateTime);
        self.completeLabel += " - last updated on " + updTime.format("DD/MM/YYYY [at] HH:mm");
      }
    }

    /*******************************/
    /*End of Functions declaration */
    /*******************************/
    self.initLabel();
  }
  return {
    getCardsDeck: function(data) { return new cardsDeck(data); },
    createCardsDeck: function(cardsData, templateKey, name) {
      var id = moment().valueOf();
      var data = {
        name: name,
        cardsData: cardsData,
        templateKey: templateKey,
        uniqueId: id
      }
      return new cardsDeck(data);
    }
  }
});
