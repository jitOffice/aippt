import { __require as requireGraphlib } from './lib/graphlib.js';
import { __require as requireLayout } from './lib/layout.js';
import { __require as requireDebug } from './lib/debug.js';
import { __require as requireUtil } from './lib/util.js';
import { __require as requireVersion } from './lib/version.js';

/*
Copyright (c) 2012-2014 Chris Pettitt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var dagre$1;
var hasRequiredDagre;

function requireDagre () {
	if (hasRequiredDagre) return dagre$1;
	hasRequiredDagre = 1;
	dagre$1 = {
	  graphlib: requireGraphlib(),

	  layout: requireLayout(),
	  debug: requireDebug(),
	  util: {
	    time: requireUtil().time,
	    notime: requireUtil().notime
	  },
	  version: requireVersion()
	};
	return dagre$1;
}

export { requireDagre as __require };
//# sourceMappingURL=index.js.map
