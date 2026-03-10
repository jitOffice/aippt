/**
 * Markdown to PPT Content Filler
 * 将 Markdown 大纲内容填充到模板中
 */

import { marked } from 'marked';

/**
 * 解析 Markdown 大纲为幻灯片数据
 */
export function parseMarkdownOutline(markdown) {
  const tokens = marked.lexer(markdown);
  const slides = [];
  
  let currentSlide = null;
  
  for (const token of tokens) {
    if (token.type === 'heading') {
      // 一级标题 = 新幻灯片
      if (token.depth === 1) {
        if (currentSlide) {
          slides.push(currentSlide);
        }
        currentSlide = {
          title: token.text,
          bullets: [],
          type: 'content'
        };
      }
      // 二级标题 = 内容标题
      else if (token.depth === 2 && currentSlide) {
        currentSlide.subtitle = token.text;
      }
    }
    // 列表项 = 内容要点
    else if (token.type === 'list' && currentSlide) {
      currentSlide.bullets = token.items.map(item => {
        // 提取纯文本
        return item.tokens
          .filter(t => t.type === 'text')
          .map(t => t.text)
          .join('');
      });
    }
    // 段落 = 描述文本
    else if (token.type === 'paragraph' && currentSlide) {
      if (!currentSlide.description) {
        currentSlide.description = token.text;
      }
    }
  }
  
  // 添加最后一个幻灯片
  if (currentSlide) {
    slides.push(currentSlide);
  }
  
  // 第一个作为封面
  if (slides.length > 0) {
    slides[0].type = 'cover';
  }
  
  return slides;
}

/**
 * 将解析的幻灯片数据应用到模板
 */
export function applyContentToTemplate(template, slides) {
  const result = {
    ...template,
    slides: []
  };
  
  for (let i = 0; i < slides.length; i++) {
    const slideData = slides[i];
    
    // 选择合适的模板幻灯片
    const templateSlide = selectTemplateSlide(template, slideData, i);
    
    // 复制模板幻灯片
    const newSlide = JSON.parse(JSON.stringify(templateSlide));
    
    // 填充内容
    fillSlideContent(newSlide, slideData);
    
    result.slides.push(newSlide);
  }
  
  return result;
}

/**
 * 选择合适的模板幻灯片
 */
function selectTemplateSlide(template, slideData, index) {
  // 第一张使用封面模板
  if (index === 0 || slideData.type === 'cover') {
    const coverSlide = template.slides.find(s => s.type === 'cover');
    if (coverSlide) return coverSlide;
  }
  
  // 根据内容数量选择模板
  const bulletCount = slideData.bullets?.length || 0;
  
  // 内容多的用布局紧凑的模板
  if (bulletCount > 4) {
    const denseSlide = template.slides.find(s => 
      s.type === 'content' && s.layout === 'dense'
    );
    if (denseSlide) return denseSlide;
  }
  
  // 默认使用第一个内容模板
  const contentSlide = template.slides.find(s => s.type === 'content');
  return contentSlide || template.slides[1] || template.slides[0];
}

/**
 * 填充幻灯片内容
 */
function fillSlideContent(slide, slideData) {
  if (!slide.layers) return;
  
  for (const layer of slide.layers) {
    if (!layer.children) continue;
    
    for (const element of layer.children) {
      // 跳过非占位符元素
      if (!element.attrs?.placeholder) continue;
      
      // 根据元素位置判断填充内容
      const y = element.attrs.y || 0;
      const fontSize = element.attrs.fontSize || 18;
      
      // 标题区域（Y < 150px 且字体较大）
      if (y < 150 && fontSize > 30) {
        element.attrs.text = slideData.title || element.attrs.text;
      }
      // 副标题区域
      else if (y < 200 && fontSize > 20 && fontSize <= 30) {
        element.attrs.text = slideData.subtitle || element.attrs.text;
      }
      // 内容区域
      else {
        // 如果是文本占位符，填充要点
        if (slideData.bullets && slideData.bullets.length > 0) {
          const bulletIndex = layer.children.filter(
            el => el.attrs?.placeholder && el.attrs.y > 200
          ).indexOf(element);
          
          if (bulletIndex >= 0 && bulletIndex < slideData.bullets.length) {
            element.attrs.text = slideData.bullets[bulletIndex];
          } else {
            // 没有对应内容，隐藏元素
            element.attrs.visible = false;
          }
        }
      }
    }
  }
}

/**
 * 优化幻灯片布局（自动调整文本大小）
 */
export function optimizeSlideLayout(slide) {
  if (!slide.layers) return slide;
  
  for (const layer of slide.layers) {
    if (!layer.children) continue;
    
    for (const element of layer.children) {
      if (element.className !== 'Text') continue;
      
      const text = element.attrs.text || '';
      const maxWidth = element.attrs.width || 800;
      const fontSize = element.attrs.fontSize || 18;
      
      // 如果文本过长，自动缩小字体
      const textLength = text.length;
      const estimatedWidth = textLength * fontSize * 0.6;
      
      if (estimatedWidth > maxWidth) {
        const scaleFactor = maxWidth / estimatedWidth;
        element.attrs.fontSize = Math.max(12, fontSize * scaleFactor);
      }
      
      // 限制最大行数
      if (element.attrs.placeholder) {
        const maxLines = 10;
        const lines = text.split('\n');
        if (lines.length > maxLines) {
          element.attrs.text = lines.slice(0, maxLines).join('\n') + '...';
        }
      }
    }
  }
  
  return slide;
}

/**
 * 完整流程：Markdown → PPT 数据
 */
export function convertMarkdownToPPT(markdown, template) {
  // 1. 解析 Markdown
  const slides = parseMarkdownOutline(markdown);
  
  // 2. 应用到模板
  let pptData = applyContentToTemplate(template, slides);
  
  // 3. 优化布局
  pptData.slides = pptData.slides.map(optimizeSlideLayout);
  
  return pptData;
}
