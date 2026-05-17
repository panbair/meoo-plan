/**
 * AI API 服务
 * 支持多种AI提供商：通义千问、DeepSeek、OpenAI等
 */

import axios from 'axios'
import type { AxiosInstance } from 'axios'

// AI提供商类型
export type AIProvider = 'qwen' | 'deepseek' | 'openai' | 'custom'

// AI配置接口
export interface AIConfig {
  provider: AIProvider
  apiKey: string
  baseUrl?: string
  model?: string
}

// 消息角色
export type MessageRole = 'system' | 'user' | 'assistant'

// 消息结构
export interface ChatMessage {
  role: MessageRole
  content: string
}

// AI请求参数
export interface AIRequestParams {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

// AI响应结构
export interface AIResponse {
  success: boolean
  data?: any
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// 方案生成请求
export interface SolutionGenerationRequest {
  websiteType: string
  industry: string
  companyName: string
  businessDesc: string
  targetAudience: string // 新增：目标用户群体
  brandKeywords: string // 新增：品牌关键词
  visualStyle: string
  emotions: string[] // 新增：情感氛围
  selectedModules: string[]
  priorityModule: string // 新增：重点模块
  targetDevice: string
  budget: string
  timeline: string
  performancePriority: number // 新增：性能优先级 1=视觉优先 2=平衡 3=速度优先
  specialRequirements: string
}

// 方案生成响应
export interface SolutionGenerationResponse {
  solutions: GeneratedSolution[]
  analysis: string
  recommendations: string[]
}

// 生成的方案
export interface GeneratedSolution {
  name: string
  icon: string
  badge: string
  description: string
  performanceRating: number
  complexity: string
  estimatedTime: string
  reasons: string[]
  modules: ModuleSolution[]
  colorScheme?: ColorScheme[]
}

// 模块方案
export interface ModuleSolution {
  icon: string
  name: string
  components: ComponentRecommendation[]
}

// 组件推荐
export interface ComponentRecommendation {
  name: string
  type: string
  purpose: string
}

// 配色方案
export interface ColorScheme {
  role: string
  hex: string
}

class AIService {
  private client: AxiosInstance
  private config: AIConfig | null = null

  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * 配置AI服务
   */
  configure(config: AIConfig) {
    this.config = config
    
    // 设置基础URL
    let baseUrl = ''
    switch (config.provider) {
      case 'qwen':
        // 开发环境使用代理，生产环境使用直连
        // 通义千问兼容OpenAI格式的API端点
        baseUrl = config.baseUrl || 
          (import.meta.env.DEV ? '/ai-proxy' : 'https://dashscope.aliyuncs.com/compatible-mode/v1')
        break
      case 'deepseek':
        baseUrl = config.baseUrl || 'https://api.deepseek.com/v1'
        break
      case 'openai':
        baseUrl = config.baseUrl || 'https://api.openai.com/v1'
        break
      case 'custom':
        baseUrl = config.baseUrl || ''
        break
    }
    
    console.log('🔧 配置AI服务:', {
      provider: config.provider,
      baseUrl,
      isDev: import.meta.env.DEV,
      usingProxy: baseUrl.includes('/ai-proxy'),
      fullUrl: import.meta.env.DEV ? `http://localhost:5173${baseUrl}/chat/completions` : `${baseUrl}/chat/completions`
    })
    
    this.client.defaults.baseURL = baseUrl
    
    // 设置认证头
    this.client.interceptors.request.use((request) => {
      if (this.config?.apiKey) {
        request.headers.Authorization = `Bearer ${this.config.apiKey}`
      }
      return request
    })
  }

  /**
   * 发送聊天消息
   */
  async chat(params: AIRequestParams): Promise<AIResponse> {
    if (!this.config) {
      return {
        success: false,
        error: 'AI服务未配置，请先调用configure()方法'
      }
    }

    console.log('🔧 AI服务配置:', {
      provider: this.config.provider,
      model: this.config.model || this.getDefaultModel(),
      baseUrl: this.client.defaults.baseURL,
      hasApiKey: !!this.config.apiKey
    })

    try {
      const model = this.config.model || this.getDefaultModel()
      
      console.log('📤 发送AI请求...')
      console.log('模型:', model)
      console.log('消息数量:', params.messages.length)
      console.log('Temperature:', params.temperature || 0.7)
      console.log('Max Tokens:', params.maxTokens || 2000)
      
      const response = await this.client.post('/chat/completions', {
        model,
        messages: params.messages,
        temperature: params.temperature || 0.7,
        max_tokens: params.maxTokens || 2000,
        stream: params.stream || false
      })

      console.log('📥 收到AI响应')
      console.log('响应状态:', response.status)
      console.log('Token使用:', response.data.usage)

      return {
        success: true,
        data: response.data.choices[0]?.message,
        usage: response.data.usage
      }
    } catch (error: any) {
      console.error('❌ AI聊天请求失败:')
      console.error('错误类型:', error.constructor.name)
      console.error('错误消息:', error.message)
      if (error.response) {
        console.error('HTTP状态:', error.response.status)
        console.error('响应数据:', error.response.data)
      }
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || '请求失败'
      }
    }
  }

  /**
   * 生成网站方案
   */
  async generateSolution(request: SolutionGenerationRequest): Promise<SolutionGenerationResponse> {
    console.log('\n🎯 ========== 开始生成网站方案 ==========')
    console.log('用户需求:', request)
    
    const systemPrompt = this.buildSystemPrompt()
    const userPrompt = this.buildUserPrompt(request)

    console.log('\n📝 系统提示词长度:', systemPrompt.length, '字符')
    console.log('📝 用户提示词长度:', userPrompt.length, '字符')

    const response = await this.chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      maxTokens: 4000
    })

    if (!response.success || !response.data) {
      console.error('❌ AI响应失败:', response.error)
      throw new Error(response.error || '方案生成失败')
    }

    console.log('\n✅ AI返回成功')
    console.log('响应内容长度:', response.data.content?.length || 0, '字符')

    // 解析AI返回的JSON
    try {
      const content = response.data.content
      console.log('\n🔍 开始解析AI响应...')
      
      // 尝试提取JSON（AI可能返回markdown格式）
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : content
      
      console.log('提取的JSON字符串长度:', jsonStr.length, '字符')
      
      const parsed = JSON.parse(jsonStr)
      
      console.log('✅ JSON解析成功')
      console.log('方案数量:', parsed.solutions?.length || 0)
      console.log('分析内容:', parsed.analysis?.substring(0, 100) + '...')
      
      return {
        solutions: parsed.solutions || [],
        analysis: parsed.analysis || '',
        recommendations: parsed.recommendations || []
      }
    } catch (error) {
      console.error('❌ 解析AI响应失败:', error)
      console.error('原始响应内容:', response.data.content?.substring(0, 500))
      // 如果解析失败，返回模拟数据
      console.log('⚠️ 使用降级方案（本地模拟数据）')
      return this.getFallbackSolution(request)
    }
  }

  /**
   * 构建系统提示词
   */
  private buildSystemPrompt(): string {
    return `你是一个专业的企业网站设计方案生成器，基于189种GSAP动画组件知识库。

你的任务是根据用户需求，生成3套不同风格的网站设计方案。

## 输出格式要求
必须严格按照以下JSON格式输出：

{
  "analysis": "对需求的简要分析（100-200字）",
  "recommendations": ["建议1", "建议2", "建议3"],
  "solutions": [
    {
      "name": "方案名称",
      "icon": "emoji图标",
      "badge": "徽章文字",
      "description": "方案描述（50-100字）",
      "performanceRating": 1-5的数字,
      "complexity": "低/中/高",
      "estimatedTime": "预估工时",
      "reasons": ["理由1", "理由2", "理由3", "理由4"],
      "modules": [
        {
          "icon": "emoji图标",
          "name": "模块名称",
          "components": [
            {
              "name": "组件名称",
              "type": "组件类型",
              "purpose": "用途说明"
            }
          ]
        }
      ],
      "colorScheme": [
        {
          "role": "颜色角色",
          "hex": "#颜色值"
        }
      ]
    }
  ]
}

## 可用组件库（完整列表 - 189种）

### 文字特效类 (CardText) - 适合标题、按钮、数据统计
- CardTextCyber: 赛博朋克风格，科技感强烈，适合技术公司
- CardTextDomino: 多米诺动画，优雅流畅，适合企业介绍
- CardTextBlur: 模糊到清晰，简洁现代，适合快速加载
- CardTextCrystal: 水晶质感，高端奢华，适合CTA按钮
- CardTextHologram: 全息投影效果，未来感十足，适合交互按钮
- CardTextAurora: 极光渐变，自然流动，适合环保/生态主题
- CardTextCorona: 日冕光晕，温暖明亮，适合产品展示
- CardTextCinematic: 电影感文字，戏剧性强，适合案例展示
- CardTextFirework: 烟花绽放，庆祝氛围，适合成就/数据
- CardTextBioluminescent: 生物发光，神秘梦幻，适合创新科技

### 图片展示类 (CardImg) - 适合背景、卡片、产品展示
- CardImgAurora: 极光背景，色彩丰富，适合hero区域
- CardImgNebulaBreath: 星云呼吸，粒子效果，适合技术架构
- CardImgMorningMist: 晨雾朦胧，柔和温馨，适合团队介绍
- CardImgParallax: 视差滚动，深度感知，适合故事叙述
- CardImgStatic: 静态渐变，简洁干净，适合快速加载
- CardImgFlip: 基础翻转，简单有效，适合信息卡片
- CardImgPrism: 棱镜折射，多彩炫目，适合产品特性
- CardImgCarousel: 轮播滑动，内容丰富，适合新闻/案例
- CardImgPerspective: 透视层级，空间感强，适合技术分层
- CardImgFlipCard: 翻转卡片，互动性强，适合联系方式
- CardImgMirror: 镜像对称，平衡美感，适合合作伙伴
- CardImgVortex: 漩涡吸引，视觉焦点，适合核心内容
- CardImgGalaxy: 星系布局，宏大壮观，适合生态系统
- CardImgRiver: 河流流动，连续不断，适合时间线/流程
- CardImgDepth: 景深效果，层次分明，适合内容卡片
- CardImgStage: 舞台聚光，突出主体，适合重点展示
- CardImgFocusRing: 聚焦环圈，引导视线，适合功能介绍
- CardImgBloom: 绽放展开，优雅过渡，适合通用场景
- CardImgBeacon: 信标指引，清晰明确，适合核心技术
- CardImgMontage: 拼贴组合，丰富多样，适合团队/新闻

### 时间轴类 (CardTime) - 专用于发展历程、时间线
- CardTimeQuantumLeap: 量子跃迁，科技感强，适合创新历程
- CardTimeBook: 书籍翻页，文艺气息，适合品牌故事
- CardTimeBeat: 心跳节奏，生命律动，适合成长轨迹

### 3D效果类 (Card3D) - 适合产品展示、特性介绍
- Card3DFlipGallery: 3D翻转画廊，立体展示，适合产品/技术

## 组件选择原则

### 根据预算选择组件数量
- **紧张预算（1-3万）**：每模块选择3-5个核心组件
- **适中预算（3-8万）**：每模块选择5-8个组件
- **充裕预算（8-15万）**：每模块选择8-12个组件
- **不限预算（15万+）**：每模块可以选择12-20个组件

### 根据性能优先级调整
- **视觉效果优先（priority=1）**：多使用WebGL、3D、粒子等高级特效组件
- **平衡模式（priority=2）**：混合使用基础和中级组件
- **加载速度优先（priority=3）**：优先选择纯CSS动画和轻量级组件

### 根据情感氛围调整动画参数
- **专业可靠**：使用稳重的动画，缓动函数用easeInOut，速度中等
- **友好亲和**：使用柔和的动画，缓动函数用easeOut，速度稍慢
- **创新前沿**：使用创新的动画效果，可以有实验性组件
- **优雅精致**：使用流畅细腻的动画，注重细节
- **活力动感**：使用快速的动画，可以有弹跳效果
- **平静舒缓**：使用缓慢流畅的动画，避免突兀变化
- **活泼有趣**：可以使用 playful 的动画，有互动性
- **严肃权威**：使用庄重的动画，避免过于花哨
- **温暖亲切**：使用温暖的色调和柔和的动画
- **冷静理性**：使用简洁的动画，逻辑清晰

### 根据重点模块分配资源
如果用户指定了priorityModule，该模块应该：
- 使用更多高级组件（增加1-2个）
- 动画效果更加精细
- 视觉投入更多

### 模块组件推荐指南
1. **首页Hero**: 必须使用视觉冲击力强的组件（CardTextCyber, CardImgAurora, CardImgNebulaBreath等）
2. **产品展示**: 优先3D和特效组件（Card3DFlipGallery, CardImgPrism, CardImgPerspective）
3. **技术优势**: 使用科技感和结构化组件（CardImgNebulaBreath, CardImgPerspective, Card3DFlipGallery）
4. **案例展示**: 使用动态和吸引眼球的组件（CardImgVortex, CardImgGalaxy, CardImgCarousel）
5. **关于我们**: 使用温和且有深度的组件（CardTime系列, CardImgMontage, CardImgMorningMist）
6. **联系我们**: 使用交互性强的组件（CardTextHologram, CardTextCrystal, CardImgFlipCard）
7. **新闻动态**: 使用内容丰富且易浏览的组件（CardImgCarousel, CardImgMontage, CardImgBloom）
8. **合作伙伴**: 使用规整且大气的组件（CardImgGalaxy, CardImgCarousel, CardImgMirror）

## 避免重复
- 同一个方案中，尽量避免多次使用同一组件
- 如果必须重复，确保用途不同（如CardImgNebulaBreath可用于背景和架构图）
- 每个模块至少包含2-3个不同的组件

## 视觉风格与配色指南
- **科技感**: 霓虹色(#00FFFF, #FF00FF)、深色背景、粒子效果
- **自然生态**: 绿色系(#2E8B57)、蓝色系(#87CEEB)、柔和色调
- **高端奢华**: 金色(#FFD700)、银色(#C0C0C0)、黑色背景
- **简约现代**: 黑白灰、留白、几何形状
- **创意艺术**: 多彩(#FF6B6B, #4ECDC4)、抽象、实验性
- **复古怀旧**: 棕色系(#8B4513)、暖色调、胶片质感

**重要**：配色方案应该结合用户的brandKeywords进行调整。例如：
- 如果关键词包含“创新”，可以加入亮蓝色或紫色
- 如果关键词包含“温暖”，可以加入橙色或黄色
- 如果关键词包含“专业”，保持稳重的蓝灰色调

## 方案类型
1. **方案A - 视觉冲击版**: 使用高级动画组件，性能评级3-4星，适合budget=high/unlimited
2. **方案B - 平衡优化版**: 平衡效果和性能，性能评级4星，推荐，适合大多数情况
3. **方案C - 快速交付版**: 轻量级组件，性能评级5星，适合budget=low或timeline=urgent

请根据用户的具体需求，智能选择合适的组件组合。`
  }

  /**
   * 构建用户提示词
   */
  private buildUserPrompt(request: SolutionGenerationRequest): string {
    const moduleNames = this.getModuleNames(request.selectedModules)
    const emotionNames = request.emotions.map(e => this.getEmotionName(e)).filter(Boolean)
    
    return `请为以下企业网站生成3套设计方案：

## 基本信息
- **网站类型**: ${this.getWebsiteTypeName(request.websiteType)}
- **所属行业**: ${this.getIndustryName(request.industry)}
- **公司名称**: ${request.companyName || '未指定'}
- **核心业务**: ${request.businessDesc}
- **目标用户**: ${request.targetAudience || '未指定'}
- **品牌关键词**: ${request.brandKeywords || '未指定'}

## 设计偏好
- **视觉风格**: ${this.getStyleName(request.visualStyle)}
- **情感氛围**: ${emotionNames.length > 0 ? emotionNames.join('、') : '未指定'}
- **功能模块**: ${moduleNames.join('、')}
- **重点模块**: ${request.priorityModule ? this.getModuleName(request.priorityModule) + '（需要更炫酷的效果）' : '无特别要求'}
- **目标设备**: ${this.getDeviceName(request.targetDevice)}
- **预算范围**: ${this.getBudgetName(request.budget)}
- **开发周期**: ${this.getTimelineName(request.timeline)}
- **性能优先级**: ${this.getPerformancePriorityLabel(request.performancePriority)}

## 特殊要求
${request.specialRequirements || '无特殊要求'}

## 方案生成要求

请根据以上信息生成3套方案：

1. **方案A - 视觉冲击版**（炫酷效果）
   - 适合预算充裕、追求视觉效果的项目
   - 使用更多高级动画组件（WebGL、3D、粒子等）
   - 性能评级：3-4星

2. **方案B - 平衡优化版**（推荐）
   - 平衡效果和性能，适合大多数情况
   - 混合使用基础和中级组件
   - 性能评级：4星

3. **方案C - 快速交付版**（高效）
   - 轻量级组件，快速开发和部署
   - 优先选择纯CSS动画
   - 性能评级：5星

### 重要考虑因素：

1. **预算适配**：根据预算范围调整每个模块的组件数量
   - 紧张预算：每模块3-5个组件
   - 适中预算：每模块5-8个组件
   - 充裕预算：每模块8-12个组件
   - 不限预算：每模块12-20个组件

2. **性能优先级**：
   - 如果priority=1（视觉优先）：多使用高级特效组件
   - 如果priority=2（平衡）：混合使用各类组件
   - 如果priority=3（速度优先）：优先轻量级组件

3. **情感氛围**：根据选择的情感特质调整动画风格
   - 例如：选择“活力动感”可以使用更快的动画和弹跳效果
   - 例如：选择“平静舒缓”应该使用缓慢流畅的动画

4. **重点模块**：如果指定了priorityModule，该模块应该获得更多视觉投入

5. **品牌关键词**：配色方案应该反映品牌关键词
   - 例如：“创新”可以加入亮蓝色或紫色
   - 例如：“温暖”可以加入橙色或黄色

每套方案需要包含：
- 方案概述和推荐理由
- 每个选中模块的具体组件推荐（注意组件数量要符合预算）
- 配色方案建议（结合品牌关键词）
- 性能评级和预估工时`
  }

  /**
   * 获取默认模型
   */
  private getDefaultModel(): string {
    switch (this.config?.provider) {
      case 'qwen':
        return 'qwen-max'
      case 'deepseek':
        return 'deepseek-chat'
      case 'openai':
        return 'gpt-4'
      default:
        return 'gpt-4'
    }
  }

  /**
   * 降级方案（当API失败时使用）
   */
  private getFallbackSolution(request: SolutionGenerationRequest): SolutionGenerationResponse {
    return {
      solutions: [
        {
          name: '方案A - 视觉冲击版',
          icon: '🎨',
          badge: '炫酷',
          description: '最大化视觉效果，使用高级动画组件',
          performanceRating: 4,
          complexity: '高',
          estimatedTime: '2-3个月',
          reasons: [
            '采用高级动画组件，视觉冲击力强',
            '适合追求品牌形象的项目',
            '需要较好的设备性能',
            '加载时间相对较长'
          ],
          modules: this.getFallbackModules(),
          colorScheme: this.getColorScheme(request.visualStyle)
        },
        {
          name: '方案B - 平衡优化版',
          icon: '⚖️',
          badge: '推荐',
          description: '在视觉效果和性能之间取得平衡',
          performanceRating: 4,
          complexity: '中',
          estimatedTime: '1-2个月',
          reasons: [
            '平衡视觉效果和加载性能',
            '适合大多数企业官网',
            '良好的兼容性和用户体验',
            '性价比最高的选择'
          ],
          modules: this.getFallbackModules(),
          colorScheme: this.getColorScheme(request.visualStyle)
        },
        {
          name: '方案C - 快速交付版',
          icon: '⚡',
          badge: '高效',
          description: '使用轻量级组件，快速开发和部署',
          performanceRating: 5,
          complexity: '低',
          estimatedTime: '2-4周',
          reasons: [
            '使用轻量级基础组件',
            '加载速度快，移动端友好',
            '快速开发和部署',
            '适合预算紧张的项目'
          ],
          modules: this.getFallbackModules().slice(0, 3),
          colorScheme: this.getColorScheme(request.visualStyle)
        }
      ],
      analysis: '基于您的需求分析，我们生成了3套不同侧重点的方案',
      recommendations: [
        '建议优先考虑方案B，平衡效果和性能',
        '如果预算充足，可以选择方案A获得更好的视觉体验',
        '如果时间紧迫，方案C可以快速上线'
      ]
    }
  }

  private getFallbackModules(): ModuleSolution[] {
    return [
      {
        icon: '🎯',
        name: '首页英雄区',
        components: [
          { name: 'CardTextCyber', type: '文字特效', purpose: '赛博风格标题' },
          { name: 'CardImgAurora', type: '背景效果', purpose: '极光背景' },
          { name: 'CardImgNebulaBreath', type: '粒子特效', purpose: '星云呼吸' },
          { name: 'CardTextHologram', type: '交互按钮', purpose: '全息CTA按钮' }
        ]
      },
      {
        icon: '👥',
        name: '关于我们',
        components: [
          { name: 'CardTimeBook', type: '时间轴', purpose: '品牌故事' },
          { name: 'CardImgMontage', type: '卡片展示', purpose: '团队介绍' },
          { name: 'CardTextBioluminescent', type: '数据统计', purpose: '成就数据' }
        ]
      },
      {
        icon: '📦',
        name: '产品/服务',
        components: [
          { name: 'Card3DFlipGallery', type: '3D展示', purpose: '产品展示' },
          { name: 'CardImgPrism', type: '棱镜效果', purpose: '特性分解' },
          { name: 'CardTextCorona', type: '文字特效', purpose: '产品标题' }
        ]
      },
      {
        icon: '⚙️',
        name: '技术优势',
        components: [
          { name: 'CardImgPerspective', type: '透视卡片', purpose: '技术架构' },
          { name: 'CardImgBeacon', type: '信标卡片', purpose: '核心技术' },
          { name: 'CardTextDomino', type: '文字动画', purpose: '技术亮点' }
        ]
      },
      {
        icon: '🏆',
        name: '成功案例',
        components: [
          { name: 'CardImgVortex', type: '漩涡效果', purpose: '案例展示' },
          { name: 'CardImgCarousel', type: '轮播展示', purpose: '案例轮播' },
          { name: 'CardTextCinematic', type: '电影文字', purpose: '案例标题' }
        ]
      },
      {
        icon: '📰',
        name: '新闻动态',
        components: [
          { name: 'CardImgCarousel', type: '轮播展示', purpose: '新闻轮播' },
          { name: 'CardImgDepth', type: '景深效果', purpose: '新闻卡片' },
          { name: 'CardTextAurora', type: '极光文字', purpose: '新闻标题' }
        ]
      },
      {
        icon: '🤝',
        name: '合作伙伴',
        components: [
          { name: 'CardImgGalaxy', type: '星系布局', purpose: '伙伴生态' },
          { name: 'CardImgMirror', type: '镜像展示', purpose: '对称布局' },
          { name: 'CardTextFirework', type: '烟花特效', purpose: '合作庆祝' }
        ]
      },
      {
        icon: '📧',
        name: '联系我们',
        components: [
          { name: 'CardTextHologram', type: '交互按钮', purpose: '联系表单' },
          { name: 'CardImgMorningMist', type: '晨雾背景', purpose: '柔和背景' },
          { name: 'CardTextCrystal', type: '水晶按钮', purpose: '提交按钮' }
        ]
      }
    ]
  }

  private getColorScheme(style: string): ColorScheme[] {
    const schemes: Record<string, ColorScheme[]> = {
      tech: [
        { role: '主色', hex: '#00FFFF' },
        { role: '辅色', hex: '#FF00FF' },
        { role: '背景', hex: '#0A0E27' },
        { role: '强调', hex: '#00FF00' }
      ],
      nature: [
        { role: '主色', hex: '#2E8B57' },
        { role: '辅色', hex: '#87CEEB' },
        { role: '背景', hex: '#F5F5DC' },
        { role: '强调', hex: '#FFD700' }
      ],
      luxury: [
        { role: '主色', hex: '#FFD700' },
        { role: '辅色', hex: '#C0C0C0' },
        { role: '背景', hex: '#000000' },
        { role: '强调', hex: '#800080' }
      ],
      minimal: [
        { role: '主色', hex: '#FFFFFF' },
        { role: '辅色', hex: '#333333' },
        { role: '背景', hex: '#F5F5F5' },
        { role: '强调', hex: '#000000' }
      ],
      creative: [
        { role: '主色', hex: '#FF6B6B' },
        { role: '辅色', hex: '#4ECDC4' },
        { role: '背景', hex: '#FFFFFF' },
        { role: '强调', hex: '#FFE66D' }
      ],
      vintage: [
        { role: '主色', hex: '#8B4513' },
        { role: '辅色', hex: '#D2691E' },
        { role: '背景', hex: '#F4A460' },
        { role: '强调', hex: '#CD853F' }
      ]
    }
    return schemes[style] || schemes.minimal
  }

  // 辅助方法：获取名称映射
  private getWebsiteTypeName(type: string): string {
    const map: Record<string, string> = {
      corporate: '企业官网',
      ecommerce: '电商平台',
      portfolio: '作品集/个人网站',
      landing: '营销落地页',
      saas: 'SaaS产品页',
      education: '教育/培训',
      medical: '医疗/健康',
      restaurant: '餐饮/酒店'
    }
    return map[type] || type
  }

  private getIndustryName(industry: string): string {
    const map: Record<string, string> = {
      tech: '科技/互联网/AI',
      finance: '金融/保险',
      design: '设计/创意/艺术',
      manufacturing: '制造/工业',
      retail: '零售/电商',
      education: '教育/培训',
      medical: '医疗/健康',
      realestate: '房地产/建筑',
      food: '餐饮/食品',
      travel: '旅游/酒店',
      legal: '法律/咨询',
      other: '其他'
    }
    return map[industry] || industry
  }

  private getStyleName(style: string): string {
    const map: Record<string, string> = {
      tech: '科技感/未来风',
      nature: '自然/生态风',
      luxury: '高端/奢华风',
      minimal: '简约/现代风',
      creative: '创意/艺术风',
      vintage: '复古/怀旧风'
    }
    return map[style] || style
  }

  private getDeviceName(device: string): string {
    const map: Record<string, string> = {
      mobile: '移动端为主',
      desktop: '桌面端为主',
      both: '两者兼顾'
    }
    return map[device] || device
  }

  private getBudgetName(budget: string): string {
    const map: Record<string, string> = {
      low: '紧张（快速交付，简化动画）',
      medium: '适中（平衡效果与性能）',
      high: '充裕（追求视觉效果）',
      unlimited: '不限（极致体验）'
    }
    return map[budget] || budget
  }

  private getTimelineName(timeline: string): string {
    const map: Record<string, string> = {
      urgent: '紧急（1-2周）',
      normal: '正常（1-2个月）',
      relaxed: '宽松（3个月以上）'
    }
    return map[timeline] || timeline
  }

  private getModuleNames(keys: string[]): string[] {
    const map: Record<string, string> = {
      hero: '首页英雄区',
      about: '关于我们',
      products: '产品/服务',
      technology: '技术优势',
      cases: '成功案例',
      news: '新闻动态',
      partners: '合作伙伴',
      contact: '联系我们'
    }
    return keys.map(key => map[key] || key)
  }

  private getModuleName(key: string): string {
    const map: Record<string, string> = {
      hero: '首页英雄区',
      about: '关于我们',
      products: '产品/服务',
      technology: '技术优势',
      cases: '成功案例',
      news: '新闻动态',
      partners: '合作伙伴',
      contact: '联系我们'
    }
    return map[key] || key
  }

  private getEmotionName(emotion: string): string {
    const map: Record<string, string> = {
      professional: '专业可靠',
      friendly: '友好亲和',
      innovative: '创新前沿',
      elegant: '优雅精致',
      energetic: '活力动感',
      calm: '平静舒缓',
      playful: '活泼有趣',
      serious: '严肃权威',
      warm: '温暖亲切',
      cool: '冷静理性'
    }
    return map[emotion] || ''
  }

  private getPerformancePriorityLabel(priority: number): string {
    const map: Record<number, string> = {
      1: '视觉效果优先 - 使用更多高级动画',
      2: '平衡模式 - 兼顾效果和性能',
      3: '加载速度优先 - 轻量级组件'
    }
    return map[priority] || '平衡模式'
  }
}

// 导出单例
export const aiService = new AIService()
export default aiService
