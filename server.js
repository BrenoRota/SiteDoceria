const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser")
const HomeCliRoute = require("./routes/clientesroute")
const CliprodutosRoute = require("./routes/clientesprodutos");
const app = express();

app.use(express.static(__dirname + "/public"));

app.set("view engine", 'ejs');

app.set("views","./views")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('layout', './layout');
app.use(expressLayouts);
app.use(cookieParser());

app.use("/", HomeCliRoute)
app.use("/clientes",CliprodutosRoute)

const server = app.listen('5000', function() {
    console.log('Servidor web iniciado');
});
