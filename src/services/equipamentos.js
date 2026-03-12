const express = require("express")
const router = express.Router()
const db = require("../db")

router.get("/", (req, res) => {

  db.query("SELECT * FROM equipamentos", (err, result) => {

    if (err) {
      res.status(500).send(err)
    } else {
      res.json(result)
    }

  })

})

router.post("/", (req, res) => {

  const { tipo, modelo, serial } = req.body

  db.query(
    "INSERT INTO equipamentos (tipo,modelo,serial, patrimonio) VALUES (?,?,?,?)",
    [tipo, modelo, serial],
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