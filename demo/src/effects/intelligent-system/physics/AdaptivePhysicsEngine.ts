import * as THREE from 'three';

/**
 * 自适应物理模拟引擎
 * 根据设备能力和性能自动调整物理模拟精度
 */
export class AdaptivePhysicsEngine {
  private simulationWorkers: Worker[] = [];
  private activeSimulations: Map<string, PhysicsSimulation> = new Map();
  private performanceMonitor: PerformanceMonitor;
  private deviceProfiler: DeviceProfiler;
  private adaptationController: AdaptationController;

  constructor(private maxWorkers: number = 4) {
    this.performanceMonitor = new PerformanceMonitor();
    this.deviceProfiler = new DeviceProfiler();
    this.adaptationController = new AdaptationController();
    
    this.initializeWorkers();
  }

  /**
   * 初始化Web Workers用于物理计算
   */
  private initializeWorkers(): void {
    try {
      for (let i = 0; i < this.maxWorkers; i++) {
        const worker = new Worker(new URL('./physics-worker.js', import.meta.url));
        worker.onmessage = this.handleWorkerMessage.bind(this);
        this.simulationWorkers.push(worker);
      }
    } catch (error) {
      console.warn('Failed to initialize physics workers, falling back to main thread');
    }
  }

  /**
   * 处理Worker消息
   */
  private handleWorkerMessage(event: MessageEvent): void {
    const { id, type, data } = event.data;
    
    const simulation = this.activeSimulations.get(id);
    if (simulation) {
      switch (type) {
        case 'step_complete':
          simulation.onStepComplete?.(data);
          break;
        case 'simulation_complete':
          simulation.onComplete?.(data);
          this.cleanupSimulation(id);
          break;
        case 'error':
          simulation.onError?.(data);
          this.cleanupSimulation(id);
          break;
      }
    }
  }

  /**
   * 创建自适应物理模拟
   */
  async createAdaptiveSimulation(config: PhysicsConfig): Promise<PhysicsSimulation> {
    // 1. 分析环境和需求
    const environment = await this.analyzeEnvironment(config);
    
    // 2. 计算最优配置
    const adaptiveConfig = this.calculateAdaptiveConfiguration(config, environment);
    
    // 3. 创建模拟实例
    const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const simulation: PhysicsSimulation = {
      id: simulationId,
      config: adaptiveConfig,
      environment: environment,
      startTime: performance.now(),
      frameCount: 0,
      isActive: true
    };

    // 4. 启动模拟
    await this.startSimulation(simulation);
    
    this.activeSimulations.set(simulationId, simulation);
    return simulation;
  }

  /**
   * 分析运行环境
   */
  private async analyzeEnvironment(config: PhysicsConfig): Promise<EnvironmentAnalysis> {
    const deviceInfo = await this.deviceProfiler.getDeviceInfo();
    const performanceData = this.performanceMonitor.getCurrentMetrics();
    
    return {
      device: deviceInfo,
      performance: performanceData,
      requirements: {
        targetFPS: config.targetFPS || 60,
        qualityPreference: config.qualityPreference || 'balanced',
        complexityBudget: this.calculateComplexityBudget(deviceInfo, performanceData)
      }
    };
  }

  /**
   * 计算复杂度预算
   */
  private calculateComplexityBudget(device: DeviceInfo, performance: PerformanceMetrics): number {
    // 基础分数系统 (0-100)
    let score = 50; // 基准分数
    
    // GPU能力加成
    score += (device.gpuScore - 5) * 5; // GPU分数范围1-10
    
    // CPU核心数加成
    score += (device.cpuCores - 4) * 3; // 基准4核心
    
    // 内存加成
    score += (device.memoryGB - 8) * 2; // 基准8GB
    
    // 当前性能惩罚
    const performancePenalty = (60 - Math.min(60, performance.averageFPS)) * 2;
    score -= performancePenalty;
    
    // 确保在合理范围内
    return Math.max(10, Math.min(100, score));
  }

  /**
   * 计算自适应配置
   */
  private calculateAdaptiveConfiguration(
    baseConfig: PhysicsConfig, 
    environment: EnvironmentAnalysis
  ): AdaptivePhysicsConfig {
    const budget = environment.requirements.complexityBudget;
    
    // 根据预算调整参数
    const resolution = this.calculateOptimalResolution(budget, baseConfig.resolution);
    const timeStep = this.calculateOptimalTimeStep(budget, baseConfig.timeStep);
    const solverIterations = this.calculateSolverIterations(budget, baseConfig.solverIterations);
    const particleLimit = this.calculateParticleLimit(budget, baseConfig.maxParticles);
    
    return {
      ...baseConfig,
      resolution,
      timeStep,
      solverIterations,
      maxParticles: particleLimit,
      adaptive: true,
      qualityLevel: this.determineQualityLevel(budget),
      optimizationFlags: this.getOptimizationFlags(budget, environment)
    };
  }

  /**
   * 计算最优分辨率
   */
  private calculateOptimalResolution(budget: number, baseResolution: number): number {
    if (budget > 80) return Math.min(baseResolution * 2, 256); // 高端设备
    if (budget > 60) return baseResolution; // 中高端设备
    if (budget > 40) return Math.max(baseResolution * 0.75, 32); // 中端设备
    return Math.max(baseResolution * 0.5, 16); // 低端设备
  }

  /**
   * 计算时间步长
   */
  private calculateOptimalTimeStep(budget: number, baseTimeStep: number): number {
    if (budget > 70) return baseTimeStep * 0.5; // 更精确的模拟
    if (budget > 50) return baseTimeStep; // 标准精度
    if (budget > 30) return baseTimeStep * 1.5; // 降低精度换取性能
    return baseTimeStep * 2; // 最低精度
  }

  /**
   * 计算求解器迭代次数
   */
  private calculateSolverIterations(budget: number, baseIterations: number): number {
    if (budget > 80) return Math.min(baseIterations * 2, 20);
    if (budget > 60) return baseIterations;
    if (budget > 40) return Math.max(Math.floor(baseIterations * 0.7), 2);
    return Math.max(Math.floor(baseIterations * 0.5), 1);
  }

  /**
   * 计算粒子限制
   */
  private calculateParticleLimit(budget: number, baseLimit: number): number {
    if (budget > 90) return baseLimit * 2;
    if (budget > 70) return Math.floor(baseLimit * 1.5);
    if (budget > 50) return baseLimit;
    if (budget > 30) return Math.floor(baseLimit * 0.7);
    return Math.floor(baseLimit * 0.4);
  }

  /**
   * 确定质量等级
   */
  private determineQualityLevel(budget: number): QualityLevel {
    if (budget > 85) return 'ultra';
    if (budget > 70) return 'high';
    if (budget > 50) return 'medium';
    if (budget > 30) return 'low';
    return 'minimum';
  }

  /**
   * 获取优化标志
   */
  private getOptimizationFlags(budget: number, environment: EnvironmentAnalysis): OptimizationFlags {
    return {
      spatialHashing: budget > 40,
      broadPhase: budget > 50,
      constraintSplitting: budget > 60,
      asyncCollision: budget > 70,
      memoryPooling: budget > 30,
      simplifiedModels: budget < 40,
      reducedPrecision: budget < 25
    };
  }

  /**
   * 启动模拟
   */
  private async startSimulation(simulation: PhysicsSimulation): Promise<void> {
    const worker = this.getAvailableWorker();
    
    if (worker) {
      // 使用Web Worker进行计算密集型任务
      worker.postMessage({
        type: 'start_simulation',
        id: simulation.id,
        config: simulation.config
      });
    } else {
      // 回退到主线程模拟
      await this.runMainThreadSimulation(simulation);
    }
  }

  /**
   * 获取可用的Worker
   */
  private getAvailableWorker(): Worker | null {
    // 简单的负载均衡策略
    if (this.simulationWorkers.length > 0) {
      const workerIndex = this.activeSimulations.size % this.simulationWorkers.length;
      return this.simulationWorkers[workerIndex];
    }
    return null;
  }

  /**
   * 主线程模拟（降级方案）
   */
  private async runMainThreadSimulation(simulation: PhysicsSimulation): Promise<void> {
    // 实现简化的物理模拟逻辑
    const simulator = new MainThreadSimulator(simulation.config);
    
    const interval = setInterval(() => {
      if (!simulation.isActive) {
        clearInterval(interval);
        return;
      }
      
      const stepResult = simulator.step();
      simulation.frameCount++;
      
      simulation.onStepComplete?.(stepResult);
      
      // 检查是否完成
      if (simulator.isComplete()) {
        clearInterval(interval);
        simulation.onComplete?.(simulator.getFinalState());
        this.cleanupSimulation(simulation.id);
      }
    }, simulation.config.timeStep * 1000);
  }

  /**
   * 实时调整模拟参数
   */
  async adaptSimulation(id: string, performanceFeedback: PerformanceFeedback): Promise<void> {
    const simulation = this.activeSimulations.get(id);
    if (!simulation) return;

    const adaptation = this.adaptationController.calculateAdaptation(
      simulation.config,
      performanceFeedback
    );

    if (adaptation.shouldAdapt) {
      await this.applyAdaptation(simulation, adaptation.changes);
    }
  }

  /**
   * 应用适应性调整
   */
  private async applyAdaptation(
    simulation: PhysicsSimulation, 
    changes: Partial<AdaptivePhysicsConfig>
  ): Promise<void> {
    // 更新配置
    Object.assign(simulation.config, changes);
    
    // 通知Worker或重新启动模拟
    const worker = this.getAvailableWorker();
    if (worker) {
      worker.postMessage({
        type: 'update_config',
        id: simulation.id,
        config: simulation.config
      });
    } else {
      // 对于主线程模拟，可能需要重启
      console.log('Restarting main thread simulation with new config');
    }
  }

  /**
   * 获取模拟状态
   */
  getSimulationStatus(id: string): SimulationStatus | null {
    const simulation = this.activeSimulations.get(id);
    if (!simulation) return null;

    return {
      id: simulation.id,
      isActive: simulation.isActive,
      frameCount: simulation.frameCount,
      duration: performance.now() - simulation.startTime,
      currentConfig: simulation.config,
      performance: this.performanceMonitor.getSimulationMetrics(id)
    };
  }

  /**
   * 暂停模拟
   */
  pauseSimulation(id: string): void {
    const simulation = this.activeSimulations.get(id);
    if (simulation) {
      simulation.isActive = false;
      const worker = this.getAvailableWorker();
      if (worker) {
        worker.postMessage({ type: 'pause_simulation', id });
      }
    }
  }

  /**
   * 恢复模拟
   */
  resumeSimulation(id: string): void {
    const simulation = this.activeSimulations.get(id);
    if (simulation) {
      simulation.isActive = true;
      const worker = this.getAvailableWorker();
      if (worker) {
        worker.postMessage({ type: 'resume_simulation', id });
      }
    }
  }

  /**
   * 停止模拟
   */
  stopSimulation(id: string): void {
    const simulation = this.activeSimulations.get(id);
    if (simulation) {
      simulation.isActive = false;
      const worker = this.getAvailableWorker();
      if (worker) {
        worker.postMessage({ type: 'stop_simulation', id });
      }
      this.cleanupSimulation(id);
    }
  }

  /**
   * 清理模拟资源
   */
  private cleanupSimulation(id: string): void {
    this.activeSimulations.delete(id);
    this.performanceMonitor.removeSimulation(id);
  }

  /**
   * 获取整体系统状态
   */
  getSystemStatus(): SystemStatus {
    return {
      activeSimulations: this.activeSimulations.size,
      availableWorkers: this.simulationWorkers.length,
      performance: this.performanceMonitor.getOverallMetrics(),
      deviceProfile: this.deviceProfiler.getCurrentProfile()
    };
  }

  /**
   * 销毁引擎
   */
  destroy(): void {
    // 停止所有模拟
    this.activeSimulations.forEach((_, id) => this.stopSimulation(id));
    
    // 终止所有Worker
    this.simulationWorkers.forEach(worker => worker.terminate());
    this.simulationWorkers = [];
    
    // 清理监控器
    this.performanceMonitor.destroy();
    this.deviceProfiler.destroy();
  }
}

/**
 * 主线程物理模拟器（简化版）
 */
class MainThreadSimulator {
  private time: number = 0;
  private particles: Particle[] = [];
  private forces: ForceField[] = [];

  constructor(private config: AdaptivePhysicsConfig) {
    this.initializeParticles();
    this.initializeForces();
  }

  private initializeParticles(): void {
    const count = Math.min(this.config.maxParticles, 1000); // 限制粒子数
    for (let i = 0; i < count; i++) {
      this.particles.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3(),
        mass: 1 + Math.random(),
        radius: 0.1 + Math.random() * 0.2
      });
    }
  }

  private initializeForces(): void {
    // 重力场
    this.forces.push({
      type: 'gravity',
      strength: 9.8,
      direction: new THREE.Vector3(0, -1, 0)
    });

    // 如果启用湍流
    if (this.config.turbulence > 0) {
      this.forces.push({
        type: 'turbulence',
        strength: this.config.turbulence,
        noiseScale: 0.1
      });
    }
  }

  step(): StepResult {
    this.time += this.config.timeStep;
    
    // 应用力场
    this.applyForces();
    
    // 更新粒子位置
    this.updateParticles();
    
    // 处理碰撞
    this.handleCollisions();
    
    return {
      time: this.time,
      particleCount: this.particles.length,
      particles: this.particles.map(p => ({
        position: p.position.clone(),
        velocity: p.velocity.clone(),
        mass: p.mass
      }))
    };
  }

  private applyForces(): void {
    this.particles.forEach(particle => {
      particle.acceleration.set(0, 0, 0);
      
      this.forces.forEach(force => {
        switch (force.type) {
          case 'gravity':
            particle.acceleration.add(
              force.direction.clone().multiplyScalar(force.strength)
            );
            break;
          case 'turbulence':
            // 简化的湍流效果
            const noise = Math.sin(particle.position.x * force.noiseScale + this.time) *
                         Math.cos(particle.position.y * force.noiseScale + this.time) *
                         force.strength;
            particle.acceleration.add(new THREE.Vector3(noise, noise * 0.5, noise * 0.3));
            break;
        }
      });
    });
  }

  private updateParticles(): void {
    this.particles.forEach(particle => {
      // 速度更新
      particle.velocity.add(
        particle.acceleration.clone().multiplyScalar(this.config.timeStep)
      );
      
      // 位置更新
      particle.position.add(
        particle.velocity.clone().multiplyScalar(this.config.timeStep)
      );
      
      // 简单的边界处理
      if (Math.abs(particle.position.x) > 10) particle.velocity.x *= -0.8;
      if (Math.abs(particle.position.y) > 10) particle.velocity.y *= -0.8;
      if (Math.abs(particle.position.z) > 10) particle.velocity.z *= -0.8;
    });
  }

  private handleCollisions(): void {
    // 简化的碰撞检测
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        
        const distance = p1.position.distanceTo(p2.position);
        const minDistance = p1.radius + p2.radius;
        
        if (distance < minDistance) {
          // 简单的弹性碰撞
          const normal = p2.position.clone().sub(p1.position).normalize();
          const relativeVelocity = p2.velocity.clone().sub(p1.velocity);
          const velocityAlongNormal = relativeVelocity.dot(normal);
          
          if (velocityAlongNormal > 0) continue; // 分离中
          
          const restitution = 0.8; // 弹性系数
          const impulse = -(1 + restitution) * velocityAlongNormal /
                         (1/p1.mass + 1/p2.mass);
          
          const impulseVector = normal.clone().multiplyScalar(impulse);
          p1.velocity.sub(impulseVector.clone().divideScalar(p1.mass));
          p2.velocity.add(impulseVector.clone().divideScalar(p2.mass));
        }
      }
    }
  }

  isComplete(): boolean {
    return this.time > (this.config.duration || 10);
  }

  getFinalState(): any {
    return {
      totalTime: this.time,
      finalParticles: this.particles
    };
  }
}

// 类型定义
interface PhysicsConfig {
  type: 'fluid' | 'rigid_body' | 'soft_body' | 'particle_system';
  resolution: number;
  timeStep: number;
  solverIterations: number;
  maxParticles: number;
  targetFPS?: number;
  qualityPreference?: 'performance' | 'quality' | 'balanced';
  duration?: number;
  gravity?: number;
  viscosity?: number;
  turbulence?: number;
}

interface AdaptivePhysicsConfig extends PhysicsConfig {
  adaptive: boolean;
  qualityLevel: QualityLevel;
  optimizationFlags: OptimizationFlags;
  complexityBudget: number;
}

interface EnvironmentAnalysis {
  device: DeviceInfo;
  performance: PerformanceMetrics;
  requirements: {
    targetFPS: number;
    qualityPreference: string;
    complexityBudget: number;
  };
}

interface DeviceInfo {
  gpuScore: number;
  cpuCores: number;
  memoryGB: number;
  webGLVersion: string;
  supportsWebGL2: boolean;
}

interface PerformanceMetrics {
  averageFPS: number;
  frameTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

interface PhysicsSimulation {
  id: string;
  config: AdaptivePhysicsConfig;
  environment: EnvironmentAnalysis;
  startTime: number;
  frameCount: number;
  isActive: boolean;
  onStepComplete?: (data: any) => void;
  onComplete?: (data: any) => void;
  onError?: (error: any) => void;
}

interface PerformanceFeedback {
  currentFPS: number;
  targetFPS: number;
  frameTime: number;
  memoryPressure: boolean;
}

interface SimulationStatus {
  id: string;
  isActive: boolean;
  frameCount: number;
  duration: number;
  currentConfig: AdaptivePhysicsConfig;
  performance: any;
}

interface SystemStatus {
  activeSimulations: number;
  availableWorkers: number;
  performance: any;
  deviceProfile: any;
}

type QualityLevel = 'minimum' | 'low' | 'medium' | 'high' | 'ultra';

interface OptimizationFlags {
  spatialHashing: boolean;
  broadPhase: boolean;
  constraintSplitting: boolean;
  asyncCollision: boolean;
  memoryPooling: boolean;
  simplifiedModels: boolean;
  reducedPrecision: boolean;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  mass: number;
  radius: number;
}

interface ForceField {
  type: 'gravity' | 'turbulence' | 'wind' | 'magnetic';
  strength: number;
  direction?: THREE.Vector3;
  noiseScale?: number;
}

interface StepResult {
  time: number;
  particleCount: number;
  particles: Array<{
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    mass: number;
  }>;
}

// 监控和分析类
class PerformanceMonitor {
  private metrics: Map<string, any[]> = new Map();
  private overallMetrics: PerformanceMetrics = {
    averageFPS: 60,
    frameTime: 16.67,
    memoryUsage: 0,
    cpuUsage: 0
  };

  getCurrentMetrics(): PerformanceMetrics {
    return { ...this.overallMetrics };
  }

  getSimulationMetrics(simulationId: string): any {
    return this.metrics.get(simulationId)?.slice(-10) || [];
  }

  getOverallMetrics(): PerformanceMetrics {
    return { ...this.overallMetrics };
  }

  removeSimulation(simulationId: string): void {
    this.metrics.delete(simulationId);
  }

  destroy(): void {
    this.metrics.clear();
  }
}

class DeviceProfiler {
  private currentProfile: any = null;

  async getDeviceInfo(): Promise<DeviceInfo> {
    // 模拟设备信息获取
    return {
      gpuScore: Math.floor(Math.random() * 10) + 1,
      cpuCores: navigator.hardwareConcurrency || 4,
      memoryGB: (navigator as any).deviceMemory || 4,
      webGLVersion: this.getWebGLVersion(),
      supportsWebGL2: this.supportsWebGL2()
    };
  }

  getCurrentProfile(): any {
    return this.currentProfile;
  }

  private getWebGLVersion(): string {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return gl ? gl.getParameter(gl.VERSION) : 'unknown';
    } catch {
      return 'unavailable';
    }
  }

  private supportsWebGL2(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl2');
    } catch {
      return false;
    }
  }

  destroy(): void {
    this.currentProfile = null;
  }
}

class AdaptationController {
  calculateAdaptation(
    currentConfig: AdaptivePhysicsConfig,
    feedback: PerformanceFeedback
  ): AdaptationResult {
    const fpsRatio = feedback.currentFPS / feedback.targetFPS;
    let shouldAdapt = false;
    const changes: Partial<AdaptivePhysicsConfig> = {};

    if (fpsRatio < 0.8) {
      // 性能不足，降低质量
      shouldAdapt = true;
      changes.qualityLevel = this.lowerQualityLevel(currentConfig.qualityLevel);
      changes.maxParticles = Math.floor(currentConfig.maxParticles * 0.8);
      changes.resolution = Math.max(16, Math.floor(currentConfig.resolution * 0.8));
    } else if (fpsRatio > 1.2) {
      // 性能过剩，可以提升质量
      shouldAdapt = true;
      changes.qualityLevel = this.raiseQualityLevel(currentConfig.qualityLevel);
      changes.maxParticles = Math.min(5000, Math.floor(currentConfig.maxParticles * 1.2));
      changes.resolution = Math.min(256, Math.floor(currentConfig.resolution * 1.2));
    }

    return { shouldAdapt, changes };
  }

  private lowerQualityLevel(current: QualityLevel): QualityLevel {
    const levels: QualityLevel[] = ['minimum', 'low', 'medium', 'high', 'ultra'];
    const currentIndex = levels.indexOf(current);
    return currentIndex > 0 ? levels[currentIndex - 1] : 'minimum';
  }

  private raiseQualityLevel(current: QualityLevel): QualityLevel {
    const levels: QualityLevel[] = ['minimum', 'low', 'medium', 'high', 'ultra'];
    const currentIndex = levels.indexOf(current);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : 'ultra';
  }
}

interface AdaptationResult {
  shouldAdapt: boolean;
  changes: Partial<AdaptivePhysicsConfig>;
}