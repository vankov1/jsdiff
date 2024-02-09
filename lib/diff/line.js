/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffLines = diffLines;
exports.diffTrimmedLines = diffTrimmedLines;
exports.lineDiff = void 0;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_params = require("../util/params")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/*istanbul ignore end*/
var lineDiff =
/*istanbul ignore start*/
exports.lineDiff =
/*istanbul ignore end*/
new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();
lineDiff.tokenize = function (value) {
  if (this.options.stripTrailingCr) {
    // remove one \r before \n to match GNU diff's --strip-trailing-cr behavior
    value = value.replace(/\r\n/g, '\n');
  }
  var retLines = [],
    linesAndNewlines = value.split(/(\n|\r\n)/);

  // Ignore the final empty token that occurs if the string ends with a new line
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  }

  // Merge the content and line separators into single tokens
  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];
    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      }
      retLines.push(line);
    }
  }
  return retLines;
};
function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}
function diffTrimmedLines(oldStr, newStr, callback) {
  var options =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/
  /*istanbul ignore start*/
  _params
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  generateOptions)
  /*istanbul ignore end*/
  (callback, {
    ignoreWhitespace: true
  });
  return lineDiff.diff(oldStr, newStr, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmFzZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3BhcmFtcyIsIm9iaiIsIl9fZXNNb2R1bGUiLCJsaW5lRGlmZiIsImV4cG9ydHMiLCJEaWZmIiwidG9rZW5pemUiLCJ2YWx1ZSIsIm9wdGlvbnMiLCJzdHJpcFRyYWlsaW5nQ3IiLCJyZXBsYWNlIiwicmV0TGluZXMiLCJsaW5lc0FuZE5ld2xpbmVzIiwic3BsaXQiLCJsZW5ndGgiLCJwb3AiLCJpIiwibGluZSIsIm5ld2xpbmVJc1Rva2VuIiwiaWdub3JlV2hpdGVzcGFjZSIsInRyaW0iLCJwdXNoIiwiZGlmZkxpbmVzIiwib2xkU3RyIiwibmV3U3RyIiwiY2FsbGJhY2siLCJkaWZmIiwiZGlmZlRyaW1tZWRMaW5lcyIsImdlbmVyYXRlT3B0aW9ucyJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2xpbmUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7Z2VuZXJhdGVPcHRpb25zfSBmcm9tICcuLi91dGlsL3BhcmFtcyc7XG5cbmV4cG9ydCBjb25zdCBsaW5lRGlmZiA9IG5ldyBEaWZmKCk7XG5saW5lRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmKHRoaXMub3B0aW9ucy5zdHJpcFRyYWlsaW5nQ3IpIHtcbiAgICAvLyByZW1vdmUgb25lIFxcciBiZWZvcmUgXFxuIHRvIG1hdGNoIEdOVSBkaWZmJ3MgLS1zdHJpcC10cmFpbGluZy1jciBiZWhhdmlvclxuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgfVxuXG4gIGxldCByZXRMaW5lcyA9IFtdLFxuICAgICAgbGluZXNBbmROZXdsaW5lcyA9IHZhbHVlLnNwbGl0KC8oXFxufFxcclxcbikvKTtcblxuICAvLyBJZ25vcmUgdGhlIGZpbmFsIGVtcHR5IHRva2VuIHRoYXQgb2NjdXJzIGlmIHRoZSBzdHJpbmcgZW5kcyB3aXRoIGEgbmV3IGxpbmVcbiAgaWYgKCFsaW5lc0FuZE5ld2xpbmVzW2xpbmVzQW5kTmV3bGluZXMubGVuZ3RoIC0gMV0pIHtcbiAgICBsaW5lc0FuZE5ld2xpbmVzLnBvcCgpO1xuICB9XG5cbiAgLy8gTWVyZ2UgdGhlIGNvbnRlbnQgYW5kIGxpbmUgc2VwYXJhdG9ycyBpbnRvIHNpbmdsZSB0b2tlbnNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lc0FuZE5ld2xpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGxpbmUgPSBsaW5lc0FuZE5ld2xpbmVzW2ldO1xuXG4gICAgaWYgKGkgJSAyICYmICF0aGlzLm9wdGlvbnMubmV3bGluZUlzVG9rZW4pIHtcbiAgICAgIHJldExpbmVzW3JldExpbmVzLmxlbmd0aCAtIDFdICs9IGxpbmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSkge1xuICAgICAgICBsaW5lID0gbGluZS50cmltKCk7XG4gICAgICB9XG4gICAgICByZXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXRMaW5lcztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmTGluZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7IHJldHVybiBsaW5lRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7IH1cbmV4cG9ydCBmdW5jdGlvbiBkaWZmVHJpbW1lZExpbmVzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICBsZXQgb3B0aW9ucyA9IGdlbmVyYXRlT3B0aW9ucyhjYWxsYmFjaywge2lnbm9yZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgcmV0dXJuIGxpbmVEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBQSxLQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBQyxPQUFBLEdBQUFELE9BQUE7QUFBQTtBQUFBO0FBQStDLG1DQUFBRCx1QkFBQUcsR0FBQSxXQUFBQSxHQUFBLElBQUFBLEdBQUEsQ0FBQUMsVUFBQSxHQUFBRCxHQUFBLGdCQUFBQSxHQUFBO0FBQUE7QUFFeEMsSUFBTUUsUUFBUTtBQUFBO0FBQUFDLE9BQUEsQ0FBQUQsUUFBQTtBQUFBO0FBQUc7QUFBSUU7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUEsQ0FBSSxDQUFDLENBQUM7QUFDbENGLFFBQVEsQ0FBQ0csUUFBUSxHQUFHLFVBQVNDLEtBQUssRUFBRTtFQUNsQyxJQUFHLElBQUksQ0FBQ0MsT0FBTyxDQUFDQyxlQUFlLEVBQUU7SUFDL0I7SUFDQUYsS0FBSyxHQUFHQSxLQUFLLENBQUNHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDO0VBQ3RDO0VBRUEsSUFBSUMsUUFBUSxHQUFHLEVBQUU7SUFDYkMsZ0JBQWdCLEdBQUdMLEtBQUssQ0FBQ00sS0FBSyxDQUFDLFdBQVcsQ0FBQzs7RUFFL0M7RUFDQSxJQUFJLENBQUNELGdCQUFnQixDQUFDQSxnQkFBZ0IsQ0FBQ0UsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFO0lBQ2xERixnQkFBZ0IsQ0FBQ0csR0FBRyxDQUFDLENBQUM7RUFDeEI7O0VBRUE7RUFDQSxLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0osZ0JBQWdCLENBQUNFLE1BQU0sRUFBRUUsQ0FBQyxFQUFFLEVBQUU7SUFDaEQsSUFBSUMsSUFBSSxHQUFHTCxnQkFBZ0IsQ0FBQ0ksQ0FBQyxDQUFDO0lBRTlCLElBQUlBLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUNSLE9BQU8sQ0FBQ1UsY0FBYyxFQUFFO01BQ3pDUCxRQUFRLENBQUNBLFFBQVEsQ0FBQ0csTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJRyxJQUFJO0lBQ3ZDLENBQUMsTUFBTTtNQUNMLElBQUksSUFBSSxDQUFDVCxPQUFPLENBQUNXLGdCQUFnQixFQUFFO1FBQ2pDRixJQUFJLEdBQUdBLElBQUksQ0FBQ0csSUFBSSxDQUFDLENBQUM7TUFDcEI7TUFDQVQsUUFBUSxDQUFDVSxJQUFJLENBQUNKLElBQUksQ0FBQztJQUNyQjtFQUNGO0VBRUEsT0FBT04sUUFBUTtBQUNqQixDQUFDO0FBRU0sU0FBU1csU0FBU0EsQ0FBQ0MsTUFBTSxFQUFFQyxNQUFNLEVBQUVDLFFBQVEsRUFBRTtFQUFFLE9BQU90QixRQUFRLENBQUN1QixJQUFJLENBQUNILE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxRQUFRLENBQUM7QUFBRTtBQUMvRixTQUFTRSxnQkFBZ0JBLENBQUNKLE1BQU0sRUFBRUMsTUFBTSxFQUFFQyxRQUFRLEVBQUU7RUFDekQsSUFBSWpCLE9BQU87RUFBRztFQUFBO0VBQUE7RUFBQW9CO0VBQUFBO0VBQUFBO0VBQUFBO0VBQUFBO0VBQUFBLGVBQWU7RUFBQTtFQUFBLENBQUNILFFBQVEsRUFBRTtJQUFDTixnQkFBZ0IsRUFBRTtFQUFJLENBQUMsQ0FBQztFQUNqRSxPQUFPaEIsUUFBUSxDQUFDdUIsSUFBSSxDQUFDSCxNQUFNLEVBQUVDLE1BQU0sRUFBRWhCLE9BQU8sQ0FBQztBQUMvQyJ9
