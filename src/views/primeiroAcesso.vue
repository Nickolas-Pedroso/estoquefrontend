<template>
  <div class="primeiro-acesso-container">
    <div class="primeiro-acesso-box">
      <img src="../assets/logo-armac.png" class="logo" alt="Logo Armac" />
      <h2>Primeiro Acesso</h2>
      <p>Insira o e-mail cadastrado para continuar o processo de primeiro acesso.</p>
      <form @submit.prevent="submitPrimeiroAcesso">
        <label>E-mail</label>
        <input
          type="email"
          v-model="email"
          placeholder="usuario@armac.com.br"
          required
        />
        <button type="submit">Enviar</button>
      </form>
      <button @click="goBack" class="back-btn">Voltar</button>
      <div class="footer">
        <p>ARMAC - Sistema de Inventário</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { primeiroAcesso } from "../services/authService";

export default {

  name: "PrimeiroAcesso",
  data() {
    return {
      email: ""
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {

    async submitPrimeiroAcesso() {
try {      // aqui vamos conectar com a API para solicitar o primeiro acesso
      const response = await primeiroAcesso(this.email);
      console.log(response.data);

      alert("Solicitação enviada! Verifique seu e-mail.");

    } catch (error) {
      console.error("Email não encontrado", error);
    }
    },
    goBack() {
      this.router.push('/');
    }
  }
};
</script>

<style scoped>
.primeiro-acesso-container {
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.primeiro-acesso-box {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  padding: 30px 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo {
  width: 230px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

h2 {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0;
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 12px;
}

p {
  font-size: 13px;
  color: #666666;
  margin: 0;
  line-height: 1.5;
  text-align: center;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: #555555;
  text-transform: capitalize;
  display: block;
  margin-bottom: 12px;
}

input {
  padding: 12px 14px;
  font-size: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333333;
  width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  margin-bottom: 5px;
}

input:focus {
  outline: none;
  border-color: #e30613;
  box-shadow: 0 0 0 2px rgba(227, 6, 19, 0.08);
}

input::placeholder {
  color: #bbbbbb;
}

button {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  background-color: #6292da;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 36px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100%;
  margin-top: 30px;
}

button:hover:not(:disabled) {
  background-color: #6292da;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(49, 67, 231, 0.3);
}

.back-btn {
  background-color: transparent;
  color: #555555;
  border: 1px solid #e0e0e0;
  margin-top: 10px;
}

.back-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
  border-color: #d0d0d0;
}

.footer {
  margin-top: 25px;
  font-size: 13px;
  color: #666;
}

/* Responsividade para dispositivos móveis */
@media (max-width: 480px) {
  .primeiro-acesso-container {
    padding: 5px;
  }
  .primeiro-acesso-box {
    padding: 20px 16px;
    gap: 12px;
    max-width: 380px;
  }

  .logo {
    width: 140px;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 8px;
  }

  label {
    font-size: 13px;
  }

  input {
    padding: 8px 10px;
    font-size: 16px;
  }

  button {
    padding: 8px 12px;
    font-size: 12px;
    min-height: 34px;
    margin-top: 20px;
  }

  .footer {
    font-size: 12px;
  }
}
</style>