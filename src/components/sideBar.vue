<template>
  <nav class="sidebar">
    <div class="sidebar-logo">TI</div>
    <div class="sidebar-item" title="Dashboard">📊</div>
    <div class="sidebar-item active" title="Celulares">📱</div>
    <div class="sidebar-item" title="Notebooks">💻</div>
    <div class="sidebar-item" title="Headsets">🎧</div>
    <div class="sidebar-item" title="Chips/SIM">📡</div>
    <div class="sidebar-item settings" title="Configurações">⚙️</div>

      <!-- MOBILE: barra inferior -->
    <nav class="sidebar mobile-sidebar">
    <div class="sidebar-item" title="Dashboard">📊</div>
    <div class="sidebar-item active" title="Celulares">📱</div>
    <div class="sidebar-item" title="Notebooks">💻</div>
    <div class="sidebar-item" title="Headsets">🎧</div>
    <div class="sidebar-item" title="Configurações">⚙️</div>
    </nav>
  </nav>
</template>

<style scoped>
.sidebar {
  width: 64px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 8px;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.sidebar-logo {
  width: 36px; height: 36px;
  background: var(--accent);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--display);
  font-weight: 800;
  color: #000;
  font-size: 14px;
  margin-bottom: 16px;
}

.sidebar-item {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: var(--muted);
  font-size: 18px;
  transition: all 0.2s;
  position: relative;
}

.sidebar-item:hover, .sidebar-item.active {
  background: var(--border);
  color: var(--accent);
}

.sidebar-item.active::before {
  content: '';
  position: absolute;
  left: -12px;
  width: 3px; height: 20px;
  background: var(--accent);
  border-radius: 0 3px 3px 0;
}

.settings { margin-top: auto; }
</style>
