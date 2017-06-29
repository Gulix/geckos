define([ "viewModels/datastorage/cardsDeck" ], function(CardsDeck) {

/*************************************************/
/* Managing the DataStorage functions for Geckos */
/*************************************************/
  function isDataStorageActive() {
    return typeof(Storage) !== "undefined";
  }

  function getStoredCardsAsString() {
    if (isDataStorageActive()) {
      var data = localStorage.getItem("geckos_cards");
      return data;
    } else {
      return null;
    }
  }

  function getListOfDecks() {
    var data = getStoredCardsAsString();
    if (data != null) {
      var jsonData = JSON.parse(data);
      return jsonData;
    }

    return [];
  }

  function storeNewDeck(cardsData, templateKey, description) {
    var newDeck = CardsDeck.createCardsDeck(cardsData, templateKey, description);
    var storedDecks = getListOfDecks();
    if ((storedDecks == null) || (storedDecks.constructor !== Array))  {
      storedDecks = [ ];
    }
    storedDecks.push(newDeck);
    var strData = JSON.stringify(storedDecks);
    localStorage.setItem("geckos_cards", strData);
  }

  return {
    getDecksForTemplate: function(templateKey) {
      var decks = getListOfDecks();
      decks = _.filter(decks, function(d) { return d.templateKey == templateKey; });
      return decks;
    },
    saveDeckAsNew: function(cards, templateKey, description) {
      storeNewDeck(cards, templateKey, description);
    }
  }
});
