<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import { PromptClass } from '@/types'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  MdAddRound,
  MdBookmarkadd,
  MdDeleteTwotone,
  MdContentcopy,
  MdGridview,
  MdViewlist,
} from 'oh-vue-icons/icons'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

addIcons(MdAddRound, MdBookmarkadd, MdDeleteTwotone, MdContentcopy, MdGridview, MdViewlist)

const router = useRouter()
const toast = useToast()

const titleInput = ref<HTMLInputElement | null>(null)
const newTitle = ref('')

const prompts = reactive<Record<number, PromptClass>>({})
const isCreating = ref(false)
const viewMode = ref<'compact' | 'expanded'>('compact')

function onInputUnfocus() {
  isCreating.value = false
  if (titleInput.value?.value) {
    createPrompt(newTitle.value)
    newTitle.value = ''
  }
}

function handleCreateCard() {
  isCreating.value = true
  nextTick(() => {
    titleInput.value?.focus()
  })
}

function createPrompt(title: string) {
  const id = Date.now()
  prompts[id] = new PromptClass(id, title)
}

function navigateToCard(id: number) {
  router.push({ name: 'card-details', params: { id } })
}

function toggleViewMode() {
  viewMode.value = viewMode.value === 'compact' ? 'expanded' : 'compact'
}

function copyPromptText(prompt: PromptClass, event: Event) {
  event.stopPropagation()

  let result = ''
  Object.values(prompt.description).forEach((category) => {
    result += category.tags.join(', ') + ', '
  })

  // Remove the last comma and space
  const promptText = result.slice(0, -2)

  navigator.clipboard.writeText(promptText)
  toast.success('Prompt copiado!')
}

function deletePrompt(id: number) {
  delete prompts[id]
}
</script>

<template>
  <main class="cards-view" :class="viewMode">
    <div class="header">
      <h1>Meus Prompts</h1>
      <div class="buttons">
        <button class="button-item" @click="handleCreateCard">
          <OhVueIcon name="md-add-round" />
          <span>Novo cartão</span>
        </button>
        <button class="button-item view-toggle" @click="toggleViewMode">
          <OhVueIcon :name="viewMode === 'compact' ? 'md-viewlist' : 'md-gridview'" />
          <span>{{ viewMode === 'compact' ? 'Expandir' : 'Compactar' }}</span>
        </button>
      </div>
    </div>

    <div class="cards">
      <div v-if="isCreating" class="card card-creator">
        <div class="card-image">
          <img src="@/assets/example.png" alt="Imagem de exemplo" />
        </div>
        <div class="card-content">
          <input
            class="card-title"
            v-model="newTitle"
            ref="titleInput"
            type="text"
            placeholder="Digite o título..."
            @keyup.enter="onInputUnfocus"
            @focusout="onInputUnfocus"
          />
        </div>
      </div>

      <div
        class="card"
        v-for="prompt in prompts"
        :key="prompt.id"
        @click="navigateToCard(prompt.id)"
      >
        <div class="card-image">
          <img src="@/assets/example.png" alt="Imagem" />
        </div>
        <div class="card-content">
          <div class="card-header">
            <input type="text" readonly class="card-title" :value="prompt.title" />
            <div class="card-actions">
              <button class="icon-button copy" @click="copyPromptText(prompt, $event)">
                <OhVueIcon name="md-contentcopy" />
              </button>
              <button class="icon-button remove" @click.stopPropagation="deletePrompt(prompt.id)">
                <OhVueIcon name="md-delete-twotone" />
              </button>
            </div>
          </div>
          <div v-if="viewMode === 'expanded'" class="card-tags">
            <div v-for="(category, key) in prompt.description" :key="key" class="tag-category">
              <h4>{{ category.label }}</h4>
              <div class="tags">
                <span v-for="(tag, index) in category.tags" :key="index" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.cards-view {
  flex: 1;
  min-height: 100%;
  padding: 1.5rem;

  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header h1 {
  font-weight: 700;
  color: var(--purple-200);
  font-size: 1.75rem;
}

.buttons {
  display: flex;
  gap: 1rem;
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

  &:hover {
    background-color: var(--purple-600);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(105, 56, 197, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.view-toggle {
  background-color: var(--gray-700);

  &:hover {
    background-color: var(--gray-600);
  }
}

.cards {
  display: grid;
  gap: 1.5rem;
  width: 100%;
}

.cards-view.compact .cards {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.cards-view.expanded .cards {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.card {
  background-color: var(--gray-800);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(105, 56, 197, 0.2);
    background-color: var(--gray-700);
  }
}

.cards-view.expanded .card {
  height: auto;
  max-height: 500px;
}

.card-image {
  height: 120px;
  width: 100%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.card-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card-title {
    font-size: 1.1rem;
    font-weight: 600;
    background-color: transparent;
    color: var(--purple-200);
    border: none;
    outline: none;
  }
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--gray-300);
  padding: 0.35rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--purple-700);
    color: var(--gray-100);
  }

  &:active {
    transform: scale(0.95);
  }
}

.card-creator {
  border: 2px outset transparent;
  border-color: var(--purple-500);
  background-color: rgba(105, 56, 197, 0.1);
  font-weight: 600;

  .card-content {
    place-content: center;
  }

  .card-title {
    font-size: 1.1rem;
    font-weight: 600;
    background-color: transparent;
    color: var(--purple-200);
    border: none;
    outline: none;

    caret-color: var(--purple-200);

    &::placeholder {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--purple-200);
    }
  }
}

.card-tags {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  padding-right: 0.5rem;
  max-height: 300px;
}

.tag-category {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h4 {
    font-size: 0.8rem;
    color: var(--purple-300);
    font-weight: 600;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: var(--purple-900);
  color: var(--purple-200);
  padding: 0.4rem 0.5rem 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
}

/* Scrollbar styling */
.card-tags::-webkit-scrollbar {
  width: 6px;
}

.card-tags::-webkit-scrollbar-track {
  background: var(--gray-800);
  border-radius: 3px;
}

.card-tags::-webkit-scrollbar-thumb {
  background: var(--purple-700);
  border-radius: 3px;
}

.card-tags::-webkit-scrollbar-thumb:hover {
  background: var(--purple-600);
}
</style>
