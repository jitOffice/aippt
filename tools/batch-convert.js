/**
 * Batch PPTX to JSON Converter
 * 批量转换 PPTX 模板为 JSON
 * 
 * Usage: node batch-convert.js <input-folder> <output-folder>
 */

const fs = require('fs');
const path = require('path');
const { parsePPTX, convertToKonvaFormat } = require('./pptx-to-json');

async function batchConvert(inputFolder, outputFolder) {
  console.log('='.repeat(60));
  console.log('Batch PPTX to JSON Converter');
  console.log('='.repeat(60));
  
  // 创建输出文件夹
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }
  
  // 获取所有 PPTX 文件
  const files = fs.readdirSync(inputFolder)
    .filter(file => file.endsWith('.pptx') || file.endsWith('.PPTX'));
  
  console.log(`\n找到 ${files.length} 个 PPTX 文件\n`);
  
  const results = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(inputFolder, file);
    const outputPath = path.join(outputFolder, file.replace(/\.pptx$/i, '.json'));
    
    console.log(`[${i + 1}/${files.length}] 转换: ${file}`);
    
    try {
      const template = await parsePPTX(inputPath);
      const konvaData = convertToKonvaFormat(template);
      
      fs.writeFileSync(outputPath, JSON.stringify(konvaData, null, 2));
      
      console.log(`  ✓ 成功: ${outputPath}`);
      console.log(`  - 幻灯片数: ${konvaData.slides.length}`);
      console.log(`  - 分类: ${konvaData.category}`);
      console.log('');
      
      results.push({
        success: true,
        input: file,
        output: path.basename(outputPath),
        slides: konvaData.slides.length,
      });
      
    } catch (error) {
      console.error(`  ✗ 失败: ${error.message}`);
      console.log('');
      
      results.push({
        success: false,
        input: file,
        error: error.message,
      });
    }
  }
  
  // 生成汇总报告
  console.log('='.repeat(60));
  console.log('转换汇总');
  console.log('='.repeat(60));
  
  const success = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`总计: ${files.length} 个文件`);
  console.log(`成功: ${success} 个`);
  console.log(`失败: ${failed} 个`);
  
  if (failed > 0) {
    console.log('\n失败列表:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.input}: ${r.error}`);
    });
  }
  
  // 保存汇总报告
  const reportPath = path.join(outputFolder, '_conversion_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: files.length,
    success: success,
    failed: failed,
    results: results,
  }, null, 2));
  
  console.log(`\n汇总报告已保存: ${reportPath}`);
  console.log('='.repeat(60));
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node batch-convert.js <input-folder> <output-folder>');
    console.error('');
    console.error('Example:');
    console.error('  node batch-convert.js ./templates/pptx ./templates/json');
    process.exit(1);
  }
  
  const inputFolder = args[0];
  const outputFolder = args[1];
  
  if (!fs.existsSync(inputFolder)) {
    console.error(`Error: Input folder not found: ${inputFolder}`);
    process.exit(1);
  }
  
  await batchConvert(inputFolder, outputFolder);
}

// 运行
if (require.main === module) {
  main();
}

module.exports = { batchConvert };
