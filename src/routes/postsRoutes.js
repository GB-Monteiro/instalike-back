import express from "express";
import multer from "multer";
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controlers/postsControler.js";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

const storage = multer.diskStorage({
    // Configura como os arquivos serão armazenados no disco.
    destination: (req, file, cb) => {
      // Define o diretório de destino para os arquivos.
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      // Define o nome do arquivo (mantém o original).
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({
    // Configura o upload de arquivos com as opções de armazenamento.
    dest: "./uploads",
    storage
  });
  
  const routes = app => {
    // Permite que o servidor interprete requisições JSON.
    app.use(express.json());
    app.use(cors(corsOptions));
    // Define a rota para buscar todos os posts.
    app.get("/posts", listarPosts);
    // Define a rota para criar um novo post.
    app.post("/posts", postarNovoPost);
    // Define a rota para fazer upload de uma imagem.
    app.post("/upload", upload.single("imagem"), uploadImagem);

    app.put("/upload/:id", atualizarNovoPost);
  };
  
  export default routes;