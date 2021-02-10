const express = require("express");
const path = require("path");
const http = require("http");
const { routesInit, corseAccessControl } = require("./routes/config_routes");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname,"public")));

corseAccessControl(app);
routesInit(app);

const server = http.createServer(app);
let port = process.env.PORT || "3000";
server.listen(port);
