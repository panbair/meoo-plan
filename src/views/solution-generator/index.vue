<template>
  <div class="solution-generator">
    <!-- 头部 -->
    <header class="generator-header">
      <div class="header-content">
        <h1 class="title">
          <span class="icon">🎯</span>
          企业网站智能方案生成器
        </h1>
        <p class="subtitle">基于597个GSAP动画组件知识库，AI驱动的智能推荐系统</p>
      </div>
      <div class="header-right">
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">597</span>
            <span class="stat-label">组件库</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">8</span>
            <span class="stat-label">网站模块</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">6</span>
            <span class="stat-label">视觉风格</span>
          </div>
        </div>
        <button class="btn-api-config" @click="showApiConfig = true" :title="aiConfigured ? 'AI已配置' : '配置AI API'">
          <span class="api-status" :class="{ configured: aiConfigured }">{{ aiConfigured ? '✅' : '⚙️' }}</span>
          <span>{{ aiConfigured ? 'AI已连接' : '配置AI' }}</span>
        </button>
      </div>
    </header>

    <!-- 步骤指示器 -->
    <div class="steps-indicator">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="step-item"
        :class="{ 
          active: currentStep === index,
          completed: currentStep > index 
        }"
      >
        <div class="step-circle">
          <span v-if="currentStep > index">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div class="step-info">
          <div class="step-label">{{ step.label }}</div>
          <div class="step-desc">{{ step.desc }}</div>
        </div>
      </div>
    </div>

    <!-- API配置对话框 -->
    <div v-if="showApiConfig" class="modal-overlay" @click.self="showApiConfig = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>⚙️ AI API 配置</h3>
          <button class="modal-close" @click="showApiConfig = false">×</button>
        </div>
        <div class="modal-body">
          <div class="config-info">
            <p>💡 <strong>提示：</strong>配置AI API后，方案生成将更加智能和个性化。</p>
            <p>如果不配置，将使用本地模拟模式生成基础方案。</p>
          </div>

          <div class="form-group">
            <label class="form-label">AI 提供商</label>
            <select v-model="apiConfigForm.provider" class="form-select">
              <option value="qwen">通义千问 (Qwen)</option>
              <option value="deepseek">DeepSeek</option>
              <option value="openai">OpenAI (GPT)</option>
              <option value="custom">自定义</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              API 密钥 <span class="required">*</span>
            </label>
            <input 
              v-model="apiConfigForm.apiKey" 
              type="password" 
              class="form-input"
              placeholder="请输入您的API密钥"
            />
            <p class="form-hint">🔒 API密钥仅存储在浏览器本地，不会上传到服务器</p>
          </div>

          <div class="form-group" v-if="apiConfigForm.provider === 'custom'">
            <label class="form-label">基础 URL</label>
            <input 
              v-model="apiConfigForm.baseUrl" 
              type="text" 
              class="form-input"
              placeholder="https://api.example.com/v1"
            />
          </div>

          <div class="form-group">
            <label class="form-label">模型名称（可选）</label>
            <input 
              v-model="apiConfigForm.model" 
              type="text" 
              class="form-input"
              :placeholder="getModelPlaceholder()"
            />
          </div>

          <div class="api-links">
            <h4>📚 获取API密钥：</h4>
            <ul>
              <li><a href="https://dashscope.console.aliyun.com/" target="_blank">通义千问 API</a></li>
              <li><a href="https://platform.deepseek.com/" target="_blank">DeepSeek API</a></li>
              <li><a href="https://platform.openai.com/" target="_blank">OpenAI API</a></li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showApiConfig = false">取消</button>
          <button class="btn btn-primary" @click="saveApiConfig">保存配置</button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <main class="generator-main">
      <!-- 步骤1: 基本信息 -->
      <div v-if="currentStep === 0" class="step-content fade-in">
        <h2 class="section-title">📋 基本信息</h2>
        <p class="section-hint">请详细描述您的网站需求，这将帮助AI生成更精准的方案</p>
        
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">🏢</span>
            网站类型 <span class="required">*</span>
          </label>
          <select v-model="formData.websiteType" class="form-select">
            <option value="">请选择网站类型</option>
            <option value="corporate">企业官网 - 展示公司形象和业务</option>
            <option value="ecommerce">电商平台 - 在线销售产品和服务</option>
            <option value="portfolio">作品集/个人网站 - 展示个人或团队作品</option>
            <option value="landing">营销落地页 - 单一目标转化页面</option>
            <option value="saas">SaaS产品页 - 软件即服务产品展示</option>
            <option value="education">教育/培训 - 课程和教育内容</option>
            <option value="medical">医疗/健康 - 医疗服务和健康信息</option>
            <option value="restaurant">餐饮/酒店 - 餐厅和住宿预订</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">🎨</span>
            所属行业 <span class="required">*</span>
          </label>
          <select v-model="formData.industry" class="form-select">
            <option value="">请选择行业</option>
            <option value="tech">科技/互联网/AI - 技术创新和数字化</option>
            <option value="finance">金融/保险 - 金融服务和投资</option>
            <option value="design">设计/创意/艺术 - 视觉设计和创意产业</option>
            <option value="manufacturing">制造/工业 - 生产制造和供应链</option>
            <option value="retail">零售/电商 - 商品销售和分销</option>
            <option value="education">教育/培训 - 知识传授和技能培养</option>
            <option value="medical">医疗/健康 - 医疗保健和健康管理</option>
            <option value="realestate">房地产/建筑 - 地产开发和建筑设计</option>
            <option value="food">餐饮/食品 - 美食和饮品</option>
            <option value="travel">旅游/酒店 - 旅行服务和住宿</option>
            <option value="legal">法律/咨询 - 专业服务和顾问</option>
            <option value="other">其他 - 未列出的行业</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📝</span>
            公司名称/项目名称
          </label>
          <input 
            v-model="formData.companyName" 
            type="text" 
            class="form-input"
            placeholder="例如：未来科技有限公司、创新AI平台"
          />
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">💡</span>
            核心业务/产品描述 <span class="required">*</span>
          </label>
          <textarea 
            v-model="formData.businessDesc" 
            class="form-textarea"
            rows="5"
            placeholder="请详细描述：&#10;1. 您的核心产品或服务是什么？&#10;2. 解决了什么用户痛点？&#10;3. 有什么独特优势或差异化特点？&#10;&#10;示例：我们是一家专注于AI驱动的智能客服解决方案提供商，通过自然语言处理技术帮助企业实现7x24小时自动化客户服务，降低80%的人工成本，提升客户满意度。"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">🎯</span>
            目标用户群体
          </label>
          <textarea 
            v-model="formData.targetAudience" 
            class="form-textarea"
            rows="3"
            placeholder="请描述您的主要用户：&#10;- 年龄段、职业、收入水平&#10;- 使用场景和需求&#10;- 地域分布等&#10;&#10;示例：25-40岁的企业决策者和技术负责人，主要分布在一线城市，需要高效解决客户服务问题"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">✨</span>
            品牌关键词（3-5个）
          </label>
          <input 
            v-model="formData.brandKeywords" 
            type="text" 
            class="form-input"
            placeholder="用逗号分隔，例如：创新、可靠、高端、智能、温暖"
          />
          <p class="form-hint">💡 这些关键词将影响配色、字体和整体设计风格</p>
        </div>

        <div class="form-actions">
          <button class="btn btn-next" @click="nextStep" :disabled="!canProceed1">
            下一步 →
          </button>
        </div>
      </div>

      <!-- 步骤2: 视觉风格 -->
      <div v-if="currentStep === 1" class="step-content fade-in">
        <h2 class="section-title">🎨 视觉风格偏好</h2>
        <p class="section-hint">选择最符合您品牌形象的设计风格，AI将据此推荐组件</p>
        
        <div class="style-grid">
          <div 
            v-for="style in visualStyles" 
            :key="style.value"
            class="style-card"
            :class="{ selected: formData.visualStyle === style.value }"
            @click="formData.visualStyle = style.value"
          >
            <div class="style-preview" :style="getPreviewStyle(style.value)"></div>
            <div class="style-icon">{{ style.icon }}</div>
            <div class="style-name">{{ style.name }}</div>
            <div class="style-desc">{{ style.desc }}</div>
            <div class="style-tags">
              <span v-for="tag in style.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="style-suitable">
              <strong>适合：</strong>{{ style.suitable }}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">🎭</span>
            情感氛围（可选）
          </label>
          <div class="emotion-tags">
            <div 
              v-for="emotion in emotions" 
              :key="emotion.value"
              class="emotion-tag"
              :class="{ selected: formData.emotions.includes(emotion.value) }"
              @click="toggleEmotion(emotion.value)"
            >
              <span class="emotion-icon">{{ emotion.icon }}</span>
              <span class="emotion-label">{{ emotion.label }}</span>
            </div>
          </div>
          <p class="form-hint">💡 选择1-3个最能代表品牌的情感特质</p>
        </div>

        <div class="form-actions">
          <button class="btn btn-prev" @click="prevStep">← 上一步</button>
          <button class="btn btn-next" @click="nextStep" :disabled="!formData.visualStyle">
            下一步 →
          </button>
        </div>
      </div>

      <!-- 步骤3: 功能模块 -->
      <div v-if="currentStep === 2" class="step-content fade-in">
        <h2 class="section-title">📦 需要的功能模块</h2>
        <p class="section-hint">选择您网站需要包含的模块（可多选），AI会为每个模块推荐最佳组件组合</p>
        
        <!-- 快速操作栏 -->
        <div class="quick-actions">
          <button class="btn-quick" @click="selectRecommendedModules" v-if="getRecommendedModules().length > 0">
            ⭐ 一键选择推荐模块 ({{ getRecommendedModules().length }}个)
          </button>
          <button class="btn-quick btn-clear" @click="clearAllModules" v-if="formData.selectedModules.length > 0">
            🗑️ 清空所有选择
          </button>
        </div>
        
        <!-- 选择统计 -->
        <div class="selection-stats" v-if="formData.selectedModules.length > 0">
          <div class="stat-item">
            <span class="stat-label">已选模块：</span>
            <span class="stat-value">{{ formData.selectedModules.length }}个</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">预估组件总数：</span>
            <span class="stat-value highlight">{{ getTotalComponentCount() }}个</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">预计开发时间：</span>
            <span class="stat-value">{{ getEstimatedTime() }}</span>
          </div>
        </div>
        
        <div class="modules-grid">
          <div 
            v-for="module in availableModules" 
            :key="module.key"
            class="module-card"
            :class="{ selected: formData.selectedModules.includes(module.key) }"
            @click="toggleModule(module.key)"
          >
            <div class="module-checkbox">
              <span v-if="formData.selectedModules.includes(module.key)">✓</span>
              <span v-else>+</span>
            </div>
            <div class="module-icon">{{ module.icon }}</div>
            <div class="module-name">{{ module.name }}</div>
            <div class="module-desc">{{ module.desc }}</div>
            <div class="module-components">
              <span class="comp-count">
                <strong>{{ module.componentCount }}</strong>
                <span class="comp-label">种组件可选</span>
              </span>
            </div>
            <!-- 智能推荐标签 -->
            <div class="module-recommendation" v-if="getRecommendationBadge(module.key)">
              <span class="badge" :class="getRecommendationBadge(module.key)">{{ getRecommendationText(module.key) }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">⭐</span>
            重点展示的模块（可选）
          </label>
          <select v-model="formData.priorityModule" class="form-select">
            <option value="">无特别要求</option>
            <option v-for="module in availableModules" :key="module.key" :value="module.key">
              {{ module.icon }} {{ module.name }} - 需要更炫酷的效果
            </option>
          </select>
          <p class="form-hint">💡 选中的模块将获得更多动画效果和视觉投入</p>
        </div>

        <div class="form-actions">
          <button class="btn btn-prev" @click="prevStep">← 上一步</button>
          <button class="btn btn-next" @click="nextStep" :disabled="formData.selectedModules.length === 0">
            下一步 →
          </button>
        </div>
      </div>

      <!-- 步骤4: 性能与预算 -->
      <div v-if="currentStep === 3" class="step-content fade-in">
        <h2 class="section-title">⚙️ 性能要求与预算</h2>
        <p class="section-hint">这些信息将帮助AI平衡视觉效果和实际可行性</p>
        
        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">📱</span>
            目标用户设备
          </label>
          <div class="radio-group">
            <label class="radio-item">
              <input type="radio" v-model="formData.targetDevice" value="mobile" />
              <span class="radio-icon">📱</span>
              <span>移动端为主</span>
              <small>优先保证手机流畅体验</small>
            </label>
            <label class="radio-item">
              <input type="radio" v-model="formData.targetDevice" value="desktop" />
              <span class="radio-icon">💻</span>
              <span>桌面端为主</span>
              <small>可以使用更复杂的特效</small>
            </label>
            <label class="radio-item">
              <input type="radio" v-model="formData.targetDevice" value="both" checked />
              <span class="radio-icon">🔄</span>
              <span>两者兼顾</span>
              <small>响应式设计，自适应</small>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">💰</span>
            项目预算范围
          </label>
          <select v-model="formData.budget" class="form-select">
            <option value="low">紧张（快速交付，简化动画）- 预计1-3万</option>
            <option value="medium" selected>适中（平衡效果与性能）- 预计3-8万</option>
            <option value="high">充裕（追求视觉效果）- 预计8-15万</option>
            <option value="unlimited">不限（极致体验）- 15万以上</option>
          </select>
          <p class="form-hint">💡 预算越高，可使用的高级动画组件越多</p>
          
          <!-- 预算建议 -->
          <div class="budget-suggestion" v-if="formData.budget">
            <div class="suggestion-header">
              <span class="icon">💡</span>
              <strong>根据当前预算的建议：</strong>
            </div>
            <div class="suggestion-content">
              <p><strong>推荐组件数量：</strong>{{ getRecommendedComponentCount(formData.budget).min }}-{{ getRecommendedComponentCount(formData.budget).max }}个/模块</p>
              <p><strong>建议：</strong>{{ getRecommendedComponentCount(formData.budget).suggestion }}</p>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">⏱️</span>
            开发周期
          </label>
          <select v-model="formData.timeline" class="form-select">
            <option value="urgent">紧急（1-2周）- 建议使用基础组件</option>
            <option value="normal" selected>正常（1-2个月）- 有足够时间优化</option>
            <option value="relaxed">宽松（3个月以上）- 可以打磨细节</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">🌐</span>
            性能优先级
          </label>
          <div class="priority-slider">
            <div class="slider-labels">
              <span>视觉效果优先</span>
              <span>平衡</span>
              <span>加载速度优先</span>
            </div>
            <input 
              type="range" 
              v-model="formData.performancePriority" 
              min="1" 
              max="3" 
              step="1"
              class="slider"
            />
            <div class="slider-value">
              当前选择：{{ getPerformanceLabel(formData.performancePriority) }}
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            <span class="label-icon">⭐</span>
            特殊要求或备注
          </label>
          <textarea 
            v-model="formData.specialRequirements" 
            class="form-textarea"
            rows="4"
            placeholder="请告诉我们任何特殊需求，例如：&#10;- 需要支持深色模式切换&#10;- 必须符合WCAG无障碍标准&#10;- 需要使用特定品牌色彩（请提供色值）&#10;- 需要集成第三方服务（如地图、支付等）&#10;- 目标市场（国内/海外，影响CDN选择）&#10;- 其他技术要求或限制"
          ></textarea>
        </div>

        <div class="form-actions">
          <button class="btn btn-prev" @click="prevStep">← 上一步</button>
          <button class="btn btn-generate" @click="generateSolution" :disabled="isGenerating">
            <span v-if="isGenerating" class="loading-spinner">⏳</span>
            {{ isGenerating ? 'AI分析中...' : '🚀 生成智能方案' }}
          </button>
        </div>
      </div>

      <!-- 步骤5: 方案展示 -->
      <div v-if="currentStep === 4" class="step-content fade-in">
        <div v-if="generatedSolutions.length === 0 && !isGenerating" class="empty-state">
          <div class="empty-icon">🎯</div>
          <h3>准备生成方案</h3>
          <p>请填写完所有信息后点击"生成智能方案"</p>
        </div>

        <div v-else-if="isGenerating" class="generating-state">
          <div class="loading-animation">
            <div class="pulse-ring"></div>
            <div class="pulse-ring delay-1"></div>
            <div class="pulse-ring delay-2"></div>
          </div>
          <h3>AI正在分析您的需求...</h3>
          <p class="loading-text">{{ loadingText }}</p>
        </div>

        <div v-else class="solutions-container">
          <div class="solutions-header">
            <h2 class="section-title">✨ AI生成的最佳方案</h2>
            <p class="solutions-subtitle">基于您的需求，我们为您生成了 {{ generatedSolutions.length }} 套方案</p>
          </div>

          <div class="solutions-tabs">
            <button 
              v-for="(solution, index) in generatedSolutions" 
              :key="index"
              class="tab-btn"
              :class="{ active: activeSolution === index }"
              @click="activeSolution = index"
            >
              <span class="tab-icon">{{ solution.icon }}</span>
              <span class="tab-name">{{ solution.name }}</span>
              <span class="tab-badge">{{ solution.badge }}</span>
            </button>
          </div>

          <div class="solution-detail">
            <div v-if="activeSolutionData" class="solution-content">
              <!-- 方案概述 -->
              <div class="solution-overview">
                <h3>{{ activeSolutionData.name }}</h3>
                <p class="overview-desc">{{ activeSolutionData.description }}</p>
                
                <div class="solution-meta">
                  <div class="meta-item">
                    <span class="meta-label">性能评级</span>
                    <div class="stars">
                      <span v-for="i in 5" :key="i" class="star" :class="{ active: i <= activeSolutionData.performanceRating }">
                        ⭐
                      </span>
                    </div>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">复杂度</span>
                    <span class="complexity">{{ activeSolutionData.complexity }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">预估工时</span>
                    <span class="time">{{ activeSolutionData.estimatedTime }}</span>
                  </div>
                </div>
              </div>

              <!-- 推荐理由 -->
              <div class="recommendation-reason">
                <h4>💡 推荐理由</h4>
                <ul class="reason-list">
                  <li v-for="(reason, idx) in activeSolutionData.reasons" :key="idx">
                    {{ reason }}
                  </li>
                </ul>
              </div>

              <!-- 模块方案详情 -->
              <div class="module-solutions">
                <h4>📦 各模块组件方案</h4>
                <div v-for="(module, mIdx) in activeSolutionData.modules" :key="mIdx" class="module-solution-card">
                  <div class="module-header">
                    <span class="module-icon">{{ module.icon }}</span>
                    <h5>{{ module.name }}</h5>
                  </div>
                  <div class="module-components">
                    <div v-for="(comp, cIdx) in module.components" :key="cIdx" class="component-item">
                      <div class="comp-badge">{{ cIdx + 1 }}</div>
                      <div class="comp-info">
                        <span class="comp-name">{{ comp.name }}</span>
                        <span class="comp-type">{{ comp.type }}</span>
                      </div>
                      <span class="comp-purpose">{{ comp.purpose }}</span>
                      <button class="btn-preview" @click="previewComponent(comp)" title="在线预览">
                        👁️
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 配色方案 -->
              <div v-if="activeSolutionData.colorScheme" class="color-scheme">
                <h4>🎨 推荐配色方案</h4>
                <div class="color-palette">
                  <div v-for="(color, idx) in activeSolutionData.colorScheme" :key="idx" class="color-item">
                    <div class="color-box" :style="{ backgroundColor: color.hex }"></div>
                    <div class="color-info">
                      <span class="color-role">{{ color.role }}</span>
                      <span class="color-hex">{{ color.hex }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="solution-actions">
                <button class="btn btn-secondary" @click="copySolutionCode">
                  📋 复制方案代码
                </button>
                <button class="btn btn-primary" @click="viewDetailedCode">
                  👁️ 查看详细实现
                </button>
                <button class="btn btn-outline" @click="regenerateSolution">
                  🔄 重新生成
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions" v-if="generatedSolutions.length > 0">
          <button class="btn btn-prev" @click="prevStep">← 返回修改</button>
          <div class="export-buttons">
            <button class="btn btn-export" @click="exportToTxt" title="下载为TXT文件（meoo AI专用）">
              📥 下载 meoo AI 方案
            </button>
            <button class="btn btn-copy" @click="copyToClipboard" title="复制到剪贴板">
              📋 复制方案内容
            </button>
            <button class="btn btn-secondary" @click="exportSolution" title="下载JSON格式（开发者用）">
              🔧 导出 JSON
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 组件预览模态框 -->
    <div v-if="showPreview" class="preview-modal-overlay" @click="closePreview">
      <div class="preview-modal-content" @click.stop>
        <div class="preview-header">
          <h3>{{ previewComponentData?.name }}</h3>
          <button class="btn-close" @click="closePreview">✕</button>
        </div>
        
        <div class="preview-body">
          <div class="preview-info">
            <div class="info-item">
              <span class="info-label">组件类型：</span>
              <span class="info-value">{{ previewComponentData?.type }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">用途说明：</span>
              <span class="info-value">{{ previewComponentData?.purpose }}</span>
            </div>
          </div>
          
          <div class="preview-demo">
            <div class="demo-placeholder">
              <div class="placeholder-icon">🎨</div>
              <p class="placeholder-text">组件预览区域</p>
              <p class="placeholder-hint">实际项目中将显示 {{ previewComponentData?.name }} 的真实效果</p>
              <div class="demo-features">
                <h4>主要特性：</h4>
                <ul>
                  <li>✨ GSAP动画效果</li>
                  <li>📱 响应式设计</li>
                  <li>🎯 可自定义配置</li>
                  <li>⚡ 高性能优化</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="preview-footer">
          <button class="btn btn-secondary" @click="copyComponentCode">
            📋 复制代码
          </button>
          <button class="btn btn-primary" @click="viewComponentDocs">
            📖 查看文档
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { aiService } from '@/api/ai'
import { aiConfig } from '@/api/ai/ai.config'

// 步骤定义
const steps = [
  { label: '基本信息', desc: '网站类型与业务' },
  { label: '视觉风格', desc: '选择设计风格' },
  { label: '功能模块', desc: '需要的页面模块' },
  { label: '性能预算', desc: '技术要求与约束' },
  { label: '智能方案', desc: 'AI生成最佳方案' }
]

const currentStep = ref(0)
const isGenerating = ref(false)
const loadingText = ref('')
const activeSolution = ref(0)
const showApiConfig = ref(false)
const aiConfigured = ref(false)

// 预览相关状态
const showPreview = ref(false)
const previewComponentData = ref<any>(null)

// API配置表单
const apiConfigForm = reactive({
  provider: 'qwen',
  apiKey: '',
  baseUrl: '',
  model: ''
})

// 表单数据
const formData = reactive({
  websiteType: '',
  industry: '',
  companyName: '',
  businessDesc: '',
  targetAudience: '', // 新增：目标用户群体
  brandKeywords: '', // 新增：品牌关键词
  visualStyle: '',
  emotions: [] as string[], // 新增：情感氛围
  selectedModules: [] as string[],
  priorityModule: '', // 新增：重点模块
  targetDevice: 'both',
  budget: 'medium',
  timeline: 'normal',
  performancePriority: 2, // 新增：性能优先级 1=视觉优先 2=平衡 3=速度优先
  specialRequirements: ''
})

// 视觉风格选项
const visualStyles = [
  {
    value: 'tech',
    name: '科技感/未来风',
    icon: '🚀',
    desc: '霓虹、全息、粒子、3D效果',
    tags: ['现代', '创新', '前卫'],
    suitable: 'AI公司、科技企业、创新产品',
    previewColors: ['#00FFFF', '#FF00FF', '#000000']
  },
  {
    value: 'nature',
    name: '自然/生态风',
    icon: '🌿',
    desc: '流水、植物、极光、柔和色调',
    tags: ['清新', '环保', '和谐'],
    suitable: '环保组织、健康品牌、生活方式',
    previewColors: ['#2E8B57', '#87CEEB', '#F5F5DC']
  },
  {
    value: 'luxury',
    name: '高端/奢华风',
    icon: '💎',
    desc: '金色、水晶、珍珠、精致质感',
    tags: ['优雅', '高贵', '品质'],
    suitable: '奢侈品牌、高端服务、珠宝钟表',
    previewColors: ['#FFD700', '#C0C0C0', '#000000']
  },
  {
    value: 'minimal',
    name: '简约/现代风',
    icon: '◻️',
    desc: '留白、几何、干净、功能性强',
    tags: ['简洁', '专业', '高效'],
    suitable: '咨询公司、SaaS产品、个人博客',
    previewColors: ['#FFFFFF', '#333333', '#F5F5F5']
  },
  {
    value: 'creative',
    name: '创意/艺术风',
    icon: '🎨',
    desc: '多彩、抽象、实验性、视觉冲击',
    tags: ['独特', '个性', '艺术'],
    suitable: '设计工作室、艺术机构、创意 agency',
    previewColors: ['#FF6B6B', '#4ECDC4', '#FFE66D']
  },
  {
    value: 'vintage',
    name: '复古/怀旧风',
    icon: '📷',
    desc: '胶片、噪点、sepia、温暖色调',
    tags: ['经典', '情怀', '温暖'],
    suitable: '咖啡馆、手工艺品、文化传承',
    previewColors: ['#8B4513', '#D2691E', '#F4A460']
  }
]

// 情感氛围选项
const emotions = [
  { value: 'professional', label: '专业可靠', icon: '👔' },
  { value: 'friendly', label: '友好亲和', icon: '😊' },
  { value: 'innovative', label: '创新前沿', icon: '💡' },
  { value: 'elegant', label: '优雅精致', icon: '✨' },
  { value: 'energetic', label: '活力动感', icon: '⚡' },
  { value: 'calm', label: '平静舒缓', icon: '🧘' },
  { value: 'playful', label: '活泼有趣', icon: '🎮' },
  { value: 'serious', label: '严肃权威', icon: '🏛️' },
  { value: 'warm', label: '温暖亲切', icon: '☀️' },
  { value: 'cool', label: '冷静理性', icon: '❄️' }
]

// 可用模块（扩充版）
const availableModules = [
  { key: 'hero', name: '首页英雄区', icon: '🎯', desc: '首屏视觉焦点，品牌展示', componentCount: 28 },
  { key: 'about', name: '关于我们', icon: '👥', desc: '企业介绍、团队、历程', componentCount: 22 },
  { key: 'products', name: '产品/服务', icon: '📦', desc: '产品展示、特性对比', componentCount: 35 },
  { key: 'technology', name: '技术优势', icon: '⚙️', desc: '技术架构、核心能力', componentCount: 25 },
  { key: 'cases', name: '成功案例', icon: '🏆', desc: '客户案例、成果展示', componentCount: 26 },
  { key: 'news', name: '新闻动态', icon: '📰', desc: '最新资讯、博客文章', componentCount: 18 },
  { key: 'partners', name: '合作伙伴', icon: '🤝', desc: 'Logo墙、合作案例', componentCount: 15 },
  { key: 'contact', name: '联系我们', icon: '📧', desc: '联系表单、地图位置', componentCount: 20 }
]

// 生成的方案
const generatedSolutions = ref<any[]>([])

// 计算属性
const canProceed1 = computed(() => {
  return formData.websiteType && formData.industry && formData.businessDesc
})

const activeSolutionData = computed(() => {
  return generatedSolutions.value[activeSolution.value] || null
})

// 方法
function nextStep() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function goToStep(step: number) {
  if (step <= currentStep.value) {
    currentStep.value = step
  }
}

function toggleModule(moduleKey: string) {
  const index = formData.selectedModules.indexOf(moduleKey)
  if (index > -1) {
    formData.selectedModules.splice(index, 1)
  } else {
    formData.selectedModules.push(moduleKey)
  }
}

// 切换情感氛围
function toggleEmotion(emotionValue: string) {
  const index = formData.emotions.indexOf(emotionValue)
  if (index > -1) {
    // 如果已选中，取消选中
    formData.emotions.splice(index, 1)
  } else {
    // 最多选择3个
    if (formData.emotions.length < 3) {
      formData.emotions.push(emotionValue)
    } else {
      alert('最多选择3个情感特质')
    }
  }
}

// 获取预览样式
function getPreviewStyle(styleValue: string) {
  const style = visualStyles.find(s => s.value === styleValue)
  if (!style || !style.previewColors) return {}
  
  return {
    background: `linear-gradient(135deg, ${style.previewColors.join(', ')})`
  }
}

// 获取性能优先级标签
function getPerformanceLabel(value: number) {
  const labels = {
    1: '视觉效果优先 - 使用更多高级动画',
    2: '平衡模式 - 兼顾效果和性能',
    3: '加载速度优先 - 轻量级组件'
  }
  return labels[value as keyof typeof labels] || '平衡模式'
}

// 获取推荐徽章类型
function getRecommendationBadge(moduleKey: string): string {
  // 根据网站类型和行业推荐必选模块
  const mustHaveModules: Record<string, string[]> = {
    corporate: ['hero', 'about', 'products', 'contact'],
    tech: ['hero', 'technology', 'products', 'cases'],
    creative: ['hero', 'cases', 'about', 'contact'],
    ecommerce: ['hero', 'products', 'cases', 'contact']
  }
  
  const recommended = mustHaveModules[formData.websiteType] || []
  if (recommended.includes(moduleKey)) {
    return 'recommended'
  }
  
  return ''
}

// 获取推荐文本
function getRecommendationText(moduleKey: string): string {
  const badge = getRecommendationBadge(moduleKey)
  if (badge === 'recommended') {
    return '⭐ 推荐必选'
  }
  return ''
}

// 根据预算推荐组件数量
function getRecommendedComponentCount(budget: string): { min: number, max: number, suggestion: string } {
  const recommendations = {
    low: { min: 3, max: 5, suggestion: '建议选择3-5个核心组件，保证基本功能' },
    medium: { min: 5, max: 8, suggestion: '建议选择5-8个组件，平衡效果与性能' },
    high: { min: 8, max: 12, suggestion: '建议选择8-12个组件，包含高级特效' },
    unlimited: { min: 12, max: 20, suggestion: '可以自由选择所有组件，定制专属体验' }
  }
  return recommendations[budget as keyof typeof recommendations] || recommendations.medium
}

// 获取推荐模块列表
function getRecommendedModules(): string[] {
  const mustHaveModules: Record<string, string[]> = {
    corporate: ['hero', 'about', 'products', 'contact'],
    tech: ['hero', 'technology', 'products', 'cases'],
    creative: ['hero', 'cases', 'about', 'contact'],
    ecommerce: ['hero', 'products', 'cases', 'contact']
  }
  
  return mustHaveModules[formData.websiteType] || []
}

// 一键选择推荐模块
function selectRecommendedModules() {
  const recommended = getRecommendedModules()
  recommended.forEach(key => {
    if (!formData.selectedModules.includes(key)) {
      formData.selectedModules.push(key)
    }
  })
}

// 清空所有选择
function clearAllModules() {
  if (confirm('确定要清空所有已选模块吗？')) {
    formData.selectedModules = []
    formData.priorityModule = ''
  }
}

// 计算总组件数
function getTotalComponentCount(): number {
  let total = 0
  const budgetRec = getRecommendedComponentCount(formData.budget)
  const avgComponents = (budgetRec.min + budgetRec.max) / 2
  
  formData.selectedModules.forEach(moduleKey => {
    total += Math.round(avgComponents)
  })
  
  return total
}

// 估算开发时间
function getEstimatedTime(): string {
  const moduleCount = formData.selectedModules.length
  const timelineMap: Record<string, number> = {
    urgent: 0.5,
    normal: 1,
    relaxed: 1.5
  }
  
  const baseTime = moduleCount * 0.5 // 每个模块基础0.5个月
  const factor = timelineMap[formData.timeline] || 1
  const estimatedMonths = baseTime * factor
  
  if (estimatedMonths < 1) {
    return `${Math.round(estimatedMonths * 4)}周`
  } else {
    return `${Math.round(estimatedMonths * 10) / 10}个月`
  }
}

// 预览组件
function previewComponent(component: any) {
  previewComponentData.value = component
  showPreview.value = true
}

// 关闭预览
function closePreview() {
  showPreview.value = false
  previewComponentData.value = null
}

// 复制组件代码
function copyComponentCode() {
  if (!previewComponentData.value) return
  
  const code = `// ${previewComponentData.value.name} 组件示例
import { gsap } from 'gsap'

// TODO: 实现 ${previewComponentData.value.name} 组件
// 类型：${previewComponentData.value.type}
// 用途：${previewComponentData.value.purpose}

console.log('${previewComponentData.value.name} 组件已加载')`
  
  navigator.clipboard.writeText(code).then(() => {
    alert('✅ 代码已复制到剪贴板')
  }).catch(() => {
    alert('❌ 复制失败，请手动复制')
  })
}

// 查看组件文档
function viewComponentDocs() {
  if (!previewComponentData.value) return
  
  const componentName = previewComponentData.value.name
  alert(`📖 ${componentName} 组件文档\n\n在实际项目中，这里将打开组件的详细文档页面，包含：\n- 完整的使用示例\n- API参数说明\n- 配置选项\n- 最佳实践`)
}

// 初始化AI服务
onMounted(() => {
  // 检查是否已配置API
  const savedConfig = localStorage.getItem('ai-api-config')
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig)
      apiConfigForm.provider = config.provider || 'qwen'
      apiConfigForm.apiKey = config.apiKey || ''
      apiConfigForm.baseUrl = config.baseUrl || ''
      apiConfigForm.model = config.model || ''
      
      if (apiConfigForm.apiKey) {
        aiService.configure({
          provider: apiConfigForm.provider as any,
          apiKey: apiConfigForm.apiKey,
          baseUrl: apiConfigForm.baseUrl,
          model: apiConfigForm.model
        })
        aiConfigured.value = true
        console.log('✅ AI服务已从本地存储加载:', apiConfigForm.provider)
      }
    } catch (e) {
      console.error('加载AI配置失败:', e)
    }
  } else if (aiConfig.apiKey) {
    // 使用环境变量配置
    aiService.configure(aiConfig)
    aiConfigured.value = true
    console.log('✅ AI服务已从环境变量配置:', aiConfig.provider)
  } else {
    console.warn('⚠️ 未配置API密钥，将使用本地模拟模式')
    console.log('💡 请在页面右上角点击“配置AI”按钮设置API密钥')
  }
})

// 获取模型占位符
function getModelPlaceholder() {
  const placeholders: Record<string, string> = {
    qwen: 'qwen-max',
    deepseek: 'deepseek-chat',
    openai: 'gpt-4',
    custom: 'model-name'
  }
  return placeholders[apiConfigForm.provider] || 'model-name'
}

// 保存API配置
function saveApiConfig() {
  if (!apiConfigForm.apiKey) {
    alert('请输入API密钥')
    return
  }
  
  // 配置AI服务
  aiService.configure({
    provider: apiConfigForm.provider as any,
    apiKey: apiConfigForm.apiKey,
    baseUrl: apiConfigForm.baseUrl,
    model: apiConfigForm.model
  })
  
  // 保存到本地存储
  localStorage.setItem('ai-api-config', JSON.stringify({
    provider: apiConfigForm.provider,
    apiKey: apiConfigForm.apiKey,
    baseUrl: apiConfigForm.baseUrl,
    model: apiConfigForm.model
  }))
  
  aiConfigured.value = true
  showApiConfig.value = false
  
  alert('✅ AI API配置成功！\n\n现在可以生成更智能的方案了。')
  console.log('✅ AI服务已配置:', apiConfigForm.provider)
}

async function generateSolution() {
  isGenerating.value = true
  
  try {
    // 检查是否配置了API密钥（优先检查页面配置，其次检查环境变量）
    const hasApiKey = apiConfigForm.apiKey || aiConfig.apiKey
    
    if (!hasApiKey) {
      // 使用本地模拟模式
      loadingText.value = '使用本地模拟模式生成方案...'
      await new Promise(resolve => setTimeout(resolve, 1500))
      generatedSolutions.value = generateSolutionsBasedOnForm()
    } else {
      // 使用真实AI API
      const loadingSteps = [
        '连接AI服务...',
        '分析网站类型和行业特征...',
        '匹配视觉风格组件库...',
        '筛选适合的动画效果...',
        '评估性能要求和兼容性...',
        '优化组件组合方案...',
        '生成配色和布局建议...',
        '完成方案生成！'
      ]
      
      for (let i = 0; i < loadingSteps.length; i++) {
        loadingText.value = loadingSteps[i]
        await new Promise(resolve => setTimeout(resolve, 600))
      }
      
      console.log('🚀 开始调用AI API生成方案...')
      console.log('📝 用户需求:', {
        websiteType: formData.websiteType,
        industry: formData.industry,
        visualStyle: formData.visualStyle,
        modules: formData.selectedModules
      })
      
      // 调用AI服务生成方案
      const result = await aiService.generateSolution({
        websiteType: formData.websiteType,
        industry: formData.industry,
        companyName: formData.companyName,
        businessDesc: formData.businessDesc,
        targetAudience: formData.targetAudience, // 新增
        brandKeywords: formData.brandKeywords, // 新增
        visualStyle: formData.visualStyle,
        emotions: formData.emotions, // 新增
        selectedModules: formData.selectedModules,
        priorityModule: formData.priorityModule, // 新增
        targetDevice: formData.targetDevice,
        budget: formData.budget,
        timeline: formData.timeline,
        performancePriority: formData.performancePriority, // 新增
        specialRequirements: formData.specialRequirements
      })
      
      console.log('✅ AI方案生成成功！')
      console.log('📊 生成了', result.solutions.length, '套方案')
      
      generatedSolutions.value = result.solutions
      
      // 显示AI分析结果
      if (result.analysis) {
        console.log('📊 AI分析:', result.analysis)
      }
      if (result.recommendations) {
        console.log('💡 AI建议:', result.recommendations)
      }
    }
    
    isGenerating.value = false
    currentStep.value = 4
  } catch (error: any) {
    console.error('❌ 方案生成失败:', error)
    console.error('错误详情:', error.response?.data || error.message)
    alert(`方案生成失败：${error.message}\n\n将使用本地模拟模式生成方案。`)
    
    // 降级到本地模拟模式
    generatedSolutions.value = generateSolutionsBasedOnForm()
    isGenerating.value = false
    currentStep.value = 4
  }
}

function generateSolutionsBasedOnForm() {
  const solutions = []
  
  // 方案A: 视觉效果优先
  solutions.push({
    name: '方案A - 视觉冲击版',
    icon: '🎨',
    badge: '炫酷',
    description: '最大化视觉效果，使用高级动画组件，创造令人印象深刻的用户体验',
    performanceRating: getPerformanceRating('high'),
    complexity: '高',
    estimatedTime: '2-3个月',
    reasons: generateReasons('visual'),
    modules: generateModuleSolutions('visual'),
    colorScheme: getColorScheme(formData.visualStyle)
  })
  
  // 方案B: 性能平衡版
  solutions.push({
    name: '方案B - 平衡优化版',
    icon: '⚖️',
    badge: '推荐',
    description: '在视觉效果和性能之间取得平衡，适合大多数企业网站项目',
    performanceRating: getPerformanceRating('medium'),
    complexity: '中',
    estimatedTime: '1-2个月',
    reasons: generateReasons('balanced'),
    modules: generateModuleSolutions('balanced'),
    colorScheme: getColorScheme(formData.visualStyle)
  })
  
  // 方案C: 快速交付版
  solutions.push({
    name: '方案C - 快速交付版',
    icon: '⚡',
    badge: '高效',
    description: '使用轻量级组件，快速开发和部署，保证基本视觉效果',
    performanceRating: getPerformanceRating('low'),
    complexity: '低',
    estimatedTime: '2-4周',
    reasons: generateReasons('fast'),
    modules: generateModuleSolutions('fast'),
    colorScheme: getColorScheme(formData.visualStyle)
  })
  
  return solutions
}

function getPerformanceRating(level: string) {
  // 根据预算和动画密度综合评分
  const budgetScore = {
    unlimited: 5,
    high: 4,
    medium: 3,
    low: 2
  }[formData.budget] || 3
  
  const levelScore = {
    high: 3,   // 高动画密度会降低性能分
    medium: 4, // 中等平衡
    low: 5     // 轻量级性能最好
  }[level] || 4
  
  // 取平均值并四舍五入
  return Math.round((budgetScore + levelScore) / 2)
}

function generateReasons(type: string) {
  const visualStyleName = getVisualStyleName(formData.visualStyle)
  const reasons = {
    visual: [
      `采用${visualStyleName}风格的高级动画组件`,
      '使用Canvas粒子和WebGL效果，视觉冲击力强',
      '适合追求品牌形象和用户体验的项目',
      '需要较好的设备性能和加载时间容忍度'
    ],
    balanced: [
      `结合${visualStyleName}风格的中级组件`,
      '平衡视觉效果和加载性能',
      '适合大多数企业官网的标准配置',
      '良好的兼容性和用户体验'
    ],
    fast: [
      '使用轻量级基础组件，加载速度快',
      '简化的动画效果，移动端友好',
      '快速开发和部署，成本可控',
      '适合预算紧张或时间紧迫的项目'
    ]
  }
  return reasons[type as keyof typeof reasons]
}

function generateModuleSolutions(type: string) {
  const modules = []
  
  // 根据选择的模块生成方案
  formData.selectedModules.forEach(moduleKey => {
    const module = availableModules.find(m => m.key === moduleKey)
    if (!module) return
    
    const components = getComponentsForModule(moduleKey, type)
    
    modules.push({
      key: moduleKey,  // 添加模块标识
      icon: module.icon,
      name: module.name,
      components
    })
  })
  
  return modules
}

function getComponentsForModule(moduleKey: string, type: string) {
  // 基于真实的 web-list 组件库返回组件
  const componentDB: any = {
    hero: {
      visual: [
        { name: 'CardTextCyber', type: '文字特效', purpose: '赛博风格标题' },
        { name: 'CardImgAurora', type: '背景效果', purpose: '极光背景' },
        { name: 'CardImgNebulaBreath', type: '粒子特效', purpose: '星云呼吸效果' },
        { name: 'CardTextHologram', type: '交互按钮', purpose: '全息CTA按钮' }
      ],
      balanced: [
        { name: 'CardTextDomino', type: '文字动画', purpose: '多米诺标题' },
        { name: 'CardImgMorningMist', type: '背景效果', purpose: '晨雾背景' },
        { name: 'CardImgParallax', type: '滚动动画', purpose: '视差揭示' },
        { name: 'CardTextCrystal', type: '交互按钮', purpose: '水晶按钮' }
      ],
      fast: [
        { name: 'CardTextBlur', type: '文字动画', purpose: '简洁标题' },
        { name: 'CardImgStatic', type: '背景效果', purpose: '静态渐变' },
        { name: 'CardImgFlip', type: '滚动动画', purpose: '基础翻转' }
      ]
    },
    about: {
      visual: [
        { name: 'CardTimeQuantumLeap', type: '时间轴', purpose: '量子跃迁时间线' },
        { name: 'CardImgNebulaBreath', type: '粒子网络', purpose: '星云呼吸效果' },
        { name: 'CardTextFirework', type: '数据统计', purpose: '烟花数字动画' }
      ],
      balanced: [
        { name: 'CardTimeBook', type: '时间轴', purpose: '书籍翻页时间线' },
        { name: 'CardImgMontage', type: '卡片展示', purpose: '团队介绍' },
        { name: 'CardTextBioluminescent', type: '数据统计', purpose: '生物发光数字' }
      ],
      fast: [
        { name: 'CardTimeBeat', type: '时间轴', purpose: '基础时间线' },
        { name: 'CardImgBeacon', type: '卡片展示', purpose: '信标卡片' }
      ]
    },
    products: {
      visual: [
        { name: 'Card3DFlipGallery', type: '3D展示', purpose: '3D翻转画廊' },
        { name: 'CardImgPrism', type: '产品展示', purpose: '棱镜效果' },
        { name: 'CardTextCorona', type: '文字特效', purpose: '日冕文字' }
      ],
      balanced: [
        { name: 'CardImgCarousel', type: '轮播展示', purpose: '产品轮播' },
        { name: 'CardImgPerspective', type: '透视卡片', purpose: '透视效果' },
        { name: 'CardTextAurora', type: '文字动画', purpose: '极光文字' }
      ],
      fast: [
        { name: 'CardImgFlipCard', type: '翻转卡片', purpose: '基础翻转' },
        { name: 'CardImgMirror', type: '镜像展示', purpose: '镜像效果' }
      ]
    },
    cases: {
      visual: [
        { name: 'CardImgVortex', type: '漩涡效果', purpose: '案例漩涡展示' },
        { name: 'CardImgGalaxy', type: '星系展示', purpose: '星系布局' },
        { name: 'CardTextFirework', type: '烟花特效', purpose: '庆祝动画' }
      ],
      balanced: [
        { name: 'CardImgRiver', type: '河流流动', purpose: '案例流' },
        { name: 'CardImgDepth', type: '深度展示', purpose: '景深效果' },
        { name: 'CardTextCinematic', type: '电影文字', purpose: '电影感标题' }
      ],
      fast: [
        { name: 'CardImgStage', type: '舞台展示', purpose: '基础展示' },
        { name: 'CardImgFocusRing', type: '聚焦环', purpose: '聚焦效果' }
      ]
    },
    technology: {
      visual: [
        { name: 'CardTextCyber', type: '文字特效', purpose: '技术标题' },
        { name: 'CardImgNebulaBreath', type: '粒子网络', purpose: '技术架构图' },
        { name: 'Card3DFlipGallery', type: '3D展示', purpose: '技术特性展示' }
      ],
      balanced: [
        { name: 'CardTextCorona', type: '文字特效', purpose: '技术亮点' },
        { name: 'CardImgPrism', type: '棱镜效果', purpose: '技术分解图' },
        { name: 'CardImgPerspective', type: '透视卡片', purpose: '技术层级' }
      ],
      fast: [
        { name: 'CardTextBlur', type: '文字动画', purpose: '简洁标题' },
        { name: 'CardImgBeacon', type: '信标卡片', purpose: '核心技术' }
      ]
    },
    contact: {
      visual: [
        { name: 'CardTextHologram', type: '交互按钮', purpose: '全息联系表单' },
        { name: 'CardImgAurora', type: '背景效果', purpose: '极光背景' },
        { name: 'CardTextCrystal', type: '水晶按钮', purpose: '提交按钮' }
      ],
      balanced: [
        { name: 'CardTextDomino', type: '文字动画', purpose: '联系标题' },
        { name: 'CardImgMorningMist', type: '晨雾背景', purpose: '柔和背景' },
        { name: 'CardImgFlipCard', type: '翻转卡片', purpose: '联系方式' }
      ],
      fast: [
        { name: 'CardTextBlur', type: '文字动画', purpose: '简洁标题' },
        { name: 'CardImgStatic', type: '静态背景', purpose: '干净背景' }
      ]
    },
    news: {
      visual: [
        { name: 'CardImgCarousel', type: '轮播展示', purpose: '新闻轮播' },
        { name: 'CardTextAurora', type: '极光文字', purpose: '新闻标题' },
        { name: 'CardImgDepth', type: '景深效果', purpose: '新闻卡片' }
      ],
      balanced: [
        { name: 'CardImgMontage', type: '拼贴展示', purpose: '新闻网格' },
        { name: 'CardTextBioluminescent', type: '生物发光', purpose: '重点新闻' },
        { name: 'CardImgFlipCard', type: '翻转卡片', purpose: '新闻摘要' }
      ],
      fast: [
        { name: 'CardImgBloom', type: '绽放卡片', purpose: '基础列表' },
        { name: 'CardTextBlur', type: '文字动画', purpose: '简洁标题' }
      ]
    },
    partners: {
      visual: [
        { name: 'CardImgGalaxy', type: '星系布局', purpose: '合作伙伴星系' },
        { name: 'CardImgVortex', type: '漩涡效果', purpose: '合作生态' },
        { name: 'CardTextFirework', type: '烟花特效', purpose: '庆祝合作' }
      ],
      balanced: [
        { name: 'CardImgCarousel', type: '轮播展示', purpose: '伙伴轮播' },
        { name: 'CardImgPerspective', type: '透视卡片', purpose: '伙伴层级' },
        { name: 'CardTextAurora', type: '极光文字', purpose: '伙伴名称' }
      ],
      fast: [
        { name: 'CardImgBloom', type: '绽放卡片', purpose: '简洁展示' },
        { name: 'CardImgMirror', type: '镜像展示', purpose: '对称布局' }
      ]
    }
  }
  
  return componentDB[moduleKey]?.[type] || [
    { name: 'CardImgBloom', type: '通用卡片', purpose: '绽放卡片' }
  ]
}

function getColorScheme(style: string) {
  const schemes: any = {
    tech: [
      { role: '主色', hex: '#00FFFF' },
      { role: '辅色', hex: '#FF00FF' },
      { role: '背景', hex: '#000000' },
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

function copySolutionCode() {
  // 复制方案代码到剪贴板
  const code = generateSolutionCode()
  navigator.clipboard.writeText(code).then(() => {
    alert('方案代码已复制到剪贴板！')
  })
}

function viewDetailedCode() {
  // 查看详细实现代码
  alert('详细代码查看功能开发中...')
}

function regenerateSolution() {
  generatedSolutions.value = []
  activeSolution.value = 0
  currentStep.value = 3
}

async function exportSolution() {
  try {
    console.log('📦 开始导出完整方案...')
    
    // 显示加载提示
    const loadingMsg = alert('正在收集组件源码，请稍候...')
    
    // 获取当前选中的方案
    const currentSolution = generatedSolutions.value[activeSolution.value]
    if (!currentSolution) {
      alert('请先生成方案！')
      return
    }
    
    // 收集所有组件名称
    const componentNames = new Set<string>()
    currentSolution.modules.forEach((module: any) => {
      module.components.forEach((comp: any) => {
        componentNames.add(comp.name)
      })
    })
    
    console.log('🔍 需要收集的组件:', Array.from(componentNames))
    
    // 动态加载组件源码
    const componentSources: Record<string, string> = {}
    const failedComponents: string[] = []
    
    for (const compName of componentNames) {
      try {
        // 尝试从 web-list 目录加载组件
        const source = await loadComponentSource(compName)
        if (source) {
          componentSources[compName] = source
          console.log(`✅ 已加载组件: ${compName}`)
        } else {
          failedComponents.push(compName)
          console.warn(`⚠️ 未找到组件: ${compName}`)
        }
      } catch (error) {
        failedComponents.push(compName)
        console.error(`❌ 加载组件失败: ${compName}`, error)
      }
    }
    
    console.log(`📊 成功加载 ${Object.keys(componentSources).length} 个组件`)
    console.log(`⚠️ 失败 ${failedComponents.length} 个组件:`, failedComponents)
    
    // 构建导出数据包
    const exportData = {
      metadata: {
        exportTime: new Date().toISOString(),
        generatorVersion: '1.0.0',
        totalComponents: Object.keys(componentSources).length,
        failedComponents: failedComponents
      },
      requirements: formData,
      solution: currentSolution,
      components: componentSources,
      usage: {
        title: '组件使用说明',
        steps: [
          '1. 解压导出的 ZIP 文件',
          '2. 将 components 文件夹复制到您的项目 src 目录',
          '3. 在 Vue 文件中导入需要的组件',
          '4. 参考 solution.json 中的配置使用组件',
          '',
          '示例代码：',
          '<template>',
          '  <div>',
          '    <ScrollModernCards :data="cardsData" />',
          '  </div>',
          '</template>',
          '',
          '<scr' + 'ipt setup>',
          'import ScrollModernCards from "./components/ScrollModernCards.vue"',
          '',
          'const cardsData = [...] // 您的数据',
          '</scr' + 'ipt>'
        ].join('\n')
      }
    }
    
    // 创建并下载 JSON 文件
    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `website-solution-${currentSolution.name.replace(/\s+/g, '-')}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('✅ 方案导出成功！')
    alert(`✅ 方案导出成功！\n\n包含：\n- 方案配置\n- ${Object.keys(componentSources).length} 个组件源码\n${failedComponents.length > 0 ? `- ${failedComponents.length} 个组件未找到` : ''}`)
    
  } catch (error: any) {
    console.error('❌ 导出失败:', error)
    alert(`导出失败：${error.message}`)
  }
}

// ==================== meoo AI 专用 TXT 导出功能 ====================

/**
 * 生成 meoo AI 专用的开发指令文档（TXT格式）
 */
function generateMeooAIContent(solution: any, form: any): string {
  const timestamp = new Date().toLocaleString('zh-CN')
  
  // 构建图片资源规范
  const imageSpecs = generateImageSpecifications(solution, form)
  
  // 构建动画规范
  const animationSpecs = generateAnimationSpecifications(solution)
  
  // 构建模块详细说明
  const moduleDetails = generateModuleDetails(solution, form)
  
  // 组装完整文档
  const content = `
# 🌐 网站开发方案 - ${solution.name}

> ⚠️ **重要提示**：请严格按照此开发文档生成网站，务必保留文档中推荐的 Unsplash 图片链接，并确保 GSAP 动画效果完整实现。

**生成时间**: ${timestamp}  
**方案类型**: ${form.websiteType} - ${form.industry}  
**企业名称**: ${form.companyName || '未指定'}  
**视觉风格**: ${getVisualStyleName(form.visualStyle)}  
**情感氛围**: ${form.emotions.join('、') || '未指定'}  

---

## 📋 一、项目概述

### 1.1 业务描述
${form.businessDesc}

### 1.2 目标用户
${form.targetAudience || '未指定'}

### 1.3 品牌关键词
${form.brandKeywords || '未指定'}

### 1.4 技术要求
- **目标设备**: ${getDeviceLabel(form.targetDevice)}
- **性能预算**: ${getBudgetLabel(form.budget)}
- **开发周期**: ${form.timeline === 'urgent' ? '紧急（2周内）' : form.timeline === 'normal' ? '正常（1个月）' : '宽松（2个月）'}
- **性能优先级**: ${getPerformanceLabel(form.performancePriority)}

---

## 🎨 二、视觉设计规范

### 2.1 配色方案
${generateColorPalette(solution)}

### 2.2 字体规范
- **主标题字体**: 使用现代无衬线字体（如 Inter、Roboto、思源黑体）
- **正文字体**: 清晰易读的无衬线字体
- **字号层级**: H1(48px) > H2(36px) > H3(28px) > Body(16px) > Small(14px)

### 2.3 间距系统
- **基础单位**: 8px
- **模块间距**: 80px - 120px
- **内边距**: 40px - 60px
- **卡片间距**: 24px - 32px

---

## 🖼️ 三、图片资源规范（Unsplash）

**重要说明**：
- ✅ 所有图片必须使用 Unsplash 高质量图片
- ✅ 图片尺寸要求：宽度至少 1920px，质量参数 q=80
- ✅ 图片主题必须与模块内容匹配
- ✅ 避免使用低分辨率或模糊图片

${imageSpecs}

---

## ✨ 四、动画效果规范

${animationSpecs}

---

## 📦 五、模块详细设计

${moduleDetails}

---

## 🔧 六、技术实现要求

### 6.1 前端框架
- **推荐框架**: React 18+ 或 Vue 3+
- **状态管理**: Zustand (React) 或 Pinia (Vue)
- **路由**: React Router 或 Vue Router
- **样式方案**: Tailwind CSS 或 SCSS

### 6.2 动画库
- **GSAP**: 用于复杂滚动动画和时间轴控制
- **Framer Motion**: 用于组件级过渡动画（React）
- **Three.js**: 如需3D效果时使用

### 6.3 性能优化
- **图片懒加载**: 使用 Intersection Observer API
- **代码分割**: 按路由和组件动态导入
- **缓存策略**: Service Worker + CDN
- **首屏加载**: LCP < 2.5s, FID < 100ms, CLS < 0.1

### 6.4 响应式设计
- **断点设置**: Mobile(<768px), Tablet(768-1024px), Desktop(>1024px)
- **移动端优先**: 确保触摸友好，按钮最小 44x44px
- **横竖屏适配**: 支持屏幕旋转

---

## 📱 七、页面结构建议

${generatePageStructure(solution)}

---

## 🎯 八、核心功能清单

${generateFeatureList(solution)}

---

## 💡 九、开发注意事项

### 9.1 必须实现的功能
1. ✅ 所有模块的响应式布局
2. ✅ 平滑滚动和视差效果
3. ✅ 图片懒加载和渐进式加载
4. ✅ SEO 友好的 HTML 结构
5. ✅ 无障碍访问支持（ARIA 标签）

### 9.2 可选增强功能
- 🌟 深色模式切换
- 🌟 多语言支持（i18n）
- 🌟 在线客服集成
- 🌟 表单验证和提交反馈
- 🌟 社交媒体分享

### 9.3 避免的问题
- ❌ 不要使用过大的图片文件（单张 > 500KB）
- ❌ 不要过度使用动画导致性能问题
- ❌ 不要忽略移动端体验
- ❌ 不要硬编码文本内容

---

## 📊 十、验收标准

### 10.1 视觉效果
- [ ] 配色符合品牌调性
- [ ] 图片清晰且主题相关
- [ ] 动画流畅自然
- [ ] 整体风格统一

### 10.2 功能完整性
- [ ] 所有模块正常显示
- [ ] 交互元素可点击
- [ ] 表单可提交
- [ ] 链接正确跳转

### 10.3 性能指标
- [ ] 首屏加载时间 < 3s
- [ ] 页面总大小 < 2MB
- [ ] Lighthouse 评分 > 90
- [ ] 无明显卡顿

---

## 🚀 十一、交付物清单

1. ✅ 完整的源代码（Git 仓库）
2. ✅ 部署好的在线演示地址
3. ✅ 技术文档和 API 说明
4. ✅ 图片资源清单
5. ✅ 浏览器兼容性测试报告

---

**生成工具**: Meoo Plan 智能方案生成器 v8.1  
**文档版本**: 1.0  
**最后更新**: ${timestamp}

---

> 🎯 **最终提醒**：请严格按照此开发文档生成网站，务必保留文档中推荐的 Unsplash 图片链接，并确保 GSAP 动画效果完整实现。

💬 **提示**：请将此文档发送给 meoo AI，它将基于此规范生成完整的网站代码。
`.trim()
  
  return content
}

/**
 * 生成图片资源规范
 */
function generateImageSpecifications(solution: any, form: any): string {
  const industryImages: Record<string, { theme: string; keywords: string }> = {
    tech: { theme: 'technology', keywords: 'technology,computer,code,ai,digital' },
    healthcare: { theme: 'healthcare', keywords: 'medical,doctor,hospital,health' },
    education: { theme: 'education', keywords: 'education,school,learning,book' },
    finance: { theme: 'finance', keywords: 'finance,money,business,banking' },
    ecommerce: { theme: 'shopping', keywords: 'shopping,product,store,retail' },
    creative: { theme: 'creative', keywords: 'design,art,creative,colorful' },
    food: { theme: 'food', keywords: 'food,restaurant,cooking,cuisine' },
    travel: { theme: 'travel', keywords: 'travel,landscape,nature,adventure' },
    real_estate: { theme: 'architecture', keywords: 'building,architecture,house,interior' },
    default: { theme: 'business', keywords: 'business,office,professional,team' }
  }
  
  const industryKey = form.industry.toLowerCase().replace(/[\s-]/g, '_')
  const imageConfig = industryImages[industryKey] || industryImages.default
  
  let specs = `### 3.1 图片选择原则

**行业主题**: ${imageConfig.theme}  
**关键词**: ${imageConfig.keywords}

**Unsplash 搜索建议**:
- 访问: https://unsplash.com/s/photos/${encodeURIComponent(imageConfig.keywords.split(',')[0])}
- 筛选: 横向图片，高分辨率
- 质量参数: 添加 \`?w=1920&q=80\` 到图片 URL

---

### 3.2 各模块推荐图片

`
  
  // 为每个模块生成具体的图片推荐
  solution.modules.forEach((module: any, index: number) => {
    const moduleImageTheme = getModuleImageTheme(module.key, imageConfig.keywords)
    const imageUrl = `https://source.unsplash.com/1920x1080/?${encodeURIComponent(moduleImageTheme)}&sig=${index}`
    
    specs += `#### ${module.name}
- **推荐主题**: ${moduleImageTheme}
- **图片 URL 示例**: \`${imageUrl}\`
- **实际使用时**: 替换为具体的 Unsplash 图片 ID
- **数量**: ${module.components.length > 3 ? '3-5 张' : '1-2 张'}
- **用途**: ${getImageUsageDescription(module.key)}

`
  })
  
  specs += `### 3.3 图片优化要求

1. **格式选择**:
   - 照片: WebP 或 JPG（质量 80%）
   - 图标/图形: SVG 或 PNG
   - 透明背景: PNG-24

2. **尺寸规范**:
   - Hero 背景图: 1920x1080px (最大 300KB)
   - 卡片配图: 800x600px (最大 150KB)
   - Logo/图标: 按需调整（SVG 优先）
   - 头像: 400x400px (最大 100KB)

3. **加载优化**:
   - 使用懒加载（lazy loading）
   - 提供低分辨率占位图
   - 实现渐进式加载
   - 添加 alt 文本（SEO + 无障碍）
`
  
  return specs
}

/**
 * 根据模块类型获取图片主题
 */
function getModuleImageTheme(moduleKey: string, industryKeywords: string): string {
  const themeMap: Record<string, string> = {
    hero: 'modern,minimal,abstract',
    about: 'team,office,people,working',
    products: 'product,technology,innovation',
    technology: 'tech,code,development,software',
    cases: 'success,achievement,result',
    news: 'news,writing,media,publishing',
    partners: 'partnership,collaboration,handshake',
    contact: 'contact,communication,email'
  }
  
  const baseTheme = themeMap[moduleKey] || 'business,professional'
  return `${baseTheme},${industryKeywords}`
}

/**
 * 获取图片用途描述
 */
function getImageUsageDescription(moduleKey: string): string {
  const descriptions: Record<string, string> = {
    hero: '首屏全屏背景图，营造视觉冲击力，展示品牌核心价值',
    about: '团队照片、办公环境、企业文化展示，增强信任感',
    products: '产品特写、使用场景、功能演示，突出产品优势',
    technology: '技术架构图、代码界面、开发工具，展示技术实力',
    cases: '客户案例成果、前后对比、数据图表，证明专业能力',
    news: '新闻配图、博客封面、文章插图，提升内容吸引力',
    partners: '合作伙伴 Logo、签约仪式、联合活动，展示生态合作',
    contact: '联系方式图标、地图截图、客服形象，方便用户联系'
  }
  
  return descriptions[moduleKey] || '通用业务图片，与模块主题相关'
}

/**
 * 生成动画效果规范
 */
function generateAnimationSpecifications(solution: any): string {
  return `
### 4.1 滚动动画（GSAP ScrollTrigger）

**入场动画**:
- 元素从下方淡入: opacity 0→1, y: 50px→0, duration: 0.8s
- 元素从左侧滑入: x: -100px→0, duration: 0.6s
- 元素缩放出现: scale: 0.8→1, duration: 0.5s

**视差效果**:
- 背景图片: 滚动速度 50% （比前景慢）
- 装饰元素: 滚动速度 150% （比前景快）
- 多层叠加: 创造深度感

**时间轴控制**:
- 使用 GSAP Timeline 串联多个动画
- stagger 延迟: 0.1s - 0.3s
- ease 缓动: power2.out 或 expo.out

### 4.2 交互动画

**悬停效果**:
- 卡片悬浮: translateY(-8px) + box-shadow 增强
- 按钮悬浮: scale(1.05) + 颜色渐变
- 图片悬浮: scale(1.1) + overlay 显示

**点击反馈**:
- 按钮点击: scale(0.95) 快速回弹
- 链接点击: 下划线展开动画
- Tab 切换: 滑块移动 + 内容淡入淡出

### 4.3 页面过渡

**路由切换**:
- 淡入淡出: opacity 0→1, duration: 0.3s
- 滑动切换: x: 100%→0, duration: 0.4s
- 缩放切换: scale: 0.9→1, duration: 0.3s

**加载状态**:
- Skeleton 骨架屏
- Progress bar 进度条
- Spinner 旋转加载器

### 4.4 性能注意事项

- ✅ 使用 will-change 优化动画性能
- ✅ 优先使用 transform 和 opacity（GPU 加速）
- ✅ 避免同时动画过多元素（< 10 个）
- ✅ 移动端减少复杂动画（降级处理）
- ✅ 尊重用户的 prefers-reduced-motion 设置
`
}

/**
 * 生成模块详细说明
 */
function generateModuleDetails(solution: any, form: any): string {
  let details = ''
  
  solution.modules.forEach((module: any, index: number) => {
    details += `### ${index + 1}. ${module.name}\n\n`
    details += `**模块标识**: \`${module.key}\`  \n`
    details += `**组件数量**: ${module.components.length} 个  \n`
    details += `**主要功能**: ${getModuleFunctionDescription(module.key)}\n\n`
    
    details += `**包含组件**:\n\n`
    module.components.forEach((comp: any, compIndex: number) => {
      details += `${compIndex + 1}. **${comp.name}** (${comp.type})\n`
      details += `   - 用途: ${comp.purpose}\n`
      details += `   - 特性: ${comp.features?.join('、') || '标准功能'}\n\n`
    })
    
    details += `**布局建议**:\n`
    details += `- ${getLayoutSuggestion(module.key)}\n\n`
    details += `**交互逻辑**:\n`
    details += `- ${getInteractionLogic(module.key)}\n\n`
    details += '---\n\n'
  })
  
  return details
}

/**
 * 获取模块功能描述
 */
function getModuleFunctionDescription(moduleKey: string): string {
  const descriptions: Record<string, string> = {
    hero: '展示品牌核心价值主张，吸引用户继续浏览',
    about: '介绍企业背景、发展历程、团队实力和价值观',
    products: '展示产品线、服务特色、价格方案和优势对比',
    technology: '展示技术架构、核心能力、专利技术和研发实力',
    cases: '展示成功案例、客户见证、数据统计和成果展示',
    news: '发布企业动态、行业资讯、技术文章和活动信息',
    partners: '展示合作伙伴、生态系统、认证资质和荣誉奖项',
    contact: '提供联系方式、在线留言、地图导航和客服入口'
  }
  
  return descriptions[moduleKey] || '通用功能模块'
}

/**
 * 获取布局建议
 */
function getLayoutSuggestion(moduleKey: string): string {
  const suggestions: Record<string, string> = {
    hero: '全屏高度（100vh），居中对齐，大标题 + CTA 按钮',
    about: '左右分栏布局，左侧文字介绍，右侧图片或视频',
    products: '网格布局（3列桌面 / 2列平板 / 1列手机），卡片式设计',
    technology: '时间轴或流程图形式，步骤化展示',
    cases: '瀑布流或轮播图，支持筛选和分类',
    news: '列表或卡片网格，显示标题、摘要、日期和缩略图',
    partners: 'Logo 墙（自动滚动或静态网格），支持 hover 放大',
    contact: '两栏布局，左侧联系信息，右侧表单'
  }
  
  return suggestions[moduleKey] || '标准模块化布局'
}

/**
 * 获取交互逻辑
 */
function getInteractionLogic(moduleKey: string): string {
  const logics: Record<string, string> = {
    hero: 'CTA 按钮点击跳转到产品页或联系页，滚动指示器引导下滑',
    about: '团队成员卡片点击弹出详细介绍，时间轴节点可展开',
    products: '产品卡片点击查看详情，Tab 切换不同分类，价格计算器',
    technology: '技术栈图标 hover 显示详情，架构图可缩放查看',
    cases: '案例卡片点击打开案例详情，支持图片画廊和前后对比',
    news: '文章卡片点击进入全文，支持搜索和标签筛选',
    partners: 'Logo 点击跳转到合作伙伴网站，hover 显示合作简介',
    contact: '表单实时验证，提交后显示成功消息，地图标记可交互'
  }
  
  return logics[moduleKey] || '标准交互模式'
}

/**
 * 生成页面结构建议
 */
function generatePageStructure(solution: any): string {
  let structure = '```\n'
  structure += '网站首页结构:\n\n'
  structure += '┌─────────────────────────────┐\n'
  structure += '│         Header / Nav         │  ← 固定顶部导航\n'
  structure += '├─────────────────────────────┤\n'
  
  solution.modules.forEach((module: any) => {
    structure += `│     ${module.name.padEnd(27)}│  ← ${module.key}\n`
    structure += '├─────────────────────────────┤\n'
  })
  
  structure += '│         Footer                │  ← 页脚信息\n'
  structure += '└─────────────────────────────┘\n'
  structure += '```\n'
  
  return structure
}

/**
 * 生成功能清单
 */
function generateFeatureList(solution: any): string {
  let features = ''
  
  const commonFeatures = [
    '✅ 响应式导航栏（移动端汉堡菜单）',
    '✅ 平滑滚动（smooth scroll）',
    '✅ 返回顶部按钮',
    '✅ 图片懒加载',
    '✅ SEO 元标签优化',
    '✅ 社交媒体分享按钮',
    '✅ Google Analytics 集成',
    '✅ Cookie 同意弹窗（GDPR 合规）'
  ]
  
  features += '### 通用功能\n\n'
  commonFeatures.forEach(f => features += `${f}\n`)
  features += '\n'
  
  // 根据模块添加特定功能
  solution.modules.forEach((module: any) => {
    const moduleFeatures = getModuleSpecificFeatures(module.key)
    if (moduleFeatures.length > 0) {
      features += `### ${module.name} 特有功能\n\n`
      moduleFeatures.forEach(f => features += `${f}\n`)
      features += '\n'
    }
  })
  
  return features
}

/**
 * 获取模块特定功能
 */
function getModuleSpecificFeatures(moduleKey: string): string[] {
  const featureMap: Record<string, string[]> = {
    hero: [
      '- 动态打字机效果（typewriter effect）',
      '- 粒子背景或视频背景',
      '- 滚动指示器动画'
    ],
    about: [
      '- 团队成员轮播',
      '- 公司数据统计动画（计数器）',
      '- 发展历程时间轴'
    ],
    products: [
      '- 产品筛选和排序',
      '- 价格对比表',
      '- 产品详情模态框'
    ],
    technology: [
      '- 技术栈图标动画',
      '- 交互式架构图',
      '- 代码片段高亮'
    ],
    cases: [
      '- 案例筛选（按行业/类型）',
      '- 前后对比滑块',
      '- 客户评价轮播'
    ],
    news: [
      '- 文章搜索功能',
      '- 标签云',
      '- RSS 订阅'
    ],
    partners: [
      '- Logo 无限滚动',
      '- 合作伙伴分类筛选',
      '- 合作案例链接'
    ],
    contact: [
      '- 表单字段验证',
      '- 地图集成（Google Maps / 高德）',
      '- 在线客服聊天窗口'
    ]
  }
  
  return featureMap[moduleKey] || []
}

/**
 * 获取视觉风格名称
 */
function getVisualStyleName(value: string): string {
  const styles: Record<string, string> = {
    tech: '科技感/未来风',
    nature: '自然/生态风',
    luxury: '高端/奢华风',
    minimal: '简约/现代风',
    creative: '创意/艺术风',
    vintage: '复古/怀旧风'
  }
  return styles[value] || value
}

/**
 * 获取设备标签
 */
function getDeviceLabel(value: string): string {
  const labels: Record<string, string> = {
    mobile: '仅移动端',
    desktop: '仅桌面端',
    both: '响应式（全平台）'
  }
  return labels[value] || value
}

/**
 * 获取预算标签
 */
function getBudgetLabel(value: string): string {
  const labels: Record<string, string> = {
    low: '低预算（精简版）',
    medium: '中等预算（标准版）',
    high: '高预算（高级版）',
    unlimited: '不限预算（旗舰版）'
  }
  return labels[value] || value
}

/**
 * 生成配色方案描述
 */
function generateColorPalette(solution: any): string {
  const palette = solution.colorPalette || {}
  return `
- **主色调**: ${palette.primary || '#667eea'} - 用于主要按钮、链接、强调元素
- **辅助色**: ${palette.secondary || '#764ba2'} - 用于次要按钮、背景装饰
- **强调色**: ${palette.accent || '#f093fb'} - 用于 CTA、通知、特殊标记
- **背景色**: ${palette.background || '#ffffff'} - 页面背景
- **文字色**: ${palette.text || '#333333'} - 正文文字
- **边框色**: ${palette.border || '#e0e0e0'} - 卡片边框、分隔线

**配色原则**:
- 主色占比 60%，辅助色 30%，强调色 10%
- 保持足够的对比度（WCAG AA 标准）
- 深色模式和浅色模式都需适配
`
}

/**
 * 导出为 meoo AI 专用 TXT 格式
 */
async function exportToTxt() {
  try {
    console.log('📝 开始生成 meoo AI 指令文档...')
    
    // 验证表单数据
    if (!validateFormData()) {
      return
    }
    
    // 获取当前选中的方案
    const currentSolution = generatedSolutions.value[activeSolution.value]
    if (!currentSolution) {
      alert('请先生成方案！')
      return
    }
    
    // 生成 meoo AI 格式的内容
    const meooContent = generateMeooAIContent(currentSolution, formData)
    
    // 创建并下载 TXT 文件
    const blob = new Blob([meooContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meoo-ai-instruction-${currentSolution.name.replace(/\s+/g, '-')}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('✅ TXT 方案导出成功！')
    alert(
      `✅ meoo AI 指令文档已导出！\n\n` +
      `文件名: meoo-ai-instruction-*.txt\n\n` +
      `下一步：\n` +
      `1. 打开 meoo AI 平台\n` +
      `2. 上传此 TXT 文件或复制内容粘贴\n` +
      `3. meoo AI 将根据规范生成完整网站代码\n\n` +
      `💡 提示：文档中已包含 Unsplash 图片规范和 GSAP 动画要求`
    )
    
  } catch (error: any) {
    console.error('❌ 导出失败:', error)
    alert(`导出失败：${error.message}`)
  }
}

/**
 * 验证表单数据
 */
function validateFormData(): boolean {
  const requiredFields = [
    { key: 'websiteType', label: '网站类型' },
    { key: 'industry', label: '所属行业' },
    { key: 'businessDesc', label: '核心业务描述' }
  ]
  
  for (const field of requiredFields) {
    if (!formData[field.key as keyof typeof formData]) {
      alert(`请填写必填项：${field.label}`)
      currentStep.value = 0 // 返回第一步
      return false
    }
  }
  
  if (generatedSolutions.value.length === 0) {
    alert('请先生成方案！')
    return false
  }
  
  return true
}

/**
 * 复制到剪贴板
 */
async function copyToClipboard() {
  try {
    // 验证表单数据
    if (!validateFormData()) {
      return
    }
    
    // 获取当前选中的方案
    const currentSolution = generatedSolutions.value[activeSolution.value]
    if (!currentSolution) {
      alert('请先生成方案！')
      return
    }
    
    // 生成 meoo AI 格式的内容
    const meooContent = generateMeooAIContent(currentSolution, formData)
    
    // 复制到剪贴板
    await navigator.clipboard.writeText(meooContent)
    
    console.log('✅ 方案内容已复制到剪贴板！')
    alert(
      `✅ 方案内容已复制到剪贴板！\n\n` +
      `下一步：\n` +
      `1. 打开 meoo AI 平台\n` +
      `2. 在对话框中粘贴（Ctrl+V）\n` +
      `3. 发送消息，meoo AI 将自动生成代码\n\n` +
      `💡 提示：也可以点击"下载 meoo AI 方案"保存为文件`
    )
  } catch (error: any) {
    console.error('❌ 复制失败:', error)
    alert(`复制失败：${error.message}\n\n请使用"下载 meoo AI 方案"按钮`)
  }
}

// 预加载所有组件源码映射
// 使用类型别名避免 Vue 模板解析问题
type ComponentSourcePromise = Promise<string | null>
const componentSourceCache = new Map<string, ComponentSourcePromise>()

// 初始化组件源码加载器
function initComponentLoader() {
  // 扫描 web-list 下所有子目录中的 .vue 文件
  const modules = import.meta.glob('../web-list/*/**/*.vue', { 
    eager: false,
    query: '?raw',
    import: 'default'
  })
  
  console.log('🔍 扫描到的模块数量:', Object.keys(modules).length)
  
  // 建立组件名到加载器的映射
  for (const [modulePath, loader] of Object.entries(modules)) {
    // 提取组件名称（从路径中提取文件夹名或文件名）
    // 例如: ../web-list/card-img/CardImgAbyss/CardImgAbyss.vue -> CardImgAbyss
    const match = modulePath.match(/\/([^/]+)\/\1\.vue$/) || modulePath.match(/\/([^/]+)\.vue$/)
    if (match) {
      const componentName = match[1]
      if (!componentSourceCache.has(componentName)) {
        componentSourceCache.set(componentName, (loader as any)().catch((err: any) => {
          console.warn(`⚠️ 加载组件失败 ${componentName}:`, err.message)
          return null
        }))
      }
    }
  }
  
  console.log(`📚 已初始化 ${componentSourceCache.size} 个组件加载器`)
  console.log('📋 可用组件列表:', Array.from(componentSourceCache.keys()).slice(0, 20).join(', '), '...')
}

// 在现有的 onMounted 中调用初始化
// 找到已有的 onMounted 并添加 initComponentLoader()
const originalOnMounted = onMounted
// 注意：由于 onMounted 已经在前面调用过，我们需要在这里再次调用
setTimeout(() => {
  initComponentLoader()
}, 100)

// 加载组件源码（优化版）
async function loadComponentSource(componentName: string): Promise<string | null> {
  // 从缓存中获取
  if (componentSourceCache.has(componentName)) {
    return await componentSourceCache.get(componentName)!
  }
  
  console.warn(`⚠️ 未找到组件: ${componentName}`)
  return null
}

function generateSolutionCode() {
  // 生成Vue代码
  return `<!-- 自动生成的方案代码 -->\n<template>\n  <div>\n    <!-- 根据方案生成的组件 -->\n  </div>\n</template>`
}
</script>

<style scoped lang="scss">
.solution-generator {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.generator-header {
  max-width: 1200px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  
  .header-content {
    flex: 1;
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: 30px;
  }
  
  .title {
    font-size: 2.5rem;
    color: white;
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 15px;
    
    .icon {
      font-size: 3rem;
    }
  }
  
  .subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    margin: 0;
  }
  
  .header-stats {
    display: flex;
    gap: 30px;
    
    .stat-item {
      text-align: center;
      color: white;
      
      .stat-value {
        display: block;
        font-size: 2.5rem;
        font-weight: bold;
        line-height: 1;
      }
      
      .stat-label {
        display: block;
        font-size: 0.9rem;
        opacity: 0.9;
        margin-top: 5px;
      }
    }
  }
  
  .btn-api-config {
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    color: white;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
    }
    
    .api-status {
      font-size: 1.2rem;
      
      &.configured {
        animation: pulse 2s infinite;
      }
    }
  }
}

.steps-indicator {
  max-width: 1200px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  
  .step-item {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.active {
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      
      .step-circle {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }
      
      .step-label,
      .step-desc {
        color: #333;
      }
    }
    
    &.completed {
      .step-circle {
        background: #4CAF50;
        color: white;
      }
    }
    
    .step-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    
    .step-info {
      flex: 1;
      
      .step-label {
        color: white;
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 3px;
      }
      
      .step-desc {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.85rem;
      }
    }
  }
}

.generator-main {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 40px;
  min-height: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.step-content {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 1.8rem;
  color: #333;
  margin: 0 0 30px;
}

.section-hint {
  color: #666;
  margin: -20px 0 30px;
}

.form-group {
  margin-bottom: 25px;
  
  .form-label {
    display: block;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
    font-size: 1rem;
    
    .label-icon {
      margin-right: 8px;
    }
    
    .required {
      color: #f44336;
      margin-left: 4px;
    }
  }
  
  .form-select,
  .form-input,
  .form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
  
  .form-textarea {
    resize: vertical;
    font-family: inherit;
  }
}

.radio-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  
  .radio-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 15px 20px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    transition: all 0.3s ease;
    text-align: center;
    min-width: 140px;
    
    &:hover {
      border-color: #667eea;
      transform: translateY(-2px);
    }
    
    input[type="radio"] {
      display: none;
    }
    
    .radio-icon {
      font-size: 2rem;
      margin-bottom: 5px;
    }
    
    span:not(.radio-icon) {
      font-weight: 600;
      color: #333;
      font-size: 1rem;
    }
    
    small {
      font-size: 0.8rem;
      color: #999;
      line-height: 1.4;
    }
    
    &:has(input:checked) {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
    }
  }
}

// 优先级滑块样式
.priority-slider {
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  
  .slider-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 0.9rem;
    color: #666;
  }
  
  .slider {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(to right, #f5576c, #667eea, #4CAF50);
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: white;
      border: 3px solid #667eea;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.2);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
    }
    
    &::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: white;
      border: 3px solid #667eea;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.2);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
    }
  }
  
  .slider-value {
    margin-top: 15px;
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
    color: #667eea;
  }
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  
  .style-card {
    padding: 25px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #667eea;
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    
    &.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    }
    
    .style-preview {
      width: 100%;
      height: 80px;
      border-radius: 8px;
      margin-bottom: 15px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .style-icon {
      font-size: 3rem;
      margin-bottom: 15px;
    }
    
    .style-name {
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    
    .style-desc {
      color: #666;
      font-size: 0.95rem;
      margin-bottom: 15px;
    }
    
    .style-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 12px;
      
      .tag {
        padding: 4px 12px;
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
        border-radius: 20px;
        font-size: 0.85rem;
      }
    }
    
    .style-suitable {
      font-size: 0.85rem;
      color: #888;
      padding-top: 12px;
      border-top: 1px dashed #e0e0e0;
      
      strong {
        color: #667eea;
      }
    }
  }
}

// 情感标签样式
.emotion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
  
  .emotion-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: white;
    user-select: none;
    
    &:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }
    
    &.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15));
      
      .emotion-icon {
        transform: scale(1.2);
      }
    }
    
    .emotion-icon {
      font-size: 1.3rem;
      transition: transform 0.3s ease;
    }
    
    .emotion-label {
      font-size: 0.95rem;
      color: #333;
      font-weight: 500;
    }
  }
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  
  .module-card {
    padding: 25px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    
    &:hover {
      border-color: #667eea;
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    
    &.selected {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      
      .module-checkbox {
        background: #667eea;
        color: white;
      }
    }
    
    .module-checkbox {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 30px;
      height: 30px;
      border: 2px solid #e0e0e0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .module-icon {
      font-size: 2.5rem;
      margin-bottom: 15px;
    }
    
    .module-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    
    .module-desc {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 12px;
    }
    
    .module-components {
      margin-top: 12px;
      
      .comp-count {
        display: inline-flex;
        align-items: baseline;
        gap: 4px;
        padding: 6px 14px;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
        border: 1px solid rgba(102, 126, 234, 0.2);
        border-radius: 20px;
        font-size: 0.85rem;
        transition: all 0.3s ease;
        
        strong {
          font-size: 1.4rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .comp-label {
          color: #667eea;
          font-weight: 500;
          font-size: 0.8rem;
        }
      }
    }
    
    &:hover .comp-count {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
    }
    
    // 智能推荐标签
    .module-recommendation {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      
      .badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        animation: badgePulse 2s ease-in-out infinite;
        
        &.recommended {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #fff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

// 预算建议样式
.budget-suggestion {
  margin-top: 15px;
  padding: 15px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  border-left: 4px solid #667eea;
  border-radius: 8px;
  animation: slideIn 0.3s ease-out;
  
  .suggestion-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 0.95rem;
    color: #333;
    
    .icon {
      font-size: 1.2rem;
    }
  }
  
  .suggestion-content {
    p {
      margin: 5px 0;
      font-size: 0.9rem;
      color: #555;
      line-height: 1.6;
      
      strong {
        color: #667eea;
      }
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 快速操作栏
.quick-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  
  .btn-quick {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #fff;
    box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
    }
    
    &.btn-clear {
      background: #f5f5f5;
      color: #666;
      box-shadow: none;
      
      &:hover {
        background: #e0e0e0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

// 选择统计
.selection-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  padding: 15px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  border-left: 4px solid #667eea;
  border-radius: 8px;
  animation: slideIn 0.3s ease-out;
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .stat-label {
      font-size: 0.9rem;
      color: #666;
    }
    
    .stat-value {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      
      &.highlight {
        color: #667eea;
        font-size: 1.3rem;
      }
    }
  }
}

// 组件预览模态框样式
.preview-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease;
}

.preview-modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 2px solid #f0f0f0;
  
  h3 {
    font-size: 1.5rem;
    color: #333;
    margin: 0;
  }
  
  .btn-close {
    width: 36px;
    height: 36px;
    border: none;
    background: #f5f5f5;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: #e0e0e0;
      transform: rotate(90deg);
    }
  }
}

.preview-body {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

.preview-info {
  margin-bottom: 25px;
  
  .info-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    
    .info-label {
      font-weight: 600;
      color: #666;
      min-width: 80px;
    }
    
    .info-value {
      color: #333;
      font-size: 1rem;
    }
  }
}

.preview-demo {
  .demo-placeholder {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
    border: 2px dashed #667eea;
    border-radius: 12px;
    padding: 60px 40px;
    text-align: center;
    
    .placeholder-icon {
      font-size: 4rem;
      margin-bottom: 20px;
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    
    .placeholder-text {
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
      margin: 0 0 10px;
    }
    
    .placeholder-hint {
      font-size: 0.95rem;
      color: #666;
      margin: 0 0 30px;
    }
    
    .demo-features {
      text-align: left;
      max-width: 400px;
      margin: 0 auto;
      
      h4 {
        font-size: 1.1rem;
        color: #333;
        margin: 0 0 15px;
      }
      
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          padding: 10px 15px;
          background: white;
          border-radius: 8px;
          margin-bottom: 8px;
          color: #555;
          font-size: 0.95rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
}

.preview-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding: 20px 30px;
  border-top: 2px solid #f0f0f0;
  background: #fafafa;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #f0f0f0;
  
  .export-buttons {
    display: flex;
    gap: 15px;
  }
}

.btn {
  padding: 14px 32px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.btn-prev {
    background: #f5f5f5;
    color: #666;
    
    &:hover:not(:disabled) {
      background: #e0e0e0;
    }
  }
  
  &.btn-next {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
  }
  
  &.btn-generate {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
    font-size: 1.1rem;
    padding: 16px 40px;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(245, 87, 108, 0.4);
    }
  }
  
  &.btn-primary {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
  }
  
  &.btn-secondary {
    background: #f5f5f5;
    color: #333;
    
    &:hover {
      background: #e0e0e0;
    }
  }
  
  &.btn-outline {
    background: transparent;
    border: 2px solid #667eea;
    color: #667eea;
    
    &:hover {
      background: rgba(102, 126, 234, 0.1);
    }
  }
  
  &.btn-export {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(76, 175, 80, 0.4);
    }
  }
  
  &.btn-copy {
    background: linear-gradient(135deg, #FF9800, #F57C00);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(255, 152, 0, 0.4);
    }
  }
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.empty-state,
.generating-state {
  text-align: center;
  padding: 80px 20px;
  
  .empty-icon {
    font-size: 5rem;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 1.8rem;
    color: #333;
    margin: 0 0 15px;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
}

.loading-animation {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 30px;
  
  .pulse-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid #667eea;
    border-radius: 50%;
    animation: pulse 2s ease-out infinite;
    
    &.delay-1 {
      animation-delay: 0.4s;
    }
    
    &.delay-2 {
      animation-delay: 0.8s;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.solutions-container {
  .solutions-header {
    margin-bottom: 30px;
    
    .section-title {
      margin-bottom: 10px;
    }
    
    .solutions-subtitle {
      color: #666;
      margin: 0;
    }
  }
}

.solutions-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
  
  .tab-btn {
    padding: 15px 25px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
    
    &:hover {
      border-color: #667eea;
    }
    
    &.active {
      border-color: #667eea;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    }
    
    .tab-icon {
      font-size: 1.5rem;
    }
    
    .tab-name {
      font-weight: 600;
      color: #333;
    }
    
    .tab-badge {
      padding: 4px 12px;
      background: #667eea;
      color: white;
      border-radius: 20px;
      font-size: 0.85rem;
    }
  }
}

.solution-detail {
  .solution-content {
    .solution-overview {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
      
      h3 {
        font-size: 1.8rem;
        color: #333;
        margin: 0 0 15px;
      }
      
      .overview-desc {
        color: #666;
        font-size: 1.1rem;
        line-height: 1.6;
        margin: 0 0 20px;
      }
      
      .solution-meta {
        display: flex;
        gap: 30px;
        flex-wrap: wrap;
        
        .meta-item {
          .meta-label {
            display: block;
            color: #999;
            font-size: 0.9rem;
            margin-bottom: 8px;
          }
          
          .stars {
            display: flex;
            gap: 5px;
            
            .star {
              font-size: 1.5rem;
              opacity: 0.3;
              
              &.active {
                opacity: 1;
              }
            }
          }
          
          .complexity,
          .time {
            font-size: 1.2rem;
            font-weight: 600;
            color: #667eea;
          }
        }
      }
    }
    
    .recommendation-reason {
      margin-bottom: 30px;
      
      h4 {
        font-size: 1.3rem;
        color: #333;
        margin: 0 0 15px;
      }
      
      .reason-list {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          padding: 12px 20px;
          background: #f9f9f9;
          border-left: 4px solid #667eea;
          margin-bottom: 10px;
          border-radius: 4px;
          color: #555;
          line-height: 1.6;
        }
      }
    }
    
    .module-solutions {
      margin-bottom: 30px;
      
      h4 {
        font-size: 1.3rem;
        color: #333;
        margin: 0 0 20px;
      }
      
      .module-solution-card {
        background: white;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        padding: 25px;
        margin-bottom: 20px;
        
        .module-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          
          .module-icon {
            font-size: 2rem;
          }
          
          h5 {
            font-size: 1.2rem;
            color: #333;
            margin: 0;
          }
        }
        
        .module-components {
          display: flex;
          flex-direction: column;
          gap: 12px;
          
          .component-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 8px;
            transition: all 0.3s ease;
            
            &:hover {
              background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
              transform: translateX(5px);
            }
            
            .comp-badge {
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.85rem;
              font-weight: 700;
              margin-right: 12px;
              flex-shrink: 0;
            }
            
            .comp-info {
              display: flex;
              align-items: center;
              gap: 12px;
              flex: 1;
              
              .comp-name {
                font-weight: 600;
                color: #333;
              }
              
              .comp-type {
                padding: 4px 10px;
                background: rgba(102, 126, 234, 0.1);
                color: #667eea;
                border-radius: 4px;
                font-size: 0.85rem;
              }
            }
            
            .comp-purpose {
              color: #666;
              font-size: 0.95rem;
              text-align: right;
            }
            
            .btn-preview {
              width: 36px;
              height: 36px;
              border: none;
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              border-radius: 8px;
              font-size: 1.1rem;
              cursor: pointer;
              transition: all 0.3s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 12px;
              flex-shrink: 0;
              
              &:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
              }
              
              &:active {
                transform: scale(0.95);
              }
            }
          }
        }
      }
    }
    
    .color-scheme {
      margin-bottom: 30px;
      
      h4 {
        font-size: 1.3rem;
        color: #333;
        margin: 0 0 20px;
      }
      
      .color-palette {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        
        .color-item {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .color-box {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            border: 2px solid #e0e0e0;
          }
          
          .color-info {
            display: flex;
            flex-direction: column;
            
            .color-role {
              font-weight: 600;
              color: #333;
              margin-bottom: 4px;
            }
            
            .color-hex {
              color: #666;
              font-size: 0.9rem;
              font-family: monospace;
            }
          }
        }
      }
    }
    
    .solution-actions {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      justify-content: center;
    }
  }
}

// API配置模态框样式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 25px 30px;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 1.5rem;
    color: #333;
    margin: 0;
  }
  
  .modal-close {
    width: 36px;
    height: 36px;
    border: none;
    background: #f5f5f5;
    border-radius: 50%;
    font-size: 1.8rem;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    
    &:hover {
      background: #e0e0e0;
      color: #333;
      transform: rotate(90deg);
    }
  }
}

.modal-body {
  padding: 30px;
  
  .config-info {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 25px;
    border-left: 4px solid #667eea;
    
    p {
      margin: 8px 0;
      color: #555;
      line-height: 1.6;
      
      &:first-child {
        margin-top: 0;
      }
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .form-hint {
    font-size: 0.85rem;
    color: #999;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .api-links {
    margin-top: 25px;
    padding-top: 25px;
    border-top: 2px solid #f0f0f0;
    
    h4 {
      font-size: 1.1rem;
      color: #333;
      margin: 0 0 15px;
    }
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 10px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        a {
          color: #667eea;
          text-decoration: none;
          transition: all 0.3s ease;
          
          &:hover {
            color: #764ba2;
            text-decoration: underline;
          }
        }
      }
    }
  }
}

.modal-footer {
  padding: 20px 30px;
  border-top: 2px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .generator-header {
    flex-direction: column;
    text-align: center;
    
    .header-stats {
      justify-content: center;
    }
  }
  
  .steps-indicator {
    flex-direction: column;
  }
  
  .style-grid,
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
    
    .btn {
      width: 100%;
    }
  }
  
  .solutions-tabs {
    flex-direction: column;
  }
}
</style>
