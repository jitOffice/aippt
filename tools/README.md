# PPTX to JSON Converter

将 PowerPoint 模板转换为 Konva 可用的 JSON 格式

## 📦 安装依赖

```bash
cd tools
npm install
```

## 🚀 使用方法

### 方法1: 转换单个文件

```bash
node pptx-to-json.js <input.pptx> <output.json>
```

**示例:**
```bash
node pptx-to-json.js ./templates/商务蓝色.pptx ./output/business-blue.json
```

### 方法2: 批量转换

```bash
node batch-convert.js <input-folder> <output-folder>
```

**示例:**
```bash
# 创建目录
mkdir -p templates/pptx templates/json

# 将下载的 PPTX 文件放到 templates/pptx/

# 批量转换
node batch-convert.js ./templates/pptx ./templates/json
```

## 📁 文件结构

```
tools/
├── pptx-to-json.js       # 单文件转换脚本
├── batch-convert.js      # 批量转换脚本
├── package.json          # 依赖配置
├── README.md             # 使用说明
└── templates/
    ├── pptx/            # 放置 PPTX 源文件
    └── json/            # 输出 JSON 文件
```

## 📋 操作步骤

### Step 1: 下载模板

从 OfficePlus 下载 3-5 个免费模板：

1. 访问: https://www.officeplus.cn/
2. 搜索关键词: "商务" "创意" "极简"
3. 下载 PPTX 文件到 `./templates/pptx/`

**推荐模板:**
- 商务蓝色风格 (business-blue.pptx)
- 创意紫色风格 (creative-purple.pptx)
- 极简白色风格 (minimal-white.pptx)

### Step 2: 转换为 JSON

```bash
cd tools
npm install
node batch-convert.js ./templates/pptx ./templates/json
```

### Step 3: 查看转换结果

转换后的 JSON 文件格式:

```json
{
  "id": "tpl_1234567890_abc123",
  "name": "商务蓝色",
  "category": "business",
  "width": 960,
  "height": 540,
  "slides": [
    {
      "type": "cover",
      "background": {
        "type": "solid",
        "color": "#FFFFFF"
      },
      "layers": [
        {
          "name": "content",
          "children": [
            {
              "className": "Text",
              "attrs": {
                "x": 100,
                "y": 200,
                "width": 760,
                "height": 100,
                "text": "这里是标题",
                "fontSize": 48,
                "fontFamily": "Arial",
                "fontStyle": "bold",
                "fill": "#000000",
                "align": "center",
                "placeholder": true
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Step 4: 导入到数据库 (后续步骤)

见主项目的 `apps/server-slide` 文档

## 🔍 JSON 格式说明

### 模板结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 模板唯一ID |
| `name` | string | 模板名称 |
| `category` | string | 分类: business/creative/minimal |
| `width` | number | 幻灯片宽度 (px) |
| `height` | number | 幻灯片高度 (px) |
| `slides` | array | 幻灯片数组 |

### 幻灯片结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `type` | string | 类型: cover/content/image/quote |
| `background` | object | 背景配置 |
| `layers` | array | Konva 图层数组 |

### 元素属性

| 字段 | 类型 | 说明 |
|------|------|------|
| `className` | string | Konva类名: Text/Rect/Image |
| `attrs` | object | 元素属性 (x, y, width, height, ...) |
| `attrs.placeholder` | boolean | 是否为可替换内容 (true = 可填充Markdown) |

## ⚠️ 注意事项

1. **PPTX 兼容性**: 仅支持标准 Office Open XML 格式
2. **复杂元素**: 图表、动画等暂不支持，会被忽略
3. **字体**: 确保字体在系统中已安装
4. **图片**: 图片会被提取路径，需要单独处理

## 🐛 故障排除

**问题1: 转换失败**
```
Error: Cannot read property...
```
解决: PPTX 格式可能不标准，尝试在 PowerPoint 中重新保存

**问题2: 中文乱码**
```
编码错误...
```
解决: 确保文件名不包含特殊字符

**问题3: 内存不足**
```
JavaScript heap out of memory
```
解决: 增加 Node.js 内存限制
```bash
NODE_OPTIONS="--max-old-space-size=4096" node batch-convert.js ...
```

## 📖 下一步

1. 将 JSON 文件导入到 PostgreSQL 数据库
2. 开发模板选择器 UI
3. 实现 Markdown → Konva 内容填充
4. 添加预览图生成功能

见主项目文档: `apps/slide/README.md`
