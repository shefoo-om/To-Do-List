<script setup>
import { ref, watch } from 'vue'
import { Edit2, Check, X } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'

const props = defineProps({
  weekId: {
    type: Number,
    required: true,
  },
  currentName: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-name'])
const toast = useToast()

const isEditing = ref(false)
const editedName = ref(props.currentName)

watch(() => props.currentName, (newName) => {
  editedName.value = newName
})

const startEdit = () => {
  isEditing.value = true
  editedName.value = props.currentName
}

const cancelEdit = () => {
  isEditing.value = false
  editedName.value = props.currentName
}

const saveName = () => {
  const trimmedName = editedName.value.trim()

  if (!trimmedName) {
    toast.error('Week name cannot be empty')
    return
  }

  if (trimmedName === props.currentName) {
    isEditing.value = false
    return
  }

  emit('update-name', { weekId: props.weekId, newName: trimmedName })
  isEditing.value = false
  toast.success('Week name updated!')
}

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    saveName()
  } else if (event.key === 'Escape') {
    cancelEdit()
  }
}
</script>

<template>
  <div class="week-name-editor">
    <div v-if="!isEditing" class="view-mode">
      <span class="week-name text-primary">{{ currentName }}</span>
      <button @click="startEdit" class="edit-btn" title="Edit week name">
        <Edit2 :size="16" />
      </button>
    </div>

    <div v-else class="edit-mode">
      <input
        v-model="editedName"
        type="text"
        class="name-input"
        @keydown="handleKeydown"
        autofocus
        maxlength="50"
      />
      <div class="action-buttons">
        <button @click="saveName" class="save-btn" title="Save">
          <Check :size="16" />
        </button>
        <button @click="cancelEdit" class="cancel-btn" title="Cancel">
          <X :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.week-name-editor {
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-mode {
  display: flex;
  align-items: center;
  gap: 8px;
}

.week-name {
  font-size: 18px;
  font-weight: 600;
  font-style: italic;
  letter-spacing: 0.3px;
}

.edit-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: var(--bg-main);
  color: var(--primary-color);
}

.edit-mode {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.name-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  font-style: italic;
  background: var(--bg-card);
  color: var(--text-primary);
}

.name-input:focus {
  outline: none;
  border-color: var(--primary-hover);
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.save-btn,
.cancel-btn {
  padding: 6px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.save-btn {
  background: var(--primary-color);
  color: white;
}

.save-btn:hover {
  background: var(--primary-hover);
}

.cancel-btn {
  background: var(--bg-main);
  color: var(--text-secondary);
}

.cancel-btn:hover {
  background: #ef4444;
  color: white;
}

@media (max-width: 768px) {
  .week-name {
    font-size: 16px;
  }

  .name-input {
    font-size: 14px;
  }
}
</style>
