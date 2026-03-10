
var assert = require('assert')
  , dnt = require('.')
;

describe('Node types', function () {
  it('has them all!', function () {
    [
      'ELEMENT_NODE',
      'ATTRIBUTE_NODE',
      'TEXT_NODE',
      'CDATA_SECTION_NODE',
      'ENTITY_REFERENCE_NODE',
      'ENTITY_NODE',
      'PROCESSING_INSTRUCTION_NODE',
      'COMMENT_NODE',
      'DOCUMENT_NODE',
      'DOCUMENT_TYPE_NODE',
      'DOCUMENT_FRAGMENT_NODE',
      'NOTATION_NODE',
    ].forEach(function (type, idx) {
      assert.equal(dnt[type], idx + 1, type + ' is ' + (idx + 1));
    });
  });
});
