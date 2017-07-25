define(['utils'], function(Utils) {

  /* ---------------------------------------------------------- */
  /* -- Create a Style object, based on another style        -- */
  /* -- Child Style is the current style used                -- */
  /* -- Parent Style is the style that the child is based on -- */
  /* ---------------------------------------------------------- */
  function getStyleFromBase(childStyle, parentStyle) {
    var builtStyle = { };

    // Basic properties
    builtStyle.name = (childStyle.name == undefined) ? parentStyle.name : childStyle.name;
    builtStyle.description = (childStyle.description == undefined) ? parentStyle.description : childStyle.description;
    builtStyle.canvasBackground = (childStyle.canvasBackground == undefined) ? parentStyle.canvasBackground : childStyle.canvasBackground;
    builtStyle.canvasWidth = (childStyle.canvasWidth == undefined) ? parentStyle.canvasWidth : childStyle.canvasWidth;
    builtStyle.canvasHeight = (childStyle.canvasHeight == undefined) ? parentStyle.canvasHeight : childStyle.canvasHeight;

    // Fields, identified by 'name'
    builtStyle.fields = [ ];
    // Adding all the fields existing in the parentStyle (modified by the childStyle, if needed)
    _.forEach(parentStyle.fields, function(_parentField) {
      var parentField = Utils.clone(_parentField);
      var childField = getFieldByName(childStyle.fields, parentField.name);
      if (childField == null) {
        // Field not modified by childStyle
        addElementTo(parentField, builtStyle.fields);
      } else {
        addElementTo(Object.assign(parentField, childField), builtStyle.fields);
      }
    });
    // Adding the fields existing only in the childStyle
    _.forEach(childStyle.fields, function(_childField) {
      var childField = Utils.clone(_childField);
      var parentField = getFieldByName(parentStyle.fields, childField.name);
      if (parentField == null) {
        addElementTo(childField, builtStyle.fields);
      }
    });

    // Canvas fields, identified by 'id' (if no id, fields always added)
    builtStyle.canvasFields = [ ];

    // Creating the CanvasFields by populating from the childStyle
    // The fields with an ID look in the child fields to get child-value
    populateCanvasFields(parentStyle.canvasFields, builtStyle.canvasFields, childStyle.canvasFields);

    // Adding the fields from the Child with no ID or an ID not existing in the Parent
    _.forEach(childStyle.canvasFields, function(childField) {
      var parentField = null;
      if (childField.id != undefined) {
        parentField = getCanvasFieldById(parentStyle.canvasFields, childField.id);
      }
      if (parentField == null) {
        addElementTo(childField, builtStyle.canvasFields);
      }
    });

    return builtStyle;
  }

  /* ---------------------------------------------------------------------------------------------- */
  /* -- Recursive loop to populate the canvas fields                                             -- */
  /* -- Some fields have children fields (path-group) that need to be dealt with                 -- */
  /* -- A child style can have a level-1 field with an id linking to level-2 (or deeper) element -- */
  /* ---------------------------------------------------------------------------------------------- */
  function populateCanvasFields(fieldsFromParent, childRootArray, childCanvasFields) {
    var canvasFieldsFromChildStyle = Utils.clone(childCanvasFields);
    _.forEach(fieldsFromParent, function(_fieldFromParent) {
      var fieldFromParent = Utils.clone(_fieldFromParent);
      var fieldForChild = { };

      // If the current 'fieldFromParent' has properties with Array value,
      // each element of the Array is transformed (if needed)
      _.forOwn(fieldFromParent, function(value, key) {
        if (Array.isArray(value)) {
          fieldForChild[key] = [ ];
          populateCanvasFields(value, fieldForChild[key], canvasFieldsFromChildStyle);
        } else {
          fieldForChild[key] = value;
        }
      });

      // If the current 'fieldFromParent' has an ID, we need to know if there is an occurence in the child fields
      if ((fieldFromParent.id != undefined) && (fieldFromParent.id != null)) {
        var childOccurence = getCanvasFieldById(canvasFieldsFromChildStyle, fieldFromParent.id);
        if (childOccurence != null) {
          fieldForChild = Object.assign(fieldForChild, childOccurence);
        }
      }

      addElementTo(fieldForChild, childRootArray);
    });
  }

  function getFieldByName(fields, name) {
    var field = null;
    for (var iField = 0; iField < fields.length; iField++) {
      if (fields[iField].name == name) field = fields[iField];
    }

    return field;
  }

  function getCanvasFieldById(canvasFields, id) {
    var searchedField = null;
    _.forEach(canvasFields, function(field) {
      if ((field.id != null) && (field.id == id)) {
        searchedField = Utils.clone(field);
      } else {
        _.forOwn(field, function(value, key) {
          if (Array.isArray(value)) {
            searchedField = getCanvasFieldById(value, id);
          }
        });
      }
    });

    return searchedField;
  }

  // Simply push the element to an array, unless it is 'ignored'
  function addElementTo(element, arrayTo) {
    if ((element != null) && (arrayTo != null) && (element.ignored != true))
    {
      arrayTo.push(element);
    }
  }

  return {
    getStyleFromBase: function(childStyle, parentStyle) { return getStyleFromBase(childStyle, parentStyle); }
  }
});
