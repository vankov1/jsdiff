/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canonicalize = canonicalize;
exports.diffJson = diffJson;
exports.jsonDiff = void 0;
/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(require("./base"))
/*istanbul ignore end*/
;
var
/*istanbul ignore start*/
_line = require("./line")
/*istanbul ignore end*/
;
/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*istanbul ignore end*/
var objectPrototypeToString = Object.prototype.toString;
var jsonDiff =
/*istanbul ignore start*/
exports.jsonDiff =
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
// Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:
jsonDiff.useLongestToken = true;
jsonDiff.tokenize =
/*istanbul ignore start*/
_line
/*istanbul ignore end*/
.
/*istanbul ignore start*/
lineDiff
/*istanbul ignore end*/
.tokenize;
jsonDiff.castInput = function (value) {
  var
    /*istanbul ignore start*/
    _this$options =
    /*istanbul ignore end*/
    this.options,
    /*istanbul ignore start*/
    /*istanbul ignore end*/
    undefinedReplacement = _this$options.undefinedReplacement,
    /*istanbul ignore start*/
    _this$options$stringi = _this$options.
    /*istanbul ignore end*/
    stringifyReplacer,
    /*istanbul ignore start*/
    /*istanbul ignore end*/
    stringifyReplacer = _this$options$stringi === void 0 ? function (k, v)
    /*istanbul ignore start*/
    {
      return (
        /*istanbul ignore end*/
        typeof v === 'undefined' ? undefinedReplacement : v
      );
    } : _this$options$stringi;
  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ');
};
jsonDiff.equals = function (left, right) {
  return (
    /*istanbul ignore start*/
    _base
    /*istanbul ignore end*/
    [
    /*istanbul ignore start*/
    "default"
    /*istanbul ignore end*/
    ].prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'))
  );
};
function diffJson(oldObj, newObj, options) {
  return jsonDiff.diff(oldObj, newObj, options);
}

// This function handles the presence of circular references by bailing out when encountering an
// object that is already on the "stack" of items being processed. Accepts an optional replacer
function canonicalize(obj, stack, replacementStack, replacer, key) {
  stack = stack || [];
  replacementStack = replacementStack || [];
  if (replacer) {
    obj = replacer(key, obj);
  }
  var i;
  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }
  var canonicalizedObj;
  if ('[object Array]' === objectPrototypeToString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);
    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
    }
    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }
  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }
  if (
  /*istanbul ignore start*/
  _typeof(
  /*istanbul ignore end*/
  obj) === 'object' && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);
    var sortedKeys = [],
      _key;
    for (_key in obj) {
      /* istanbul ignore else */
      if (obj.hasOwnProperty(_key)) {
        sortedKeys.push(_key);
      }
    }
    sortedKeys.sort();
    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }
    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }
  return canonicalizedObj;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmFzZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2xpbmUiLCJvYmoiLCJfX2VzTW9kdWxlIiwiX3R5cGVvZiIsIm8iLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwib2JqZWN0UHJvdG90eXBlVG9TdHJpbmciLCJPYmplY3QiLCJ0b1N0cmluZyIsImpzb25EaWZmIiwiZXhwb3J0cyIsIkRpZmYiLCJ1c2VMb25nZXN0VG9rZW4iLCJ0b2tlbml6ZSIsImxpbmVEaWZmIiwiY2FzdElucHV0IiwidmFsdWUiLCJfdGhpcyRvcHRpb25zIiwib3B0aW9ucyIsInVuZGVmaW5lZFJlcGxhY2VtZW50IiwiX3RoaXMkb3B0aW9ucyRzdHJpbmdpIiwic3RyaW5naWZ5UmVwbGFjZXIiLCJrIiwidiIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYW5vbmljYWxpemUiLCJlcXVhbHMiLCJsZWZ0IiwicmlnaHQiLCJjYWxsIiwicmVwbGFjZSIsImRpZmZKc29uIiwib2xkT2JqIiwibmV3T2JqIiwiZGlmZiIsInN0YWNrIiwicmVwbGFjZW1lbnRTdGFjayIsInJlcGxhY2VyIiwia2V5IiwiaSIsImxlbmd0aCIsImNhbm9uaWNhbGl6ZWRPYmoiLCJwdXNoIiwiQXJyYXkiLCJwb3AiLCJ0b0pTT04iLCJzb3J0ZWRLZXlzIiwiaGFzT3duUHJvcGVydHkiLCJzb3J0Il0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RpZmYvanNvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRGlmZiBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHtsaW5lRGlmZn0gZnJvbSAnLi9saW5lJztcblxuY29uc3Qgb2JqZWN0UHJvdG90eXBlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5cbmV4cG9ydCBjb25zdCBqc29uRGlmZiA9IG5ldyBEaWZmKCk7XG4vLyBEaXNjcmltaW5hdGUgYmV0d2VlbiB0d28gbGluZXMgb2YgcHJldHR5LXByaW50ZWQsIHNlcmlhbGl6ZWQgSlNPTiB3aGVyZSBvbmUgb2YgdGhlbSBoYXMgYVxuLy8gZGFuZ2xpbmcgY29tbWEgYW5kIHRoZSBvdGhlciBkb2Vzbid0LiBUdXJucyBvdXQgaW5jbHVkaW5nIHRoZSBkYW5nbGluZyBjb21tYSB5aWVsZHMgdGhlIG5pY2VzdCBvdXRwdXQ6XG5qc29uRGlmZi51c2VMb25nZXN0VG9rZW4gPSB0cnVlO1xuXG5qc29uRGlmZi50b2tlbml6ZSA9IGxpbmVEaWZmLnRva2VuaXplO1xuanNvbkRpZmYuY2FzdElucHV0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgY29uc3Qge3VuZGVmaW5lZFJlcGxhY2VtZW50LCBzdHJpbmdpZnlSZXBsYWNlciA9IChrLCB2KSA9PiB0eXBlb2YgdiA9PT0gJ3VuZGVmaW5lZCcgPyB1bmRlZmluZWRSZXBsYWNlbWVudCA6IHZ9ID0gdGhpcy5vcHRpb25zO1xuXG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeShjYW5vbmljYWxpemUodmFsdWUsIG51bGwsIG51bGwsIHN0cmluZ2lmeVJlcGxhY2VyKSwgc3RyaW5naWZ5UmVwbGFjZXIsICcgICcpO1xufTtcbmpzb25EaWZmLmVxdWFscyA9IGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gIHJldHVybiBEaWZmLnByb3RvdHlwZS5lcXVhbHMuY2FsbChqc29uRGlmZiwgbGVmdC5yZXBsYWNlKC8sKFtcXHJcXG5dKS9nLCAnJDEnKSwgcmlnaHQucmVwbGFjZSgvLChbXFxyXFxuXSkvZywgJyQxJykpO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZKc29uKG9sZE9iaiwgbmV3T2JqLCBvcHRpb25zKSB7IHJldHVybiBqc29uRGlmZi5kaWZmKG9sZE9iaiwgbmV3T2JqLCBvcHRpb25zKTsgfVxuXG4vLyBUaGlzIGZ1bmN0aW9uIGhhbmRsZXMgdGhlIHByZXNlbmNlIG9mIGNpcmN1bGFyIHJlZmVyZW5jZXMgYnkgYmFpbGluZyBvdXQgd2hlbiBlbmNvdW50ZXJpbmcgYW5cbi8vIG9iamVjdCB0aGF0IGlzIGFscmVhZHkgb24gdGhlIFwic3RhY2tcIiBvZiBpdGVtcyBiZWluZyBwcm9jZXNzZWQuIEFjY2VwdHMgYW4gb3B0aW9uYWwgcmVwbGFjZXJcbmV4cG9ydCBmdW5jdGlvbiBjYW5vbmljYWxpemUob2JqLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIGtleSkge1xuICBzdGFjayA9IHN0YWNrIHx8IFtdO1xuICByZXBsYWNlbWVudFN0YWNrID0gcmVwbGFjZW1lbnRTdGFjayB8fCBbXTtcblxuICBpZiAocmVwbGFjZXIpIHtcbiAgICBvYmogPSByZXBsYWNlcihrZXksIG9iaik7XG4gIH1cblxuICBsZXQgaTtcblxuICBmb3IgKGkgPSAwOyBpIDwgc3RhY2subGVuZ3RoOyBpICs9IDEpIHtcbiAgICBpZiAoc3RhY2tbaV0gPT09IG9iaikge1xuICAgICAgcmV0dXJuIHJlcGxhY2VtZW50U3RhY2tbaV07XG4gICAgfVxuICB9XG5cbiAgbGV0IGNhbm9uaWNhbGl6ZWRPYmo7XG5cbiAgaWYgKCdbb2JqZWN0IEFycmF5XScgPT09IG9iamVjdFByb3RvdHlwZVRvU3RyaW5nLmNhbGwob2JqKSkge1xuICAgIHN0YWNrLnB1c2gob2JqKTtcbiAgICBjYW5vbmljYWxpemVkT2JqID0gbmV3IEFycmF5KG9iai5sZW5ndGgpO1xuICAgIHJlcGxhY2VtZW50U3RhY2sucHVzaChjYW5vbmljYWxpemVkT2JqKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjYW5vbmljYWxpemVkT2JqW2ldID0gY2Fub25pY2FsaXplKG9ialtpXSwgc3RhY2ssIHJlcGxhY2VtZW50U3RhY2ssIHJlcGxhY2VyLCBrZXkpO1xuICAgIH1cbiAgICBzdGFjay5wb3AoKTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnBvcCgpO1xuICAgIHJldHVybiBjYW5vbmljYWxpemVkT2JqO1xuICB9XG5cbiAgaWYgKG9iaiAmJiBvYmoudG9KU09OKSB7XG4gICAgb2JqID0gb2JqLnRvSlNPTigpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCkge1xuICAgIHN0YWNrLnB1c2gob2JqKTtcbiAgICBjYW5vbmljYWxpemVkT2JqID0ge307XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wdXNoKGNhbm9uaWNhbGl6ZWRPYmopO1xuICAgIGxldCBzb3J0ZWRLZXlzID0gW10sXG4gICAgICAgIGtleTtcbiAgICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgc29ydGVkS2V5cy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfVxuICAgIHNvcnRlZEtleXMuc29ydCgpO1xuICAgIGZvciAoaSA9IDA7IGkgPCBzb3J0ZWRLZXlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBrZXkgPSBzb3J0ZWRLZXlzW2ldO1xuICAgICAgY2Fub25pY2FsaXplZE9ialtrZXldID0gY2Fub25pY2FsaXplKG9ialtrZXldLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIGtleSk7XG4gICAgfVxuICAgIHN0YWNrLnBvcCgpO1xuICAgIHJlcGxhY2VtZW50U3RhY2sucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgY2Fub25pY2FsaXplZE9iaiA9IG9iajtcbiAgfVxuICByZXR1cm4gY2Fub25pY2FsaXplZE9iajtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQUEsS0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQUMsS0FBQSxHQUFBRCxPQUFBO0FBQUE7QUFBQTtBQUFnQyxtQ0FBQUQsdUJBQUFHLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQs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
