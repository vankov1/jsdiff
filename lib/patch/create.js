/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPatch = createPatch;
exports.createTwoFilesPatch = createTwoFilesPatch;
exports.formatPatch = formatPatch;
exports.structuredPatch = structuredPatch;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_line = require("../diff/line")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/*istanbul ignore end*/
function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (!options) {
    options = {};
  }
  if (typeof options.context === 'undefined') {
    options.context = 4;
  }
  var diff =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/
  /*istanbul ignore start*/
  _line
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  diffLines)
  /*istanbul ignore end*/
  (oldStr, newStr, options);
  if (!diff) {
    return;
  }
  diff.push({
    value: '',
    lines: []
  }); // Append an empty value to make cleanup easier

  function contextLines(lines) {
    return lines.map(function (entry) {
      return ' ' + entry;
    });
  }
  var hunks = [];
  var oldRangeStart = 0,
    newRangeStart = 0,
    curRange = [],
    oldLine = 1,
    newLine = 1;
  /*istanbul ignore start*/
  var _loop = function _loop()
  /*istanbul ignore end*/
  {
    var current = diff[i],
      lines = current.lines || current.value.replace(/\n$/, '').split('\n');
    current.lines = lines;
    if (current.added || current.removed) {
      /*istanbul ignore start*/
      var _curRange;
      /*istanbul ignore end*/
      // If we have previous context, start with that
      if (!oldRangeStart) {
        var prev = diff[i - 1];
        oldRangeStart = oldLine;
        newRangeStart = newLine;
        if (prev) {
          curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
          oldRangeStart -= curRange.length;
          newRangeStart -= curRange.length;
        }
      }

      // Output our changes
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      /*istanbul ignore start*/
      (_curRange =
      /*istanbul ignore end*/
      curRange).push.apply(
      /*istanbul ignore start*/
      _curRange
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      lines.map(function (entry) {
        return (current.added ? '+' : '-') + entry;
      })));

      // Track the updated file position
      if (current.added) {
        newLine += lines.length;
      } else {
        oldLine += lines.length;
      }
    } else {
      // Identical context lines. Track line changes
      if (oldRangeStart) {
        // Close out any changes that have been output (or join overlapping)
        if (lines.length <= options.context * 2 && i < diff.length - 2) {
          /*istanbul ignore start*/
          var _curRange2;
          /*istanbul ignore end*/
          // Overlapping
          /*istanbul ignore start*/
          /*istanbul ignore end*/
          /*istanbul ignore start*/
          (_curRange2 =
          /*istanbul ignore end*/
          curRange).push.apply(
          /*istanbul ignore start*/
          _curRange2
          /*istanbul ignore end*/
          ,
          /*istanbul ignore start*/
          _toConsumableArray(
          /*istanbul ignore end*/
          contextLines(lines)));
        } else {
          /*istanbul ignore start*/
          var _curRange3;
          /*istanbul ignore end*/
          // end the range and output
          var contextSize = Math.min(lines.length, options.context);
          /*istanbul ignore start*/
          /*istanbul ignore end*/
          /*istanbul ignore start*/
          (_curRange3 =
          /*istanbul ignore end*/
          curRange).push.apply(
          /*istanbul ignore start*/
          _curRange3
          /*istanbul ignore end*/
          ,
          /*istanbul ignore start*/
          _toConsumableArray(
          /*istanbul ignore end*/
          contextLines(lines.slice(0, contextSize))));
          var hunk = {
            oldStart: oldRangeStart,
            oldLines: oldLine - oldRangeStart + contextSize,
            newStart: newRangeStart,
            newLines: newLine - newRangeStart + contextSize,
            lines: curRange
          };
          if (i >= diff.length - 2 && lines.length <= options.context) {
            // EOF is inside this hunk
            var oldEOFNewline = /\n$/.test(oldStr);
            var newEOFNewline = /\n$/.test(newStr);
            var noNlBeforeAdds = lines.length == 0 && curRange.length > hunk.oldLines;
            if (!oldEOFNewline && noNlBeforeAdds && oldStr.length > 0) {
              // special case: old has no eol and no trailing context; no-nl can end up before adds
              // however, if the old file is empty, do not output the no-nl line
              curRange.splice(hunk.oldLines, 0, '\\ No newline at end of file');
            }
            if (!oldEOFNewline && !noNlBeforeAdds || !newEOFNewline) {
              curRange.push('\\ No newline at end of file');
            }
          }
          hunks.push(hunk);
          oldRangeStart = 0;
          newRangeStart = 0;
          curRange = [];
        }
      }
      oldLine += lines.length;
      newLine += lines.length;
    }
  };
  for (var i = 0; i < diff.length; i++)
  /*istanbul ignore start*/
  {
    _loop();
  }
  /*istanbul ignore end*/
  return {
    oldFileName: oldFileName,
    newFileName: newFileName,
    oldHeader: oldHeader,
    newHeader: newHeader,
    hunks: hunks
  };
}
function formatPatch(diff) {
  if (Array.isArray(diff)) {
    return diff.map(formatPatch).join('\n');
  }
  var ret = [];
  if (diff.oldFileName == diff.newFileName) {
    ret.push('Index: ' + diff.oldFileName);
  }
  ret.push('===================================================================');
  ret.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader));
  ret.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader));
  for (var i = 0; i < diff.hunks.length; i++) {
    var hunk = diff.hunks[i];
    // Unified Diff Format quirk: If the chunk size is 0,
    // the first number is one lower than one would expect.
    // https://www.artima.com/weblogs/viewpost.jsp?thread=164293
    if (hunk.oldLines === 0) {
      hunk.oldStart -= 1;
    }
    if (hunk.newLines === 0) {
      hunk.newStart -= 1;
    }
    ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@');
    ret.push.apply(ret, hunk.lines);
  }
  return ret.join('\n') + '\n';
}
function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  var patchObj = structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options);
  if (!patchObj) {
    return;
  }
  return formatPatch(patchObj);
}
function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbGluZSIsInJlcXVpcmUiLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJhcnIiLCJfYXJyYXlXaXRob3V0SG9sZXMiLCJfaXRlcmFibGVUb0FycmF5IiwiX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5IiwiX25vbkl0ZXJhYmxlU3ByZWFkIiwiVHlwZUVycm9yIiwibyIsIm1pbkxlbiIsIl9hcnJheUxpa2VUb0FycmF5IiwibiIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsInNsaWNlIiwiY29uc3RydWN0b3IiLCJuYW1lIiwiQXJyYXkiLCJmcm9tIiwidGVzdCIsIml0ZXIiLCJTeW1ib2wiLCJpdGVyYXRvciIsImlzQXJyYXkiLCJsZW4iLCJsZW5ndGgiLCJpIiwiYXJyMiIsInN0cnVjdHVyZWRQYXRjaCIsIm9sZEZpbGVOYW1lIiwibmV3RmlsZU5hbWUiLCJvbGRTdHIiLCJuZXdTdHIiLCJvbGRIZWFkZXIiLCJuZXdIZWFkZXIiLCJvcHRpb25zIiwiY29udGV4dCIsImRpZmYiLCJkaWZmTGluZXMiLCJwdXNoIiwidmFsdWUiLCJsaW5lcyIsImNvbnRleHRMaW5lcyIsIm1hcCIsImVudHJ5IiwiaHVua3MiLCJvbGRSYW5nZVN0YXJ0IiwibmV3UmFuZ2VTdGFydCIsImN1clJhbmdlIiwib2xkTGluZSIsIm5ld0xpbmUiLCJfbG9vcCIsImN1cnJlbnQiLCJyZXBsYWNlIiwic3BsaXQiLCJhZGRlZCIsInJlbW92ZWQiLCJfY3VyUmFuZ2UiLCJwcmV2IiwiYXBwbHkiLCJfY3VyUmFuZ2UyIiwiX2N1clJhbmdlMyIsImNvbnRleHRTaXplIiwiTWF0aCIsIm1pbiIsImh1bmsiLCJvbGRTdGFydCIsIm9sZExpbmVzIiwibmV3U3RhcnQiLCJuZXdMaW5lcyIsIm9sZEVPRk5ld2xpbmUiLCJuZXdFT0ZOZXdsaW5lIiwibm9ObEJlZm9yZUFkZHMiLCJzcGxpY2UiLCJmb3JtYXRQYXRjaCIsImpvaW4iLCJyZXQiLCJjcmVhdGVUd29GaWxlc1BhdGNoIiwicGF0Y2hPYmoiLCJjcmVhdGVQYXRjaCIsImZpbGVOYW1lIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BhdGNoL2NyZWF0ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2RpZmZMaW5lc30gZnJvbSAnLi4vZGlmZi9saW5lJztcblxuZXhwb3J0IGZ1bmN0aW9uIHN0cnVjdHVyZWRQYXRjaChvbGRGaWxlTmFtZSwgbmV3RmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmNvbnRleHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgb3B0aW9ucy5jb250ZXh0ID0gNDtcbiAgfVxuXG4gIGNvbnN0IGRpZmYgPSBkaWZmTGluZXMob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xuICBpZighZGlmZikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGRpZmYucHVzaCh7dmFsdWU6ICcnLCBsaW5lczogW119KTsgLy8gQXBwZW5kIGFuIGVtcHR5IHZhbHVlIHRvIG1ha2UgY2xlYW51cCBlYXNpZXJcblxuICBmdW5jdGlvbiBjb250ZXh0TGluZXMobGluZXMpIHtcbiAgICByZXR1cm4gbGluZXMubWFwKGZ1bmN0aW9uKGVudHJ5KSB7IHJldHVybiAnICcgKyBlbnRyeTsgfSk7XG4gIH1cblxuICBsZXQgaHVua3MgPSBbXTtcbiAgbGV0IG9sZFJhbmdlU3RhcnQgPSAwLCBuZXdSYW5nZVN0YXJ0ID0gMCwgY3VyUmFuZ2UgPSBbXSxcbiAgICAgIG9sZExpbmUgPSAxLCBuZXdMaW5lID0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY3VycmVudCA9IGRpZmZbaV0sXG4gICAgICAgICAgbGluZXMgPSBjdXJyZW50LmxpbmVzIHx8IGN1cnJlbnQudmFsdWUucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG4gICAgY3VycmVudC5saW5lcyA9IGxpbmVzO1xuXG4gICAgaWYgKGN1cnJlbnQuYWRkZWQgfHwgY3VycmVudC5yZW1vdmVkKSB7XG4gICAgICAvLyBJZiB3ZSBoYXZlIHByZXZpb3VzIGNvbnRleHQsIHN0YXJ0IHdpdGggdGhhdFxuICAgICAgaWYgKCFvbGRSYW5nZVN0YXJ0KSB7XG4gICAgICAgIGNvbnN0IHByZXYgPSBkaWZmW2kgLSAxXTtcbiAgICAgICAgb2xkUmFuZ2VTdGFydCA9IG9sZExpbmU7XG4gICAgICAgIG5ld1JhbmdlU3RhcnQgPSBuZXdMaW5lO1xuXG4gICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgY3VyUmFuZ2UgPSBvcHRpb25zLmNvbnRleHQgPiAwID8gY29udGV4dExpbmVzKHByZXYubGluZXMuc2xpY2UoLW9wdGlvbnMuY29udGV4dCkpIDogW107XG4gICAgICAgICAgb2xkUmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgICAgbmV3UmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT3V0cHV0IG91ciBjaGFuZ2VzXG4gICAgICBjdXJSYW5nZS5wdXNoKC4uLiBsaW5lcy5tYXAoZnVuY3Rpb24oZW50cnkpIHtcbiAgICAgICAgcmV0dXJuIChjdXJyZW50LmFkZGVkID8gJysnIDogJy0nKSArIGVudHJ5O1xuICAgICAgfSkpO1xuXG4gICAgICAvLyBUcmFjayB0aGUgdXBkYXRlZCBmaWxlIHBvc2l0aW9uXG4gICAgICBpZiAoY3VycmVudC5hZGRlZCkge1xuICAgICAgICBuZXdMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9sZExpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZGVudGljYWwgY29udGV4dCBsaW5lcy4gVHJhY2sgbGluZSBjaGFuZ2VzXG4gICAgICBpZiAob2xkUmFuZ2VTdGFydCkge1xuICAgICAgICAvLyBDbG9zZSBvdXQgYW55IGNoYW5nZXMgdGhhdCBoYXZlIGJlZW4gb3V0cHV0IChvciBqb2luIG92ZXJsYXBwaW5nKVxuICAgICAgICBpZiAobGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCAqIDIgJiYgaSA8IGRpZmYubGVuZ3RoIC0gMikge1xuICAgICAgICAgIC8vIE92ZXJsYXBwaW5nXG4gICAgICAgICAgY3VyUmFuZ2UucHVzaCguLi4gY29udGV4dExpbmVzKGxpbmVzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZW5kIHRoZSByYW5nZSBhbmQgb3V0cHV0XG4gICAgICAgICAgbGV0IGNvbnRleHRTaXplID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBvcHRpb25zLmNvbnRleHQpO1xuICAgICAgICAgIGN1clJhbmdlLnB1c2goLi4uIGNvbnRleHRMaW5lcyhsaW5lcy5zbGljZSgwLCBjb250ZXh0U2l6ZSkpKTtcblxuICAgICAgICAgIGxldCBodW5rID0ge1xuICAgICAgICAgICAgb2xkU3RhcnQ6IG9sZFJhbmdlU3RhcnQsXG4gICAgICAgICAgICBvbGRMaW5lczogKG9sZExpbmUgLSBvbGRSYW5nZVN0YXJ0ICsgY29udGV4dFNpemUpLFxuICAgICAgICAgICAgbmV3U3RhcnQ6IG5ld1JhbmdlU3RhcnQsXG4gICAgICAgICAgICBuZXdMaW5lczogKG5ld0xpbmUgLSBuZXdSYW5nZVN0YXJ0ICsgY29udGV4dFNpemUpLFxuICAgICAgICAgICAgbGluZXM6IGN1clJhbmdlXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaSA+PSBkaWZmLmxlbmd0aCAtIDIgJiYgbGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCkge1xuICAgICAgICAgICAgLy8gRU9GIGlzIGluc2lkZSB0aGlzIGh1bmtcbiAgICAgICAgICAgIGxldCBvbGRFT0ZOZXdsaW5lID0gKCgvXFxuJC8pLnRlc3Qob2xkU3RyKSk7XG4gICAgICAgICAgICBsZXQgbmV3RU9GTmV3bGluZSA9ICgoL1xcbiQvKS50ZXN0KG5ld1N0cikpO1xuICAgICAgICAgICAgbGV0IG5vTmxCZWZvcmVBZGRzID0gbGluZXMubGVuZ3RoID09IDAgJiYgY3VyUmFuZ2UubGVuZ3RoID4gaHVuay5vbGRMaW5lcztcbiAgICAgICAgICAgIGlmICghb2xkRU9GTmV3bGluZSAmJiBub05sQmVmb3JlQWRkcyAmJiBvbGRTdHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IG9sZCBoYXMgbm8gZW9sIGFuZCBubyB0cmFpbGluZyBjb250ZXh0OyBuby1ubCBjYW4gZW5kIHVwIGJlZm9yZSBhZGRzXG4gICAgICAgICAgICAgIC8vIGhvd2V2ZXIsIGlmIHRoZSBvbGQgZmlsZSBpcyBlbXB0eSwgZG8gbm90IG91dHB1dCB0aGUgbm8tbmwgbGluZVxuICAgICAgICAgICAgICBjdXJSYW5nZS5zcGxpY2UoaHVuay5vbGRMaW5lcywgMCwgJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCghb2xkRU9GTmV3bGluZSAmJiAhbm9ObEJlZm9yZUFkZHMpIHx8ICFuZXdFT0ZOZXdsaW5lKSB7XG4gICAgICAgICAgICAgIGN1clJhbmdlLnB1c2goJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBodW5rcy5wdXNoKGh1bmspO1xuXG4gICAgICAgICAgb2xkUmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgbmV3UmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgY3VyUmFuZ2UgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb2xkTGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICBuZXdMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9sZEZpbGVOYW1lOiBvbGRGaWxlTmFtZSwgbmV3RmlsZU5hbWU6IG5ld0ZpbGVOYW1lLFxuICAgIG9sZEhlYWRlcjogb2xkSGVhZGVyLCBuZXdIZWFkZXI6IG5ld0hlYWRlcixcbiAgICBodW5rczogaHVua3NcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFBhdGNoKGRpZmYpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZGlmZikpIHtcbiAgICByZXR1cm4gZGlmZi5tYXAoZm9ybWF0UGF0Y2gpLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgY29uc3QgcmV0ID0gW107XG4gIGlmIChkaWZmLm9sZEZpbGVOYW1lID09IGRpZmYubmV3RmlsZU5hbWUpIHtcbiAgICByZXQucHVzaCgnSW5kZXg6ICcgKyBkaWZmLm9sZEZpbGVOYW1lKTtcbiAgfVxuICByZXQucHVzaCgnPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PScpO1xuICByZXQucHVzaCgnLS0tICcgKyBkaWZmLm9sZEZpbGVOYW1lICsgKHR5cGVvZiBkaWZmLm9sZEhlYWRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6ICdcXHQnICsgZGlmZi5vbGRIZWFkZXIpKTtcbiAgcmV0LnB1c2goJysrKyAnICsgZGlmZi5uZXdGaWxlTmFtZSArICh0eXBlb2YgZGlmZi5uZXdIZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJycgOiAnXFx0JyArIGRpZmYubmV3SGVhZGVyKSk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmLmh1bmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgaHVuayA9IGRpZmYuaHVua3NbaV07XG4gICAgLy8gVW5pZmllZCBEaWZmIEZvcm1hdCBxdWlyazogSWYgdGhlIGNodW5rIHNpemUgaXMgMCxcbiAgICAvLyB0aGUgZmlyc3QgbnVtYmVyIGlzIG9uZSBsb3dlciB0aGFuIG9uZSB3b3VsZCBleHBlY3QuXG4gICAgLy8gaHR0cHM6Ly93d3cuYXJ0aW1hLmNvbS93ZWJsb2dzL3ZpZXdwb3N0LmpzcD90aHJlYWQ9MTY0MjkzXG4gICAgaWYgKGh1bmsub2xkTGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsub2xkU3RhcnQgLT0gMTtcbiAgICB9XG4gICAgaWYgKGh1bmsubmV3TGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsubmV3U3RhcnQgLT0gMTtcbiAgICB9XG4gICAgcmV0LnB1c2goXG4gICAgICAnQEAgLScgKyBodW5rLm9sZFN0YXJ0ICsgJywnICsgaHVuay5vbGRMaW5lc1xuICAgICAgKyAnICsnICsgaHVuay5uZXdTdGFydCArICcsJyArIGh1bmsubmV3TGluZXNcbiAgICAgICsgJyBAQCdcbiAgICApO1xuICAgIHJldC5wdXNoLmFwcGx5KHJldCwgaHVuay5saW5lcyk7XG4gIH1cblxuICByZXR1cm4gcmV0LmpvaW4oJ1xcbicpICsgJ1xcbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUd29GaWxlc1BhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIGNvbnN0IHBhdGNoT2JqID0gc3RydWN0dXJlZFBhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKTtcbiAgaWYgKCFwYXRjaE9iaikge1xuICAgIHJldHVybjtcbiAgfVxuICByZXR1cm4gZm9ybWF0UGF0Y2gocGF0Y2hPYmopO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGF0Y2goZmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykge1xuICByZXR1cm4gY3JlYXRlVHdvRmlsZXNQYXRjaChmaWxlTmFtZSwgZmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucyk7XG59XG4iXSwibWFw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
