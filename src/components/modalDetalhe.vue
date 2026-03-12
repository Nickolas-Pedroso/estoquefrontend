<template>
  <transition name="fade">
    <div class="modal-overlay" v-if="aberto && dispositivo" @click.self="$emit('fechar')">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-icon">🔍</div>
          <div>
            <div class="modal-title">{{ dispositivo.nome || 'Dispositivo Não Atribuído' }}</div>
            <div class="modal-sub mono">{{ formatarTelefone(dispositivo.numero) }} · {{ dispositivo.operadora }}</div>
          </div>
          <button class="btn btn-ghost btn-sm" @click="$emit('editar', dispositivo)"
            style="margin-left:auto; margin-right:8px">✏️ Editar</button>
          <button class="btn btn-ghost btn-sm btn-icon" @click="$emit('fechar')">✕</button>
        </div>

        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <div class="detail-key">Número</div>
              <div class="detail-val mono">{{ formatarTelefone(dispositivo.numero) }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Operadora</div>
              <div class="detail-val"><span :class="chipOperadora(dispositivo.operadora)" class="chip">{{
                  dispositivo.operadora }}</span></div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Modelo</div>
              <div class="detail-val">{{ dispositivo.modelo || '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-key">IMEI</div>
              <div class="detail-val mono">{{ dispositivo.imei || '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Matrícula RH/TI</div>
              <div class="detail-val mono">{{ dispositivo.matricula || '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Colaborador</div>
              <div class="detail-val">{{ dispositivo.nome || '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Função</div>
              <div class="detail-val">{{ dispositivo.funcao || '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Local</div>
              <div class="detail-val">{{ dispositivo.cidade && dispositivo.estado ? `${dispositivo.cidade} /
                ${dispositivo.estado}` : '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Data de Retirada</div>
              <div class="detail-val">{{ dispositivo.dataRetirada ? formatarData(dispositivo.dataRetirada) : '—' }}
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Data de Liberação</div>
              <div class="detail-val" :style="{ color: dispositivo.dataLiberacao ? 'var(--accent)' : '' }">
                {{ dispositivo.dataLiberacao ? formatarData(dispositivo.dataLiberacao) : '—' }}
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Termo Assinado</div>
              <div class="detail-val">
                <span :class="dispositivo.termoAssinado ? 'badge-green' : 'badge-danger'" class="badge">
                  {{ dispositivo.termoAssinado ? '✓ Assinado' : '✗ Pendente' }}
                </span>
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Duplicidade</div>
              <div class="detail-val">
                <span v-if="dispositivo.repeticao > 1" class="badge badge-warn">⚠ {{ dispositivo.repeticao }}×
                  ocorrências</span>
                <span v-else class="badge badge-green">✓ Único</span>
              </div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Gmail do Aparelho</div>
              <div class="detail-val mono" style="font-size:12px">{{ dispositivo.gmail || '—' }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-key">Senha Gmail</div>
              <div class="detail-val">
                <span v-if="dispositivo.senhagmail">
                  <span v-if="!mostrarSenha">••••••••</span>
                  <span v-else class="mono" style="font-size:12px">{{ dispositivo.senhagmail }}</span>
                  <button class="btn btn-ghost btn-sm" style="margin-left:8px; padding:2px 8px"
                    @click="mostrarSenha = !mostrarSenha">
                    {{ mostrarSenha ? 'Ocultar' : 'Mostrar' }}
                  </button>
                </span>
                <span v-else>—</span>
              </div>
            </div>
          </div>

          <div v-if="dispositivo.obs" class="obs-section">
            <div class="section-label">Observações</div>
            <div class="obs-text">{{ dispositivo.obs }}</div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-ghost" style="margin-left:auto" @click="$emit('fechar')">Fechar</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { formatarTelefone, formatarData, chipOperadora } from '../utils/useDispositivos.js'

const props = defineProps({
  aberto: Boolean,
  dispositivo: Object
})

defineEmits(['fechar', 'editar'])

const mostrarSenha = ref(false)

watch(() => props.aberto, () => {
  mostrarSenha.value = false
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal {
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: 18px;
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
}

.modal-header {
  display: flex;
  align-items: center;
  padding: 22px 28px 20px;
  border-bottom: 1px solid var(--border);
  gap: 14px;
  position: sticky;
  top: 0;
  background: var(--surface);
  z-index: 5;
  border-radius: 18px 18px 0 0;
}

.modal-icon {
  width: 40px;
  height: 40px;
  background: rgba(0, 229, 160, 0.1);
  border: 1px solid rgba(0, 229, 160, 0.2);
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.modal-title {
  font-family: var(--display);
  font-size: 17px;
  font-weight: 700;
}

.modal-sub {
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
}

.modal-body {
  padding: 24px 28px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.detail-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.detail-item:nth-child(odd) {
  padding-right: 20px;
  border-right: 1px solid var(--border);
}

.detail-item:nth-child(even) {
  padding-left: 20px;
}

.detail-key {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 4px;
}

.detail-val {
  font-size: 13px;
  font-weight: 500;
}

.section-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-label::before {
  content: '';
  width: 3px;
  height: 12px;
  background: var(--accent);
  border-radius: 2px;
}

.obs-section {
  margin-top: 16px;
}

.obs-text {
  font-size: 13px;
  color: var(--muted2);
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  align-items: center;
  padding: 18px 28px 24px;
  border-top: 1px solid var(--border);
}
</style>
