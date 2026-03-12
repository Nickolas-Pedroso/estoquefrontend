<template>
  <div class="stats-grid">
    <div class="stat-card green">
      <div class="stat-label">Total de Aparelhos</div>
      <div class="stat-value">{{ totalDevices }}</div>
      <div class="stat-sub">no inventário</div>
    </div>
    <div class="stat-card info">
      <div class="stat-label">Em Uso</div>
      <div class="stat-value">{{ emUso }}</div>
      <div class="stat-sub">atribuídos</div>
    </div>
    <div class="stat-card warn">
      <div class="stat-label">Números Duplicados</div>
      <div class="stat-value">{{ numerosRepetidos }}</div>
      <div class="stat-sub">requerem verificação</div>
    </div>
    <div class="stat-card danger">
      <div class="stat-label">Termos Pendentes</div>
      <div class="stat-value">{{ termosPendentes }}</div>
      <div class="stat-sub">não assinados</div>
    </div>
    <div class="stat-card purple">
      <div class="stat-label">Disponíveis</div>
      <div class="stat-value">{{ disponiveis }}</div>
      <div class="stat-sub">sem usuário</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalDevices: Number,
  emUso: Number,
  numerosRepetidos: Number,
  termosPendentes: Number,
  disponiveis: Number,
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px 20px;
  position: relative;
  overflow: hidden;
}

.stat-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
}

.stat-card.green::after {
  background: var(--accent);
}

.stat-card.warn::after {
  background: var(--warn);
}

.stat-card.danger::after {
  background: var(--danger);
}

.stat-card.info::after {
  background: var(--info);
}

.stat-card.purple::after {
  background: #a855f7;
}

.stat-label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
  margin-bottom: 6px;
}

.stat-value {
  font-family: var(--display);
  font-size: 26px;
  font-weight: 700;
}

.stat-card.green .stat-value {
  color: var(--accent);
}

.stat-card.warn .stat-value {
  color: var(--warn);
}

.stat-card.danger .stat-value {
  color: var(--danger);
}

.stat-card.info .stat-value {
  color: var(--info);
}

.stat-card.purple .stat-value {
  color: #a855f7;
}

.stat-sub {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
