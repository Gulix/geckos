define([ ], function() {

  // Generates an array describing each character of the HTML text
  // Each character can be bold and/or italic
  // Each line is a <p></p> element in the HTML
  function getCharsTableFromHtml(sHtml) {
    var parsedHtml = $.parseHTML(sHtml);

    // Split into lines
    var charLines = [ ];
    var currentStyle = {
      "isBold": false,
      "isItalic": false
    };

    for (var iLine = 0; iLine < parsedHtml.length; iLine++) {
      var charLine = [ ];
      var currentLine = parsedHtml[iLine];
      if (currentLine.nodeName == '#text') {
        addCharsFromHtml(currentLine, charLine, currentStyle);
      } else {
        for(var iChild = 0; iChild < currentLine.childNodes.length; iChild++) {
          addCharsFromHtml(currentLine.childNodes[iChild], charLine, currentStyle);
        }
      }

      charLines.push(charLine);
    }

    return charLines;
  }

  function addCharsFromHtml(html, charsArray, style) {

    var styleBefore = {
      "isBold": style.isBold,
      "isItalic": style.isItalic
     };

    // Text element - Each char is added to charsArray with the current style
    if (html.nodeName == "#text") {
      for(var iChar = 0; iChar < html.nodeValue.length; iChar++) {
        var charToAdd = {
          "char": html.nodeValue[iChar],
          "bold": ((style != null) && (style.isBold != undefined)) ? style.isBold : false,
          "italic": ((style != null) && (style.isItalic != undefined)) ? style.isItalic : false
        };
        charsArray.push(charToAdd);
      }
    } else {

      if (html.nodeName == "STRONG") {
        style.isBold = true;
      } else if (html.nodeName == "EM") {
        style.isItalic = true;
      }

      for(var iChild = 0; iChild < html.childNodes.length; iChild++) {

        var childElement = html.childNodes[iChild];
        addCharsFromHtml(childElement, charsArray, style);
      }
      style.isBold = styleBefore.isBold;
      style.isItalic = styleBefore.isItalic;
    }
  }

  function getTextFromCharTable(charTable) {
    var text = '';
    for (var iLine = 0; iLine < charTable.length; iLine++) {
      for (var iChar = 0; iChar < charTable[iLine].length; iChar++) {
        text += charTable[iLine][iChar]['char'];
      }
      text += '\n';
    }
    return text;
  }

  function getStylesTablesFromCharTables(charTables) {
    var stylesTables = { };
    for (var iLine = 0; iLine < charTables.length; iLine++) {
      var stylesLine = { };
      var lineWithStyle = false;
      for (var iChar = 0; iChar < charTables[iLine].length; iChar++) {
        var charElement = charTables[iLine][iChar];
        if (charElement["bold"] || charElement['italic']) {
          var charStyle = { };
          if (charElement["bold"]) {
            charStyle['fontWeight'] = 'bold';
          }
          if (charElement["italic"]) {
            charStyle['fontStyle'] = 'italic';
          }
          stylesLine['' + iChar] = charStyle;
          lineWithStyle = true;
        }
      }
      if (lineWithStyle) {
        stylesTables['' + iLine] = stylesLine;
      }
    }
    return stylesTables;
  }

  function getHtmlFromFormattedText(formattedText) {
    // Each line is placed within <p> and </p>
    var lines = formattedText.match(/^.*((\r\n|\n|\r)|$)/gm);
    var fullText = '';
    for(var iLine = 0; iLine < lines.length; iLine++) { fullText += '<p>' + lines[iLine] + '</p>'; }

    // Bold replacement (** becomes <strong>)
    var regexBold = /\*\*(.*?)\*\*/img;
    fullText = fullText.replace(regexBold, function(match, p1, offset, string) { return "<strong>" + p1 + "</strong>"; });

    // Italic replacement (// becomes <em>)
    var regexItalic = /\/\/(.*?)\/\//img;
    fullText = fullText.replace(regexItalic, function(match, p1, offset, string) { return "<em>" + p1 + "</em>"; });

    return fullText;
  }

  // Generates an Array for the Styles property of a FabricJS text element
  // Parse HTML code to define the bold / italic parts of the text
  // Identifiy the line-breaks
  function getStylesArrayFromHtml(htmlText)
  {
    var charTables = getCharsTableFromHtml(htmlText);
    return getStylesTablesFromCharTables(charTables);
  }

  function getTextFromHtml(htmlText)
  {
    var charTables = getCharsTableFromHtml(htmlText);
    return getTextFromCharTable(charTables);
  }

  function getStylesFromFormattedText(formattedText)
  {
    var htmlText = getHtmlFromFormattedText(formattedText);
    return getStylesArrayFromHtml(htmlText);
  }

  return {
    generateStylesFromHtml: function(htmlText)
      { return getStylesArrayFromHtml(htmlText); },
    generateTextFromHtml: function(htmlText)
      { return getTextFromHtml(htmlText); },
    generateStylesFromFormattedText: function(formattedText)
      { return getStylesFromFormattedText(formattedText); }
  }
});
