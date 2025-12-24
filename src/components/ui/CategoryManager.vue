<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import {
  Briefcase,
  Sparkles,
  Dumbbell,
  Rocket,
  Heart,
  DollarSign,
  Plus,
  X,
  Edit2,
  Trash2,
  Coffee,
  Book,
  Music,
  Plane,
  ShoppingCart,
  Home,
  Car,
  Laptop,
  Camera,
  Pizza,
  Gift,
  Star,
  Zap,
  Target,
  ChartBarStacked,
} from 'lucide-vue-next'

const emit = defineEmits(['update-categories'])
const toast = useToast()

const availableIcons = [
  { name: 'Briefcase', component: Briefcase },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Dumbbell', component: Dumbbell },
  { name: 'Rocket', component: Rocket },
  { name: 'Heart', component: Heart },
  { name: 'DollarSign', component: DollarSign },
  { name: 'Coffee', component: Coffee },
  { name: 'Book', component: Book },
  { name: 'Music', component: Music },
  { name: 'Plane', component: Plane },
  { name: 'ShoppingCart', component: ShoppingCart },
  { name: 'Home', component: Home },
  { name: 'Car', component: Car },
  { name: 'Laptop', component: Laptop },
  { name: 'Camera', component: Camera },
  { name: 'Pizza', component: Pizza },
  { name: 'Gift', component: Gift },
  { name: 'Star', component: Star },
  { name: 'Zap', component: Zap },
  { name: 'Target', component: Target },
]

const defaultCategories = [
  { value: 'work', label: 'Work', icon: 'Briefcase', isDefault: true },
  { value: 'personal', label: 'Personal', icon: 'Sparkles', isDefault: true },
  { value: 'health', label: 'Health & Fitness', icon: 'Dumbbell', isDefault: true },
  { value: 'learning', label: 'Learning', icon: 'Rocket', isDefault: true },
  { value: 'social', label: 'Social & Family', icon: 'Heart', isDefault: true },
  { value: 'finance', label: 'Finance', icon: 'DollarSign', isDefault: true },
]

const categories = ref([])
const showAddModal = ref(false)
const showIconPicker = ref(false)
const newCategory = ref({ label: '', icon: 'Star' })
const editingCategory = ref(null)

const loadCategories = () => {
  const stored = localStorage.getItem('customCategories')
  if (stored) {
    try {
      categories.value = JSON.parse(stored)
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      categories.value = [...defaultCategories]
    }
  } else {
    categories.value = [...defaultCategories]
  }
}

const saveCategories = () => {
  localStorage.setItem('customCategories', JSON.stringify(categories.value))
  emit('update-categories', categories.value)
}

const getIconComponent = (iconName) => {
  const icon = availableIcons.find((i) => i.name === iconName)
  return icon ? icon.component : Star
}

const addCategory = () => {
  if (!newCategory.value.label.trim()) {
    toast.error('Please enter a category name')
    return
  }

  const value = newCategory.value.label.toLowerCase().replace(/\s+/g, '-')

  if (categories.value.some((c) => c.value === value)) {
    toast.error('Category already exists')
    return
  }

  categories.value.push({
    value,
    label: newCategory.value.label.trim(),
    icon: newCategory.value.icon,
    isDefault: false,
  })

  saveCategories()
  toast.success(`"${newCategory.value.label}" added successfully!`)

  newCategory.value = { label: '', icon: 'Star' }
  showAddModal.value = false
}

const deleteCategory = (category) => {
  if (category.isDefault) {
    toast.error('Cannot delete default categories')
    return
  }

  categories.value = categories.value.filter((c) => c.value !== category.value)
  saveCategories()
  toast.success(`"${category.label}" deleted`)
}

const startEdit = (category) => {
  if (category.isDefault) {
    toast.error('Cannot edit default categories')
    return
  }
  editingCategory.value = { ...category }
}

const saveEdit = () => {
  const index = categories.value.findIndex((c) => c.value === editingCategory.value.value)
  if (index !== -1) {
    categories.value[index] = { ...editingCategory.value }
    saveCategories()
    toast.success('Category updated')
  }
  editingCategory.value = null
}

const selectIcon = (iconName) => {
  if (editingCategory.value) {
    editingCategory.value.icon = iconName
  } else {
    newCategory.value.icon = iconName
  }
  showIconPicker.value = false
}

loadCategories()
</script>

<template>
  <div class="category-manager">
    <div class="manager-header">
      <h2 class="text-primary">
        <ChartBarStacked size="32" class="icondetails" />Manage Categories
      </h2>
      <button @click="showAddModal = true" class="add-btn">
        <Plus :size="18" />
        Add Category
      </button>
    </div>

    <div class="categories-list">
      <div v-for="category in categories" :key="category.value" class="category-item bg-card">
        <div class="category-info">
          <component :is="getIconComponent(category.icon)" :size="20" :stroke-width="2" />
          <span class="category-label text-primary">{{ category.label }}</span>
          <span v-if="category.isDefault" class="default-badge">Default</span>
        </div>
        <div class="category-actions">
          <button
            v-if="!category.isDefault"
            @click="startEdit(category)"
            class="action-btn edit-btn"
            title="Edit"
          >
            <Edit2 :size="16" />
          </button>
          <button
            v-if="!category.isDefault"
            @click="deleteCategory(category)"
            class="action-btn delete-btn"
            title="Delete"
          >
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add Category Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="showAddModal = false">
      <div class="modal-content bg-card" @click.stop>
        <div class="modal-header">
          <h3 class="text-primary">Add New Category</h3>
          <button @click="showAddModal = false" class="close-btn">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="text-secondary">Category Name</label>
            <input
              v-model="newCategory.label"
              type="text"
              placeholder="Enter category name"
              class="form-input"
              @keydown.enter="addCategory"
            />
          </div>

          <div class="form-group">
            <label class="text-secondary">Icon</label>
            <button @click="showIconPicker = !showIconPicker" class="icon-picker-btn">
              <component :is="getIconComponent(newCategory.icon)" :size="20" />
              <span>Select Icon</span>
            </button>

            <div v-if="showIconPicker" class="icon-grid">
              <button
                v-for="icon in availableIcons"
                :key="icon.name"
                @click="selectIcon(icon.name)"
                class="icon-option"
                :class="{ selected: newCategory.icon === icon.name }"
              >
                <component :is="icon.component" :size="24" />
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showAddModal = false" class="btn-secondary">Cancel</button>
          <button @click="addCategory" class="btn-primary">Add Category</button>
        </div>
      </div>
    </div>

    <!-- Edit Category Modal -->
    <div v-if="editingCategory" class="modal-overlay" @click="editingCategory = null">
      <div class="modal-content bg-card" @click.stop>
        <div class="modal-header">
          <h3 class="text-primary">Edit Category</h3>
          <button @click="editingCategory = null" class="close-btn">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label class="text-secondary">Category Name</label>
            <input
              v-model="editingCategory.label"
              type="text"
              placeholder="Enter category name"
              class="form-input"
              @keydown.enter="saveEdit"
            />
          </div>

          <div class="form-group">
            <label class="text-secondary">Icon</label>
            <button @click="showIconPicker = !showIconPicker" class="icon-picker-btn">
              <component :is="getIconComponent(editingCategory.icon)" :size="20" />
              <span>Select Icon</span>
            </button>

            <div v-if="showIconPicker" class="icon-grid">
              <button
                v-for="icon in availableIcons"
                :key="icon.name"
                @click="selectIcon(icon.name)"
                class="icon-option"
                :class="{ selected: editingCategory.icon === icon.name }"
              >
                <component :is="icon.component" :size="24" />
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="editingCategory = null" class="btn-secondary">Cancel</button>
          <button @click="saveEdit" class="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-manager {
  padding: 0px 20px;
}
@media (max-width: 480px) {
  .category-manager {
    padding: 0px 10px;
  }
}
.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
@media (max-width: 480px) {
  .manager-header {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 18px;
  }
}
.manager-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}
.icondetails {
  margin-right: 10px;
}
.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: var(--primary-hover);
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.category-item {
  display: flex;
  width: 30%;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
}
@media (max-width: 900px) {
  .category-item {
    width: 48%;
  }
}
@media (max-width: 768px) {
  .category-item {
    width: 100%;
  }
}
.category-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-label {
  font-size: 16px;
  font-weight: 500;
}

.default-badge {
  font-size: 11px;
  padding: 3px 8px;
  background: var(--bg-main);
  border-radius: 12px;
  color: var(--text-secondary);
  font-weight: 600;
}

.category-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  background: var(--bg-main);
  color: var(--text-secondary);
}

.edit-btn:hover {
  background: var(--primary-color);
  color: white;
}

.delete-btn {
  background: var(--bg-main);
  color: var(--text-secondary);
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  border-radius: 16px;
  padding: 24px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--bg-main);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
}

.form-input {
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 15px;
  background: var(--bg-main);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.icon-picker-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--bg-main);
  cursor: pointer;
  transition: all 0.2s;
}

.icon-picker-btn:hover {
  border-color: var(--primary-color);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 12px;
  background: var(--bg-main);
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.icon-option {
  padding: 12px;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-option:hover {
  border-color: var(--primary-color);
}

.icon-option.selected {
  border-color: var(--primary-color);
  background: var(--primary-light, #eff6ff);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  background: var(--bg-main);
  color: var(--text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .icon-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
