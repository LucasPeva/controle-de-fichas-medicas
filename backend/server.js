const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.get("/", (req, res) => {
  res.send("Hi :3");
});

app.listen(port, () => {
  console.log(`Rodando servidor na porta ${port}`);
});