
module.exports = function qname (name, ns = {}) {
  let match = /^(\w+):(.+)/.exec(name);
  if (match && ns[match[1]]) return { ns: ns[match[1]], ln: match[2] };
  return { qn: name };
};
