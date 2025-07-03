const express = require("express")

const cliprodrouter =express.Router();

const ProdutosClientes = require("../controller/produtosCli");

const ctrl = new ProdutosClientes()

cliprodrouter.get("/produtos",ctrl.produtosView)

module.exports = cliprodrouter

