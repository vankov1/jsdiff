/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reversePatch = reversePatch;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*istanbul ignore end*/
function reversePatch(structuredPatch) {
  if (Array.isArray(structuredPatch)) {
    return structuredPatch.map(reversePatch).reverse();
  }
  return (
    /*istanbul ignore start*/
    _objectSpread(_objectSpread({},
    /*istanbul ignore end*/
    structuredPatch), {}, {
      oldFileName: structuredPatch.newFileName,
      oldHeader: structuredPatch.newHeader,
      newFileName: structuredPatch.oldFileName,
      newHeader: structuredPatch.oldHeader,
      hunks: structuredPatch.hunks.map(function (hunk) {
        return {
          oldLines: hunk.newLines,
          oldStart: hunk.newStart,
          newLines: hunk.oldLines,
          newStart: hunk.oldStart,
          linedelimiters: hunk.linedelimiters,
          lines: hunk.lines.map(function (l) {
            if (l.startsWith('-')) {
              return (
                /*istanbul ignore start*/
                "+".concat(
                /*istanbul ignore end*/
                l.slice(1))
              );
            }
            if (l.startsWith('+')) {
              return (
                /*istanbul ignore start*/
                "-".concat(
                /*istanbul ignore end*/
                l.slice(1))
              );
            }
            return l;
          })
        };
      })
    })
  );
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJyZXZlcnNlUGF0Y2giLCJzdHJ1Y3R1cmVkUGF0Y2giLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJyZXZlcnNlIiwiX29iamVjdFNwcmVhZCIsIm9sZEZpbGVOYW1lIiwibmV3RmlsZU5hbWUiLCJvbGRIZWFkZXIiLCJuZXdIZWFkZXIiLCJodW5rcyIsImh1bmsiLCJvbGRMaW5lcyIsIm5ld0xpbmVzIiwib2xkU3RhcnQiLCJuZXdTdGFydCIsImxpbmVkZWxpbWl0ZXJzIiwibGluZXMiLCJsIiwic3RhcnRzV2l0aCIsImNvbmNhdCIsInNsaWNlIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BhdGNoL3JldmVyc2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHJldmVyc2VQYXRjaChzdHJ1Y3R1cmVkUGF0Y2gpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoc3RydWN0dXJlZFBhdGNoKSkge1xuICAgIHJldHVybiBzdHJ1Y3R1cmVkUGF0Y2gubWFwKHJldmVyc2VQYXRjaCkucmV2ZXJzZSgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdHJ1Y3R1cmVkUGF0Y2gsXG4gICAgb2xkRmlsZU5hbWU6IHN0cnVjdHVyZWRQYXRjaC5uZXdGaWxlTmFtZSxcbiAgICBvbGRIZWFkZXI6IHN0cnVjdHVyZWRQYXRjaC5uZXdIZWFkZXIsXG4gICAgbmV3RmlsZU5hbWU6IHN0cnVjdHVyZWRQYXRjaC5vbGRGaWxlTmFtZSxcbiAgICBuZXdIZWFkZXI6IHN0cnVjdHVyZWRQYXRjaC5vbGRIZWFkZXIsXG4gICAgaHVua3M6IHN0cnVjdHVyZWRQYXRjaC5odW5rcy5tYXAoaHVuayA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvbGRMaW5lczogaHVuay5uZXdMaW5lcyxcbiAgICAgICAgb2xkU3RhcnQ6IGh1bmsubmV3U3RhcnQsXG4gICAgICAgIG5ld0xpbmVzOiBodW5rLm9sZExpbmVzLFxuICAgICAgICBuZXdTdGFydDogaHVuay5vbGRTdGFydCxcbiAgICAgICAgbGluZWRlbGltaXRlcnM6IGh1bmsubGluZWRlbGltaXRlcnMsXG4gICAgICAgIGxpbmVzOiBodW5rLmxpbmVzLm1hcChsID0+IHtcbiAgICAgICAgICBpZiAobC5zdGFydHNXaXRoKCctJykpIHsgcmV0dXJuIGArJHtsLnNsaWNlKDEpfWA7IH1cbiAgICAgICAgICBpZiAobC5zdGFydHNXaXRoKCcrJykpIHsgcmV0dXJuIGAtJHtsLnNsaWNlKDEpfWA7IH1cbiAgICAgICAgICByZXR1cm4gbDtcbiAgICAgICAgfSlcbiAgICAgIH07XG4gICAgfSlcbiAgfTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBTyxTQUFTQSxZQUFZQSxDQUFDQyxlQUFlLEVBQUU7RUFDNUMsSUFBSUMsS0FBSyxDQUFDQyxPQUFPLENBQUNGLGVBQWUsQ0FBQyxFQUFFO0lBQ2xDLE9BQU9BLGVBQWUsQ0FBQ0csR0FBRyxDQUFDSixZQUFZLENBQUMsQ0FBQ0ssT0FBTyxDQUFDLENBQUM7RUFDcEQ7RUFFQTtJQUFBO0lBQUFDLGFBQUEsQ0FBQUEsYUFBQTtJQUFBO0lBQ0tMLGVBQWU7TUFDbEJNLFdBQVcsRUFBRU4sZUFBZSxDQUFDTyxXQUFXO01BQ3hDQyxTQUFTLEVBQUVSLGVBQWUsQ0FBQ1MsU0FBUztNQUNwQ0YsV0FBVyxFQUFFUCxlQUFlLENBQUNNLFdBQVc7TUFDeENHLFNBQVMsRUFBRVQsZUFBZSxDQUFDUSxTQUFTO01BQ3BDRSxLQUFLLEVBQUVWLGVBQWUsQ0FBQ1UsS0FBSyxDQUFDUCxHQUFHLENBQUMsVUFBQVEsSUFBSSxFQUFJO1FBQ3ZDLE9BQU87VUFDTEMsUUFBUSxFQUFFRCxJQUFJLENBQUNFLFFBQVE7VUFDdkJDLFFBQVEsRUFBRUgsSUFBSSxDQUFDSSxRQUFRO1VBQ3ZCRixRQUFRLEVBQUVGLElBQUksQ0FBQ0MsUUFBUTtVQUN2QkcsUUFBUSxFQUFFSixJQUFJLENBQUNHLFFBQVE7VUFDdkJFLGNBQWMsRUFBRUwsSUFBSSxDQUFDSyxjQUFjO1VBQ25DQyxLQUFLLEVBQUVOLElBQUksQ0FBQ00sS0FBSyxDQUFDZCxHQUFHLENBQUMsVUFBQWUsQ0FBQyxFQUFJO1lBQ3pCLElBQUlBLENBQUMsQ0FBQ0MsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO2NBQUU7Z0JBQUE7Z0JBQUEsSUFBQUMsTUFBQTtnQkFBQTtnQkFBV0YsQ0FBQyxDQUFDRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2NBQUE7WUFBSTtZQUNsRCxJQUFJSCxDQUFDLENBQUNDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtjQUFFO2dCQUFBO2dCQUFBLElBQUFDLE1BQUE7Z0JBQUE7Z0JBQVdGLENBQUMsQ0FBQ0csS0FBSyxDQUFDLENBQUMsQ0FBQztjQUFBO1lBQUk7WUFDbEQsT0FBT0gsQ0FBQztVQUNWLENBQUM7UUFDSCxDQUFDO01BQ0gsQ0FBQztJQUFDO0VBQUE7QUFFTiJ9
