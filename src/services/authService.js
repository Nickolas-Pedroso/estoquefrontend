import api from "./api";

export const login = (email, senha) => {
  return api.post("/login", {
    email,
    senha
  });
};

export const primeiroAcesso = (email) => {
  return api.post("/primeiro-acesso", {
    email
  });
};