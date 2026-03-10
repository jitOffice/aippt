
/* eslint import/no-extraneous-dependencies: 0 */
let assert = require('assert')
  , dom = require('get-dom')
  , Marcheur = require('..')
  , nodal = require('../nodal')
  , Matcher = require('../matcher')
  , loadXML = require('../test-utils/load-xml')
  , { join } = require('path')
  , prefixMap = { b: 'http://berjon.com/' }
;

describe('Basic', () => {
  let m = new Matcher(prefixMap)
    , walker
  ;
  beforeAll(() => {
    walker = new Marcheur();
  });
  it('should match basic structures', (done) => {
    loadXML(join(__dirname, 'fixtures/basic.xml'), (err, document) => {
      assert.ifError(err);
      let seenDoc = false
        , seenEl = false
        , seenDefault = false
        , el
      ;
      walker
        .match(m.document(),
          (src, out, w) => {
            let doc = dom.implementation().createHTMLDocument('')
              , nod = nodal(doc, {}, prefixMap)
              , meta = doc.createElement('meta')
            ;
            el = nod.el;
            meta.setAttribute('charset', 'utf8');
            doc.head.appendChild(meta);
            seenDoc = true;
            w.result(doc);
            w.walk(doc.body);
          }
        )
        .match(m.el('b:sub-element'), (src, out, w) => {
          seenEl = true;
          assert(out, 'there is an output');
          assert.equal(out.localName, 'div', 'output is div');
          w.walk(el('span', {}, out));
        })
        .match(m.el('*'), (src, out, w) => {
          seenDefault = true;
          assert(src, 'there is a source');
          assert.equal(src.localName, 'test', 'src is body');
          assert.equal(src.namespaceURI, prefixMap.b, 'src is in right ns');
          assert(out, 'there is an output');
          assert.equal(out.localName, 'body', 'output is body');
          w.walk(el('div', { id: 'found' }, out));
        })
        .run(document, (err, result) => {
          assert(seenDoc, 'walked the document');
          assert(seenEl, 'walked the element');
          assert(seenDefault, 'walked the default');
          assert(result, 'there is a result');
          assert(result.querySelector('body'), 'result has a body');
          assert(result.querySelector('meta[charset="utf8"]'), 'result has a meta[charset]');
          assert(result.querySelector('#found'), 'made an output');
          assert(result.querySelector('body > #found > span'), 'correct structure');
          assert(/Kittens/.test(result.body.textContent), 'result has kittens');
          done();
        })
      ;
    });
  });
});
