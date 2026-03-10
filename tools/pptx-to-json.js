/**
 * PPTX to JSON Converter
 * 将 PowerPoint 模板转换为 Konva 可用的 JSON 格式
 * 
 * Usage: node pptx-to-json.js <input.pptx> <output.json>
 */

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const xml2js = require('xml2js');

// 解析 PPTX 文件
async function parsePPTX(pptxPath) {
  console.log(`[1/5] 读取 PPTX 文件: ${pptxPath}`);
  
  const data = fs.readFileSync(pptxPath);
  const zip = await JSZip.loadAsync(data);
  
  console.log('[2/5] 解析 XML 文件...');
  
  // 解析演示文稿尺寸
  const presentationXML = await zip.file('ppt/presentation.xml').async('string');
  const presentation = await xml2js.parseStringPromise(presentationXML);
  
  const slideWidth = parseInt(presentation['p:presentation']['p:sldSz'][0]['$']['cx']) / 12700; // EMU to px
  const slideHeight = parseInt(presentation['p:presentation']['p:sldSz'][0]['$']['cy']) / 12700;
  
  console.log(`   尺寸: ${slideWidth}px × ${slideHeight}px`);
  
  // 获取所有幻灯片
  const slideFiles = Object.keys(zip.files)
    .filter(name => name.match(/ppt\/slides\/slide\d+\.xml$/))
    .sort();
  
  console.log(`   找到 ${slideFiles.length} 个幻灯片`);
  
  console.log('[3/5] 解析幻灯片内容...');
  
  const slides = [];
  for (const slideFile of slideFiles) {
    const slideXML = await zip.file(slideFile).async('string');
    const slide = await parseSlide(slideXML, slideWidth, slideHeight);
    slides.push(slide);
    console.log(`   ✓ ${slideFile}`);
  }
  
  return {
    name: path.basename(pptxPath, '.pptx'),
    width: slideWidth,
    height: slideHeight,
    slides: slides,
  };
}

// 解析单个幻灯片
async function parseSlide(slideXML, slideWidth, slideHeight) {
  const parsed = await xml2js.parseStringPromise(slideXML);
  const slideData = parsed['p:sld'];
  
  const slide = {
    type: 'content', // cover / content / image / quote
    background: extractBackground(slideData),
    elements: [],
  };
  
  // 解析形状和文本框
  const shapes = slideData['p:cSld'][0]['p:spTree'][0]['p:sp'] || [];
  
  for (const shape of shapes) {
    const element = parseShape(shape, slideWidth, slideHeight);
    if (element) {
      slide.elements.push(element);
    }
  }
  
  // 检测幻灯片类型
  slide.type = detectSlideType(slide);
  
  return slide;
}

// 解析形状
function parseShape(shape, slideWidth, slideHeight) {
  // 获取位置和尺寸
  const spPr = shape['p:spPr'][0];
  const xfrm = spPr['a:xfrm']?.[0];
  
  if (!xfrm) return null;
  
  const off = xfrm['a:off'][0]['$'];
  const ext = xfrm['a:ext'][0]['$'];
  
  const x = parseInt(off.x) / 12700; // EMU to px
  const y = parseInt(off.y) / 12700;
  const width = parseInt(ext.cx) / 12700;
  const height = parseInt(ext.cy) / 12700;
  
  // 获取文本内容
  const txBody = shape['p:txBody'];
  let text = '';
  let fontSize = 18;
  let fontFamily = 'Arial';
  let fontWeight = 'normal';
  let color = '#000000';
  let align = 'left';
  
  if (txBody && txBody[0]['a:p']) {
    const paragraphs = txBody[0]['a:p'];
    
    for (const p of paragraphs) {
      // 提取段落对齐方式
      if (p['a:pPr']?.[0]?.['$']?.algn) {
        const algn = p['a:pPr'][0]['$'].algn;
        align = algn === 'ctr' ? 'center' : algn === 'r' ? 'right' : 'left';
      }
      
      // 提取文本运行
      const runs = p['a:r'] || [];
      for (const run of runs) {
        if (run['a:t']) {
          text += run['a:t'][0];
        }
        
        // 提取字体样式
        if (run['a:rPr']?.[0]) {
          const rPr = run['a:rPr'][0]['$'];
          if (rPr.sz) fontSize = parseInt(rPr.sz) / 100; // 单位转换
          if (rPr.b === '1') fontWeight = 'bold';
          
          // 提取颜色
          const solidFill = run['a:rPr'][0]['a:solidFill'];
          if (solidFill) {
            color = extractColor(solidFill[0]);
          }
        }
      }
      
      text += '\n';
    }
    
    text = text.trim();
  }
  
  // 获取填充色（背景）
  let fill = 'transparent';
  const solidFill = spPr['a:solidFill'];
  if (solidFill) {
    fill = extractColor(solidFill[0]);
  }
  
  return {
    type: text ? 'text' : 'shape',
    x: x,
    y: y,
    width: width,
    height: height,
    text: text || undefined,
    fontSize: fontSize,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    color: color,
    align: align,
    fill: fill,
  };
}

// 提取背景
function extractBackground(slideData) {
  // 简化版：返回白色背景
  // 实际可以从 p:bg 中提取
  return {
    type: 'solid',
    color: '#FFFFFF',
  };
}

// 提取颜色
function extractColor(solidFill) {
  if (solidFill['a:srgbClr']) {
    return '#' + solidFill['a:srgbClr'][0]['$'].val;
  }
  if (solidFill['a:schemeClr']) {
    // 主题颜色，返回默认值
    return '#000000';
  }
  return '#000000';
}

// 检测幻灯片类型
function detectSlideType(slide) {
  const elements = slide.elements.filter(e => e.type === 'text');
  
  // 如果只有1-2个大标题，可能是封面
  if (elements.length <= 2 && elements.some(e => e.fontSize > 40)) {
    return 'cover';
  }
  
  // 如果有多个文本框，可能是内容页
  if (elements.length >= 3) {
    return 'content';
  }
  
  return 'content';
}

// 转换为 Konva 格式
function convertToKonvaFormat(template) {
  console.log('[4/5] 转换为 Konva 格式...');
  
  return {
    id: generateId(),
    name: template.name,
    category: detectCategory(template),
    preview: '', // 需要单独生成预览图
    width: template.width,
    height: template.height,
    slides: template.slides.map(slide => ({
      type: slide.type,
      background: slide.background,
      layers: [
        {
          name: 'background',
          children: [], // 背景元素
        },
        {
          name: 'content',
          children: slide.elements.map(convertElementToKonva),
        }
      ]
    }))
  };
}

// 转换单个元素为 Konva 节点
function convertElementToKonva(element) {
  if (element.type === 'text') {
    return {
      className: 'Text',
      attrs: {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        text: element.text,
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        fontStyle: element.fontWeight,
        fill: element.color,
        align: element.align,
        verticalAlign: 'middle',
        placeholder: true, // 标记为可替换内容
      }
    };
  } else if (element.type === 'shape') {
    return {
      className: 'Rect',
      attrs: {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
        fill: element.fill,
      }
    };
  }
  
  return null;
}

// 检测分类
function detectCategory(template) {
  // 简单检测：根据颜色判断
  const colors = [];
  template.slides.forEach(slide => {
    slide.elements.forEach(el => {
      if (el.color) colors.push(el.color);
      if (el.fill) colors.push(el.fill);
    });
  });
  
  const hasBlue = colors.some(c => c.includes('00') && c.includes('ff'));
  const hasPurple = colors.some(c => c.includes('ff') && c.includes('00ff'));
  
  if (hasBlue) return 'business';
  if (hasPurple) return 'creative';
  return 'minimal';
}

// 生成ID
function generateId() {
  return 'tpl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node pptx-to-json.js <input.pptx> <output.json>');
    process.exit(1);
  }
  
  const inputPath = args[0];
  const outputPath = args[1];
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found: ${inputPath}`);
    process.exit(1);
  }
  
  try {
    console.log('='.repeat(60));
    console.log('PPTX to JSON Converter');
    console.log('='.repeat(60));
    
    const template = await parsePPTX(inputPath);
    const konvaData = convertToKonvaFormat(template);
    
    console.log('[5/5] 保存 JSON 文件...');
    fs.writeFileSync(outputPath, JSON.stringify(konvaData, null, 2));
    
    console.log('='.repeat(60));
    console.log(`✓ 转换完成！`);
    console.log(`  输入: ${inputPath}`);
    console.log(`  输出: ${outputPath}`);
    console.log(`  幻灯片数: ${konvaData.slides.length}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 运行
if (require.main === module) {
  main();
}

module.exports = { parsePPTX, convertToKonvaFormat };
