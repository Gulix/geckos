define(['viewModels/field-text',
        'viewModels/field-image',
        'viewModels/field-richtext',
        'viewModels/field-color',
        'viewModels/field-checkbox',
        'viewModels/field-multiline',
        'viewModels/field-options',
        'viewModels/field-numeric',
        'viewModels/fields-group'
       ],
       function(text, image, richtext, color, checkbox, multiline, options, numeric, group) {

  return {
    buildField: function(jsonField, sharedConfiguration) {
      var fieldType = '';

      if (jsonField.type != undefined) {
        fieldType = jsonField.type;
      }

      switch(fieldType) {
        case "checkbox":
          return checkbox.build(jsonField); break;
        case "color":
          return color.build(jsonField); break;
        case "image":
          return image.build(jsonField); break;
        case "multiline":
          return multiline.build(jsonField); break;
        case "number":
          return numeric.build(jsonField); break;
        case "options":
          return options.build(jsonField, sharedConfiguration.sharedOptions); break;
        case "richtext":
          return richtext.build(jsonField); break;
        case "group":
          return group.build(jsonField); break;
        default:
          return text.build(jsonField); break;
      }
    }
  }

});
