"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsdom = require("jsdom");
const docx = require("docx");
const mathml2omml = require("@hungknguyen/mathml2omml");
const mathjax = require("mathjax");
function convertOmml2Math(ommlString) {
  let doc;
  if (typeof window === "undefined") {
    const dom = new jsdom.JSDOM(ommlString, { contentType: "text/xml" });
    doc = dom.window.document;
  } else {
    const parser = new DOMParser();
    doc = parser.parseFromString(ommlString, "text/xml");
  }
  const mathElement = doc.getElementsByTagName("m:oMath")[0];
  const children = convertChildren(mathElement.children);
  return new docx.Math({
    children
  });
}
function convertChildren(children) {
  const items = [...children].map((item) => {
    return convertItem(item);
  });
  const components = items.filter((item) => !!item);
  return components;
}
function convertItem(item) {
  const tagName = item.tagName.toLowerCase();
  if (tagName === "m:f") {
    return buildFraction(item);
  }
  if (tagName === "m:r") {
    return buildMathRun(item);
  }
  if (tagName === "m:ssub") {
    return buildSubScript(item);
  }
  if (tagName === "m:ssup") {
    return buildSuperScript(item);
  }
  if (tagName === "m:ssubsup") {
    return buildSubSuperScript(item);
  }
  if (tagName === "m:rad") {
    return buildRadical(item);
  }
  if (tagName === "m:limupp") {
    return buildLimitUpp(item);
  }
  if (tagName === "m:limlow") {
    return buildLimitLow(item);
  }
  if (tagName === "m:nary") {
    return buildNary(item);
  }
  return new docx.MathRun("口");
}
function buildFraction(item) {
  const numerator = item.getElementsByTagName("m:num")[0];
  const denominator = item.getElementsByTagName("m:den")[0];
  return new docx.MathFraction({
    numerator: convertChildren(numerator.children),
    denominator: convertChildren(denominator.children)
  });
}
function buildMathRun(item) {
  const text = item.getElementsByTagName("m:t")[0];
  return new docx.MathRun(text.textContent || "");
}
function buildSubScript(item) {
  const e = item.getElementsByTagName("m:e")[0];
  const sub = item.getElementsByTagName("m:sub")[0];
  return new docx.MathSubScript({
    children: convertChildren(e.children),
    subScript: convertChildren(sub.children)
  });
}
function buildSuperScript(item) {
  const e = item.getElementsByTagName("m:e")[0];
  const sup = item.getElementsByTagName("m:sup")[0];
  return new docx.MathSuperScript({
    children: convertChildren(e.children),
    superScript: convertChildren(sup.children)
  });
}
function buildSubSuperScript(item) {
  const e = item.getElementsByTagName("m:e")[0];
  const sub = item.getElementsByTagName("m:sub")[0];
  const sup = item.getElementsByTagName("m:sup")[0];
  return new docx.MathSubSuperScript({
    children: convertChildren(e.children),
    superScript: convertChildren(sup.children),
    subScript: convertChildren(sub.children)
  });
}
function buildRadical(item) {
  const e = item.getElementsByTagName("m:e")[0];
  const deg = item.getElementsByTagName("m:deg")[0];
  const degree = deg.children[0] ? convertItem(deg.children[0]) : void 0;
  return new docx.MathRadical({
    children: convertChildren(e.children),
    degree: degree ? [degree] : void 0
  });
}
function buildLimitUpp(item) {
  const e = item.getElementsByTagName("m:e")[0];
  const lim = item.getElementsByTagName("m:lim")[0];
  return new docx.MathLimitUpper({
    children: convertChildren(e.children),
    limit: convertChildren(lim.children)
  });
}
function buildLimitLow(item) {
  const e = item.getElementsByTagName("m:e")[0];
  const lim = item.getElementsByTagName("m:lim")[0];
  return new docx.MathLimitLower({
    children: convertChildren(e.children),
    limit: convertChildren(lim.children)
  });
}
function buildNary(item) {
  const char = item.getElementsByTagName("m:chr")[0];
  const charVal = char.getAttribute("m:val");
  const e = item.getElementsByTagName("m:e")[0];
  const sub = item.getElementsByTagName("m:sub")[0];
  const sup = item.getElementsByTagName("m:sup")[0];
  if (charVal === "∑") {
    return new docx.MathSum({
      children: convertChildren(e.children),
      superScript: convertChildren(sup.children),
      subScript: convertChildren(sub.children)
    });
  }
  if (charVal === "∫") {
    return new docx.MathIntegral({
      children: convertChildren(e.children),
      superScript: convertChildren(sup.children),
      subScript: convertChildren(sub.children)
    });
  }
}
function convertMathMl2Math(mathMlString) {
  const ommlString = convertMathMl2Omml(mathMlString);
  return convertOmml2Math(ommlString);
}
function convertMathMl2Omml(mml) {
  const ommlString = mathml2omml.mml2omml(mml, { disableDecode: true });
  return ommlString;
}
let MathJax;
async function mathJaxReady() {
  if (typeof window === "undefined") {
    if (!MathJax) {
      MathJax = await mathjax.init({ loader: { load: ["input/tex"] } });
    }
  } else {
    MathJax = window.MathJax;
  }
  return true;
}
function convertLatex2Math(latexString) {
  const mathMlString = latex2MathMl(latexString);
  return convertMathMl2Math(mathMlString);
}
function latex2MathMl(latexString) {
  if (typeof latexString !== "string") {
    throw "invalid params for latex2MathMl";
  }
  return MathJax.tex2mml(latexString);
}
exports.convertLatex2Math = convertLatex2Math;
exports.convertMathMl2Math = convertMathMl2Math;
exports.convertOmml2Math = convertOmml2Math;
exports.mathJaxReady = mathJaxReady;
