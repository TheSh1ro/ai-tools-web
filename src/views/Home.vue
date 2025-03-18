<script setup lang="ts">
import { reactive, ref, nextTick, computed } from 'vue'
import { PromptClass } from '@/types'
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import {
  MdAddRound,
  MdBookmarkadd,
  MdDeleteTwotone,
  MdContentcopy,
  MdGridview,
  MdViewlist,
  MdSearchRound,
  MdNotificationsRound,
  MdEditRound,
  MdFilterlist,
  MdSort,
} from 'oh-vue-icons/icons'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

addIcons(
  MdAddRound,
  MdBookmarkadd,
  MdDeleteTwotone,
  MdContentcopy,
  MdGridview,
  MdViewlist,
  MdSearchRound,
  MdNotificationsRound,
  MdEditRound,
  MdFilterlist,
  MdSort,
)

const router = useRouter()
const toast = useToast()

const titleInput = ref<HTMLInputElement | null>(null)
const newTitle = ref('')
const searchQuery = ref('')
const showConfirmDelete = ref(false)
const promptToDelete = ref<number | null>(null)
const sortBy = ref('date')
const isCreating = ref(false)
const viewMode = ref<'compact' | 'expanded'>('compact')

const prompts = reactive<Record<number, PromptClass>>({})

const filterPrompts = computed(() => {
  const filtered = Object.values(prompts).filter((prompt) =>
    prompt.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )

  if (sortBy.value === 'date') {
    return filtered.sort((a, b) => b.id - a.id)
  } else if (sortBy.value === 'name') {
    return filtered.sort((a, b) => a.title.localeCompare(b.title))
  }

  return filtered
})

const promptCount = computed(() => Object.keys(prompts).length)

function onInputUnfocus() {
  if (titleInput.value?.value) {
    createPrompt(newTitle.value)
    newTitle.value = ''
  }
  isCreating.value = false
}

function handleCreateCard() {
  viewMode.value = 'compact'

  isCreating.value = true
  nextTick(() => {
    titleInput.value?.focus()
  })
}

function createPrompt(title: string) {
  const id = Date.now()
  prompts[id] = new PromptClass(id, title)
  toast.success('Prompt criado com sucesso!')
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

  const promptText = result.slice(0, -2)
  navigator.clipboard.writeText(promptText)
  toast.success('Prompt copiado para a área de transferência!')
}

function confirmDelete(id: number, event: Event) {
  event.stopPropagation()
  promptToDelete.value = id
  showConfirmDelete.value = true
}

function deletePrompt() {
  if (promptToDelete.value) {
    delete prompts[promptToDelete.value]
    toast.success('Prompt excluído com sucesso!')
    showConfirmDelete.value = false
    promptToDelete.value = null
  }
}

function cancelDelete() {
  showConfirmDelete.value = false
  promptToDelete.value = null
}

function changeSortOrder(order: string) {
  sortBy.value = order
}

function addSamplePrompts() {
  const samplePrompt1 = new PromptClass(1, 'Visual alternativo')
  const samplePrompt2 = new PromptClass(2, 'Visual de faculdade')
  const samplePrompt3 = new PromptClass(3, 'Visual de noiva')

  prompts[1] = samplePrompt1
  prompts[2] = samplePrompt2
  prompts[3] = samplePrompt3
}

addSamplePrompts()
</script>

<template>
  <main class="prompt-dashboard">
    <header class="dashboard-header">
      <div class="logo-search">
        <h1>Meus Prompts</h1>
        <div class="search-container">
          <OhVueIcon name="md-search-round" class="search-icon" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar prompts..."
            class="search-input"
          />
        </div>
      </div>

      <div class="header-actions">
        <button class="action-button filter-button">
          <OhVueIcon name="md-filterlist" />
          <span>Filtrar</span>
        </button>

        <div class="sort-dropdown">
          <button class="action-button">
            <OhVueIcon name="md-sort" />
            <span>Ordenar</span>
          </button>
          <div class="dropdown-content">
            <button @click="changeSortOrder('date')" :class="{ active: sortBy === 'date' }">
              Mais recentes
            </button>
            <button @click="changeSortOrder('name')" :class="{ active: sortBy === 'name' }">
              Ordem alfabética
            </button>
          </div>
        </div>

        <button class="action-button view-toggle" @click="toggleViewMode">
          <OhVueIcon :name="viewMode === 'compact' ? 'md-viewlist' : 'md-gridview'" />
          <span>{{ viewMode === 'compact' ? 'Expandir' : 'Compactar' }}</span>
        </button>

        <button class="create-button" @click="handleCreateCard">
          <OhVueIcon name="md-add-round" />
          <span>Novo prompt</span>
        </button>
      </div>
    </header>

    <div class="prompt-stats">
      <div class="stat-card">
        <span class="stat-value">{{ promptCount }}</span>
        <span class="stat-label">Prompts salvos</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">3</span>
        <span class="stat-label">Usados hoje</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">42</span>
        <span class="stat-label">Total de usos</span>
      </div>
    </div>

    <div class="prompt-cards" :class="viewMode">
      <div v-if="isCreating" class="prompt-card create-card">
        <div class="card-image">
          <img src="@/assets/example.png" alt="Imagem de exemplo" />
        </div>
        <div class="card-content">
          <input
            class="card-title-input"
            v-model="newTitle"
            ref="titleInput"
            type="text"
            placeholder="Digite o título do prompt..."
            @keyup.enter="onInputUnfocus"
            @focusout="onInputUnfocus"
          />
        </div>
      </div>

      <div v-if="filterPrompts.length === 0 && !isCreating" class="empty-state">
        <div class="empty-content">
          <OhVueIcon name="md-bookmarkadd" class="empty-icon" />
          <h3>Nenhum prompt encontrado</h3>
          <p>Crie seu primeiro prompt ou tente outra busca</p>
          <button class="create-button" @click="handleCreateCard">
            <OhVueIcon name="md-add-round" />
            <span>Criar novo prompt</span>
          </button>
        </div>
      </div>

      <div
        v-for="prompt in filterPrompts"
        :key="prompt.id"
        class="prompt-card"
        @click="navigateToCard(prompt.id)"
      >
        <div class="card-image">
          <img src="@/assets/example.png" alt="Imagem de capa" />
          <div class="card-badges">
            <span class="badge">IA</span>
          </div>
        </div>

        <div class="card-content">
          <div class="card-header">
            <h3 class="card-title">{{ prompt.title }}</h3>
            <div class="card-actions">
              <button class="icon-button edit" @click.stop>
                <OhVueIcon name="md-edit-round" />
              </button>
              <button class="icon-button copy" @click.stop="copyPromptText(prompt, $event)">
                <OhVueIcon name="md-contentcopy" />
              </button>
              <button class="icon-button delete" @click.stop="confirmDelete(prompt.id, $event)">
                <OhVueIcon name="md-delete-twotone" />
              </button>
            </div>
          </div>

          <div v-if="viewMode === 'expanded'" class="card-description">
            <div v-for="(category, key) in prompt.description" :key="key" class="tag-category">
              <h4>{{ category.label }}</h4>
              <div class="tag-list">
                <span v-for="(tag, index) in category.tags" :key="index" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <span class="usage-count">Copiado 12 vezes</span>
            <span class="last-used">Última vez: hoje</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div class="modal-overlay" v-if="showConfirmDelete">
      <div class="modal-content">
        <h3>Excluir prompt</h3>
        <p>Tem certeza que deseja excluir este prompt? Esta ação não pode ser desfeita.</p>
        <div class="modal-actions">
          <button class="cancel-button" @click="cancelDelete">Cancelar</button>
          <button class="delete-button" @click="deletePrompt">Excluir</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.prompt-dashboard {
  flex: 1;
  min-height: 100vh;
  background-color: var(--gray-900);
  color: var(--gray-100);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--gray-800);
}

.logo-search {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.dashboard-header h1 {
  font-weight: 700;
  color: var(--purple-200);
  font-size: 2rem;
  margin: 0;
}

.search-container {
  position: relative;
  width: 280px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-500);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 8px;
  background-color: var(--gray-800);
  border: 1px solid var(--gray-700);
  color: var(--gray-100);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--purple-500);
  box-shadow: 0 0 0 2px rgba(105, 56, 197, 0.2);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  background-color: var(--gray-800);
  color: var(--gray-300);
  border: 1px solid var(--gray-700);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.action-button:hover {
  background-color: var(--gray-700);
  color: var(--gray-100);
}

.filter-button {
  background-color: var(--gray-800);
}

.view-toggle {
  background-color: var(--gray-800);
}

.create-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  background-color: var(--purple-600);
  color: var(--gray-100);
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.create-button:hover {
  background-color: var(--purple-500);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(105, 56, 197, 0.3);
}

.create-button:active {
  transform: translateY(0);
}

.prompt-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.stat-card {
  background-color: var(--gray-800);
  border-radius: 12px;
  padding: 1.5rem;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid var(--gray-700);
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: var(--purple-500);
  transform: translateY(-2px);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--purple-300);
}

.stat-label {
  color: var(--gray-400);
  font-size: 0.9rem;
}

.prompt-cards {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.prompt-cards.expanded {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.prompt-card {
  background-color: var(--gray-800);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--gray-700);
}

.prompt-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(105, 56, 197, 0.2);
  border-color: var(--purple-500);
}

.card-image {
  height: 140px;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s ease;
}

.card-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.3rem 0.6rem;
  background-color: var(--purple-600);
  color: var(--gray-100);
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.card-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--purple-200);
  margin: 0;
}

.card-title-input {
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: transparent;
  color: var(--purple-200);
  border: none;
  outline: none;
  border-bottom: 2px solid var(--purple-500);
  padding: 0.5rem 0;
}

.card-title-input::placeholder {
  color: var(--purple-400);
  opacity: 0.7;
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
  color: var(--gray-500);
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-button:hover {
  background-color: var(--gray-700);
}

.icon-button.edit:hover {
  color: var(--purple-300);
}

.icon-button.copy:hover {
  color: var(--purple-300);
}

.icon-button.copy:active {
  transform: scale(0.9);
}

.icon-button.delete:hover {
  color: #ff5c5c;
  background-color: rgba(255, 92, 92, 0.1);
}

.card-description {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.tag-category {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tag-category h4 {
  font-size: 0.85rem;
  color: var(--purple-300);
  font-weight: 600;
  margin: 0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: var(--purple-900);
  color: var(--purple-200);
  padding: 0.4rem 0.7rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.tag:hover {
  background-color: var(--purple-700);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-700);
  margin-top: auto;
}

.usage-count,
.last-used {
  font-size: 0.8rem;
  color: var(--gray-400);
}

.create-card {
  border: 2px dashed var(--purple-500);
  background-color: rgba(105, 56, 197, 0.05);
}

.create-card .card-content {
  justify-content: center;
  align-items: center;
}

.create-card .card-title-input {
  text-align: center;
}

.empty-state {
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  color: var(--purple-400);
}

.empty-content h3 {
  font-size: 1.3rem;
  color: var(--purple-200);
  margin: 0;
}

.empty-content p {
  color: var(--gray-400);
  margin: 0;
}

.card-description::-webkit-scrollbar {
  width: 6px;
}

.card-description::-webkit-scrollbar-track {
  background: var(--gray-800);
  border-radius: 3px;
}

.card-description::-webkit-scrollbar-thumb {
  background: var(--purple-700);
  border-radius: 3px;
}

.card-description::-webkit-scrollbar-thumb:hover {
  background: var(--purple-600);
}

.sort-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  min-width: 180px;
  z-index: 1;
  background-color: var(--gray-800);
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  border: 1px solid var(--gray-700);
}

.sort-dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--gray-300);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-content button:hover {
  background-color: var(--gray-700);
  color: var(--gray-100);
}

.dropdown-content button.active {
  background-color: var(--purple-900);
  color: var(--purple-200);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--gray-800);
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  color: var(--purple-200);
  margin-top: 0;
  margin-bottom: 1rem;
}

.modal-content p {
  color: var(--gray-300);
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button {
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  background-color: var(--gray-700);
  color: var(--gray-300);
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background-color: var(--gray-600);
  color: var(--gray-100);
}

.delete-button {
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  background-color: #ff5c5c;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.delete-button:hover {
  background-color: #ff3333;
}

@media (max-width: 768px) {
  .prompt-dashboard {
    padding: 1.5rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .logo-search {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .search-container {
    width: 100%;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .prompt-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-card {
    width: 100%;
  }

  .prompt-cards {
    grid-template-columns: 1fr;
  }
}
</style>
