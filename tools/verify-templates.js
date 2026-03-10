/**
 * Verify Templates in Database
 * 验证数据库中的模板数据
 * 
 * Usage: node verify-templates.js
 */

const { PrismaClient } = require('@prisma/client');

// 使用环境变量指定 schema 路径
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || require('../../server-slide/.env').DATABASE_URL
    }
  }
});

async function verifyTemplates() {
  console.log('='.repeat(60));
  console.log('验证数据库中的 PPT 模板');
  console.log('='.repeat(60));
  console.log('');

  try {
    // 1. 统计总数
    const total = await prisma.pPTTemplate.count();
    console.log(`📊 模板总数: ${total}`);
    console.log('');

    if (total === 0) {
      console.log('⚠️  数据库中没有模板！');
      console.log('请先运行: node import-templates-to-db.js ./templates/json');
      return;
    }

    // 2. 按分类统计
    const categories = await prisma.pPTTemplate.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    });

    console.log('📁 按分类统计:');
    categories.forEach(cat => {
      console.log(`   ${cat.category}: ${cat._count.id} 个模板`);
    });
    console.log('');

    // 3. 按来源统计
    const sources = await prisma.pPTTemplate.groupBy({
      by: ['source'],
      _count: {
        id: true
      }
    });

    console.log('🏷️  按来源统计:');
    sources.forEach(src => {
      console.log(`   ${src.source}: ${src._count.id} 个模板`);
    });
    console.log('');

    // 4. 列出所有模板
    const templates = await prisma.pPTTemplate.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        width: true,
        height: true,
        source: true,
        downloads: true,
        tags: true,
        createdAt: true,
        data: {
          select: {
            slides: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📋 模板列表:');
    console.log('');
    templates.forEach((tpl, index) => {
      console.log(`${index + 1}. ${tpl.name}`);
      console.log(`   ID: ${tpl.id}`);
      console.log(`   分类: ${tpl.category}`);
      console.log(`   尺寸: ${tpl.width}×${tpl.height}`);
      console.log(`   来源: ${tpl.source}`);
      console.log(`   幻灯片数: ${tpl.data?.slides?.length || 0}`);
      console.log(`   下载次数: ${tpl.downloads}`);
      console.log(`   标签: ${tpl.tags.join(', ')}`);
      console.log(`   创建时间: ${tpl.createdAt.toLocaleString('zh-CN')}`);
      console.log('');
    });

    // 5. 验证数据完整性
    console.log('🔍 数据完整性检查:');
    const issues = [];

    for (const tpl of templates) {
      if (!tpl.data || !tpl.data.slides || tpl.data.slides.length === 0) {
        issues.push(`❌ ${tpl.name}: 缺少幻灯片数据`);
      }
      if (!tpl.name || tpl.name.trim() === '') {
        issues.push(`❌ ${tpl.id}: 缺少名称`);
      }
      if (!tpl.category) {
        issues.push(`❌ ${tpl.name}: 缺少分类`);
      }
    }

    if (issues.length === 0) {
      console.log('   ✅ 所有模板数据完整');
    } else {
      console.log('   发现以下问题:');
      issues.forEach(issue => console.log(`   ${issue}`));
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('✅ 验证完成！');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ 验证失败:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行
verifyTemplates();
