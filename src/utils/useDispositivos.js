export const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

export function formVazio() {
  return {
    id: null,
    numero: '',
    operadora: '',
    modelo: '',
    imei: '',
    dataRetirada: '',
    matricula: '',
    nome: '',
    funcao: '',
    cpf: '',
    estado: '',
    cidade: '',
    dataLiberacao: '',
    termoAssinado: false,
    gmail: '',
    senhagmail: '',
    obs: ''
  }
}

export function formatarTelefone(numero) {
  if (!numero) return '—'
  const n = numero.replace(/\D/g, '')
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
  return numero
}

export function formatarData(data) {
  if (!data) return '—'
  const d = new Date(data + 'T00:00:00')
  return d.toLocaleDateString('pt-BR')
}

export function iniciais(nome) {
  if (!nome) return '?'
  return nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

export function corAvatar(nome) {
  const cores = ['#e30613', '#6292da', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22']
  if (!nome) return cores[0]
  const i = nome.charCodeAt(0) % cores.length
  return cores[i]
}

export function chipOperadora(operadora) {
  const mapa = {
    'Vivo': 'chip-vivo',
    'Claro': 'chip-claro',
    'TIM': 'chip-tim',
    'Oi': 'chip-oi'
  }
  return mapa[operadora] || 'chip-default'
}