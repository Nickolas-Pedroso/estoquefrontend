<template>
  <div class="login-container">

    <div class="login-box">

      <img src="../assets/logo-armac.png" class="logo"/>

      <h2>Login</h2>

      <form @submit.prevent="login">

        <label>Email</label>
        <input 
          type="email"
          v-model="email"
          placeholder="usuario@armac.com.br"
          required
        />

        <label class="senha-label">Senha</label>
        <input 
          type="password"
          v-model="senha"
          placeholder="********"
          required
        />

        <button type="submit">
          ENTRAR
        </button>

      </form>

      <p> Projeto teste</p>

      <button @click="goToPrimeiroAcesso" class="primeiro-acesso-btn">
        Primeiro Acesso
      </button>

      <div class="footer">
        <p>ARMAC - Sistema de Inventário</p>
      </div>

    </div>

  </div>
</template>

<script>

import { login } from "../services/authService";
import { useRouter } from 'vue-router';

export default {

  name: "Login",

  setup() {
    const router = useRouter();
    return { router };
  },

  data() {
    return {
      email: "",
      senha: ""
    }
  },

  methods: {
    async login() {

      try {
      //API para validar o login

      const response = await login(this.email, this.senha);
      
      if(!response.data.success) {
        alert("E-mail ou senha incorretos");
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));
      this.router.push('/equipamentos');
  
      // conecta com API
      } catch (error) {
        alert("E-mail ou senha incorretos");
        console.error(error);
      }
    },
    goToPrimeiroAcesso() {
      this.router.push('/primeiro-acesso');
    }
  }
}


</script>

<style scoped>

.login-container {
  width: 100%;
  min-height: 100vh;
  height: 100%;        /* ← essa linha */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.login-box{
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  padding: 50px 50px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logo{
  width: 230px;
  margin-bottom:20px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

/* Responsividade para dispositivos móveis */
@media (max-width: 600px) {
  .login-container {
    padding: 5px;
  }
  .login-box {
    padding: 30px 24px;
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

h2{
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

label{
  font-size: 14px;
  font-weight: 600;
  color: #555555;
  text-transform: capitalize;
  display: block;
  margin-bottom: 12px;
}

.senha-label {
  margin-top: 10px;
}

input{
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

button{
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  background-color: #e30613;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 36px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: 100%;
  margin-top: 20px;
}

button:hover{
  background-color: #c20410;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(227, 6, 19, 0.3);
}

.primeiro-acesso-btn {
  background-color: #6292da;
  margin-top: 10px;
}

.primeiro-acesso-btn:hover {
  background-color: #4a7bc1;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(98, 146, 218, 0.3);
}

.footer{
  margin-top:25px;
  font-size:12px;
  color:#666;
}

</style>