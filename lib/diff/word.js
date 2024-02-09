/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffWords = diffWords;
exports.diffWordsWithSpace = diffWordsWithSpace;
exports.wordDiff = void 0;
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
// Based on https://en.wikipedia.org/wiki/Latin_script_in_Unicode
//
// Ranges and exceptions:
// Latin-1 Supplement, 0080–00FF
//  - U+00D7  × Multiplication sign
//  - U+00F7  ÷ Division sign
// Latin Extended-A, 0100–017F
// Latin Extended-B, 0180–024F
// IPA Extensions, 0250–02AF
// Spacing Modifier Letters, 02B0–02FF
//  - U+02C7  ˇ &#711;  Caron
//  - U+02D8  ˘ &#728;  Breve
//  - U+02D9  ˙ &#729;  Dot Above
//  - U+02DA  ˚ &#730;  Ring Above
//  - U+02DB  ˛ &#731;  Ogonek
//  - U+02DC  ˜ &#732;  Small Tilde
//  - U+02DD  ˝ &#733;  Double Acute Accent
// Latin Extended Additional, 1E00–1EFF
var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var reWhitespace = /\S/;
var wordDiff =
/*istanbul ignore start*/
exports.wordDiff =
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
wordDiff.equals = function (left, right) {
  if (this.options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }
  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};
wordDiff.tokenize = function (value) {
  // All whitespace symbols except newline group into one token, each newline - in separate token
  var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/);

  // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.
  for (var i = 0; i < tokens.length - 1; i++) {
    // If we have an empty string in the next field and we have only word chars before and after, merge
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }
  return tokens;
};
function diffWords(oldStr, newStr, options) {
  options =
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
  (options, {
    ignoreWhitespace: true
  });
  return wordDiff.diff(oldStr, newStr, options);
}
function diffWordsWithSpace(oldStr, newStr, options) {
  return wordDiff.diff(oldStr, newStr, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmFzZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3BhcmFtcyIsIm9iaiIsIl9fZXNNb2R1bGUiLCJleHRlbmRlZFdvcmRDaGFycyIsInJlV2hpdGVzcGFjZSIsIndvcmREaWZmIiwiZXhwb3J0cyIsIkRpZmYiLCJlcXVhbHMiLCJsZWZ0IiwicmlnaHQiLCJvcHRpb25zIiwiaWdub3JlQ2FzZSIsInRvTG93ZXJDYXNlIiwiaWdub3JlV2hpdGVzcGFjZSIsInRlc3QiLCJ0b2tlbml6ZSIsInZhbHVlIiwidG9rZW5zIiwic3BsaXQiLCJpIiwibGVuZ3RoIiwic3BsaWNlIiwiZGlmZldvcmRzIiwib2xkU3RyIiwibmV3U3RyIiwiZ2VuZXJhdGVPcHRpb25zIiwiZGlmZiIsImRpZmZXb3Jkc1dpdGhTcGFjZSJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL3dvcmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7Z2VuZXJhdGVPcHRpb25zfSBmcm9tICcuLi91dGlsL3BhcmFtcyc7XG5cbi8vIEJhc2VkIG9uIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xhdGluX3NjcmlwdF9pbl9Vbmljb2RlXG4vL1xuLy8gUmFuZ2VzIGFuZCBleGNlcHRpb25zOlxuLy8gTGF0aW4tMSBTdXBwbGVtZW50LCAwMDgw4oCTMDBGRlxuLy8gIC0gVSswMEQ3ICDDlyBNdWx0aXBsaWNhdGlvbiBzaWduXG4vLyAgLSBVKzAwRjcgIMO3IERpdmlzaW9uIHNpZ25cbi8vIExhdGluIEV4dGVuZGVkLUEsIDAxMDDigJMwMTdGXG4vLyBMYXRpbiBFeHRlbmRlZC1CLCAwMTgw4oCTMDI0RlxuLy8gSVBBIEV4dGVuc2lvbnMsIDAyNTDigJMwMkFGXG4vLyBTcGFjaW5nIE1vZGlmaWVyIExldHRlcnMsIDAyQjDigJMwMkZGXG4vLyAgLSBVKzAyQzcgIMuHICYjNzExOyAgQ2Fyb25cbi8vICAtIFUrMDJEOCAgy5ggJiM3Mjg7ICBCcmV2ZVxuLy8gIC0gVSswMkQ5ICDLmSAmIzcyOTsgIERvdCBBYm92ZVxuLy8gIC0gVSswMkRBICDLmiAmIzczMDsgIFJpbmcgQWJvdmVcbi8vICAtIFUrMDJEQiAgy5sgJiM3MzE7ICBPZ29uZWtcbi8vICAtIFUrMDJEQyAgy5wgJiM3MzI7ICBTbWFsbCBUaWxkZVxuLy8gIC0gVSswMkREICDLnSAmIzczMzsgIERvdWJsZSBBY3V0ZSBBY2NlbnRcbi8vIExhdGluIEV4dGVuZGVkIEFkZGl0aW9uYWwsIDFFMDDigJMxRUZGXG5jb25zdCBleHRlbmRlZFdvcmRDaGFycyA9IC9eW2EtekEtWlxcdXtDMH0tXFx1e0ZGfVxcdXtEOH0tXFx1e0Y2fVxcdXtGOH0tXFx1ezJDNn1cXHV7MkM4fS1cXHV7MkQ3fVxcdXsyREV9LVxcdXsyRkZ9XFx1ezFFMDB9LVxcdXsxRUZGfV0rJC91O1xuXG5jb25zdCByZVdoaXRlc3BhY2UgPSAvXFxTLztcblxuZXhwb3J0IGNvbnN0IHdvcmREaWZmID0gbmV3IERpZmYoKTtcbndvcmREaWZmLmVxdWFscyA9IGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSkge1xuICAgIGxlZnQgPSBsZWZ0LnRvTG93ZXJDYXNlKCk7XG4gICAgcmlnaHQgPSByaWdodC50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIHJldHVybiBsZWZ0ID09PSByaWdodCB8fCAodGhpcy5vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UgJiYgIXJlV2hpdGVzcGFjZS50ZXN0KGxlZnQpICYmICFyZVdoaXRlc3BhY2UudGVzdChyaWdodCkpO1xufTtcbndvcmREaWZmLnRva2VuaXplID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gQWxsIHdoaXRlc3BhY2Ugc3ltYm9scyBleGNlcHQgbmV3bGluZSBncm91cCBpbnRvIG9uZSB0b2tlbiwgZWFjaCBuZXdsaW5lIC0gaW4gc2VwYXJhdGUgdG9rZW5cbiAgbGV0IHRva2VucyA9IHZhbHVlLnNwbGl0KC8oW15cXFNcXHJcXG5dK3xbKClbXFxde30nXCJcXHJcXG5dfFxcYikvKTtcblxuICAvLyBKb2luIHRoZSBib3VuZGFyeSBzcGxpdHMgdGhhdCB3ZSBkbyBub3QgY29uc2lkZXIgdG8gYmUgYm91bmRhcmllcy4gVGhpcyBpcyBwcmltYXJpbHkgdGhlIGV4dGVuZGVkIExhdGluIGNoYXJhY3RlciBzZXQuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIC8vIElmIHdlIGhhdmUgYW4gZW1wdHkgc3RyaW5nIGluIHRoZSBuZXh0IGZpZWxkIGFuZCB3ZSBoYXZlIG9ubHkgd29yZCBjaGFycyBiZWZvcmUgYW5kIGFmdGVyLCBtZXJnZVxuICAgIGlmICghdG9rZW5zW2kgKyAxXSAmJiB0b2tlbnNbaSArIDJdXG4gICAgICAgICAgJiYgZXh0ZW5kZWRXb3JkQ2hhcnMudGVzdCh0b2tlbnNbaV0pXG4gICAgICAgICAgJiYgZXh0ZW5kZWRXb3JkQ2hhcnMudGVzdCh0b2tlbnNbaSArIDJdKSkge1xuICAgICAgdG9rZW5zW2ldICs9IHRva2Vuc1tpICsgMl07XG4gICAgICB0b2tlbnMuc3BsaWNlKGkgKyAxLCAyKTtcbiAgICAgIGktLTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG9rZW5zO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZXb3JkcyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICBvcHRpb25zID0gZ2VuZXJhdGVPcHRpb25zKG9wdGlvbnMsIHtpZ25vcmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gIHJldHVybiB3b3JkRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZXb3Jkc1dpdGhTcGFjZShvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICByZXR1cm4gd29yZERpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7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
