/**
 * Skill: 智能图表生成
 * 使用 MiniMax 生成 ECharts 配置
 */

import { streamGenerate } from '@/utils/ai/index'
import type { Skill, SkillMetadata, SkillParams, SkillResult } from '../SkillRegistry'

export class ChartGenerationSkill implements Skill {
  metadata: SkillMetadata = {
    id: 'chart-generation',
    name: '智能图表生成',
    description: '根据需求生成专业图表：柱状图、折线图、饼图、雷达图等',
    category: 'data',
    provider: 'minimax-echarts',
    keywords: ['图表', '柱状图', '折线图', '饼图', '雷达图', '散点图', '数据可视化', '统计图', '数据图'],
    examples: [
      '添加一个销售数据的柱状图',
      '生成产品占比的饼图',
      '创建趋势分析的折线图'
    ]
  }

  async execute(params: SkillParams): Promise<SkillResult> {
    return new Promise((resolve) => {
      let fullResponse = ''

      // 检测图表类型
      const chartType = this.detectChartType(params.userInput)

      const systemPrompt = `你是 ECharts 配置生成专家。
根据用户需求生成完整的 ECharts option 配置。

要求：
1. 返回单行 JSON 格式（无换行）
2. 配置必须完整可用
3. 使用中文标签
4. 适配 600x400 画布尺寸
5. 颜色使用专业配色方案

示例（柱状图）：
{"title":{"text":"销售数据","left":"center"},"tooltip":{"trigger":"axis"},"xAxis":{"type":"category","data":["周一","周二","周三","周四","周五"]},"yAxis":{"type":"value"},"series":[{"data":[120,200,150,80,170],"type":"bar","itemStyle":{"color":"#5470c6"}}]}

示例（饼图）：
{"title":{"text":"产品占比","left":"center"},"tooltip":{"trigger":"item"},"series":[{"type":"pie","radius":"50%","data":[{"value":335,"name":"产品A"},{"value":234,"name":"产品B"},{"value":154,"name":"产品C"}]}]}`

      streamGenerate(
        `生成${chartType}，需求：${params.userInput}`,
        systemPrompt,
        {
          onDelta: (chunk) => {
            fullResponse += chunk
          },
          onDone: () => {
            try {
              // 提取 JSON
              const jsonMatch = fullResponse.match(/\{[\s\S]*\}/)
              if (!jsonMatch) {
                resolve({
                  success: false,
                  error: '无法解析 ECharts 配置'
                })
                return
              }

              const echartOption = JSON.parse(jsonMatch[0])

              resolve({
                success: true,
                data: { echartOption, chartType },
                actions: [{
                  type: 'add-chart',
                  payload: {
                    echartOption,
                    x: 100,
                    y: 100,
                    width: 600,
                    height: 400
                  }
                }]
              })
            } catch (error) {
              resolve({
                success: false,
                error: '图表配置解析失败'
              })
            }
          },
          onError: (error) => {
            resolve({
              success: false,
              error: String(error)
            })
          }
        },
        undefined,
        {
          provider: 'minimax',
          model: 'minimax-m2.1-lightning'
        }
      )
    })
  }

  /**
   * 检测图表类型
   */
  private detectChartType(userInput: string): string {
    if (/柱状图|柱形图|bar/i.test(userInput)) return '柱状图'
    if (/折线图|线图|line/i.test(userInput)) return '折线图'
    if (/饼图|pie/i.test(userInput)) return '饼图'
    if (/雷达图|radar/i.test(userInput)) return '雷达图'
    if (/散点图|scatter/i.test(userInput)) return '散点图'
    return '图表'
  }
}
