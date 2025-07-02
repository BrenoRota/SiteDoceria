const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser")

const ClienteRoute = require("./routes/clientesroute")

const app = express();

app.use(express.static(__dirname + "/public"));

app.set("view engine", 'ejs');

app.set("views","./views")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('layout', './layout');
app.use(expressLayouts);
app.use(cookieParser());

app.use("/",ClienteRoute)


const server = app.listen('5000', function() {
    console.log('Servidor web iniciado');
});
