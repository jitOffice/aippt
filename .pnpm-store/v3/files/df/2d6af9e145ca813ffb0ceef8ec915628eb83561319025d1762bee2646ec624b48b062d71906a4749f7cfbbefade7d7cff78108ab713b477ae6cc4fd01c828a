import { diff } from 'diff-match-patch-es';
import { hash } from 'ohash';

// eslint-disable-next-line ts/no-unsafe-function-type

function createMagicMoveMachine(codeToKeyedTokens, options = {}) {
  const EMPTY = toKeyedTokens('', []);
  let previous = EMPTY;
  let current = EMPTY;
  function commit(code, override) {
    previous = current;
    const mergedOptions = override ? {
      ...options,
      ...override
    } : options;
    const newTokens = codeToKeyedTokens(code, mergedOptions.lineNumbers);
    ({
      from: previous,
      to: current
    } = syncTokenKeys(previous, newTokens, mergedOptions));
    return {
      current,
      previous
    };
  }
  return {
    get current() {
      return current;
    },
    get previous() {
      return previous;
    },
    commit,
    reset() {
      previous = EMPTY;
      current = EMPTY;
    }
  };
}
function codeToKeyedTokens(highlighter, code, options, lineNumbers = false) {
  const result = highlighter.codeToTokens(code, options);
  return {
    ...toKeyedTokens(code, result.tokens,
    // We put the lang and theme to participate in the hash calculation because they can affect the tokenization
    JSON.stringify([options.lang, 'themes' in options ? options.themes : options.theme]), lineNumbers),
    bg: result.bg,
    fg: result.fg,
    rootStyle: result.rootStyle,
    themeName: result.themeName,
    lang: options.lang
  };
}
function toKeyedTokens(code, tokens, salt = '', lineNumbers = false) {
  const hash$1 = hash(code + salt);
  let lastOffset = 0;
  let firstOffset = 0;
  const lineNumberDigits = Math.max(1, String(tokens.length).length);
  const keyed = splitWhitespaceTokens(tokens).flatMap((line, lineIdx) => {
    firstOffset = line[0]?.offset || lastOffset;
    const lastEl = line[line.length - 1];
    if (!lastEl) lastOffset += 1;else lastOffset = lastEl.offset + lastEl.content.length;
    const tokens = [...line, {
      content: '\n',
      offset: lastOffset
    }];
    if (lineNumbers) {
      tokens.unshift({
        key: `${hash$1}-ln-${lineIdx + 1}`,
        content: `${String(lineIdx + 1).padStart(lineNumberDigits, ' ')}  `,
        offset: firstOffset,
        htmlClass: 'shiki-magic-move-line-number'
      });
    }
    return tokens;
  }).map((token, idx) => {
    const t = token;
    t.key ||= `${hash$1}-${idx}`;
    return t;
  });
  return {
    code,
    hash: hash$1,
    tokens: keyed,
    lineNumbers
  };
}
function splitWhitespaceTokens(tokens) {
  return tokens.map(line => {
    return line.flatMap(token => {
      if (token.content.match(/^\s+$/)) return token;
      // eslint-disable-next-line regexp/no-super-linear-backtracking
      const match = token.content.match(/^(\s*)(.*?)(\s*)$/);
      if (!match) return token;
      const [, leading, content, trailing] = match;
      if (!leading && !trailing) return token;
      const expanded = [{
        ...token,
        offset: token.offset + leading.length,
        content
      }];
      if (leading) {
        expanded.unshift({
          content: leading,
          offset: token.offset
        });
      }
      if (trailing) {
        expanded.push({
          content: trailing,
          offset: token.offset + leading.length + content.length
        });
      }
      return expanded;
    });
  });
}

/**
 * Split a token into multiple tokens by given offsets.
 *
 * The offsets are relative to the token, and should be sorted.
 */
function splitToken(token, offsets) {
  let lastOffset = 0;
  const key = token.key;
  let index = 0;
  const tokens = [];
  function getKey() {
    if (index === 0) {
      index++;
      return key;
    }
    return `${key}-${index++}`;
  }
  for (const offset of offsets) {
    if (offset > lastOffset) {
      tokens.push({
        ...token,
        content: token.content.slice(lastOffset, offset),
        offset: token.offset + lastOffset,
        key: getKey()
      });
    }
    lastOffset = offset;
  }
  if (lastOffset < token.content.length) {
    tokens.push({
      ...token,
      content: token.content.slice(lastOffset),
      offset: token.offset + lastOffset,
      key: getKey()
    });
  }
  return tokens;
}

/**
 * Split 2D tokens array by given breakpoints.
 */
function splitTokens(tokens, breakpoints) {
  const sorted = Array.from(breakpoints instanceof Set ? breakpoints : new Set(breakpoints)).sort((a, b) => a - b);
  if (!sorted.length) return tokens;
  return tokens.flatMap(token => {
    const breakpointsInToken = sorted.filter(i => token.offset < i && i < token.offset + token.content.length).map(i => i - token.offset).sort((a, b) => a - b);
    if (!breakpointsInToken.length) return token;
    return splitToken(token, breakpointsInToken);
  });
}

/**
 * Run diff on two sets of tokens,
 * and sync the keys from the first set to the second set if those tokens are matched
 */
function syncTokenKeys(from, to, options = {}) {
  const {
    splitTokens: shouldSplitTokens = false,
    enhanceMatching = true
  } = options;

  // Run the diff and generate matches parts
  // In the matched parts, we override the keys with the same key so that the transition group can know they are the same element
  const matches = findTextMatches(from.code, to.code, options);
  const tokensFrom = shouldSplitTokens ? splitTokens(from.tokens, matches.flatMap(m => m.from)) : from.tokens;
  const tokensTo = shouldSplitTokens ? splitTokens(to.tokens, matches.flatMap(m => m.to)) : to.tokens;
  const matchedKeys = new Set();
  matches.forEach(match => {
    const tokensF = tokensFrom.filter(t => t.offset >= match.from[0] && t.offset + t.content.length <= match.from[1]);
    const tokensT = tokensTo.filter(t => t.offset >= match.to[0] && t.offset + t.content.length <= match.to[1]);
    let idxF = 0;
    let idxT = 0;
    while (idxF < tokensF.length && idxT < tokensT.length) {
      if (!tokensF[idxF] || !tokensT[idxT]) break;
      if (tokensF[idxF].content === tokensT[idxT].content) {
        // assign the key from the first set to the second set
        tokensT[idxT].key = tokensF[idxF].key;
        matchedKeys.add(tokensF[idxF].key);
        idxF++;
        idxT++;
      } else if (tokensF[idxF + 1]?.content === tokensT[idxT].content) {
        // console.log('Token missing match', tokensF[idxF], undefined)
        idxF++;
      } else if (tokensF[idxF].content === tokensT[idxT + 1]?.content) {
        // console.log('Token missing match', undefined, tokensT[idxT])
        idxT++;
      } else {
        // console.log('Token missing match', tokensF[idxF], tokensT[idxT])
        idxF++;
        idxT++;
      }
    }
  });
  if (enhanceMatching) {
    for (const token of tokensFrom) {
      if (matchedKeys.has(token.key)) continue;
      if (token.content.length < 3 || !token.content.match(/^[\w-]+$/)) continue;
      const matched = tokensTo.find(t => t.content === token.content && !matchedKeys.has(t.key));
      if (matched) {
        matched.key = token.key;
        matchedKeys.add(token.key);
      }
    }
  }
  return {
    from: tokensFrom.length === from.tokens.length ? from : {
      ...from,
      tokens: tokensFrom
    },
    to: tokensTo.length === to.tokens.length ? to : {
      ...to,
      tokens: tokensTo
    }
  };
}

/**
 * Find ranges of text matches between two strings
 * It uses `diff-match-patch` under the hood
 */
function findTextMatches(a, b, options = {}) {
  let delta = diff(a, b);
  delta = options.diffCleanup?.(delta) || delta;
  let aContent = '';
  let bContent = '';
  const matched = [];
  for (const [op, text] of delta) {
    if (op === 0) {
      matched.push({
        from: [aContent.length, aContent.length + text.length],
        to: [bContent.length, bContent.length + text.length],
        content: text
      });
      aContent += text;
      bContent += text;
    } else if (op === -1) {
      aContent += text;
    } else if (op === 1) {
      bContent += text;
    }
  }
  if (aContent !== a || bContent !== b) throw new Error('Content mismatch');
  return matched;
}

export { codeToKeyedTokens, createMagicMoveMachine, findTextMatches, syncTokenKeys, toKeyedTokens };
