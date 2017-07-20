define(['knockout'], function(ko) {

/************************************/
/* Configuration for the PDF Export */
/************************************/
  function pdfConfig() {
    var self = this;

    /*************************/
    /* Variables declaration */
    /*************************/
    self.displayedUnit = ko.observable('i');
    self.orientation = ko.observable('l');
    self.cardWidthInPoints = ko.observable(200);
    self.cardHeightInPoints = ko.observable(300);
    self.marginInPoints = ko.observable(0);
    self.scale = ko.observable(1.0);

    /********************************/
    /* End of Variables declaration */
    /********************************/
    // Displayed Unit
    self.configInMM = ko.computed(function() {
      return self.displayedUnit() == 'm';
    })
    self.configInInches = ko.computed(function() {
      return self.displayedUnit() == 'i';
    })

    // Orientation
    self.configIsLandscape = ko.computed(function() {
      return self.orientation() == 'l';
    })
    self.configIsPortrait = ko.computed(function() {
      return self.orientation() == 'p';
    })

    // Width & Height
    self.setCardDimensions = function(width, height) {
      self.cardWidthInPoints(width);
      self.cardHeightInPoints(height);
    }
    self.convertFromDisplayedUnitToPoints = function(unitValue) {
      if (self.configInInches()) {
        return Math.round(unitValue * 72);
      } else if (self.configInMM()) {
        return Math.round(unitValue / 0.35277);
      }
      return unitValue;
    }
    self.convertFromPointsToDisplayedUnit = function(pointsValue) {
      if (self.configInInches()) {
        return (pointsValue / 72).toFixed(2);
      } else if (self.configInMM()) {
        return Math.round(pointsValue * 0.35277);
      }
      return pointsValue;
    }
    self.displayedWidth = ko.computed({
      read: function () {
        return self.convertFromPointsToDisplayedUnit(self.cardWidthInPoints() * self.scale());
      },
      write: function (value) {
        var newWidth = self.convertFromDisplayedUnitToPoints(value);
        self.scale(newWidth / self.cardWidthInPoints());
      }
    });
    self.displayedHeight = ko.computed({
      read: function () {
        return self.convertFromPointsToDisplayedUnit(self.cardHeightInPoints() * self.scale());
      },
      write: function (value) {
        var newHeight = self.convertFromDisplayedUnitToPoints(value);
        self.scale(newHeight / self.cardHeightInPoints());
      }
    });
    self.displayedMargin = ko.computed({
      read: function () {
        return self.convertFromPointsToDisplayedUnit(self.marginInPoints());
      },
      write: function (value) {
        var newMargin = self.convertFromDisplayedUnitToPoints(value);
        self.marginInPoints(newMargin);
      }
    });

    /*************************/
    /* Functions declaration */
    /*************************/
    self.setInInches = function() {
      self.displayedUnit('i');
    }
    self.setInMM = function() {
      self.displayedUnit('m');
    }
    self.setLandscape = function() {
      self.orientation('l');
    }
    self.setPortrait = function() {
      self.orientation('p');
    }

    /*******************************/
    /*End of Functions declaration */
    /*******************************/
  }
  return {
    getPdfConfig: function(cardWidth, cardHeight) {
      return new pdfConfig(cardWidth, cardHeight);
    }
  }
});
