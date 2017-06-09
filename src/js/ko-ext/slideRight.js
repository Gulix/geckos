define(['knockout', 'jQuery'], function(ko) {

ko.bindingHandlers.slideRightMenu = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value));
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).show(400) : $(element).hide(400);
    }
};

});
