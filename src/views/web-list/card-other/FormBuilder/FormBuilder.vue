<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 类型定义 ====================
type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'email'

interface FormField {
  id: number
  type: FieldType
  label: string
  placeholder: string
  required: boolean
  options: string[]
  value: string
}

const fieldTypes: { type: FieldType; icon: string; label: string }[] = [
  { type: 'text', icon: '📝', label: '文本输入' },
  { type: 'textarea', icon: '📄', label: '多行文本' },
  { type: 'number', icon: '🔢', label: '数字' },
  { type: 'email', icon: '📧', label: '邮箱' },
  { type: 'date', icon: '📅', label: '日期' },
  { type: 'select', icon: '📋', label: '下拉选择' },
  { type: 'radio', icon: '🔘', label: '单选' },
  { type: 'checkbox', icon: '☑️', label: '多选' },
]

// ==================== 状态 ====================
let idCounter = 1
const fields = reactive<FormField[]>([])
const selectedFieldId = ref<number | null>(null)
const mode = ref<'edit' | 'preview' | 'json'>('edit')
const dragOverIdx = ref(-1)

const selectedField = computed(() => fields.find((f) => f.id === selectedFieldId.value) || null)

const jsonSchema = computed(() => {
  const properties: Record<string, object> = {}
  const required: string[] = []
  fields.forEach((f) => {
    const key = `field_${f.id}`
    const prop: Record<string, unknown> = { title: f.label }
    if (f.type === 'text' || f.type === 'textarea' || f.type === 'email' || f.type === 'date') {
      prop.type = 'string'
    } else if (f.type === 'number') {
      prop.type = 'number'
    } else if (f.type === 'select' || f.type === 'radio') {
      prop.type = 'string'
      prop.enum = f.options
    } else if (f.type === 'checkbox') {
      prop.type = 'array'
      prop.items = { type: 'string', enum: f.options }
    }
    properties[key] = prop
    if (f.required) {
      required.push(key)
    }
  })
  return JSON.stringify({ type: 'object', properties, required }, null, 2)
})

// ==================== 操作 ====================
function addField(type: FieldType) {
  const field: FormField = {
    id: idCounter++,
    type,
    label: fieldTypes.find((f) => f.type === type)!.label,
    placeholder: '请输入...',
    required: false,
    options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['选项1', '选项2', '选项3'] : [],
    value: '',
  }
  fields.push(field)
  selectedFieldId.value = field.id
}

function removeField(id: number) {
  const idx = fields.findIndex((f) => f.id === id)
  if (idx > -1) {
    fields.splice(idx, 1)
    if (selectedFieldId.value === id) {
      selectedFieldId.value = null
    }
  }
}

function moveField(from: number, to: number) {
  if (from === to || to < 0 || to >= fields.length) {
    return
  }
  const [item] = fields.splice(from, 1)
  fields.splice(to, 0, item)
}

function addOption() {
  if (selectedField.value) {
    selectedField.value.options.push(`选项${selectedField.value.options.length + 1}`)
  }
}

function removeOption(idx: number) {
  if (selectedField.value) {
    selectedField.value.options.splice(idx, 1)
  }
}

// ==================== 拖拽 ====================
function handleDragStart(e: DragEvent, type: FieldType) {
  e.dataTransfer?.setData('fieldType', type)
}

function handleCanvasDragOver(e: DragEvent, idx: number) {
  e.preventDefault()
  dragOverIdx.value = idx
}

function handleCanvasDrop(e: DragEvent, idx: number) {
  e.preventDefault()
  const type = e.dataTransfer?.getData('fieldType') as FieldType
  if (type) {
    const field: FormField = {
      id: idCounter++,
      type,
      label: fieldTypes.find((f) => f.type === type)!.label,
      placeholder: '请输入...',
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['选项1', '选项2', '选项3'] : [],
      value: '',
    }
    fields.splice(idx + 1, 0, field)
    selectedFieldId.value = field.id
  }
  dragOverIdx.value = -1
}

function handleCanvasDragLeave() {
  dragOverIdx.value = -1
}

onMounted(() => {
  // Add some default fields
  addField('text')
  if (fields[0]) {
    fields[0].label = '姓名'
    fields[0].required = true
  }
  addField('email')
  if (fields[1]) {
    fields[1].label = '邮箱'
  }
  addField('select')
  if (fields[2]) {
    fields[2].label = '部门'
    fields[2].options = ['研发部', '产品部', '市场部', '运营部']
  }
  addField('textarea')
  if (fields[3]) {
    fields[3].label = '备注'
  }
  selectedFieldId.value = null

  gsap.fromTo('.form-builder', { opacity: 0 }, { opacity: 1, duration: 0.4 })
})
</script>

<template>
  <div class="form-builder">
    <div class="top-bar">
      <h2>🛠 表单构建器</h2>
      <div class="mode-tabs">
        <button class="mode-btn" :class="{ active: mode === 'edit' }" @click="mode = 'edit'">设计</button>
        <button class="mode-btn" :class="{ active: mode === 'preview' }" @click="mode = 'preview'">预览</button>
        <button class="mode-btn" :class="{ active: mode === 'json' }" @click="mode = 'json'">JSON</button>
      </div>
    </div>

    <div class="main-layout">
      <!-- Left: Field types -->
      <div v-if="mode === 'edit'" class="field-panel">
        <div class="panel-title">字段组件</div>
        <div
          v-for="ft in fieldTypes"
          :key="ft.type"
          class="field-type-item"
          draggable="true"
          @dragstart="handleDragStart($event, ft.type)"
          @click="addField(ft.type)"
        >
          <span class="ft-icon">{{ ft.icon }}</span>
          <span class="ft-label">{{ ft.label }}</span>
        </div>
      </div>

      <!-- Center: Canvas -->
      <div class="canvas-area">
        <!-- Edit mode -->
        <template v-if="mode === 'edit'">
          <div v-if="fields.length === 0" class="empty-hint">
            从左侧拖拽或点击字段组件到此处
          </div>
          <div
            v-for="(field, idx) in fields"
            :key="field.id"
            class="canvas-field"
            :class="{ selected: selectedFieldId === field.id, 'drag-over': dragOverIdx === idx }"
            @click="selectedFieldId = field.id"
            @dragover="handleCanvasDragOver($event, idx)"
            @drop="handleCanvasDrop($event, idx)"
            @dragleave="handleCanvasDragLeave"
          >
            <div class="field-header">
              <span class="field-label">
                {{ field.label }}
                <span v-if="field.required" class="req">*</span>
              </span>
              <div class="field-actions">
                <button v-if="idx > 0" class="fa-btn" @click.stop="moveField(idx, idx - 1)">↑</button>
                <button v-if="idx < fields.length - 1" class="fa-btn" @click.stop="moveField(idx, idx + 1)">↓</button>
                <button class="fa-btn del" @click.stop="removeField(field.id)">✕</button>
              </div>
            </div>
            <div class="field-preview">
              <input v-if="field.type === 'text' || field.type === 'email'" type="text" class="fp-input" :placeholder="field.placeholder" disabled />
              <input v-else-if="field.type === 'number'" type="number" class="fp-input" :placeholder="field.placeholder" disabled />
              <input v-else-if="field.type === 'date'" type="date" class="fp-input" disabled />
              <textarea v-else-if="field.type === 'textarea'" class="fp-textarea" :placeholder="field.placeholder" disabled></textarea>
              <select v-else-if="field.type === 'select'" class="fp-input" disabled>
                <option v-for="(o, oi) in field.options" :key="oi">{{ o }}</option>
              </select>
              <div v-else-if="field.type === 'radio'" class="fp-options">
                <label v-for="(o, oi) in field.options" :key="oi" class="fp-radio">
                  <input type="radio" disabled /> {{ o }}
                </label>
              </div>
              <div v-else-if="field.type === 'checkbox'" class="fp-options">
                <label v-for="(o, oi) in field.options" :key="oi" class="fp-radio">
                  <input type="checkbox" disabled /> {{ o }}
                </label>
              </div>
            </div>
          </div>
          <!-- Drop zone at end -->
          <div
            class="drop-zone"
            :class="{ active: dragOverIdx === fields.length }"
            @dragover.prevent="dragOverIdx = fields.length"
            @drop="handleCanvasDrop($event, fields.length - 1)"
            @dragleave="dragOverIdx = -1"
          >
            拖拽字段到这里
          </div>
        </template>

        <!-- Preview mode -->
        <template v-if="mode === 'preview'">
          <div class="preview-form">
            <h3>表单预览</h3>
            <div v-for="field in fields" :key="field.id" class="pf-field">
              <label class="pf-label">
                {{ field.label }}
                <span v-if="field.required" class="req">*</span>
              </label>
              <input v-if="field.type === 'text' || field.type === 'email'" v-model="field.value" type="text" class="pf-input" :placeholder="field.placeholder" />
              <input v-else-if="field.type === 'number'" v-model="field.value" type="number" class="pf-input" :placeholder="field.placeholder" />
              <input v-else-if="field.type === 'date'" v-model="field.value" type="date" class="pf-input" />
              <textarea v-else-if="field.type === 'textarea'" v-model="field.value" class="pf-textarea" :placeholder="field.placeholder"></textarea>
              <select v-else-if="field.type === 'select'" v-model="field.value" class="pf-input">
                <option value="">请选择</option>
                <option v-for="(o, oi) in field.options" :key="oi" :value="o">{{ o }}</option>
              </select>
              <div v-else-if="field.type === 'radio'" class="pf-options">
                <label v-for="(o, oi) in field.options" :key="oi">
                  <input v-model="field.value" type="radio" :value="o" /> {{ o }}
                </label>
              </div>
              <div v-else-if="field.type === 'checkbox'" class="pf-options">
                <label v-for="(o, oi) in field.options" :key="oi">
                  <input type="checkbox" :value="o" /> {{ o }}
                </label>
              </div>
            </div>
            <button class="submit-btn">提交</button>
          </div>
        </template>

        <!-- JSON mode -->
        <template v-if="mode === 'json'">
          <div class="json-view">
            <div class="json-title">JSON Schema</div>
            <pre class="json-code">{{ jsonSchema }}</pre>
          </div>
        </template>
      </div>

      <!-- Right: Properties panel -->
      <div v-if="mode === 'edit'" class="props-panel">
        <div class="panel-title">属性配置</div>
        <template v-if="selectedField">
          <div class="prop-group">
            <label class="prop-label">标签</label>
            <input v-model="selectedField.label" class="prop-input" />
          </div>
          <div class="prop-group">
            <label class="prop-label">占位符</label>
            <input v-model="selectedField.placeholder" class="prop-input" />
          </div>
          <div class="prop-group">
            <label class="prop-check">
              <input v-model="selectedField.required" type="checkbox" />
              <span>必填</span>
            </label>
          </div>
          <div class="prop-group">
            <label class="prop-label">类型: {{ selectedField.type }}</label>
          </div>
          <template v-if="selectedField.options.length > 0">
            <div class="prop-group">
              <label class="prop-label">选项</label>
              <div v-for="(o, oi) in selectedField.options" :key="oi" class="opt-row">
                <input v-model="selectedField.options[oi]" class="prop-input opt-input" />
                <button class="opt-del" @click="removeOption(oi)">✕</button>
              </div>
              <button class="add-opt-btn" @click="addOption">+ 添加选项</button>
            </div>
          </template>
        </template>
        <div v-else class="no-selection">
          点击字段以编辑属性
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-builder {
  width: 100vw;
  height: 100vh;
  background: #0b1120;
  display: flex;
  flex-direction: column;
  font-family: 'Microsoft YaHei', sans-serif;
  overflow: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}

.top-bar h2 {
  color: #e2e8f0;
  font-size: 18px;
  margin: 0;
}

.mode-tabs {
  display: flex;
  gap: 4px;
}

.mode-btn {
  padding: 5px 16px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}

.mode-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Field panel */
.field-panel {
  width: 180px;
  background: #0f172a;
  border-right: 1px solid #1e293b;
  padding: 12px;
  flex-shrink: 0;
  overflow-y: auto;
}

.panel-title {
  color: #64748b;
  font-size: 11px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.field-type-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: grab;
  transition: all 0.15s;
  color: #94a3b8;
  font-size: 13px;
}

.field-type-item:hover {
  background: #334155;
  color: #e2e8f0;
}

.field-type-item:active {
  cursor: grabbing;
}

.ft-icon {
  font-size: 16px;
}

/* Canvas */
.canvas-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.empty-hint {
  text-align: center;
  color: #334155;
  padding: 60px;
  border: 2px dashed #1e293b;
  border-radius: 12px;
  font-size: 14px;
}

.canvas-field {
  background: #111827;
  border: 1.5px solid #1e293b;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.canvas-field:hover {
  border-color: #334155;
}

.canvas-field.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
}

.canvas-field.drag-over {
  border-color: #10b981;
  border-style: dashed;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.field-label {
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 500;
}

.req {
  color: #ef4444;
}

.field-actions {
  display: flex;
  gap: 4px;
}

.fa-btn {
  width: 22px;
  height: 22px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #64748b;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fa-btn:hover {
  color: #e2e8f0;
}

.fa-btn.del:hover {
  background: #ef4444;
  color: #fff;
}

.fp-input,
.fp-textarea {
  width: 100%;
  background: #0f172a;
  border: 1px solid #1e293b;
  color: #64748b;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 13px;
  box-sizing: border-box;
}

.fp-textarea {
  height: 60px;
  resize: none;
}

.fp-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.fp-radio {
  color: #64748b;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.drop-zone {
  border: 2px dashed #1e293b;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  color: #334155;
  font-size: 13px;
  transition: all 0.15s;
}

.drop-zone.active {
  border-color: #10b981;
  color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

/* Props panel */
.props-panel {
  width: 240px;
  background: #0f172a;
  border-left: 1px solid #1e293b;
  padding: 12px;
  flex-shrink: 0;
  overflow-y: auto;
}

.prop-group {
  margin-bottom: 12px;
}

.prop-label {
  color: #64748b;
  font-size: 11px;
  display: block;
  margin-bottom: 4px;
}

.prop-input {
  width: 100%;
  background: #1e293b;
  border: 1px solid #334155;
  color: #e2e8f0;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}

.prop-check {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
}

.opt-row {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.opt-input {
  flex: 1;
}

.opt-del {
  width: 28px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #64748b;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
}

.opt-del:hover {
  background: #ef4444;
  color: #fff;
}

.add-opt-btn {
  width: 100%;
  padding: 4px;
  background: transparent;
  border: 1px dashed #334155;
  color: #3b82f6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.no-selection {
  color: #334155;
  font-size: 13px;
  text-align: center;
  padding: 20px;
}

/* Preview form */
.preview-form {
  max-width: 500px;
  margin: 0 auto;
}

.preview-form h3 {
  color: #e2e8f0;
  font-size: 18px;
  margin: 0 0 20px;
}

.pf-field {
  margin-bottom: 16px;
}

.pf-label {
  color: #cbd5e1;
  font-size: 13px;
  display: block;
  margin-bottom: 4px;
}

.pf-input,
.pf-textarea {
  width: 100%;
  background: #111827;
  border: 1px solid #1e293b;
  color: #e2e8f0;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
}

.pf-input:focus,
.pf-textarea:focus {
  border-color: #3b82f6;
}

.pf-textarea {
  height: 80px;
  resize: vertical;
}

.pf-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #cbd5e1;
  font-size: 13px;
}

.submit-btn {
  padding: 10px 28px;
  background: #3b82f6;
  border: none;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 12px;
}

/* JSON view */
.json-view {
  padding: 10px;
}

.json-title {
  color: #64748b;
  font-size: 12px;
  margin-bottom: 10px;
}

.json-code {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 16px;
  color: #a5f3fc;
  font-family: 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  overflow: auto;
  white-space: pre;
}
</style>

