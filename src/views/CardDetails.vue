<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PromptClass } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { MdArrowback, MdContentcopy } from 'oh-vue-icons/icons'

addIcons(MdArrowback, MdContentcopy)

const route = useRoute()
const router = useRouter()
const id = Number(route.params.id)

const prompt = ref<PromptClass | null>(null)
const newTags = ref<Record<string, string>>({})

const isTranslated = ref(false)

onMounted(() => {
  // In a real application, you would fetch the data from a store or API
  // This is a mock implementation for demonstration
  prompt.value = new PromptClass(id, 'Título do Card')
})

const categories = computed(() => {
  if (!prompt.value) return []

  return Object.entries(prompt.value.description).map(([key, value]) => ({
    key,
    ...value,
  }))
})

const promptText = computed(() => {
  if (!prompt.value) return ''

  let result = ''

  Object.values(prompt.value.description).forEach((category) => {
    result += category.tags.join(', ') + ', '
  })

  // Remove the last comma and space
  return result.slice(0, -2)
})

function addTag(category: string) {
  if (!prompt.value || !newTags.value[category] || newTags.value[category].trim() === '') return

  const tag = newTags.value[category].trim()
  prompt.value.description[category as keyof typeof prompt.value.description].tags.push(tag)
  newTags.value[category] = ''
}

function removeTag(category: string, tagIndex: number) {
  if (!prompt.value) return

  prompt.value.description[category as keyof typeof prompt.value.description].tags.splice(
    tagIndex,
    1,
  )
}

function copyToClipboard() {
  if (!promptText.value) return

  navigator.clipboard
    .writeText(promptText.value)
    .then(() => {
      alert('Prompt copiado para a área de transferência!')
    })
    .catch(() => {
      alert('Falha ao copiar. Por favor, tente novamente.')
    })
}

function goBack() {
  router.push({ name: 'home' })
}

function handleKeyDown(event: KeyboardEvent, category: string) {
  if (event.key === 'Enter') {
    event.preventDefault()
    addTag(category)
  }
}

function toggleTranslation() {
  isTranslated.value = !isTranslated.value
}

function translateToEnglish(text: string) {
  // Mock de tradução
  return 'Tradução (en): ' + text
}

const displayedPromptText = computed(() => {
  return isTranslated.value ? translateToEnglish(promptText.value) : promptText.value
})
</script>

<template>
  <main class="card-details" v-if="prompt">
    <div class="header">
      <button class="button-item" @click="goBack">
        <OhVueIcon name="md-arrowback" />
        <span>Voltar</span>
      </button>
      <h1>{{ prompt.title }}</h1>
    </div>

    <div class="main-content">
      <div class="categories">
        <div v-for="category in categories" :key="category.key" class="category-container">
          <h2>{{ category.label }}</h2>
          <div class="tag-input">
            <input
              type="text"
              :placeholder="`Adicionar ${category.label.toLowerCase()}`"
              v-model="newTags[category.key]"
              @keydown="(e) => handleKeyDown(e, category.key)"
            />
            <button @click="addTag(category.key)">Adicionar</button>
          </div>
          <div class="tags">
            <span
              v-for="(tag, index) in category.tags"
              :key="index"
              class="tag"
              @click="removeTag(category.key, index)"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <div class="prompt-preview">
        <h2>Preview do Prompt</h2>
        <div class="preview-content">
          {{ displayedPromptText }}
        </div>
        <div class="preview-actions">
          <button class="button-item" @click="copyToClipboard">Copiar Prompt</button>
          <button class="button-item" @click="toggleTranslation">
            {{ isTranslated ? 'Exibir Original' : 'Exibir Traduzido' }}
          </button>
        </div>
      </div>
    </div>
  </main>
  <div v-else class="loading">Carregando...</div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--purple-700);
  border-radius: 8px;
}

::-webkit-scrollbar-track {
  /* background-color: var(--gray-800); */
  background-color: transparent;
  border-radius: 8px;
}

.card-details {
  flex: 1;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--purple-700);
  flex-wrap: wrap;
  gap: 1rem;
}

.header h1 {
  font-weight: 700;
  color: var(--purple-200);
  font-size: 1.75rem;
}

.button-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  background-color: var(--purple-700);
  color: var(--gray-100);
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.button-item:hover {
  background-color: var(--purple-600);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(105, 56, 197, 0.3);
}

.button-item:active {
  transform: translateY(0);
}

.main-content {
  display: grid;
  grid-template-columns: 8fr 10fr;
  gap: 1rem;
  overflow: hidden;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.category-container {
  background-color: var(--gray-800);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.category-container:hover {
  background-color: var(--gray-700);
  box-shadow: 0 8px 20px rgba(105, 56, 197, 0.2);
}

.category-container h2 {
  font-weight: 600;
  color: var(--purple-200);
  margin-bottom: 1rem;
}

.tag-input {
  display: flex;
  margin: 0.5rem 0 1rem;
}

.tag-input input {
  flex: 1;
  background-color: var(--gray-700);
  border: 1px solid var(--purple-700);
  color: var(--gray-100);
  padding: 0.75rem;
  border-radius: 8px 0 0 8px;
  outline: none;
}

.tag-input input:focus {
  border-color: var(--purple-500);
}

.tag-input button {
  background-color: var(--purple-700);
  color: var (--gray-100);
  border: none;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  border-radius: 0 8px 8px 0;
  font-weight: 600;
  transition: all 0.2s ease;
}

.tag-input button:hover {
  background-color: var(--purple-600);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: var(--purple-900);
  color: var (--purple-200);
  padding: 0.4rem 0.75rem 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
}

.tag:hover {
  background-color: var(--purple-700);
  text-decoration: line-through;
}

.prompt-preview {
  display: flex;
  flex-direction: column;

  background-color: var(--gray-800);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  width: 100%;
  overflow: hidden;
}

.prompt-preview:hover {
  background-color: var(--gray-700);
  box-shadow: 0 8px 20px rgba(105, 56, 197, 0.2);
}

.prompt-preview h2 {
  font-weight: 600;
  color: var(--purple-200);
  margin-bottom: 1rem;
}

.preview-content {
  flex: 1;

  background-color: var(--gray-900);
  padding: 1.25rem;
  border-radius: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--gray-100);
  border: 1px solid var(--purple-900);
  overflow-y: auto;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--purple-200);
  font-size: 1.2rem;
  font-weight: 600;
}

/* Animações e transições */
.button-item,
.tag-input button,
.tag {
  transition: all 0.2s ease;
}

.preview-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
</style>
