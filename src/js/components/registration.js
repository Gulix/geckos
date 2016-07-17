define(['knockout'], function(ko) {
  return {
    register: function() {

      /****************/
      /* Input Fields */
      /****************/
      ko.components.register('input-checkbox', {
        viewModel: { require: 'components/input-generic' },
        template: { require: 'text!components/input-checkbox/input-checkbox.html' }
      });
      ko.components.register('input-color', {
        viewModel: { require: 'components/input-generic' },
        template: { require: 'text!components/input-color/input-color.html' }
      });
      ko.components.register('input-color-select', {
        viewModel: { require: 'components/input-generic' },
        template: { require: 'text!components/input-color/input-color-select.html' }
      });
      ko.components.register('input-image', {
        viewModel: { require: 'components/input-generic' },
        template: { require: 'text!components/input-image/input-image.html' }
      });
      ko.components.register('input-multiline', {
        viewModel: { require: 'components/input-generic' },
        template: { require: 'text!components/input-multiline/input-multiline.html' }
      });
      ko.components.register('input-numeric', {
        viewModel: { require: 'components/input-generic' },
        template: { require: 'text!components/input-numeric/input-numeric.html' }
      });
      ko.components.register('input-options', {
        viewModel: { require: 'components/input-generic' },
        template: { require: 'text!components/input-options/input-options.html' }
      });
      ko.components.register('input-richtext', {
        viewModel: { require: 'components/input-generic' },
        template: { require: 'text!components/input-richtext/input-richtext.html' }
      });
      ko.components.register('input-text', {
        viewModel: { require: 'components/input-generic' },
        template: { require: 'text!components/input-text/input-text.html' }
      });

      /******************/
      /* Editing a Card */
      /******************/
      ko.components.register('card-editable-fields', {
        viewModel: { require: 'components/card-editable-fields/card-editable-fields' },
        template: { require: 'text!components/card-editable-fields/card-editable-fields.html' }
      });
    }
  };
});
