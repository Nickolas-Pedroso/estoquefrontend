<template>
  <div>
    <!-- TOOLBAR -->
    <div class="toolbar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" v-model="busca" placeholder="Buscar por número, nome, matrícula, IMEI..." />
      </div>
      <select class="filter-select" v-model="filtroOperadora">
        <option value="">Todas as Operadoras</option>
        <option>Claro</option><option>Vivo</option><option>TIM</option>
      </select>
      <select class="filter-select" v-model="filtroTermo">
        <option value="">Todos os Termos</option>
        <option value="sim">Assinado</option>
        <option value="nao">Pendente</option>
      </select>
      <select class="filter-select" v-model="filtroStatus">
        <option value="">Todos Status</option>
        <option value="ativo">Em Uso</option>
        <option value="livre">Disponível</option>
      </select>
      <div class="toolbar-right">
        <button class="btn btn-ghost btn-sm" @click="$emit('toggle-duplicados')">
          {{ mostrarApenasDuplicados ? '✕ Duplicados' : '⚠ Ver Duplicados' }}
        </button>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-wrap">
      <div class="table-head">
        <span class="table-title">Inventário de Celulares</span>
        <span class="badge badge-green">{{ filtrados.length }} registros</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Número / Operadora</th>
            <th>Usuário / Matrícula</th>
            <th>Função · Local</th>
            <th>Modelo / IMEI</th>
            <th>Retirada / Liberação</th>
            <th>Termo</th>
            <th>Gmail</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in paginados" :key="d.id" @click="$emit('ver-detalhe', d)">
            <td>
              <div class="phone-num">
                <span v-if="d.repeticao > 1" class="dup-warn" :title="`${d.repeticao} ocorrências deste número`">{{ d.repeticao }}×</span>
                {{ formatarTelefone(d.numero) }}
              </div>
              <div style="margin-top:4px">
                <span :class="chipOperadora(d.operadora)" class="chip">{{ d.operadora }}</span>
              </div>
            </td>
            <td>
              <div v-if="d.matricula" class="user-cell">
                <div class="avatar" :style="{ background: corAvatar(d.nome) }">{{ iniciais(d.nome) }}</div>
                <div>
                  <div class="user-name">{{ d.nome }}</div>
                  <div class="user-mat">{{ d.matricula }}</div>
                </div>
              </div>
              <span v-else class="badge badge-neutral">Não atribuído</span>
            </td>
            <td>
              <div style="font-size:12px; color: var(--muted2)">{{ d.funcao || '—' }}</div>
              <div style="font-size:11px; color: var(--muted); margin-top:2px">{{ d.cidade ? `${d.cidade} · ${d.estado}` : '—' }}</div>
            </td>
            <td>
              <div style="font-size:13px; font-weight:500">{{ d.modelo }}</div>
              <div class="mono" style="color: var(--muted); margin-top:3px">{{ d.imei ? d.imei.substring(0,8)+'...' : '—' }}</div>
            </td>
            <td>
              <div style="font-size:12px">{{ d.dataRetirada ? formatarData(d.dataRetirada) : '—' }}</div>
              <div v-if="d.dataLiberacao" style="font-size:11px; color:var(--accent); margin-top:2px">Liberado: {{ formatarData(d.dataLiberacao) }}</div>
            </td>
            <td>
              <span :class="d.termoAssinado ? 'badge-green' : 'badge-danger'" class="badge">
                {{ d.termoAssinado ? '✓ Assinado' : '✗ Pendente' }}
              </span>
            </td>
            <td>
              <div v-if="d.gmail" style="font-size:12px; color: var(--muted2)">{{ d.gmail }}</div>
              <span v-else style="font-size:12px; color: var(--muted)">—</span>
            </td>
            <td>
              <div class="action-btns" @click.stop>
                <button class="btn btn-ghost btn-sm btn-icon" @click="$emit('editar', d)" title="Editar">✏️</button>
                <button class="btn btn-danger btn-sm btn-icon" @click="$emit('excluir', d)" title="Excluir">🗑️</button>
              </div>
            </td>
          </tr>
          <tr v-if="filtrados.length === 0">
            <td colspan="8">
              <div class="empty-state">
                <div class="icon">📭</div>
                <p>Nenhum dispositivo encontrado com os filtros aplicados.</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- PAGINATION -->
      <div class="pagination" v-if="totalPaginas > 1">
        <span class="page-info">{{ filtrados.length }} de {{ total }} registros</span>
        <button class="page-btn" @click="pagina = Math.max(1, pagina - 1)">‹</button>
        <button
          v-for="p in totalPaginas" :key="p"
          class="page-btn" :class="{ active: pagina === p }"
          @click="pagina = p"
        >{{ p }}</button>
        <button class="page-btn" @click="pagina = Math.min(totalPaginas, pagina + 1)">›</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { formatarTelefone, formatarData, iniciais, corAvatar, chipOperadora } from '../utils/useDispositivos.js'

const props = defineProps({
  dispositivos: Array,
  mostrarApenasDuplicados: Boolean,
  total: Number,
})

defineEmits(['toggle-duplicados', 'ver-detalhe', 'editar', 'excluir'])

const busca            = ref('')
const filtroOperadora  = ref('')
const filtroTermo      = ref('')
const filtroStatus     = ref('')
const pagina           = ref(1)
const POR_PAGINA       = 8

// Reset página ao filtrar
watch([busca, filtroOperadora, filtroTermo, filtroStatus], () => { pagina.value = 1 })

const filtrados = computed(() => {
  let list = props.dispositivos
  if (busca.value) {
    const q = busca.value.toLowerCase()
    list = list.filter(d =>
      d.numero.includes(q) || d.nome.toLowerCase().includes(q) ||
      d.matricula.toLowerCase().includes(q) || d.imei.includes(q) ||
      d.modelo.toLowerCase().includes(q) || d.gmail.toLowerCase().includes(q)
    )
  }
  if (filtroOperadora.value) list = list.filter(d => d.operadora === filtroOperadora.value)
  if (filtroTermo.value === 'sim') list = list.filter(d => d.termoAssinado)
  if (filtroTermo.value === 'nao') list = list.filter(d => !d.termoAssinado)
  if (filtroStatus.value === 'ativo') list = list.filter(d => d.matricula)
  if (filtroStatus.value === 'livre') list = list.filter(d => !d.matricula)
  if (props.mostrarApenasDuplicados) list = list.filter(d => d.repeticao > 1)
  return list
})

const totalPaginas = computed(() => Math.ceil(filtrados.value.length / POR_PAGINA))
const paginados = computed(() => {
  const start = (pagina.value - 1) * POR_PAGINA
  return filtrados.value.slice(start, start + POR_PAGINA)
})
</script>

<style scoped>
.toolbar {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-box { flex: 1; max-width: 380px; position: relative; }
.search-box input {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 9px 14px 9px 38px;
  color: var(--text);
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}
.search-box input:focus { border-color: var(--accent); }
.search-box input::placeholder { color: var(--muted); }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 15px; }

.filter-select {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 9px 14px;
  color: var(--text);
  font-family: var(--sans);
  font-size: 13px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.filter-select:focus { border-color: var(--accent); }

.toolbar-right { margin-left: auto; display: flex; gap: 8px; }

.table-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.table-head {
  display: flex; align-items: center;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
  gap: 12px;
}

.table-title { font-family: var(--display); font-weight: 700; font-size: 15px; }

table { width: 100%; border-collapse: collapse; }

thead th {
  padding: 10px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--muted);
  background: var(--surface2);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
thead th:first-child { padding-left: 20px; }
thead th:last-child  { padding-right: 20px; }

tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
  cursor: pointer;
}
tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: rgba(255,255,255,0.025); }

tbody td { padding: 12px 16px; font-size: 13px; vertical-align: middle; }
tbody td:first-child { padding-left: 20px; }
tbody td:last-child  { padding-right: 20px; }

.phone-num {
  font-family: var(--mono);
  font-size: 13px; font-weight: 500;
  color: var(--text);
  display: flex; align-items: center; gap: 6px;
}

.dup-warn {
  width: 18px; height: 18px;
  background: rgba(245,158,11,0.15);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: 4px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 10px; color: var(--warn); font-weight: 700; flex-shrink: 0;
}

.user-cell { display: flex; align-items: center; gap: 10px; }

.avatar {
  width: 30px; height: 30px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
  font-family: var(--display);
  flex-shrink: 0; color: #000;
}

.user-name { font-weight: 500; font-size: 13px; }
.user-mat  { font-size: 11px; color: var(--muted2); font-family: var(--mono); }

.action-btns { display: flex; gap: 5px; opacity: 0; transition: opacity 0.15s; }
tbody tr:hover .action-btns { opacity: 1; }

.empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
.empty-state .icon { font-size: 40px; margin-bottom: 12px; }
.empty-state p { font-size: 14px; }

.pagination {
  display: flex; align-items: center; gap: 6px;
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  justify-content: flex-end;
}

.page-btn {
  width: 30px; height: 30px;
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; cursor: pointer;
  border: 1px solid var(--border);
  background: transparent; color: var(--muted2);
  transition: all 0.15s;
  font-family: var(--mono);
}
.page-btn:hover, .page-btn.active {
  border-color: var(--accent); color: var(--accent);
  background: rgba(0,229,160,0.07);
}

.page-info { font-size: 12px; color: var(--muted); margin-right: auto; font-family: var(--mono); }
</style>
