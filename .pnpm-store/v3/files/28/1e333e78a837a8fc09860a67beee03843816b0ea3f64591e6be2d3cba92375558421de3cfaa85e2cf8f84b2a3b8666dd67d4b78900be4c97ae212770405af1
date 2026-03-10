
/* eslint import/no-extraneous-dependencies: 0 */
let { DOMParser } = require('xmldom')
  , { readFile } = require('fs')
;

module.exports = function parseXML (file, cb) {
  readFile(file, { encoding: 'utf8' }, (err, xml) => {
    if (err) return cb(err);
    let doc
      , errors = []
    ;
    try {
      doc = new DOMParser({
        errorHandler: { fatalError: (f) => errors.push(f), }
      }).parseFromString(xml);
      if (errors.length) {
        let msg = errors.map(str => str.replace(/\n@#.*?]/, '')).join('\n  - ');
        throw new Error(`Fatal XML parsing error:\n  - ${msg}`);
      }
    }
    catch (err) {
      return cb(new Error(`Failed to parse XML file '${file}': ${err}`));
    }
    if (doc) return cb(null, doc);
    cb(new Error(`Parsing ${file} as XML failed to produce a document`));
  });
};
