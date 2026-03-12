<template>
  <div class="layout">

    <sideBar />

    <div class="main-content">
      <statsGrid
        :totalDevices="dispositivos.length"
        :emUso="dispositivos.filter(d => d.matricula).length"
        :numerosRepetidos="numerosRepetidos"
        :termosPendentes="dispositivos.filter(d => !d.termoAssinado).length"
        :disponiveis="dispositivos.filter(d => !d.matricula).length"
      />
      <dispositivosTable
        :dispositivos="dispositivos"
        @ver-detalhe="abrirDetalhe"
        @editar="abrirEdicao"
        @excluir="excluirDispositivo"
      />
    </div>

    <modalDetalhe
      :aberto="modalDetalheAberto"
      :dispositivo="dispositivoSelecionado"
      @fechar="modalDetalheAberto = false"
      @editar="abrirEdicao"
    />

    <ModalForm
      :aberto="modalFormAberto"
      :edicao="dispositivoEditando"
      :contarDuplicados="contarDuplicados"
      @fechar="modalFormAberto = false"
      @salvar="salvarDispositivo"
    />

    <button class="fab" @click="abrirNovoDispositivo">＋</button>

    <button class="btn-logout" @click="logout">Sair</button>

  </div>
</template>

<script>
import axios from 'axios'
import sideBar from '../components/sideBar.vue'
import statsGrid from '../components/statsGrid.vue'
import dispositivosTable from '../components/dispositivosTable.vue'
import modalDetalhe from '../components/modalDetalhe.vue'
import ModalForm from '../components/ModalForm.vue'

const API = 'http://127.0.0.1:3000/api'

export default {
  name: 'Equipamentos',

  components: {
    sideBar,
    statsGrid,
    dispositivosTable,
    modalDetalhe,
    ModalForm
  },

  data() {
    return {
      dispositivos: [],
      modalDetalheAberto: false,
      modalFormAberto: false,
      dispositivoSelecionado: null,
      dispositivoEditando: null,
      carregando: false
    }
  },

  computed: {
    numerosRepetidos() {
      const contagem = {}
      this.dispositivos.forEach(d => {
        contagem[d.numero] = (contagem[d.numero] || 0) + 1
      })
      return Object.values(contagem).filter(v => v > 1).length
    }
  },

  mounted() {
    const usuario = localStorage.getItem('usuario')
    if (!usuario) {
      this.$router.push('/')
      return
    }
    this.carregarDispositivos()
  },

  methods: {
    async carregarDispositivos() {
      try {
        this.carregando = true
        const response = await axios.get(`${API}/equipamentos`)
        this.dispositivos = response.data.map(d => ({
          id: d.id,
          numero: d.numero,
          operadora: d.operadora,
          modelo: d.modelo,
          imei: d.imei,
          dataRetirada: d.data_retirada ? String(d.data_retirada).split('T')[0] : '',
          matricula: d.matricula,
          nome: d.nome,
          funcao: d.funcao,
          cpf: d.cpf,
          estado: d.estado,
          cidade: d.cidade,
          dataLiberacao: d.data_liberacao ? String(d.data_liberacao).split('T')[0] : '',
          termoAssinado: !!d.termo_assinado,
          gmail: d.gmail,
          senhagmail: d.senhagmail,
          obs: d.obs
        }))
      } catch (error) {
        console.error('Erro ao carregar dispositivos:', error)
        alert('Erro ao carregar dispositivos.')
      } finally {
        this.carregando = false
      }
    },

    contarDuplicados(numero) {
      if (!numero) return 0
      return this.dispositivos.filter(d => d.numero === numero).length
    },

    abrirDetalhe(dispositivo) {
      this.dispositivoSelecionado = dispositivo
      this.modalDetalheAberto = true
    },

    abrirEdicao(dispositivo) {
      this.dispositivoEditando = dispositivo
      this.modalFormAberto = true
      this.modalDetalheAberto = false
    },

    abrirNovoDispositivo() {
      this.dispositivoEditando = null
      this.modalFormAberto = true
    },

    async salvarDispositivo(dados) {
      try {
        if (dados.id) {
          await axios.put(`${API}/equipamentos/${dados.id}`, dados)
          const index = this.dispositivos.findIndex(d => d.id === dados.id)
          if (index !== -1) this.dispositivos.splice(index, 1, dados)
        } else {
          const response = await axios.post(`${API}/equipamentos`, dados)
          this.dispositivos.push({ ...dados, id: response.data.id })
        }
        this.modalFormAberto = false
      } catch (error) {
        console.error('Erro ao salvar dispositivo:', error)
        alert('Erro ao salvar dispositivo.')
      }
    },

    async excluirDispositivo(dispositivo) {
      if (!confirm(`Excluir o dispositivo de ${dispositivo.nome}?`)) return
      try {
        await axios.delete(`${API}/equipamentos/${dispositivo.id}`)
        this.dispositivos = this.dispositivos.filter(d => d.id !== dispositivo.id)
      } catch (error) {
        console.error('Erro ao excluir dispositivo:', error)
        alert('Erro ao excluir dispositivo.')
      }
    },

    logout() {
      localStorage.removeItem('usuario')
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  margin-left: 64px;
  padding: 24px;
  padding-top: 60px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--accent, #e30613);
  color: white;
  font-size: 24px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: 200;
}

.btn-logout {
  position: fixed;
  top: 16px;
  right: 24px;
  padding: 6px 14px;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
}

.btn-logout:hover {
  background: #f5f5f5;
}
</style>