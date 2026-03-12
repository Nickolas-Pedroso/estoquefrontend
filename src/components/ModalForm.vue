<template>
  <transition name="fade">
    <div class="modal-overlay" v-if="aberto" @click.self="$emit('fechar')">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-icon">📱</div>
          <div>
            <div class="modal-title">{{ edicao ? 'Editar Dispositivo' : 'Novo Dispositivo' }}</div>
            <div class="modal-sub">{{ edicao ? 'Atualize as informações do aparelho' : 'Preencha os dados do novo celular' }}</div>
          </div>
          <button class="btn btn-ghost btn-sm btn-icon modal-close" @click="$emit('fechar')">✕</button>
        </div>

        <div class="modal-body">
          <!-- ALERTA DUPLICADO -->
          <div class="warn-box" v-if="numeroDuplicado">
            ⚠️ <span>Este número já existe no sistema ({{ contarDups }} ocorrências). Isso pode dificultar a identificação do responsável. Verifique antes de salvar.</span>
          </div>

          <!-- LINHA E APARELHO -->
          <div class="section-label">Informações da Linha e Aparelho</div>
          <div class="form-grid cols3">
            <div class="form-field">
              <label>Número do Celular *</label>
              <input type="text" v-model="form.numero" placeholder="(11) 99999-9999" @input="validarNumero" class="mono-input" maxlength="15" />
            </div>
            <div class="form-field">
              <label>Operadora *</label>
              <select v-model="form.operadora">
                <option value="">Selecione...</option>
                <option>Claro</option><option>Vivo</option><option>TIM</option><option>Outro</option>
              </select>
            </div>
            <div class="form-field">
              <label>Modelo do Aparelho *</label>
              <input type="text" v-model="form.modelo" placeholder="Ex: iPhone 14, Samsung A54" />
            </div>
            <div class="form-field span2">
              <label>IMEI</label>
              <input type="text" v-model="form.imei" placeholder="15 dígitos" class="mono-input" maxlength="17" />
            </div>
            <div class="form-field">
              <label>Data de Retirada</label>
              <input type="date" v-model="form.dataRetirada" max="2099-12-31" min="2018-01-01" @blur="validarData('dataRetirada')"/>
            </div>
          </div>

          <!-- USUÁRIO -->
          <div class="section-label">Usuário Responsável</div>
          <div class="info-box">
            ℹ️ <span>Por segurança, utilize a Matrícula RH/TI como identificador principal. Evite armazenar CPF quando possível.</span>
          </div>
          <div class="form-grid">
            <div class="form-field">
              <label>Matrícula RH/TI</label>
              <input type="text" v-model="form.matricula" placeholder="Ex: RH-004512" class="mono-input" maxlength="8" />
            </div>
            <div class="form-field">
              <label>Nome Completo</label>
              <input type="text" v-model="form.nome" placeholder="Nome do colaborador" maxlength="40" />
            </div>
            <div class="form-field">
              <label>Função na Empresa</label>
              <input type="text" v-model="form.funcao" placeholder="Ex: Analista, Gerente..." maxlength="40" />
            </div>
            <div class="form-field">
              <label>CPF <span class="cpf-warn">(Opcional -  prefira matrícula)</span></label>
              <input type="text" v-model="form.cpf" placeholder="000.000.000-00" class="mono-input" maxlength="14" @input="formatarCPF" />
              <span class="campo-erro" v-if="form.cpf && !cpfValido">CPF inválido</span>
            </div>
            <div class="form-field">
              <label>Estado de Atuação</label>
              <select v-model="form.estado">
                <option value="">Selecione...</option>
                <option v-for="uf in ESTADOS" :key="uf">{{ uf }}</option>
              </select>
            </div>
            <div class="form-field">
              <label>Cidade de Atuação</label>
              <input type="text" v-model="form.cidade" placeholder="Cidade" maxlength="30" />
            </div>
          </div>

          <!-- LIBERAÇÃO -->
          <div class="section-label">Status e Liberação</div>
          <div class="form-grid cols3">
            <div class="form-field">
              <label>Data de Liberação</label>
              <input type="date" v-model="form.dataLiberacao" max="2099-12-31" min="2018-01-01" @blur="validarData('dataLiberacao')"/>
            </div>
            <div class="form-field">
              <label>Termo de Responsabilidade</label>
              <div class="toggle-wrap">
                <button class="toggle" :class="{ on: form.termoAssinado }" @click="form.termoAssinado = !form.termoAssinado"></button>
                <span class="toggle-label">{{ form.termoAssinado ? '✓ Assinado' : 'Pendente' }}</span>
              </div>
            </div>
          </div>

          <!-- CREDENCIAIS -->
          <div class="section-label">Credenciais Google (Aparelho)</div>
          <div class="form-grid">
            <div class="form-field">
              <label>Gmail do Aparelho</label>
              <input type="email" v-model="form.gmail" placeholder="dispositivo@empresa.com" maxlength="30"/>
            </div>
            <div class="form-field">
              <label>Senha do Gmail</label>
              <div class="pass-wrap">
                <input :type="mostrarSenha ? 'text' : 'password'" v-model="form.senhagmail" placeholder="••••••••" />
                <button class="pass-eye" @click="mostrarSenha = !mostrarSenha">{{ mostrarSenha ? 'Ocultar' : 'Mostrar' }}</button>
              </div>
            </div>
          </div>

          <!-- OBS -->
          <div class="section-label">Observações</div>
          <div class="form-field">
            <textarea v-model="form.obs" placeholder="Informações adicionais, histórico, problemas registrados..."></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <span v-if="edicao" class="id-label">ID: {{ form.id }}</span>
          <div class="footer-right">
            <button class="btn btn-ghost" @click="$emit('fechar')">Cancelar</button>
            <button class="btn btn-primary" @click="salvar">
              {{ edicao ? '✓ Salvar Alterações' : '+ Cadastrar Dispositivo' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ESTADOS, formVazio, formatarTelefone } from '../utils/useDispositivos.js'

const props = defineProps({
  aberto: Boolean,
  edicao: Object,
  contarDuplicados: Function,
})

const emit = defineEmits(['fechar', 'salvar'])

const form = ref(formVazio())
const mostrarSenha = ref(false)

// preenche o formulario se for edição

watch(() => props.aberto, (aberto) => {
  if (aberto) {
    if (props.edicao) {
      form.value = { ...props.edicao }
    } else {
      form.value = formVazio()
    }
    mostrarSenha.value = false
  }
}, { immediate: true })

const numeroDuplicado = computed(() => {
  if (!form.value.numero) return false
  return props.contarDuplicados(form.value.numero, form.value.id) > 0
})

const contarDups = computed(() => {
  if (!props.contarDuplicados) return 0
  return props.contarDuplicados(form.value.numero, form.value.id)
})

function validarNumero() {
  const apenasDigitos = form.value.numero.replace(/\D/g, '').slice(0, 11)
  let v = apenasDigitos
  if (v.length > 10) {
    v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`
  } else if (v.length > 6) {
    v = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`
  } else if (v.length > 2) {
    v = `(${v.slice(0,2)}) ${v.slice(2)}`
  } else if (v.length > 0) {
    v = `(${v}`
  }
  form.value.numero = v
}

function salvar() {
  emit('salvar', { ...form.value })
}

function validarData(campo) {
  const valor = form.value[campo]
  if (!valor) return
  const ano = parseInt(valor.split('-')[0])
  if (ano < 2000 || ano > 2099) {
    form.value[campo] = ''
  }
}

// Formata CPF enquanto digita (000.000.000-00)
function formatarCPF() {
  let v = form.value.cpf.replace(/\D/g, '').slice(0, 11)
  if (v.length > 9) {
    v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
  } else if (v.length > 6) {
    v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
  } else if (v.length > 3) {
    v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2')
  }
  form.value.cpf = v
}

// Valida se o CPF é matematicamente correto
const cpfValido = computed(() => {
  const cpf = form.value.cpf.replace(/\D/g, '')
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false // ex: 111.111.111-11

  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i)
  let resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpf[9])) return false

  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i)
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  return resto === parseInt(cpf[10])
})
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.campo-erro {
  font-size: 11px;
  color: var(--danger);
  margin-top: 2px;
}
.modal {
  background: var(--surface);
  border: 1px solid var(--border2);
  border-radius: 18px;
  width: 100%; max-width: 820px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6);
}

.modal-header {
  display: flex; align-items: center;
  padding: 22px 28px 20px;
  border-bottom: 1px solid var(--border);
  gap: 14px;
  position: sticky; top: 0;
  background: var(--surface);
  z-index: 5;
  border-radius: 18px 18px 0 0;
}

.modal-icon {
  width: 40px; height: 40px;
  background: rgba(0,229,160,0.1);
  border: 1px solid rgba(0,229,160,0.2);
  border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}

.modal-title { font-family: var(--display); font-size: 17px; font-weight: 700; }
.modal-sub   { font-size: 12px; color: var(--muted); margin-top: 2px; }
.modal-close { margin-left: auto; }

.modal-body { padding: 24px 28px; }

.section-label {
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--muted);
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 8px;
}
.section-label::before {
  content: '';
  width: 3px; height: 12px;
  background: var(--accent);
  border-radius: 2px;
}

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 24px; }
.form-grid.cols3 { grid-template-columns: 1fr 1fr 1fr; }
.span2 { grid-column: span 2; }

.form-field { display: flex; flex-direction: column; gap: 6px; }

label {
  font-size: 11px; font-weight: 500;
  color: var(--muted2);
  text-transform: uppercase; letter-spacing: 0.06em;
}

.cpf-warn { color: var(--warn); font-size: 10px; text-transform: none; letter-spacing: 0; }

.warn-box {
  background: rgba(245,158,11,0.07);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 12px; color: var(--warn);
  display: flex; align-items: flex-start; gap: 10px;
  margin-bottom: 16px;
}

.info-box {
  background: rgba(59,130,246,0.07);
  border: 1px solid rgba(59,130,246,0.2);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 12px; color: var(--info);
  display: flex; align-items: flex-start; gap: 10px;
  margin-bottom: 16px;
}

.toggle-wrap { display: flex; align-items: center; gap: 10px; margin-top: 6px; }

.toggle {
  position: relative;
  width: 38px; height: 22px;
  background: var(--border2);
  border-radius: 11px;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
  border: none; outline: none;
}
.toggle.on { background: var(--accent); }
.toggle::after {
  content: '';
  position: absolute;
  top: 3px; left: 3px;
  width: 16px; height: 16px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}
.toggle.on::after { transform: translateX(16px); }
.toggle-label { font-size: 13px; color: var(--text); }

.pass-wrap { position: relative; }
.pass-wrap input { padding-right: 40px; }
.pass-eye {
  position: absolute; right: 11px; top: 50%;
  transform: translateY(-50%);
  cursor: pointer; color: var(--muted);
  font-size: 16px;
  transition: color 0.2s;
  background: none; border: none;
}
.pass-eye:hover { color: var(--accent); }

.modal-footer {
  display: flex; align-items: center; gap: 10px;
  padding: 18px 28px 24px;
  border-top: 1px solid var(--border);
}
.id-label { font-size: 12px; color: var(--muted); }
.footer-right { margin-left: auto; display: flex; gap: 10px; }

@media (max-width: 900px) {
  .form-grid, .form-grid.cols3 { grid-template-columns: 1fr; }
  .span2 { grid-column: span 1; }
}
</style>
