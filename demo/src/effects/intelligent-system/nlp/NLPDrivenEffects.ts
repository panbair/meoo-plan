import * as THREE from 'three';

/**
 * 自然语言驱动的特效生成模块
 * 使用Transformers.js解析用户描述并生成特效规范
 */
export class NLPDrivenEffects {
  private transformerModel: any = null;
  private styleModels: Map<string, any> = new Map();
  private effectTemplates: Map<string, EffectTemplate> = new Map();

  constructor() {
    this.initializeEffectTemplates();
    this.loadPretrainedModels();
  }

  /**
   * 初始化特效模板
   */
  private initializeEffectTemplates(): void {
    // 爆炸类特效模板
    this.effectTemplates.set('explosion', {
      baseType: 'particle_system',
      physics: 'fluid_dynamics',
      defaultStyle: 'chaotic',
      parameters: {
        particleCount: 800,
        spread: 2.5,
        gravity: -0.5,
        turbulence: 0.8,
        colorPalette: ['#ff4500', '#ffa500', '#ffff00']
      },
      descriptionPatterns: [
        /爆炸|explosion|blast/i,
        /冲击波|shockwave/i,
        /火焰|fire|燃烧/i
      ]
    });

    // 流体类特效模板
    this.effectTemplates.set('fluid', {
      baseType: 'fluid_simulation',
      physics: 'navier_stokes',
      defaultStyle: 'smooth',
      parameters: {
        viscosity: 0.7,
        density: 1.0,
        turbulence: 0.3,
        colorPalette: ['#1e90ff', '#87ceeb', '#00bfff']
      },
      descriptionPatterns: [
        /水流|water|fluid/i,
        /流动|flow|stream/i,
        /液体|liquid/i
      ]
    });

    // 电力类特效模板
    this.effectTemplates.set('electric', {
      baseType: 'electric_discharge',
      physics: 'electromagnetic',
      defaultStyle: 'energetic',
      parameters: {
        voltage: 10000,
        frequency: 60,
        branching: 0.7,
        colorPalette: ['#00ffff', '#ffffff', '#7fff00']
      },
      descriptionPatterns: [
        /闪电|lightning|electric/i,
        /电流|current/i,
        /能量|energy|power/i
      ]
    });

    // 魔法类特效模板
    this.effectTemplates.set('magic', {
      baseType: 'magical_particles',
      physics: 'quantum_field',
      defaultStyle: 'mystical',
      parameters: {
        spellPower: 0.8,
        enchantment: 0.6,
        shimmer: 0.9,
        colorPalette: ['#9370db', '#da70d6', '#ba55d3']
      },
      descriptionPatterns: [
        /魔法|magic|spell/i,
        /神秘|mystical|enchant/i,
        /法术|wizard|sorcery/i
      ]
    });

    // 宇宙类特效模板
    this.effectTemplates.set('cosmic', {
      baseType: 'cosmic_phenomena',
      physics: 'relativistic',
      defaultStyle: 'celestial',
      parameters: {
        scale: 1000,
        timeDilation: 0.5,
        gravitationalWaves: 0.3,
        colorPalette: ['#4169e1', '#9370db', '#ffd700']
      },
      descriptionPatterns: [
        /宇宙|cosmic|space/i,
        /星系|galaxy|stellar/i,
        /黑洞|blackhole|wormhole/i
      ]
    });
  }

  /**
   * 加载预训练模型
   */
  private async loadPretrainedModels(): Promise<void> {
    try {
      // 模拟加载Transformers.js模型
      // 在实际应用中这里会加载真实的NLP模型
      console.log('Loading NLP models...');
      
      // 模拟异步加载
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.transformerModel = {
        process: this.mockProcess.bind(this),
        generate: this.mockGenerate.bind(this)
      };
      
      console.log('NLP models loaded successfully');
    } catch (error) {
      console.warn('Failed to load NLP models, using fallback parsing');
      this.transformerModel = null;
    }
  }

  /**
   * 模拟文本处理
   */
  private mockProcess(text: string, options: any = {}): any {
    const lowerText = text.toLowerCase();
    
    // 提取关键信息
    const extracted = {
      type: this.extractEffectType(lowerText),
      style: this.extractStyle(lowerText),
      physics: this.extractPhysics(lowerText),
      intensity: this.extractIntensity(lowerText),
      duration: this.extractDuration(lowerText),
      modifiers: this.extractModifiers(lowerText)
    };

    return {
      type: extracted.type,
      style: extracted.style,
      physics: extracted.physics || this.getDefaultPhysics(extracted.type),
      intensity: extracted.intensity,
      duration: extracted.duration,
      parameters: this.mergeWithTemplate(extracted)
    };
  }

  /**
   * 模拟文本生成
   */
  private mockGenerate(prompt: string, options: any = {}): string {
    // 基于提示词生成描述
    const effects = ['explosion', 'fluid_flow', 'electric_arc', 'magic_spell', 'cosmic_event'];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    return `Generated ${randomEffect} effect with enhanced parameters`;
  }

  /**
   * 提取特效类型
   */
  private extractEffectType(text: string): string {
    // 检查模板匹配
    for (const [templateName, template] of this.effectTemplates.entries()) {
      for (const pattern of template.descriptionPatterns) {
        if (pattern.test(text)) {
          return templateName;
        }
      }
    }

    // 关键词匹配
    if (/(粒子|particle|碎屑|debris)/i.test(text)) return 'particles';
    if (/(烟雾|smoke|云|cloud)/i.test(text)) return 'smoke';
    if (/(光|light|光芒|glow)/i.test(text)) return 'light';
    if (/(波纹|ripple|涟漪)/i.test(text)) return 'ripple';

    return 'generic'; // 默认类型
  }

  /**
   * 提取样式
   */
  private extractStyle(text: string): string {
    const styleKeywords: Record<string, RegExp[]> = {
      'chaotic': [/混乱|chaotic|狂野|wild|激烈|intense/i],
      'smooth': [/平滑|smooth|柔和|gentle|优雅|elegant/i],
      'energetic': [/充满能量|energetic|活力|vibrant|强烈|powerful/i],
      'mystical': [/神秘|mystical|魔法|magical|超自然|supernatural/i],
      'celestial': [/天体|celestial|宇宙|cosmic|星空|starry/i],
      'cyberpunk': [/赛博朋克|cyberpunk|霓虹|neon|未来|futuristic/i],
      'organic': [/有机|organic|自然|natural|生物|biological/i]
    };

    for (const [style, patterns] of Object.entries(styleKeywords)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          return style;
        }
      }
    }

    return 'default';
  }

  /**
   * 提取物理类型
   */
  private extractPhysics(text: string): string {
    const physicsKeywords: Record<string, RegExp[]> = {
      'fluid_dynamics': [/流体|fluid|液体|liquid|水|water/i],
      'rigid_body': [/刚体|rigid|固体|solid|碰撞|collision/i],
      'soft_body': [/软体|soft|弹性|elastic|布料|cloth/i],
      'particle_system': [/粒子|particle|碎屑|debris|灰尘|dust/i],
      'electromagnetic': [/电磁|electro|磁力|magnetic|电流|current/i],
      'quantum_field': [/量子|quantum|场|field|波|wave/i],
      'relativistic': [/相对论|relativistic|时空|spacetime|引力|gravity/i]
    };

    for (const [physics, patterns] of Object.entries(physicsKeywords)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          return physics;
        }
      }
    }

    return ''; // 返回空字符串表示未找到
  }

  /**
   * 获取默认物理类型
   */
  private getDefaultPhysics(effectType: string): string {
    const defaults: Record<string, string> = {
      'explosion': 'fluid_dynamics',
      'fluid': 'navier_stokes',
      'electric': 'electromagnetic',
      'magic': 'quantum_field',
      'cosmic': 'relativistic',
      'particles': 'particle_system',
      'smoke': 'fluid_dynamics',
      'light': 'wave_optics',
      'ripple': 'wave_equation'
    };

    return defaults[effectType] || 'basic_physics';
  }

  /**
   * 提取强度
   */
  private extractIntensity(text: string): number {
    const intensityKeywords: Record<number, RegExp[]> = {
      0.3: [/轻微|轻微的|轻柔|gentle|soft/i],
      0.6: [/中等|适中|normal|moderate/i],
      0.9: [/强烈|激烈的|猛烈|violent|intense/i],
      1.0: [/极端|极限|maximal|maximum/i]
    };

    for (const [intensity, patterns] of Object.entries(intensityKeywords)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          return parseFloat(intensity);
        }
      }
    }

    // 数值提取
    const numberMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:倍|times?|level|等级)/i);
    if (numberMatch) {
      return Math.min(1.0, Math.max(0.1, parseFloat(numberMatch[1]) / 10));
    }

    return 0.7; // 默认强度
  }

  /**
   * 提取持续时间
   */
  private extractDuration(text: string): number {
    const timeKeywords: Record<number, RegExp[]> = {
      1000: [/瞬间|instant|刹那|moment/i],
      2000: [/短暂|brief|短促|short/i],
      5000: [/中等|medium|一般|normal/i],
      10000: [/较长|long|持久|persistent/i],
      30000: [/很长|very long|持续|continuous/i]
    };

    for (const [duration, patterns] of Object.entries(timeKeywords)) {
      for (const pattern of patterns) {
        if (pattern.test(text)) {
          return parseInt(duration);
        }
      }
    }

    // 时间单位提取
    const timeUnits: Record<string, number> = {
      '毫秒': 1,
      'ms': 1,
      '秒': 1000,
      's': 1000,
      '分钟': 60000,
      'min': 60000
    };

    for (const [unit, multiplier] of Object.entries(timeUnits)) {
      const match = text.match(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*${unit}`, 'i'));
      if (match) {
        return parseFloat(match[1]) * multiplier;
      }
    }

    return 3000; // 默认3秒
  }

  /**
   * 提取修饰词
   */
  private extractModifiers(text: string): string[] {
    const modifiers: string[] = [];
    const modifierPatterns: RegExp[] = [
      /快速的|fast|急速|rapid/i,
      /缓慢的|slow|迟缓|gradual/i,
      /旋转的|rotating|自旋|spinning/i,
      /脉冲的|pulsing|闪烁|flashing/i,
      /螺旋的|spiral|涡旋|vortex/i,
      /分形的|fractal|递归|recursive/i
    ];

    modifierPatterns.forEach(pattern => {
      if (pattern.test(text)) {
        modifiers.push(pattern.toString());
      }
    });

    return modifiers;
  }

  /**
   * 与模板合并参数
   */
  private mergeWithTemplate(extracted: any): any {
    const template = this.effectTemplates.get(extracted.type);
    if (!template) {
      return extracted.parameters || {};
    }

    return {
      ...template.parameters,
      ...extracted.parameters,
      style: extracted.style || template.defaultStyle,
      intensity: extracted.intensity,
      duration: extracted.duration
    };
  }

  /**
   * 主要的文本到特效转换方法
   */
  async createFromDescription(description: string, options: CreateOptions = {}): Promise<GeneratedEffect> {
    try {
      // 1. 使用AI模型处理描述
      let parsedResult: any;
      
      if (this.transformerModel) {
        parsedResult = await this.transformerModel.process(description, {
          task: 'effect-generation',
          max_length: 200,
          temperature: options.creativity || 0.8
        });
      } else {
        // 使用规则匹配作为后备
        parsedResult = this.ruleBasedParsing(description);
      }

      // 2. 生成详细的特效规范
      const effectSpec = this.generateEffectSpecification(parsedResult, options);

      // 3. 创建可视化预览（可选）
      const preview = options.generatePreview ? 
        await this.createVisualPreview(effectSpec) : null;

      return {
        specification: effectSpec,
        preview: preview,
        confidence: this.calculateConfidence(parsedResult, description),
        alternatives: this.generateAlternatives(effectSpec, description)
      };

    } catch (error) {
      console.error('NLP effect generation failed:', error);
      // 降级到基本处理
      return this.fallbackGeneration(description);
    }
  }

  /**
   * 基于规则的解析（无AI时使用）
   */
  private ruleBasedParsing(description: string): any {
    return this.mockProcess(description);
  }

  /**
   * 生成特效规范
   */
  private generateEffectSpecification(parsed: any, options: CreateOptions): EffectSpecification {
    return {
      id: `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: parsed.type,
      physicsModel: parsed.physics,
      visualStyle: parsed.style,
      intensity: parsed.intensity,
      duration: parsed.duration,
      parameters: this.enhanceParameters(parsed.parameters, options),
      metadata: {
        sourceDescription: parsed.originalText || '',
        creationTimestamp: Date.now(),
        version: '1.0'
      }
    };
  }

  /**
   * 增强参数
   */
  private enhanceParameters(baseParams: any, options: CreateOptions): EnhancedParameters {
    const enhanced: EnhancedParameters = {
      ...baseParams,
      quality: options.quality || 'medium',
      adaptive: options.adaptive !== false,
      interactive: options.interactive || false,
      responsive: options.responsive !== false
    };

    // 根据质量级别调整参数
    switch (enhanced.quality) {
      case 'low':
        enhanced.particleCount = Math.floor((enhanced.particleCount || 200) * 0.5);
        enhanced.detailLevel = 1;
        break;
      case 'high':
        enhanced.particleCount = Math.floor((enhanced.particleCount || 200) * 2);
        enhanced.detailLevel = 3;
        break;
      case 'ultra':
        enhanced.particleCount = Math.floor((enhanced.particleCount || 200) * 4);
        enhanced.detailLevel = 4;
        enhanced.enableAdvancedFeatures = true;
        break;
      default: // medium
        enhanced.detailLevel = 2;
    }

    return enhanced;
  }

  /**
   * 创建可视化预览
   */
  private async createVisualPreview(spec: EffectSpecification): Promise<THREE.Object3D | null> {
    try {
      // 创建简化的预览对象
      const previewGeometry = new THREE.SphereGeometry(0.5, 8, 8);
      const previewMaterial = new THREE.MeshBasicMaterial({
        color: this.getColorFromSpec(spec),
        wireframe: true,
        transparent: true,
        opacity: 0.5
      });
      
      const previewObject = new THREE.Mesh(previewGeometry, previewMaterial);
      
      // 添加一些基本动画
      // 这里只是示意，实际实现会更复杂
      
      return previewObject;
    } catch (error) {
      console.warn('Failed to create visual preview:', error);
      return null;
    }
  }

  /**
   * 根据规范获取颜色
   */
  private getColorFromSpec(spec: EffectSpecification): number {
    const styleColors: Record<string, number> = {
      'chaotic': 0xff4500,
      'smooth': 0x1e90ff,
      'energetic': 0xffff00,
      'mystical': 0x9370db,
      'celestial': 0x4169e1,
      'cyberpunk': 0x00ffff,
      'organic': 0x228b22
    };

    return styleColors[spec.visualStyle] || 0xffffff;
  }

  /**
   * 计算置信度
   */
  private calculateConfidence(parsed: any, originalText: string): number {
    const factors = [
      parsed.type !== 'generic' ? 0.3 : 0,
      parsed.physics ? 0.2 : 0,
      parsed.style !== 'default' ? 0.2 : 0,
      parsed.intensity !== 0.7 ? 0.15 : 0,
      parsed.duration !== 3000 ? 0.15 : 0
    ];

    return Math.min(1.0, factors.reduce((sum, factor) => sum + factor, 0));
  }

  /**
   * 生成替代方案
   */
  private generateAlternatives(spec: EffectSpecification, originalText: string): EffectAlternative[] {
    const alternatives: EffectAlternative[] = [];
    const similarTypes = this.getSimilarEffectTypes(spec.type);

    similarTypes.forEach(type => {
      alternatives.push({
        type: type,
        confidence: 0.7,
        reason: `Alternative to ${spec.type}`,
        parameters: {
          ...spec.parameters,
          alternativeType: type
        }
      });
    });

    return alternatives.slice(0, 3); // 限制数量
  }

  /**
   * 获取相似的特效类型
   */
  private getSimilarEffectTypes(currentType: string): string[] {
    const similarities: Record<string, string[]> = {
      'explosion': ['particles', 'smoke', 'fire'],
      'fluid': ['water', 'flow', 'liquid'],
      'electric': ['lightning', 'current', 'energy'],
      'magic': ['spell', 'enchantment', 'mystical'],
      'cosmic': ['galaxy', 'stellar', 'space']
    };

    return similarities[currentType] || ['generic'];
  }

  /**
   * 降级生成方法
   */
  private fallbackGeneration(description: string): GeneratedEffect {
    const basicSpec: EffectSpecification = {
      id: `fallback_${Date.now()}`,
      type: this.extractEffectType(description.toLowerCase()),
      physicsModel: 'basic_physics',
      visualStyle: 'default',
      intensity: 0.7,
      duration: 3000,
      parameters: {
        particleCount: 200,
        size: 0.1,
        speed: 1.0
      },
      metadata: {
        sourceDescription: description,
        creationTimestamp: Date.now(),
        version: '1.0-fallback'
      }
    };

    return {
      specification: basicSpec,
      preview: null,
      confidence: 0.3,
      alternatives: []
    };
  }

  /**
   * 批量处理多个描述
   */
  async batchProcess(descriptions: string[], options: BatchOptions = {}): Promise<BatchResult> {
    const results: GeneratedEffect[] = [];
    const errors: ProcessingError[] = [];

    for (let i = 0; i < descriptions.length; i++) {
      try {
        const result = await this.createFromDescription(descriptions[i], {
          ...options.individualOptions,
          quality: options.batchQuality || 'medium'
        });
        results.push(result);
      } catch (error) {
        errors.push({
          index: i,
          description: descriptions[i],
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return {
      results,
      errors,
      summary: {
        total: descriptions.length,
        successful: results.length,
        failed: errors.length,
        averageConfidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length
      }
    };
  }
}

// 类型定义
interface EffectTemplate {
  baseType: string;
  physics: string;
  defaultStyle: string;
  parameters: Record<string, any>;
  descriptionPatterns: RegExp[];
}

interface CreateOptions {
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  adaptive?: boolean;
  interactive?: boolean;
  responsive?: boolean;
  generatePreview?: boolean;
  creativity?: number;
}

interface EnhancedParameters extends Record<string, any> {
  quality?: string;
  detailLevel?: number;
  adaptive?: boolean;
  interactive?: boolean;
  responsive?: boolean;
  enableAdvancedFeatures?: boolean;
}

interface EffectSpecification {
  id: string;
  type: string;
  physicsModel: string;
  visualStyle: string;
  intensity: number;
  duration: number;
  parameters: EnhancedParameters;
  metadata: {
    sourceDescription: string;
    creationTimestamp: number;
    version: string;
  };
}

interface EffectAlternative {
  type: string;
  confidence: number;
  reason: string;
  parameters: Record<string, any>;
}

interface GeneratedEffect {
  specification: EffectSpecification;
  preview: THREE.Object3D | null;
  confidence: number;
  alternatives: EffectAlternative[];
}

interface ProcessingError {
  index: number;
  description: string;
  error: string;
}

interface BatchOptions {
  batchQuality?: 'low' | 'medium' | 'high' | 'ultra';
  individualOptions?: CreateOptions;
}

interface BatchResult {
  results: GeneratedEffect[];
  errors: ProcessingError[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    averageConfidence: number;
  };
}