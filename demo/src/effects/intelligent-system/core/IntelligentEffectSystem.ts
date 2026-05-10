import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 模拟Taichi.js物理引擎接口
interface TaichiPhysics {
  simulate(options: any): Promise<any>;
  getField(name: string): any;
}

// 模拟Transformers.js NLP接口
interface TransformersPipeline {
  process(text: string, options?: any): Promise<any>;
  generate(prompt: string, options?: any): Promise<string>;
}

// 模拟TensorFlow.js ML接口
interface TensorFlowModel {
  predict(input: any): Promise<any>;
  train(data: any): Promise<void>;
}

export interface EffectContext {
  deviceInfo: {
    gpuCapability: number;
    cpuCores: number;
    availableMemory: number;
    screenResolution: { width: number; height: number };
  };
  performanceMetrics: {
    targetFPS: number;
    currentFPS: number;
    frameTime: number;
  };
  userPreferences: {
    style: string;
    complexity: number;
    intensity: number;
  };
}

export interface EffectSpecification {
  type: string;
  physics: string;
  style: string;
  intensity: number;
  duration: number;
  parameters: Record<string, any>;
}

/**
 * 智能特效系统核心类
 * 融合AI理解、物理模拟和智能渲染的下一代特效引擎
 */
export class IntelligentEffectSystem {
  private scene: THREE.Scene;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  
  // 三大核心引擎
  private physicsEngine: TaichiPhysics | null = null;
  private aiUnderstanding: TransformersPipeline | null = null;
  private learningEngine: TensorFlowModel | null = null;
  
  // 效果管理
  private activeEffects: Map<string, any> = new Map();
  private effectHistory: EffectSpecification[] = [];
  private performanceMonitor: PerformanceObserver;
  
  // 上下文管理
  private context: EffectContext;
  private feedbackCollector: FeedbackCollector;

  constructor(options: { 
    scene: THREE.Scene; 
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
  }) {
    this.scene = options.scene;
    this.renderer = options.renderer;
    this.camera = options.camera;
    
    // 初始化上下文
    this.context = this.initializeContext();
    
    // 初始化监控系统
    this.performanceMonitor = new PerformanceObserver(this.handlePerformanceData.bind(this));
    this.feedbackCollector = new FeedbackCollector();
    
    // 启动系统
    this.setupGSAP();
    this.startMonitoring();
  }

  /**
   * 初始化运行上下文
   */
  private initializeContext(): EffectContext {
    return {
      deviceInfo: {
        gpuCapability: this.detectGPUCapability(),
        cpuCores: navigator.hardwareConcurrency || 4,
        availableMemory: this.getAvailableMemory(),
        screenResolution: {
          width: window.screen.width,
          height: window.screen.height
        }
      },
      performanceMetrics: {
        targetFPS: 60,
        currentFPS: 0,
        frameTime: 0
      },
      userPreferences: {
        style: 'default',
        complexity: 0.7,
        intensity: 0.8
      }
    };
  }

  /**
   * 检测GPU能力
   */
  private detectGPUCapability(): number {
    try {
      const gl = this.renderer.getContext();
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        // 简单的GPU能力评分（实际项目中应该更复杂）
        if (renderer.includes('NVIDIA')) return 9;
        if (renderer.includes('AMD')) return 8;
        if (renderer.includes('Intel')) return 6;
      }
      return 5; // 默认评分
    } catch {
      return 3; // 最低评分
    }
  }

  /**
   * 获取可用内存
   */
  private getAvailableMemory(): number {
    if ('deviceMemory' in navigator) {
      return (navigator as any).deviceMemory * 1024; // GB转MB
    }
    return 2048; // 默认2GB
  }

  /**
   * 设置GSAP配置
   */
  private setupGSAP(): void {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({
      force3D: true,
      nullTargetWarn: false
    });
  }

  /**
   * 启动性能监控
   */
  private startMonitoring(): void {
    this.performanceMonitor.observe({ entryTypes: ['measure', 'navigation'] });
  }

  /**
   * 处理性能数据
   */
  private handlePerformanceData(entries: PerformanceEntryList): void {
    entries.forEach(entry => {
      if (entry.entryType === 'measure') {
        const frameTime = entry.duration;
        this.context.performanceMetrics.frameTime = frameTime;
        this.context.performanceMetrics.currentFPS = 1000 / frameTime;
        
        // 根据性能自动调整
        this.autoAdjustEffects(frameTime);
      }
    });
  }

  /**
   * 自动调整特效质量
   */
  private autoAdjustEffects(frameTime: number): void {
    const targetFrameTime = 1000 / this.context.performanceMetrics.targetFPS;
    
    if (frameTime > targetFrameTime * 1.5) {
      // 性能下降，降低特效质量
      this.reduceEffectComplexity();
    } else if (frameTime < targetFrameTime * 0.8) {
      // 性能良好，可以提升质量
      this.increaseEffectQuality();
    }
  }

  /**
   * 降低特效复杂度
   */
  private reduceEffectComplexity(): void {
    this.activeEffects.forEach((effect, id) => {
      if (effect.complexity > 0.3) {
        effect.complexity -= 0.1;
        effect.particleCount = Math.max(100, effect.particleCount * 0.8);
        effect.updateQuality();
      }
    });
  }

  /**
   * 提升特效质量
   */
  private increaseEffectQuality(): void {
    this.activeEffects.forEach((effect, id) => {
      if (effect.complexity < 0.9) {
        effect.complexity += 0.05;
        effect.particleCount = Math.min(5000, effect.particleCount * 1.1);
        effect.updateQuality();
      }
    });
  }

  /**
   * 智能特效播放入口
   * @param description 自然语言描述
   * @param context 上下文信息
   */
  async playIntelligentEffect(description: string, context?: Partial<EffectContext>): Promise<any> {
    try {
      // 更新上下文
      if (context) {
        Object.assign(this.context, context);
      }

      // 1. AI理解自然语言描述
      const effectSpec = await this.parseEffectDescription(description);
      
      // 2. 机器学习优化参数
      const optimizedParams = await this.optimizeEffect(effectSpec);
      
      // 3. 物理模拟生成
      const physicalSimulation = await this.simulatePhysics(optimizedParams);
      
      // 4. Three.js渲染
      const visualEffect = this.renderPhysicalEffect(physicalSimulation, optimizedParams);
      
      // 5. GSAP智能动画编排
      const animation = this.createIntelligentAnimation(visualEffect, optimizedParams);
      
      // 6. 学习反馈
      this.learnFromFeedback(effectSpec, animation);
      
      // 记录特效历史
      this.effectHistory.push(effectSpec);
      this.activeEffects.set(animation.id, animation);
      
      return animation;
      
    } catch (error) {
      console.error('智能特效生成失败:', error);
      // 降级到预设特效
      return this.playFallbackEffect(description);
    }
  }

  /**
   * AI解析特效描述
   */
  private async parseEffectDescription(description: string): Promise<EffectSpecification> {
    if (!this.aiUnderstanding) {
      // 模拟AI解析过程
      return this.fallbackParse(description);
    }

    try {
      const result = await this.aiUnderstanding.process(description, {
        task: 'effect-parsing',
        max_tokens: 150
      });

      return {
        type: result.type || 'particle_system',
        physics: result.physics || 'fluid_dynamics',
        style: result.style || 'default',
        intensity: result.intensity || 0.7,
        duration: result.duration || 3000,
        parameters: result.parameters || {}
      };
    } catch (error) {
      return this.fallbackParse(description);
    }
  }

  /**
   * 降级解析方法
   */
  private fallbackParse(description: string): EffectSpecification {
    const lowerDesc = description.toLowerCase();
    
    // 关键词匹配
    if (lowerDesc.includes('爆炸') || lowerDesc.includes('explosion')) {
      return {
        type: 'explosion',
        physics: 'fluid_dynamics',
        style: 'chaotic',
        intensity: 0.9,
        duration: 2000,
        parameters: { particleCount: 1000, spread: 2 }
      };
    }
    
    if (lowerDesc.includes('水流') || lowerDesc.includes('water')) {
      return {
        type: 'fluid',
        physics: 'fluid_dynamics',
        style: 'smooth',
        intensity: 0.6,
        duration: 5000,
        parameters: { viscosity: 0.8, turbulence: 0.3 }
      };
    }
    
    // 默认配置
    return {
      type: 'particle_system',
      physics: 'basic_physics',
      style: 'default',
      intensity: 0.7,
      duration: 3000,
      parameters: {}
    };
  }

  /**
   * 机器学习优化特效参数
   */
  private async optimizeEffect(spec: EffectSpecification): Promise<any> {
    if (!this.learningEngine) {
      return this.getDefaultParameters(spec);
    }

    try {
      const input = {
        effectSpec: spec,
        context: this.context,
        history: this.effectHistory.slice(-10) // 最近10个特效
      };

      const optimized = await this.learningEngine.predict(input);
      return { ...spec.parameters, ...optimized };
    } catch (error) {
      return this.getDefaultParameters(spec);
    }
  }

  /**
   * 获取默认参数
   */
  private getDefaultParameters(spec: EffectSpecification): any {
    const baseParams = {
      particleCount: Math.floor(500 * spec.intensity),
      size: 0.1 + spec.intensity * 0.3,
      speed: 1 + spec.intensity,
      color: this.getStyleColor(spec.style),
      opacity: 0.8
    };

    return { ...baseParams, ...spec.parameters };
  }

  /**
   * 根据样式获取颜色
   */
  private getStyleColor(style: string): number {
    const colorMap: Record<string, number> = {
      'fire': 0xff4500,
      'water': 0x1e90ff,
      'electric': 0x00ffff,
      'magic': 0x9370db,
      'chaotic': 0xff0000,
      'smooth': 0x00ff00,
      'default': 0xffffff
    };
    return colorMap[style] || colorMap.default;
  }

  /**
   * 物理模拟
   */
  private async simulatePhysics(params: any): Promise<any> {
    if (!this.physicsEngine) {
      // 模拟物理计算
      return this.simplePhysicsSimulation(params);
    }

    try {
      return await this.physicsEngine.simulate({
        type: params.physicsType,
        parameters: params,
        duration: params.duration
      });
    } catch (error) {
      return this.simplePhysicsSimulation(params);
    }
  }

  /**
   * 简单物理模拟（降级方案）
   */
  private simplePhysicsSimulation(params: any): any {
    // 基于参数生成简单的物理行为
    const particles = [];
    const count = params.particleCount || 200;
    
    for (let i = 0; i < count; i++) {
      particles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * params.speed,
          (Math.random() - 0.5) * params.speed,
          (Math.random() - 0.5) * params.speed
        ),
        life: 1.0,
        size: params.size * (0.5 + Math.random())
      });
    }

    return { particles, bounds: new THREE.Box3() };
  }

  /**
   * 渲染物理效果
   */
  private renderPhysicalEffect(simulation: any, params: any): THREE.Object3D {
    const particleSystem = new THREE.Points(
      this.createParticleGeometry(simulation.particles),
      this.createParticleMaterial(params)
    );

    this.scene.add(particleSystem);
    return particleSystem;
  }

  /**
   * 创建粒子几何体
   */
  private createParticleGeometry(particles: any[]): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);
    const colors = new Float32Array(particles.length * 3);

    particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      
      sizes[i] = particle.size;
      
      // 简单的颜色设置
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.5;
      colors[i * 3 + 2] = 0.2;
    });

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geometry;
  }

  /**
   * 创建粒子材质
   */
  private createParticleMaterial(params: any): THREE.Material {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(params.color || 0xffffff) },
        opacity: { value: params.opacity || 0.8 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        uniform float time;
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          vColor = color;
          vOpacity = 1.0 - time * 0.5;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5, 0.5));
          if (distance > 0.5) discard;
          
          float alpha = (1.0 - distance * 2.0) * opacity * vOpacity;
          gl_FragColor = vec4(vColor * color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }

  /**
   * 创建智能动画
   */
  private createIntelligentAnimation(object: THREE.Object3D, params: any): any {
    const timeline = gsap.timeline({
      onComplete: () => {
        this.cleanupEffect(object);
      }
    });

    // 基于参数创建动画序列
    timeline
      .from(object.scale, {
        x: 0, y: 0, z: 0,
        duration: params.duration * 0.2 / 1000,
        ease: "back.out(1.7)"
      })
      .to(object.material, {
        opacity: 0,
        duration: params.duration * 0.3 / 1000,
        ease: "power2.in"
      }, params.duration * 0.7 / 1000);

    // 添加物理运动
    this.animatePhysics(object, params, timeline);

    const effectId = `effect_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: effectId,
      object: object,
      timeline: timeline,
      params: params,
      complexity: params.complexity || 0.7,
      particleCount: params.particleCount || 200,
      updateQuality: () => this.updateEffectQuality(object, params)
    };
  }

  /**
   * 物理动画
   */
  private animatePhysics(object: THREE.Object3D, params: any, timeline: gsap.core.Timeline): void {
    const updatePhysics = () => {
      if (object instanceof THREE.Points) {
        const positions = object.geometry.attributes.position.array as Float32Array;
        const sizes = object.geometry.attributes.size.array as Float32Array;
        
        for (let i = 0; i < positions.length; i += 3) {
          // 简单的物理更新
          positions[i + 1] -= 0.01 * params.gravity || 0.01; // 下落
          positions[i] += (Math.random() - 0.5) * 0.02; // 随机扰动
          positions[i + 2] += (Math.random() - 0.5) * 0.02;
          
          // 缩放变化
          sizes[i/3] *= 0.995;
        }
        
        object.geometry.attributes.position.needsUpdate = true;
        object.geometry.attributes.size.needsUpdate = true;
      }
    };

    timeline.eventCallback("onUpdate", updatePhysics);
  }

  /**
   * 更新特效质量
   */
  private updateEffectQuality(object: THREE.Object3D, params: any): void {
    if (object instanceof THREE.Points) {
      // 根据复杂度调整粒子数量
      const targetCount = Math.floor(params.particleCount * params.complexity);
      const currentCount = object.geometry.attributes.position.count;
      
      if (targetCount !== currentCount) {
        // 重新创建几何体（简化版本）
        const newParticles = [];
        for (let i = 0; i < targetCount; i++) {
          newParticles.push({
            position: new THREE.Vector3(
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2,
              (Math.random() - 0.5) * 2
            ),
            size: params.size * (0.5 + Math.random())
          });
        }
        object.geometry = this.createParticleGeometry(newParticles);
      }
    }
  }

  /**
   * 清理特效
   */
  private cleanupEffect(object: THREE.Object3D): void {
    this.scene.remove(object);
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(mat => mat.dispose());
      } else {
        object.material.dispose();
      }
    }
  }

  /**
   * 学习反馈
   */
  private learnFromFeedback(spec: EffectSpecification, animation: any): void {
    // 收集用户反馈数据
    const feedback = this.feedbackCollector.collect({
      effectSpec: spec,
      performance: this.context.performanceMetrics,
      userInteraction: true // 简化处理
    });

    // 如果有学习引擎，进行训练
    if (this.learningEngine && feedback) {
      this.learningEngine.train(feedback).catch(console.warn);
    }
  }

  /**
   * 降级特效（当AI系统不可用时）
   */
  private playFallbackEffect(description: string): any {
    const lowerDesc = description.toLowerCase();
    let effectType = 'basic_particles';
    
    if (lowerDesc.includes('爆炸')) effectType = 'explosion';
    if (lowerDesc.includes('水流')) effectType = 'flow';
    if (lowerDesc.includes('光')) effectType = 'light';
    
    return this.createBasicEffect(effectType);
  }

  /**
   * 创建基础特效
   */
  private createBasicEffect(type: string): any {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff0000,
      transparent: true,
      opacity: 0.7
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4
    );
    
    this.scene.add(mesh);
    
    const timeline = gsap.timeline({
      onComplete: () => this.cleanupEffect(mesh)
    });
    
    timeline
      .from(mesh.scale, { x: 0, y: 0, z: 0, duration: 0.5 })
      .to(mesh.scale, { x: 3, y: 3, z: 3, duration: 1 })
      .to(mesh.material, { opacity: 0, duration: 0.5 });
    
    return {
      id: `fallback_${Date.now()}`,
      object: mesh,
      timeline: timeline,
      type: type
    };
  }

  /**
   * 销毁系统
   */
  public destroy(): void {
    this.performanceMonitor.disconnect();
    this.feedbackCollector.destroy();
    
    // 清理所有活动特效
    this.activeEffects.forEach(effect => {
      effect.timeline.kill();
      this.cleanupEffect(effect.object);
    });
    
    this.activeEffects.clear();
  }

  /**
   * 获取系统状态
   */
  public getStatus(): any {
    return {
      activeEffects: this.activeEffects.size,
      performance: this.context.performanceMetrics,
      deviceInfo: this.context.deviceInfo,
      effectHistory: this.effectHistory.length
    };
  }
}

/**
 * 反馈收集器
 */
class FeedbackCollector {
  private feedbackBuffer: any[] = [];
  private maxLength = 100;

  collect(feedback: any): any {
    this.feedbackBuffer.push({
      ...feedback,
      timestamp: Date.now()
    });

    // 保持缓冲区大小
    if (this.feedbackBuffer.length > this.maxLength) {
      this.feedbackBuffer.shift();
    }

    return this.feedbackBuffer.length >= 10 ? this.feedbackBuffer.slice(-10) : null;
  }

  destroy(): void {
    this.feedbackBuffer = [];
  }
}

/**
 * 性能观察器
 */
class PerformanceObserver {
  private observer: any;
  
  constructor(callback: (entries: PerformanceEntryList) => void) {
    if (typeof PerformanceObserver !== 'undefined') {
      this.observer = new PerformanceObserver(callback);
    }
  }

  observe(options: any): void {
    if (this.observer) {
      this.observer.observe(options);
    }
  }

  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}