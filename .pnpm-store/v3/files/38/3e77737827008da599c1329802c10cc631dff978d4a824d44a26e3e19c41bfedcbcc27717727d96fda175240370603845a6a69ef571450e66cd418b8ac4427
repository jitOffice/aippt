# Measury

一个轻量级的 JavaScript 库，用于在非浏览器环境中估算文本的宽度和高度。

与 `node-canvas` 或 `opentype` 等重量级方案不同，本库提供了一个基于字体度量配置的轻量级替代方案，适用于近似文本测量。

## ✨ 特性

- 📏 精确的文本宽度和高度测量
- 🎨 支持多种文本样式（字体、大小、粗细、间距等）
- 🔤 文本转换支持（大写、小写、首字母大写）
- 📦 **轻量级** - 按需加载，核心库仅 3-5KB
- 🌲 **Tree-shaking 友好** - 只打包使用的字体
- 🚀 快速 - 基于预计算的字体度量
- 🛠️ 完整的 TypeScript 类型定义
- 🔧 内置字体提取脚本

## 📦 安装

```bash
npm install measury
```

## 🚀 快速开始

### 方式 1：使用系统字体（最小体积）

```typescript
import { measureText } from 'measury';

// 测量系统字体，无需额外配置
const metrics = measureText('Hello World', {
  fontFamily: 'Arial',
  fontSize: 16,
});

console.log(metrics.width);    // 文本宽度（像素）
console.log(metrics.height);   // 行高（像素）
console.log(metrics.baseline); // 基线位置（像素）
```

### 方式 2：按需加载字体数据（精确测量）

```typescript
import { measureText, registerFont } from 'measury';
import AlibabaPuHuiTiRegular from 'measury/fonts/AlibabaPuHuiTi-Regular';

// 注册字体
registerFont(AlibabaPuHuiTiRegular);

// 精确测量
const metrics = measureText('你好世界', {
  fontFamily: 'Alibaba PuHuiTi',
  fontSize: 16,
  fontStyle: 'normal', // 支持 'normal' | 'italic' | 'oblique'
});
```

**优势**：
- ✅ 核心库体积小（3-5KB），只在需要时加载字体数据
- ✅ Tree-shaking 友好，打包工具自动去除未使用的字体
- ✅ 灵活控制打包体积
- ✅ 支持多种字体样式（normal, italic, oblique）

**字体导入方式**：

```typescript
import AlibabaPuHuiTiRegular from 'measury/fonts/AlibabaPuHuiTi-Regular';
```

## 📖 API

### `measureText(text, style?)`

测量单行文本的尺寸。

**参数：**
- `text` - 要测量的文本
- `style` - 可选的文本样式配置

**返回：** `TextMetrics` 对象
- `width` - 文本宽度（像素）
- `height` - 行高（像素）
- `baseline` - 基线位置（像素）

**样式选项：**

```typescript
interface TextStyle {
  fontSize?: number;              // 默认: 16
  fontFamily?: string;            // 默认: 'sans-serif'
  fontWeight?: 'normal' | 'bold' | number;
  fontStyle?: 'normal' | 'italic' | 'oblique';
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';
  letterSpacing?: number;         // 字符间距（像素）
  wordSpacing?: number;           // 单词间距（像素）
  lineHeight?: number | { type: 'pixel', value: number };
}
```

### `registerFont(fontData)`

注册字体供文本测量使用。

```typescript
import { registerFont } from 'measury';
import MyFont from 'measury/myfont';

registerFont(MyFont);
```

支持在字体数据中声明别名：

```typescript
registerFont({
  ...MyFont,
  aliases: ['AlibabaPuHuiTi', 'AlibabaPuHuiTi-Regular'],
});
```

### `setDefaultFontFamily(fontFamily)`

设置默认字体族。

```typescript
import { setDefaultFontFamily } from 'measury';

setDefaultFontFamily('Alibaba PuHuiTi');
```

## 🔧 从 TTF 文件提取字体数据

本库内置了从 TTF 文件提取字体度量数据的脚本。

### 基本用法

```bash
npm run extract <字体文件路径.ttf>
```

这将：
1. 从 TTF/OFT 文件提取字体数据
2. 在 `src/fonts/` 生成 TypeScript 文件
3. 自动添加到 `src/fonts/index.ts`

### 示例

**提取字体：**
```bash
npm run extract fonts/Roboto-Regular.ttf
# 生成: src/fonts/roboto-regular.ts
```

**指定字重：**
```bash
npm run extract fonts/Roboto-Bold.ttf --weight 700
# 或简写
npm run extract fonts/Roboto-Bold.ttf -w 700
```

**指定字体样式：**
```bash
npm run extract fonts/Roboto-Italic.ttf --style italic
# 或简写
npm run extract fonts/Roboto-Italic.ttf -s italic
```

**自定义字体名称：**
```bash
npm run extract fonts/CustomFont.ttf --family "自定义字体"
```

**只提取特定字符（减小文件体积）：**
```bash
# 只提取数字
npm run extract fonts/Arial.ttf --charset "0123456789"

# 只提取英文字母
npm run extract fonts/Font.ttf -c "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
```

**跳过字偶距数据：**
```bash
npm run extract fonts/Font.ttf --no-kerning
```

### 选项说明

| 选项 | 简写 | 说明 | 示例 |
|------|------|------|------|
| `--weight <weight>` | `-w` | 设置字重 | `--weight 700` |
| `--style <style>` | `-s` | 设置字体样式 (normal/italic/oblique) | `--style italic` |
| `--family <name>` | `-f` | 自定义字体名称 | `--family "我的字体"` |
| `--charset <chars>` | `-c` | 只提取指定字符 | `--charset "ABC123"` |
| `--output <file>` | `-o` | 输出文件路径 | `-o src/fonts/my-font.ts` |
| `--no-kerning` | - | 跳过字偶距数据 | `--no-kerning` |

### 提取后使用

```typescript
import { measureText } from 'measury';

const metrics = measureText('Hello', {
  fontFamily: 'Roboto',
  fontSize: 16,
});
```

### 优化建议

- **减小文件体积**：
  - 使用 `--charset` 只提取需要的字符
  - 使用 `--no-kerning` 跳过字偶距数据
  - 脚本自动优化：将最常见的字形宽度设为默认值
  
- **字重**：分别提取每个字重（Regular、Bold 等）

- **提取速度**：
  - 小字体（拉丁字符，~100-500 字形）：< 1 秒
  - 大字体（CJK，10,000+ 字形）：1-10 秒

## 🧪 测试

运行测试：

```bash
npm test
```

监听模式：

```bash
npm run test:watch
```

生成覆盖率报告：

```bash
npm run test:coverage
```

### 浏览器验证

验证测量准确性：

```bash
npm run dev
# 访问 http://localhost:8090
```

功能：
- ✅ 包含字体文件，开箱即用
- ✅ 对比真实浏览器渲染结果
- ✅ 生成测试代码
- ✅ 验证测量精度

## ⚙️ 工作原理

1. 从 TTF 文件预提取字体度量数据（字形宽度、垂直度量、字偶距）
2. 通过累加每个字符的推进宽度来测量文本
3. 应用字符对之间的字偶距调整
4. 添加指定的字符间距和单词间距
5. 根据字体度量或样式设置计算行高

这种方法提供快速的近似测量，无需完整字体渲染的开销。

## ⚠️ 限制

- 仅支持单行文本测量（不支持自动换行）
- 需要预注册字体数据
- 测量结果是基于字体度量的近似值，非像素完美
- 不考虑字体微调、亚像素渲染或平台特定的文本渲染差异

## 📄 许可证

MIT
