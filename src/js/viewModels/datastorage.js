define([ ], function() {

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

    

    /*******************************/
    /*End of Functions declaration */
    /*******************************/
  }
  return {
    getDataStorage: function() { return new datastorage(); }
  }
});
