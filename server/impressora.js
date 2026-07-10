import express from "express";
import cors from "cors";
import { exec } from "child_process";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/imprimir", (req, res) => {
  const { conteudo } = req.body;

  const processo = exec(
    "lp -d DieboldIM453H",
    (erro) => {
      if (erro) {
        console.error("Erro CUPS:", erro);
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

