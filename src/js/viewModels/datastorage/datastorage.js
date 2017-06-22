define([ "viewModels/datastorage/cardsList" ], function(CardsList) {

/*************************************************/
/* Managing the DataStorage functions for Geckos */
/*************************************************/
  function datastorage() {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/


    /*************************/
    /* Functions declaration */
    /*************************/
    self.isDataStorageActive = function() {
      return typeof(Storage) !== "undefined";
    }

    self.getStoredData = function() {
      if (self.isDataStorageActive()) {
        var data = localStorage.getItem("geckos_cards");
        return data;
      } else {
        return null;
      }
    }

    self.getListOfLists = function() {
      var data = self.getStoredData();
      if (data != null) {
        var jsonData = JSON.parse(data);
        return jsonData;
      }

      return [];
    }

    self.storeNewList = function(cardsData, templateKey, description) {
      var cardsList = CardsList.createCardsList(cardsData, templateKey, description);
      var storedData = self.getStoredData();
      if ((storedData == null) || (storedData.constructor !== Array))  {
        storedData = [ ];
      }
      storedData.push(cardsList);
      var strData = JSON.stringify(storedData);
      localStorage.setItem("geckos_cards", strData);

    }



    /*******************************/
    /*End of Functions declaration */
    /*******************************/
  }
  return {
    getList: function(listId) {
      var ds = new datastorage();
      var lists = ds.getListOfLists();
      var searchedList = _.find(lists, function(l) { return l.uniqueId == listId; });
      return searchedList;
    },
    saveCurrentList: function(data) {
      var ds = new datastorage();
      ds.storeNewList(data, "balec", "balec");
    }
  }
});
