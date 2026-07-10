const express = require("express");
const { exec } = require("child_process");

const app = express();

app.use(express.json());

app.post("/imprimir", (req, res) => {
  const { conteudo } = req.body;

  const processo = exec(
    "lp -d DieboldIM453H",
    (erro) => {
      if (erro) {
        console.error(erro);
        return res.json({ sucesso: false });
      }

      res.json({ sucesso: true });
    }
  );

  processo.stdin.write(conteudo);
  processo.stdin.end();
});

app.listen(3001, () => {
  console.log("Servidor de impressão ativo na porta 3001");
});