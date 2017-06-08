define(['knockout', 'jQuery'], function(ko) {

ko.bindingHandlers.slideRightMenu = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        $(element).closest("li").hover(
          function() { $(element).show(400); },
          function() { $(element).hide(400); }
        );
        $(element).hide(); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out

    }
};

});
