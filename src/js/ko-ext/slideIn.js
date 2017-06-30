define(['knockout', 'jQuery'], function(ko) {

ko.bindingHandlers.slideIn = {
  init: function (element, valueAccessor) {
    var value = ko.utils.unwrapObservable(valueAccessor());
    $(element).toggle(value);
  },
  update: function (element, valueAccessor) {
    var value = ko.utils.unwrapObservable(valueAccessor());
    value ? $(element).slideDown() : $(element).slideUp();
  }
};

});
