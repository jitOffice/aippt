/**
 * Import PPT Templates to Database
 * 将转换好的 JSON 模板导入到 PostgreSQL 数据库
 * 
 * Usage: node import-templates-to-db.js <json-folder>
 */

const fs = require('fs');
const path = require('path');

// 使用 require.resolve 找到正确的 Prisma Client
let PrismaClient;
try {
  // 尝试从 server-slide 导入
  PrismaClient = require('../../server-slide/node_modules/@prisma/client').PrismaClient;
} catch (e) {
  // 备用：从根目录 node_modules 导入
  PrismaClient = require('@prisma/client').PrismaClient;
}

const prisma = new PrismaClient();

async function importTemplates(jsonFolder) {
  console.log('='.repeat(60));
  console.log('Import PPT Templates to Database');
  console.log('='.repeat(60));
  console.log('');
  
  // 获取所有 JSON 文件
  const files = fs.readdirSync(jsonFolder)
    .filter(file => file.endsWith('.json') && !file.startsWith('_'));
  
  console.log(`找到 ${files.length} 个模板文件\n`);
  
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(jsonFolder, file);
    
    console.log(`[${i + 1}/${files.length}] 导入: ${file}`);
    
    try {
      // 读取 JSON 文件
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      // 提取标签
      const tags = extractTags(jsonData);
      
      // 检查是否已存在
      const existing = await prisma.pPTTemplate.findFirst({
        where: { name: jsonData.name }
      });
      
      if (existing) {
        console.log(`  ⚠️  模板已存在，跳过: ${jsonData.name}`);
        results.push({
          success: true,
          file: file,
          action: 'skipped',
          id: existing.id
        });
        continue;
      }
      
      // 创建模板记录
      const template = await prisma.pPTTemplate.create({
        data: {
          id: jsonData.id,
          name: jsonData.name,
          category: jsonData.category || 'business',
          width: jsonData.width || 960,
          height: jsonData.height || 540,
          data: jsonData,
          source: 'officeplus',
          isPremium: false,
          tags: tags,
        }
      });
      
      console.log(`  ✓ 成功导入: ${template.name}`);
      console.log(`    - ID: ${template.id}`);
      console.log(`    - 分类: ${template.category}`);
      console.log(`    - 幻灯片数: ${jsonData.slides?.length || 0}`);
      console.log(`    - 标签: ${tags.join(', ')}`);
      console.log('');
      
      results.push({
        success: true,
        file: file,
        action: 'created',
        id: template.id,
        name: template.name
      });
      
    } catch (error) {
      console.error(`  ✗ 失败: ${error.message}`);
      console.log('');
      
      results.push({
        success: false,
        file: file,
        error: error.message
      });
    }
  }
  
  // 打印汇总
  console.log('='.repeat(60));
  console.log('导入汇总');
  console.log('='.repeat(60));
  
  const created = results.filter(r => r.action === 'created').length;
  const skipped = results.filter(r => r.action === 'skipped').length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`总计: ${files.length} 个文件`);
  console.log(`新建: ${created} 个`);
  console.log(`跳过: ${skipped} 个`);
  console.log(`失败: ${failed} 个`);
  
  if (failed > 0) {
    console.log('\n失败列表:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.file}: ${r.error}`);
    });
  }
  
  // 查询数据库中的模板总数
  const total = await prisma.pPTTemplate.count();
  console.log(`\n数据库中总模板数: ${total}`);
  console.log('='.repeat(60));
  
  return results;
}

// 提取标签
function extractTags(templateData) {
  const tags = [];
  
  // 从名称提取
  const name = templateData.name.toLowerCase();
  if (name.includes('商务') || name.includes('business')) tags.push('商务', 'business');
  if (name.includes('创意') || name.includes('creative')) tags.push('创意', 'creative');
  if (name.includes('极简') || name.includes('minimal')) tags.push('极简', 'minimal');
  if (name.includes('科技') || name.includes('tech')) tags.push('科技', 'tech');
  if (name.includes('教育') || name.includes('education')) tags.push('教育', 'education');
  
  // 从分类提取
  if (templateData.category) {
    tags.push(templateData.category);
  }
  
  // 颜色标签
  const colors = extractColors(templateData);
  tags.push(...colors);
  
  // 去重
  return [...new Set(tags)];
}

// 提取主要颜色
function extractColors(templateData) {
  const colors = [];
  const colorKeywords = {
    '蓝色': ['blue', '#00', '#1e', '#2e', '#3e'],
    '红色': ['red', '#ff0', '#e00'],
    '绿色': ['green', '#0f0', '#0e0'],
    '紫色': ['purple', '#ff00ff', '#e00e'],
    '黑色': ['black', '#000'],
    '白色': ['white', '#fff'],
  };
  
  // 简单检测（实际可以更复杂）
  const dataStr = JSON.stringify(templateData).toLowerCase();
  
  for (const [color, keywords] of Object.entries(colorKeywords)) {
    if (keywords.some(kw => dataStr.includes(kw))) {
      colors.push(color);
    }
  }
  
  return colors.slice(0, 2); // 最多2个颜色标签
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: node import-templates-to-db.js <json-folder>');
    console.error('');
    console.error('Example:');
    console.error('  node import-templates-to-db.js ./templates/json');
    process.exit(1);
  }
  
  const jsonFolder = args[0];
  
  if (!fs.existsSync(jsonFolder)) {
    console.error(`Error: Folder not found: ${jsonFolder}`);
    process.exit(1);
  }
  
  try {
    await importTemplates(jsonFolder);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行
if (require.main === module) {
  main();
}

module.exports = { importTemplates };
