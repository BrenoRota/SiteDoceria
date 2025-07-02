const express = require("express")

const clirouter =express.Router();

const HomeCliController = require("../controller/homeclicontroller")

let ctrl = new HomeCliController();

clirouter.get("/",ctrl.homeview);



module.exports = clirouter;