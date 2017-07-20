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

  function setStoredDecksFromJson(jsonDecks) {
    var strData = JSON.stringify(jsonDecks);
    localStorage.setItem("geckos_cards", strData);
  }

  function getJsonListOfDecks() {
    var data = getStoredCardsAsString();
    if (data != null) {
      var jsonData = JSON.parse(data);
      return jsonData;
    }

    return [];
  }

  function storeNewDeck(cardsData, templateKey, description) {
    var newDeck = CardsDeck.createCardsDeck(cardsData, templateKey, description);
    var storedDecks = getJsonListOfDecks();
    if ((storedDecks == null) || (storedDecks.constructor !== Array))  {
      storedDecks = [ ];
    }
    storedDecks.push(newDeck);
    var strData = JSON.stringify(storedDecks);
    localStorage.setItem("geckos_cards", strData);
  }

  return {
    getDecksForTemplate: function(templateKey) {
      var jsonDecks = getJsonListOfDecks();
      jsonDecks = _.filter(jsonDecks, function(d) { return d.templateKey == templateKey; });
      var decks = [];
      _.forEach(jsonDecks, function(obj) { decks.push(CardsDeck.getCardsDeck(obj)); });
      return decks;
    },
    saveDeckAsNew: function(cards, templateKey, description) {
      storeNewDeck(cards, templateKey, description);
    },
    removeDeck: function(uniqueId) {
      var jsonDecks = getJsonListOfDecks();
      jsonDecks = _.filter(jsonDecks, function(obj) { return obj.uniqueId != uniqueId; });
      setStoredDecksFromJson(jsonDecks);
    },
    updateDeck: function(deck) {
      var jsonDecks = getJsonListOfDecks();
      jsonDecks = _.filter(jsonDecks, function(obj) { return obj.uniqueId != deck.uniqueId; });
      jsonDecks.push(deck);
      setStoredDecksFromJson(jsonDecks);
    }
  }
});
