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
    //self.cardWidthInPoints = ko.observable(200);
    //self.cardHeightInPoints = ko.observable(300);
    self.pageMarginValue = ko.observable(40);
    self.paddingValue = ko.observable(0);
    self.originalCardWidth = ko.observable(200);
    self.originalCardHeight = ko.observable(300);
    self.cardWidthValue = ko.observable(self.originalCardWidth());
    self.cardHeightValue = ko.observable(self.originalCardHeight());

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
      self.originalCardWidth(width);
      self.originalCardHeight(height);
      self.cardWidthValue(self.originalCardWidth() / 3);
      self.cardHeightValue(self.originalCardHeight() / 3);
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

    /*****************************************************/
    /* Padding between cards with min, max & value */
    /*****************************************************/
    self.paddingValueString = ko.computed(function() {
      var val = self.convertFromPointsToDisplayedUnit(self.paddingValue());
      var unit = self.configInMM() ? " mm" : " inches";
      return val + unit;
    });
    self.paddingMin = 0;
    self.paddingMax = 72; // in points, one inch / 25mm

    /**************************************/
    /* Page Margins with min, max & value */
    /**************************************/
    self.pageMarginValueString = ko.computed(function() {
      var val = self.convertFromPointsToDisplayedUnit(self.pageMarginValue());
      var unit = self.configInMM() ? " mm" : " inches";
      return val + unit;
    });
    self.pageMarginMin = 0;
    self.pageMarginMax = 72; // in points, one inch / 25mm

    /**************/
    /* Card Width */
    /**************/
    self.cardWidthValueString = ko.computed(function() {
      var val = self.convertFromPointsToDisplayedUnit(self.cardWidthValue());
      var unit = self.configInMM() ? " mm" : " inches";
      return val + unit;
    });
    self.cardWidthValueForSlider = ko.computed({
      read: function () {
        return self.cardWidthValue();
      },
      write: function (value) {
        var ratio = self.cardWidthValue() / self.cardHeightValue();
        var newHeight = value / ratio;
        self.cardWidthValue(value);
        self.cardHeightValue(newHeight);
      }
    });
    self.cardWidthMin = 10;
    self.cardWidthMax = 720; // Could/Should be dependent of the orientation, margins, paddings, card ratio, ...
    self.scaleX = ko.computed(function() {
      return self.cardWidthValue() / self.originalCardWidth();
    });

    /***************/
    /* Card Height */
    /***************/
    self.cardHeightValueString = ko.computed(function() {
      var val = self.convertFromPointsToDisplayedUnit(self.cardHeightValue());
      var unit = self.configInMM() ? " mm" : " inches";
      return val + unit;
    });
    self.cardHeightValueForSlider = ko.computed({
      read: function () {
        return self.cardHeightValue();
      },
      write: function (value) {
        var ratio = self.cardWidthValue() / self.cardHeightValue();
        var newWidth = value * ratio;
        self.cardHeightValue(value);
        self.cardWidthValue(newWidth);
      }
    });
    self.cardHeightMin = 10;
    self.cardHeightMax = 720; // Could/Should be dependent of the orientation, margins, paddings, card ratio, ...
    self.scaleY = ko.computed(function() {
      return self.cardHeightValue() / self.originalCardHeight();
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
