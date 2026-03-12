const express = require("express")
const router = express.Router()
const db = require("../db")

// Lista os funcionarios
router.get("/", (req, res) => {

  db.query("SELECT * FROM funcionarios", (err, result) => {

    if (err) {
      res.status(500).send(err)
    } else {
      res.json(result)
    }

  })

})


// Busca de funcionário por ID
router.get("/:id", (req, res) => {

  const { id } = req.params

  db.query(
    "SELECT * FROM funcionarios WHERE id = ?",
    [id],
    (err, result) => {

      if (err) {
        res.status(500).send(err)
      } else {
        res.json(result)
      }

    }
  )

})


// Adicionar novo funcionário
router.post("/", (req, res) => {

  const { nome, email, departamento } = req.body

  db.query(
    "INSERT INTO funcionarios (nome,email,departamento) VALUES (?,?,?)",
    [nome, email, departamento],
    (err, result) => {

      if (err) {
        res.status(500).send(err)
      } else {
        res.json(result)
      }

    }
  )

})


// Editar funcionário
router.put("/:id", (req, res) => {

  const { id } = req.params
  const { nome, email, departamento } = req.body

  db.query(
    "UPDATE funcionarios SET nome=?, email=?, departamento=? WHERE id=?",
    [nome, email, departamento, id],
    (err, result) => {

      if (err) {
        res.status(500).send(err)
      } else {
        res.json(result)
      }

    }
  )

})


// deletar funcionário
router.delete("/:id", (req, res) => {

  const { id } = req.params

  db.query(
    "DELETE FROM funcionarios WHERE id=?",
    [id],
    (err, result) => {

      if (err) {
        res.status(500).send(err)
      } else {
        res.json(result)
      }

    }
  )

})

module.exports = router