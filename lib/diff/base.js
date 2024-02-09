/*istanbul ignore start*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Diff;
/*istanbul ignore end*/
function Diff() {}
Diff.prototype = {
  /*istanbul ignore start*/
  /*istanbul ignore end*/
  diff: function diff(oldString, newString) {
    /*istanbul ignore start*/
    var _options$timeout;
    var
    /*istanbul ignore end*/
    options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = options.callback;
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    this.options = options;
    var self = this;
    function done(value) {
      if (callback) {
        setTimeout(function () {
          callback(undefined, value);
        }, 0);
        return true;
      } else {
        return value;
      }
    }

    // Allow subclasses to massage the input prior to running
    oldString = this.castInput(oldString);
    newString = this.castInput(newString);
    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));
    var newLen = newString.length,
      oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    if (options.maxEditLength != null) {
      maxEditLength = Math.min(maxEditLength, options.maxEditLength);
    }
    var maxExecutionTime =
    /*istanbul ignore start*/
    (_options$timeout =
    /*istanbul ignore end*/
    options.timeout) !== null && _options$timeout !== void 0 ? _options$timeout : Infinity;
    var abortAfterTimestamp = Date.now() + maxExecutionTime;
    var bestPath = [{
      oldPos: -1,
      lastComponent: undefined
    }];

    // Seed editLength = 0, i.e. the content starts with the same values
    var newPos = this.extractCommon(bestPath[0], newString, oldString, 0);
    if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
      // Identity per the equality and tokenizer
      return done(buildValues(self, bestPath[0].lastComponent, newString, oldString, self.useLongestToken));
    }

    // Once we hit the right edge of the edit graph on some diagonal k, we can
    // definitely reach the end of the edit graph in no more than k edits, so
    // there's no point in considering any moves to diagonal k+1 any more (from
    // which we're guaranteed to need at least k+1 more edits).
    // Similarly, once we've reached the bottom of the edit graph, there's no
    // point considering moves to lower diagonals.
    // We record this fact by setting minDiagonalToConsider and
    // maxDiagonalToConsider to some finite value once we've hit the edge of
    // the edit graph.
    // This optimization is not faithful to the original algorithm presented in
    // Myers's paper, which instead pointlessly extends D-paths off the end of
    // the edit graph - see page 7 of Myers's paper which notes this point
    // explicitly and illustrates it with a diagram. This has major performance
    // implications for some common scenarios. For instance, to compute a diff
    // where the new text simply appends d characters on the end of the
    // original text of length n, the true Myers algorithm will take O(n+d^2)
    // time while this optimization needs only O(n+d) time.
    var minDiagonalToConsider = -Infinity,
      maxDiagonalToConsider = Infinity;

    // Main worker method. checks all permutations of a given edit length for acceptance.
    function execEditLength() {
      for (var diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
        var basePath =
        /*istanbul ignore start*/
        void 0
        /*istanbul ignore end*/
        ;
        var removePath = bestPath[diagonalPath - 1],
          addPath = bestPath[diagonalPath + 1];
        if (removePath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }
        var canAdd = false;
        if (addPath) {
          // what newPos will be after we do an insertion:
          var addPathNewPos = addPath.oldPos - diagonalPath;
          canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
        }
        var canRemove = removePath && removePath.oldPos + 1 < oldLen;
        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          bestPath[diagonalPath] = undefined;
          continue;
        }

        // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the old string is the farthest from the origin
        // and does not pass the bounds of the diff graph
        if (!canRemove || canAdd && removePath.oldPos < addPath.oldPos) {
          basePath = self.addToPath(addPath, true, false, 0);
        } else {
          basePath = self.addToPath(removePath, false, true, 1);
        }
        newPos = self.extractCommon(basePath, newString, oldString, diagonalPath);
        if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
          // If we have hit the end of both strings, then we are done
          return done(buildValues(self, basePath.lastComponent, newString, oldString, self.useLongestToken));
        } else {
          bestPath[diagonalPath] = basePath;
          if (basePath.oldPos + 1 >= oldLen) {
            maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
          }
          if (newPos + 1 >= newLen) {
            minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
          }
        }
      }
      editLength++;
    }

    // Performs the length of edit iteration. Is a bit fugly as this has to support the
    // sync and async mode which is never fun. Loops over execEditLength until a value
    // is produced, or until the edit length exceeds options.maxEditLength (if given),
    // in which case it will return undefined.
    if (callback) {
      (function exec() {
        setTimeout(function () {
          if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
            return callback();
          }
          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
        var ret = execEditLength();
        if (ret) {
          return ret;
        }
      }
    }
  },
  /*istanbul ignore start*/
  /*istanbul ignore end*/
  addToPath: function addToPath(path, added, removed, oldPosInc) {
    var last = path.lastComponent;
    if (last && !this.options.oneChangePerToken && last.added === added && last.removed === removed) {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: last.count + 1,
          added: added,
          removed: removed,
          previousComponent: last.previousComponent
        }
      };
    } else {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: 1,
          added: added,
          removed: removed,
          previousComponent: last
        }
      };
    }
  },
  /*istanbul ignore start*/
  /*istanbul ignore end*/
  extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length,
      oldLen = oldString.length,
      oldPos = basePath.oldPos,
      newPos = oldPos - diagonalPath,
      commonCount = 0;
    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(oldString[oldPos + 1], newString[newPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
      if (this.options.oneChangePerToken) {
        basePath.lastComponent = {
          count: 1,
          previousComponent: basePath.lastComponent,
          added: false,
          removed: false
        };
      }
    }
    if (commonCount && !this.options.oneChangePerToken) {
      basePath.lastComponent = {
        count: commonCount,
        previousComponent: basePath.lastComponent,
        added: false,
        removed: false
      };
    }
    basePath.oldPos = oldPos;
    return newPos;
  },
  /*istanbul ignore start*/
  /*istanbul ignore end*/
  equals: function equals(left, right) {
    if (this.options.comparator) {
      return this.options.comparator(left, right);
    } else {
      return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  },
  /*istanbul ignore start*/
  /*istanbul ignore end*/
  removeEmpty: function removeEmpty(array) {
    var ret = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  },
  /*istanbul ignore start*/
  /*istanbul ignore end*/
  castInput: function castInput(value) {
    return value;
  },
  /*istanbul ignore start*/
  /*istanbul ignore end*/
  tokenize: function tokenize(value) {
    return value.split('');
  },
  /*istanbul ignore start*/
  /*istanbul ignore end*/
  join: function join(chars) {
    return chars.join('');
  }
};
function buildValues(diff, lastComponent, newString, oldString, useLongestToken) {
  // First we convert our linked list of components in reverse order to an
  // array in the right order:
  var components = [];
  var nextComponent;
  while (lastComponent) {
    components.push(lastComponent);
    nextComponent = lastComponent.previousComponent;
    delete lastComponent.previousComponent;
    lastComponent = nextComponent;
  }
  components.reverse();
  var componentPos = 0,
    componentLen = components.length,
    newPos = 0,
    oldPos = 0;
  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];
    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function (value, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value.length ? oldValue : value;
        });
        component.value = diff.join(value);
      } else {
        component.value = diff.join(newString.slice(newPos, newPos + component.count));
      }
      newPos += component.count;

      // Common case
      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count;
    }
  }

  // Special case handle for when one terminal is ignored (i.e. whitespace).
  // For this case we merge the terminal into the prior string and drop the change.
  // This is only available for string mode.
  var finalComponent = components[componentLen - 1];
  if (componentLen > 1 && typeof finalComponent.value === 'string' && (finalComponent.added && diff.equals('', finalComponent.value) || finalComponent.removed && diff.equals(finalComponent.value, ''))) {
    components[componentLen - 2].value += finalComponent.value;
    components.pop();
  }
  return components;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEaWZmIiwicHJvdG90eXBlIiwiZGlmZiIsIm9sZFN0cmluZyIsIm5ld1N0cmluZyIsIl9vcHRpb25zJHRpbWVvdXQiLCJvcHRpb25zIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiY2FsbGJhY2siLCJzZWxmIiwiZG9uZSIsInZhbHVlIiwic2V0VGltZW91dCIsImNhc3RJbnB1dCIsInJlbW92ZUVtcHR5IiwidG9rZW5pemUiLCJuZXdMZW4iLCJvbGRMZW4iLCJlZGl0TGVuZ3RoIiwibWF4RWRpdExlbmd0aCIsIk1hdGgiLCJtaW4iLCJtYXhFeGVjdXRpb25UaW1lIiwidGltZW91dCIsIkluZmluaXR5IiwiYWJvcnRBZnRlclRpbWVzdGFtcCIsIkRhdGUiLCJub3ciLCJiZXN0UGF0aCIsIm9sZFBvcyIsImxhc3RDb21wb25lbnQiLCJuZXdQb3MiLCJleHRyYWN0Q29tbW9uIiwiYnVpbGRWYWx1ZXMiLCJ1c2VMb25nZXN0VG9rZW4iLCJtaW5EaWFnb25hbFRvQ29uc2lkZXIiLCJtYXhEaWFnb25hbFRvQ29uc2lkZXIiLCJleGVjRWRpdExlbmd0aCIsImRpYWdvbmFsUGF0aCIsIm1heCIsImJhc2VQYXRoIiwicmVtb3ZlUGF0aCIsImFkZFBhdGgiLCJjYW5BZGQiLCJhZGRQYXRoTmV3UG9zIiwiY2FuUmVtb3ZlIiwiYWRkVG9QYXRoIiwiZXhlYyIsInJldCIsInBhdGgiLCJhZGRlZCIsInJlbW92ZWQiLCJvbGRQb3NJbmMiLCJsYXN0Iiwib25lQ2hhbmdlUGVyVG9rZW4iLCJjb3VudCIsInByZXZpb3VzQ29tcG9uZW50IiwiY29tbW9uQ291bnQiLCJlcXVhbHMiLCJsZWZ0IiwicmlnaHQiLCJjb21wYXJhdG9yIiwiaWdub3JlQ2FzZSIsInRvTG93ZXJDYXNlIiwiYXJyYXkiLCJpIiwicHVzaCIsInNwbGl0Iiwiam9pbiIsImNoYXJzIiwiY29tcG9uZW50cyIsIm5leHRDb21wb25lbnQiLCJyZXZlcnNlIiwiY29tcG9uZW50UG9zIiwiY29tcG9uZW50TGVuIiwiY29tcG9uZW50Iiwic2xpY2UiLCJtYXAiLCJvbGRWYWx1ZSIsImZpbmFsQ29tcG9uZW50IiwicG9wIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RpZmYvYmFzZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEaWZmKCkge31cblxuRGlmZi5wcm90b3R5cGUgPSB7XG4gIGRpZmYob2xkU3RyaW5nLCBuZXdTdHJpbmcsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2s7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBkb25lKHZhbHVlKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2sodW5kZWZpbmVkLCB2YWx1ZSk7IH0sIDApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBbGxvdyBzdWJjbGFzc2VzIHRvIG1hc3NhZ2UgdGhlIGlucHV0IHByaW9yIHRvIHJ1bm5pbmdcbiAgICBvbGRTdHJpbmcgPSB0aGlzLmNhc3RJbnB1dChvbGRTdHJpbmcpO1xuICAgIG5ld1N0cmluZyA9IHRoaXMuY2FzdElucHV0KG5ld1N0cmluZyk7XG5cbiAgICBvbGRTdHJpbmcgPSB0aGlzLnJlbW92ZUVtcHR5KHRoaXMudG9rZW5pemUob2xkU3RyaW5nKSk7XG4gICAgbmV3U3RyaW5nID0gdGhpcy5yZW1vdmVFbXB0eSh0aGlzLnRva2VuaXplKG5ld1N0cmluZykpO1xuXG4gICAgbGV0IG5ld0xlbiA9IG5ld1N0cmluZy5sZW5ndGgsIG9sZExlbiA9IG9sZFN0cmluZy5sZW5ndGg7XG4gICAgbGV0IGVkaXRMZW5ndGggPSAxO1xuICAgIGxldCBtYXhFZGl0TGVuZ3RoID0gbmV3TGVuICsgb2xkTGVuO1xuICAgIGlmKG9wdGlvbnMubWF4RWRpdExlbmd0aCAhPSBudWxsKSB7XG4gICAgICBtYXhFZGl0TGVuZ3RoID0gTWF0aC5taW4obWF4RWRpdExlbmd0aCwgb3B0aW9ucy5tYXhFZGl0TGVuZ3RoKTtcbiAgICB9XG4gICAgY29uc3QgbWF4RXhlY3V0aW9uVGltZSA9IG9wdGlvbnMudGltZW91dCA/PyBJbmZpbml0eTtcbiAgICBjb25zdCBhYm9ydEFmdGVyVGltZXN0YW1wID0gRGF0ZS5ub3coKSArIG1heEV4ZWN1dGlvblRpbWU7XG5cbiAgICBsZXQgYmVzdFBhdGggPSBbeyBvbGRQb3M6IC0xLCBsYXN0Q29tcG9uZW50OiB1bmRlZmluZWQgfV07XG5cbiAgICAvLyBTZWVkIGVkaXRMZW5ndGggPSAwLCBpLmUuIHRoZSBjb250ZW50IHN0YXJ0cyB3aXRoIHRoZSBzYW1lIHZhbHVlc1xuICAgIGxldCBuZXdQb3MgPSB0aGlzLmV4dHJhY3RDb21tb24oYmVzdFBhdGhbMF0sIG5ld1N0cmluZywgb2xkU3RyaW5nLCAwKTtcbiAgICBpZiAoYmVzdFBhdGhbMF0ub2xkUG9zICsgMSA+PSBvbGRMZW4gJiYgbmV3UG9zICsgMSA+PSBuZXdMZW4pIHtcbiAgICAgIC8vIElkZW50aXR5IHBlciB0aGUgZXF1YWxpdHkgYW5kIHRva2VuaXplclxuICAgICAgcmV0dXJuIGRvbmUoYnVpbGRWYWx1ZXMoc2VsZiwgYmVzdFBhdGhbMF0ubGFzdENvbXBvbmVudCwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIHNlbGYudXNlTG9uZ2VzdFRva2VuKSk7XG4gICAgfVxuXG4gICAgLy8gT25jZSB3ZSBoaXQgdGhlIHJpZ2h0IGVkZ2Ugb2YgdGhlIGVkaXQgZ3JhcGggb24gc29tZSBkaWFnb25hbCBrLCB3ZSBjYW5cbiAgICAvLyBkZWZpbml0ZWx5IHJlYWNoIHRoZSBlbmQgb2YgdGhlIGVkaXQgZ3JhcGggaW4gbm8gbW9yZSB0aGFuIGsgZWRpdHMsIHNvXG4gICAgLy8gdGhlcmUncyBubyBwb2ludCBpbiBjb25zaWRlcmluZyBhbnkgbW92ZXMgdG8gZGlhZ29uYWwgaysxIGFueSBtb3JlIChmcm9tXG4gICAgLy8gd2hpY2ggd2UncmUgZ3VhcmFudGVlZCB0byBuZWVkIGF0IGxlYXN0IGsrMSBtb3JlIGVkaXRzKS5cbiAgICAvLyBTaW1pbGFybHksIG9uY2Ugd2UndmUgcmVhY2hlZCB0aGUgYm90dG9tIG9mIHRoZSBlZGl0IGdyYXBoLCB0aGVyZSdzIG5vXG4gICAgLy8gcG9pbnQgY29uc2lkZXJpbmcgbW92ZXMgdG8gbG93ZXIgZGlhZ29uYWxzLlxuICAgIC8vIFdlIHJlY29yZCB0aGlzIGZhY3QgYnkgc2V0dGluZyBtaW5EaWFnb25hbFRvQ29uc2lkZXIgYW5kXG4gICAgLy8gbWF4RGlhZ29uYWxUb0NvbnNpZGVyIHRvIHNvbWUgZmluaXRlIHZhbHVlIG9uY2Ugd2UndmUgaGl0IHRoZSBlZGdlIG9mXG4gICAgLy8gdGhlIGVkaXQgZ3JhcGguXG4gICAgLy8gVGhpcyBvcHRpbWl6YXRpb24gaXMgbm90IGZhaXRoZnVsIHRvIHRoZSBvcmlnaW5hbCBhbGdvcml0aG0gcHJlc2VudGVkIGluXG4gICAgLy8gTXllcnMncyBwYXBlciwgd2hpY2ggaW5zdGVhZCBwb2ludGxlc3NseSBleHRlbmRzIEQtcGF0aHMgb2ZmIHRoZSBlbmQgb2ZcbiAgICAvLyB0aGUgZWRpdCBncmFwaCAtIHNlZSBwYWdlIDcgb2YgTXllcnMncyBwYXBlciB3aGljaCBub3RlcyB0aGlzIHBvaW50XG4gICAgLy8gZXhwbGljaXRseSBhbmQgaWxsdXN0cmF0ZXMgaXQgd2l0aCBhIGRpYWdyYW0uIFRoaXMgaGFzIG1ham9yIHBlcmZvcm1hbmNlXG4gICAgLy8gaW1wbGljYXRpb25zIGZvciBzb21lIGNvbW1vbiBzY2VuYXJpb3MuIEZvciBpbnN0YW5jZSwgdG8gY29tcHV0ZSBhIGRpZmZcbiAgICAvLyB3aGVyZSB0aGUgbmV3IHRleHQgc2ltcGx5IGFwcGVuZHMgZCBjaGFyYWN0ZXJzIG9uIHRoZSBlbmQgb2YgdGhlXG4gICAgLy8gb3JpZ2luYWwgdGV4dCBvZiBsZW5ndGggbiwgdGhlIHRydWUgTXllcnMgYWxnb3JpdGhtIHdpbGwgdGFrZSBPKG4rZF4yKVxuICAgIC8vIHRpbWUgd2hpbGUgdGhpcyBvcHRpbWl6YXRpb24gbmVlZHMgb25seSBPKG4rZCkgdGltZS5cbiAgICBsZXQgbWluRGlhZ29uYWxUb0NvbnNpZGVyID0gLUluZmluaXR5LCBtYXhEaWFnb25hbFRvQ29uc2lkZXIgPSBJbmZpbml0eTtcblxuICAgIC8vIE1haW4gd29ya2VyIG1ldGhvZC4gY2hlY2tzIGFsbCBwZXJtdXRhdGlvbnMgb2YgYSBnaXZlbiBlZGl0IGxlbmd0aCBmb3IgYWNjZXB0YW5jZS5cbiAgICBmdW5jdGlvbiBleGVjRWRpdExlbmd0aCgpIHtcbiAgICAgIGZvciAoXG4gICAgICAgIGxldCBkaWFnb25hbFBhdGggPSBNYXRoLm1heChtaW5EaWFnb25hbFRvQ29uc2lkZXIsIC1lZGl0TGVuZ3RoKTtcbiAgICAgICAgZGlhZ29uYWxQYXRoIDw9IE1hdGgubWluKG1heERpYWdvbmFsVG9Db25zaWRlciwgZWRpdExlbmd0aCk7XG4gICAgICAgIGRpYWdvbmFsUGF0aCArPSAyXG4gICAgICApIHtcbiAgICAgICAgbGV0IGJhc2VQYXRoO1xuICAgICAgICBsZXQgcmVtb3ZlUGF0aCA9IGJlc3RQYXRoW2RpYWdvbmFsUGF0aCAtIDFdLFxuICAgICAgICAgICAgYWRkUGF0aCA9IGJlc3RQYXRoW2RpYWdvbmFsUGF0aCArIDFdO1xuICAgICAgICBpZiAocmVtb3ZlUGF0aCkge1xuICAgICAgICAgIC8vIE5vIG9uZSBlbHNlIGlzIGdvaW5nIHRvIGF0dGVtcHQgdG8gdXNlIHRoaXMgdmFsdWUsIGNsZWFyIGl0XG4gICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoIC0gMV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2FuQWRkID0gZmFsc2U7XG4gICAgICAgIGlmIChhZGRQYXRoKSB7XG4gICAgICAgICAgLy8gd2hhdCBuZXdQb3Mgd2lsbCBiZSBhZnRlciB3ZSBkbyBhbiBpbnNlcnRpb246XG4gICAgICAgICAgY29uc3QgYWRkUGF0aE5ld1BvcyA9IGFkZFBhdGgub2xkUG9zIC0gZGlhZ29uYWxQYXRoO1xuICAgICAgICAgIGNhbkFkZCA9IGFkZFBhdGggJiYgMCA8PSBhZGRQYXRoTmV3UG9zICYmIGFkZFBhdGhOZXdQb3MgPCBuZXdMZW47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2FuUmVtb3ZlID0gcmVtb3ZlUGF0aCAmJiByZW1vdmVQYXRoLm9sZFBvcyArIDEgPCBvbGRMZW47XG4gICAgICAgIGlmICghY2FuQWRkICYmICFjYW5SZW1vdmUpIHtcbiAgICAgICAgICAvLyBJZiB0aGlzIHBhdGggaXMgYSB0ZXJtaW5hbCB0aGVuIHBydW5lXG4gICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNlbGVjdCB0aGUgZGlhZ29uYWwgdGhhdCB3ZSB3YW50IHRvIGJyYW5jaCBmcm9tLiBXZSBzZWxlY3QgdGhlIHByaW9yXG4gICAgICAgIC8vIHBhdGggd2hvc2UgcG9zaXRpb24gaW4gdGhlIG9sZCBzdHJpbmcgaXMgdGhlIGZhcnRoZXN0IGZyb20gdGhlIG9yaWdpblxuICAgICAgICAvLyBhbmQgZG9lcyBub3QgcGFzcyB0aGUgYm91bmRzIG9mIHRoZSBkaWZmIGdyYXBoXG4gICAgICAgIGlmICghY2FuUmVtb3ZlIHx8IChjYW5BZGQgJiYgcmVtb3ZlUGF0aC5vbGRQb3MgPCBhZGRQYXRoLm9sZFBvcykpIHtcbiAgICAgICAgICBiYXNlUGF0aCA9IHNlbGYuYWRkVG9QYXRoKGFkZFBhdGgsIHRydWUsIGZhbHNlLCAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiYXNlUGF0aCA9IHNlbGYuYWRkVG9QYXRoKHJlbW92ZVBhdGgsIGZhbHNlLCB0cnVlLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1BvcyA9IHNlbGYuZXh0cmFjdENvbW1vbihiYXNlUGF0aCwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIGRpYWdvbmFsUGF0aCk7XG5cbiAgICAgICAgaWYgKGJhc2VQYXRoLm9sZFBvcyArIDEgPj0gb2xkTGVuICYmIG5ld1BvcyArIDEgPj0gbmV3TGVuKSB7XG4gICAgICAgICAgLy8gSWYgd2UgaGF2ZSBoaXQgdGhlIGVuZCBvZiBib3RoIHN0cmluZ3MsIHRoZW4gd2UgYXJlIGRvbmVcbiAgICAgICAgICByZXR1cm4gZG9uZShidWlsZFZhbHVlcyhzZWxmLCBiYXNlUGF0aC5sYXN0Q29tcG9uZW50LCBuZXdTdHJpbmcsIG9sZFN0cmluZywgc2VsZi51c2VMb25nZXN0VG9rZW4pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiZXN0UGF0aFtkaWFnb25hbFBhdGhdID0gYmFzZVBhdGg7XG4gICAgICAgICAgaWYgKGJhc2VQYXRoLm9sZFBvcyArIDEgPj0gb2xkTGVuKSB7XG4gICAgICAgICAgICBtYXhEaWFnb25hbFRvQ29uc2lkZXIgPSBNYXRoLm1pbihtYXhEaWFnb25hbFRvQ29uc2lkZXIsIGRpYWdvbmFsUGF0aCAtIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobmV3UG9zICsgMSA+PSBuZXdMZW4pIHtcbiAgICAgICAgICAgIG1pbkRpYWdvbmFsVG9Db25zaWRlciA9IE1hdGgubWF4KG1pbkRpYWdvbmFsVG9Db25zaWRlciwgZGlhZ29uYWxQYXRoICsgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVkaXRMZW5ndGgrKztcbiAgICB9XG5cbiAgICAvLyBQZXJmb3JtcyB0aGUgbGVuZ3RoIG9mIGVkaXQgaXRlcmF0aW9uLiBJcyBhIGJpdCBmdWdseSBhcyB0aGlzIGhhcyB0byBzdXBwb3J0IHRoZVxuICAgIC8vIHN5bmMgYW5kIGFzeW5jIG1vZGUgd2hpY2ggaXMgbmV2ZXIgZnVuLiBMb29wcyBvdmVyIGV4ZWNFZGl0TGVuZ3RoIHVudGlsIGEgdmFsdWVcbiAgICAvLyBpcyBwcm9kdWNlZCwgb3IgdW50aWwgdGhlIGVkaXQgbGVuZ3RoIGV4Y2VlZHMgb3B0aW9ucy5tYXhFZGl0TGVuZ3RoIChpZiBnaXZlbiksXG4gICAgLy8gaW4gd2hpY2ggY2FzZSBpdCB3aWxsIHJldHVybiB1bmRlZmluZWQuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAoZnVuY3Rpb24gZXhlYygpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoZWRpdExlbmd0aCA+IG1heEVkaXRMZW5ndGggfHwgRGF0ZS5ub3coKSA+IGFib3J0QWZ0ZXJUaW1lc3RhbXApIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghZXhlY0VkaXRMZW5ndGgoKSkge1xuICAgICAgICAgICAgZXhlYygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9KCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAoZWRpdExlbmd0aCA8PSBtYXhFZGl0TGVuZ3RoICYmIERhdGUubm93KCkgPD0gYWJvcnRBZnRlclRpbWVzdGFtcCkge1xuICAgICAgICBsZXQgcmV0ID0gZXhlY0VkaXRMZW5ndGgoKTtcbiAgICAgICAgaWYgKHJldCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYWRkVG9QYXRoKHBhdGgsIGFkZGVkLCByZW1vdmVkLCBvbGRQb3NJbmMpIHtcbiAgICBsZXQgbGFzdCA9IHBhdGgubGFzdENvbXBvbmVudDtcbiAgICBpZiAobGFzdCAmJiAhdGhpcy5vcHRpb25zLm9uZUNoYW5nZVBlclRva2VuICYmIGxhc3QuYWRkZWQgPT09IGFkZGVkICYmIGxhc3QucmVtb3ZlZCA9PT0gcmVtb3ZlZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgb2xkUG9zOiBwYXRoLm9sZFBvcyArIG9sZFBvc0luYyxcbiAgICAgICAgbGFzdENvbXBvbmVudDoge2NvdW50OiBsYXN0LmNvdW50ICsgMSwgYWRkZWQ6IGFkZGVkLCByZW1vdmVkOiByZW1vdmVkLCBwcmV2aW91c0NvbXBvbmVudDogbGFzdC5wcmV2aW91c0NvbXBvbmVudCB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvbGRQb3M6IHBhdGgub2xkUG9zICsgb2xkUG9zSW5jLFxuICAgICAgICBsYXN0Q29tcG9uZW50OiB7Y291bnQ6IDEsIGFkZGVkOiBhZGRlZCwgcmVtb3ZlZDogcmVtb3ZlZCwgcHJldmlvdXNDb21wb25lbnQ6IGxhc3QgfVxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIGV4dHJhY3RDb21tb24oYmFzZVBhdGgsIG5ld1N0cmluZywgb2xkU3RyaW5nLCBkaWFnb25hbFBhdGgpIHtcbiAgICBsZXQgbmV3TGVuID0gbmV3U3RyaW5nLmxlbmd0aCxcbiAgICAgICAgb2xkTGVuID0gb2xkU3RyaW5nLmxlbmd0aCxcbiAgICAgICAgb2xkUG9zID0gYmFzZVBhdGgub2xkUG9zLFxuICAgICAgICBuZXdQb3MgPSBvbGRQb3MgLSBkaWFnb25hbFBhdGgsXG5cbiAgICAgICAgY29tbW9uQ291bnQgPSAwO1xuICAgIHdoaWxlIChuZXdQb3MgKyAxIDwgbmV3TGVuICYmIG9sZFBvcyArIDEgPCBvbGRMZW4gJiYgdGhpcy5lcXVhbHMob2xkU3RyaW5nW29sZFBvcyArIDFdLCBuZXdTdHJpbmdbbmV3UG9zICsgMV0pKSB7XG4gICAgICBuZXdQb3MrKztcbiAgICAgIG9sZFBvcysrO1xuICAgICAgY29tbW9uQ291bnQrKztcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMub25lQ2hhbmdlUGVyVG9rZW4pIHtcbiAgICAgICAgYmFzZVBhdGgubGFzdENvbXBvbmVudCA9IHtjb3VudDogMSwgcHJldmlvdXNDb21wb25lbnQ6IGJhc2VQYXRoLmxhc3RDb21wb25lbnQsIGFkZGVkOiBmYWxzZSwgcmVtb3ZlZDogZmFsc2V9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb21tb25Db3VudCAmJiAhdGhpcy5vcHRpb25zLm9uZUNoYW5nZVBlclRva2VuKSB7XG4gICAgICBiYXNlUGF0aC5sYXN0Q29tcG9uZW50ID0ge2NvdW50OiBjb21tb25Db3VudCwgcHJldmlvdXNDb21wb25lbnQ6IGJhc2VQYXRoLmxhc3RDb21wb25lbnQsIGFkZGVkOiBmYWxzZSwgcmVtb3ZlZDogZmFsc2V9O1xuICAgIH1cblxuICAgIGJhc2VQYXRoLm9sZFBvcyA9IG9sZFBvcztcbiAgICByZXR1cm4gbmV3UG9zO1xuICB9LFxuXG4gIGVxdWFscyhsZWZ0LCByaWdodCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb21wYXJhdG9yKGxlZnQsIHJpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0XG4gICAgICAgIHx8ICh0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSAmJiBsZWZ0LnRvTG93ZXJDYXNlKCkgPT09IHJpZ2h0LnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cbiAgfSxcbiAgcmVtb3ZlRW1wdHkoYXJyYXkpIHtcbiAgICBsZXQgcmV0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFycmF5W2ldKSB7XG4gICAgICAgIHJldC5wdXNoKGFycmF5W2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcbiAgY2FzdElucHV0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuICB0b2tlbml6ZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdCgnJyk7XG4gIH0sXG4gIGpvaW4oY2hhcnMpIHtcbiAgICByZXR1cm4gY2hhcnMuam9pbignJyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGJ1aWxkVmFsdWVzKGRpZmYsIGxhc3RDb21wb25lbnQsIG5ld1N0cmluZywgb2xkU3RyaW5nLCB1c2VMb25nZXN0VG9rZW4pIHtcbiAgLy8gRmlyc3Qgd2UgY29udmVydCBvdXIgbGlua2VkIGxpc3Qgb2YgY29tcG9uZW50cyBpbiByZXZlcnNlIG9yZGVyIHRvIGFuXG4gIC8vIGFycmF5IGluIHRoZSByaWdodCBvcmRlcjpcbiAgY29uc3QgY29tcG9uZW50cyA9IFtdO1xuICBsZXQgbmV4dENvbXBvbmVudDtcbiAgd2hpbGUgKGxhc3RDb21wb25lbnQpIHtcbiAgICBjb21wb25lbnRzLnB1c2gobGFzdENvbXBvbmVudCk7XG4gICAgbmV4dENvbXBvbmVudCA9IGxhc3RDb21wb25lbnQucHJldmlvdXNDb21wb25lbnQ7XG4gICAgZGVsZXRlIGxhc3RDb21wb25lbnQucHJldmlvdXNDb21wb25lbnQ7XG4gICAgbGFzdENvbXBvbmVudCA9IG5leHRDb21wb25lbnQ7XG4gIH1cbiAgY29tcG9uZW50cy5yZXZlcnNlKCk7XG5cbiAgbGV0IGNvbXBvbmVudFBvcyA9IDAsXG4gICAgICBjb21wb25lbnRMZW4gPSBjb21wb25lbnRzLmxlbmd0aCxcbiAgICAgIG5ld1BvcyA9IDAsXG4gICAgICBvbGRQb3MgPSAwO1xuXG4gIGZvciAoOyBjb21wb25lbnRQb3MgPCBjb21wb25lbnRMZW47IGNvbXBvbmVudFBvcysrKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcbiAgICBpZiAoIWNvbXBvbmVudC5yZW1vdmVkKSB7XG4gICAgICBpZiAoIWNvbXBvbmVudC5hZGRlZCAmJiB1c2VMb25nZXN0VG9rZW4pIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KTtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5tYXAoZnVuY3Rpb24odmFsdWUsIGkpIHtcbiAgICAgICAgICBsZXQgb2xkVmFsdWUgPSBvbGRTdHJpbmdbb2xkUG9zICsgaV07XG4gICAgICAgICAgcmV0dXJuIG9sZFZhbHVlLmxlbmd0aCA+IHZhbHVlLmxlbmd0aCA/IG9sZFZhbHVlIDogdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbXBvbmVudC52YWx1ZSA9IGRpZmYuam9pbih2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wb25lbnQudmFsdWUgPSBkaWZmLmpvaW4obmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KSk7XG4gICAgICB9XG4gICAgICBuZXdQb3MgKz0gY29tcG9uZW50LmNvdW50O1xuXG4gICAgICAvLyBDb21tb24gY2FzZVxuICAgICAgaWYgKCFjb21wb25lbnQuYWRkZWQpIHtcbiAgICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29tcG9uZW50LnZhbHVlID0gZGlmZi5qb2luKG9sZFN0cmluZy5zbGljZShvbGRQb3MsIG9sZFBvcyArIGNvbXBvbmVudC5jb3VudCkpO1xuICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDtcbiAgICB9XG4gIH1cblxuICAvLyBTcGVjaWFsIGNhc2UgaGFuZGxlIGZvciB3aGVuIG9uZSB0ZXJtaW5hbCBpcyBpZ25vcmVkIChpLmUuIHdoaXRlc3BhY2UpLlxuICAvLyBGb3IgdGhpcyBjYXNlIHdlIG1lcmdlIHRoZSB0ZXJtaW5hbCBpbnRvIHRoZSBwcmlvciBzdHJpbmcgYW5kIGRyb3AgdGhlIGNoYW5nZS5cbiAgLy8gVGhpcyBpcyBvbmx5IGF2YWlsYWJsZSBmb3Igc3RyaW5nIG1vZGUuXG4gIGxldCBmaW5hbENvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcG9uZW50TGVuIC0gMV07XG4gIGlmIChcbiAgICBjb21wb25lbnRMZW4gPiAxXG4gICAgJiYgdHlwZW9mIGZpbmFsQ29tcG9uZW50LnZhbHVlID09PSAnc3RyaW5nJ1xuICAgICYmIChcbiAgICAgIChmaW5hbENvbXBvbmVudC5hZGRlZCAmJiBkaWZmLmVxdWFscygnJywgZmluYWxDb21wb25lbnQudmFsdWUpKVxuICAgICAgfHxcbiAgICAgIChmaW5hbENvbXBvbmVudC5yZW1vdmVkICYmIGRpZmYuZXF1YWxzKGZpbmFsQ29tcG9uZW50LnZhbHVlLCAnJykpXG4gICAgKVxuICApIHtcbiAgICBjb21wb25lbnRzW2NvbXBvbmVudExlbiAtIDJdLnZhbHVlICs9IGZpbmFsQ29tcG9uZW50LnZhbHVlO1xuICAgIGNvbXBvbmVudHMucG9wKCk7XG4gIH1cblxuICByZXR1cm4gY29tcG9uZW50cztcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBZSxTQUFTQSxJQUFJQSxDQUFBLEVBQUcsQ0FBQztBQUVoQ0EsSUFBSSxDQUFDQyxTQUFTLEdBQUc7RUFBQTtFQUFBO0VBQ2ZDLElBQUksV0FBQUEsS0FBQ0MsU0FBUyxFQUFFQyxTQUFTLEVBQWdCO0lBQUE7SUFBQSxJQUFBQyxnQkFBQTtJQUFBO0lBQUE7SUFBZEMsT0FBTyxHQUFBQyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBRyxDQUFDLENBQUM7SUFDckMsSUFBSUcsUUFBUSxHQUFHSixPQUFPLENBQUNJLFFBQVE7SUFDL0IsSUFBSSxPQUFPSixPQUFPLEtBQUssVUFBVSxFQUFFO01BQ2pDSSxRQUFRLEdBQUdKLE9BQU87TUFDbEJBLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDZDtJQUNBLElBQUksQ0FBQ0EsT0FBTyxHQUFHQSxPQUFPO0lBRXRCLElBQUlLLElBQUksR0FBRyxJQUFJO0lBRWYsU0FBU0MsSUFBSUEsQ0FBQ0MsS0FBSyxFQUFFO01BQ25CLElBQUlILFFBQVEsRUFBRTtRQUNaSSxVQUFVLENBQUMsWUFBVztVQUFF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
