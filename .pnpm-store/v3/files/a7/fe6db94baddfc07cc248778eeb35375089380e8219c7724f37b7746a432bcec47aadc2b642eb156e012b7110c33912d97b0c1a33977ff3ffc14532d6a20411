import { commonjsRequire } from '../../../_virtual/_commonjs-dynamic-modules.js';
import { __require as requireClone } from '../../lodash/clone.js';
import { __require as requireConstant } from '../../lodash/constant.js';
import { __require as requireEach } from '../../lodash/each.js';
import { __require as requireFilter } from '../../lodash/filter.js';
import { __require as requireHas } from '../../lodash/has.js';
import { __require as requireIsArray } from '../../lodash/isArray.js';
import { __require as requireIsEmpty } from '../../lodash/isEmpty.js';
import { __require as requireIsFunction } from '../../lodash/isFunction.js';
import { __require as requireIsUndefined } from '../../lodash/isUndefined.js';
import { __require as requireKeys } from '../../lodash/keys.js';
import { __require as requireMap } from '../../lodash/map.js';
import { __require as requireReduce } from '../../lodash/reduce.js';
import { __require as requireSize } from '../../lodash/size.js';
import { __require as requireTransform } from '../../lodash/transform.js';
import { __require as requireUnion } from '../../lodash/union.js';
import { __require as requireValues } from '../../lodash/values.js';

/* global window */

var lodash_1$1;
var hasRequiredLodash$1;

function requireLodash$1 () {
	if (hasRequiredLodash$1) return lodash_1$1;
	hasRequiredLodash$1 = 1;
	var lodash;

	if (typeof commonjsRequire === "function") {
	  try {
	    lodash = {
	      clone: requireClone(),
	      constant: requireConstant(),
	      each: requireEach(),
	      filter: requireFilter(),
	      has:  requireHas(),
	      isArray: requireIsArray(),
	      isEmpty: requireIsEmpty(),
	      isFunction: requireIsFunction(),
	      isUndefined: requireIsUndefined(),
	      keys: requireKeys(),
	      map: requireMap(),
	      reduce: requireReduce(),
	      size: requireSize(),
	      transform: requireTransform(),
	      union: requireUnion(),
	      values: requireValues()
	    };
	  } catch (e) {
	    // continue regardless of error
	  }
	}

	if (!lodash) {
	  lodash = window._;
	}

	lodash_1$1 = lodash;
	return lodash_1$1;
}

export { requireLodash$1 as __require };
//# sourceMappingURL=lodash.js.map
