import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"

export async function listarPosts(req, res) {
        // Obtém todos os posts do banco de dados ou de outra fonte de dados.
        const posts = await getTodosPosts();
        // Envia uma resposta HTTP com status 200 (sucesso) e os posts no formato JSON.
        res.status(200).json(posts);
      }
      
export async function postarNovoPost(req, res) {
  // Extrai os dados do novo post a partir do corpo da requisição.
  const novoPost = req.body;
  try {
    // Chama a função para criar um novo post no banco de dados.
    const postCriado = await criarPost(novoPost);
    // Envia uma resposta HTTP com status 200 (sucesso) e os dados do post criado.
    res.status(200).json(postCriado);
  } catch(erro) {
    // Loga o erro no console para facilitar a depuração.
    console.error(erro.message);
    // Envia uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro genérica.
    res.status(500).json({"Erro":"Falha na requisição"})
  }
}
      
export async function uploadImagem(req, res) {
  // Cria um objeto com os dados do novo post, incluindo a URL da imagem.
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname, // Considerar usar um nome de arquivo mais seguro e único
    alt: ""
  }
  try {
    // Cria o post no banco de dados.
    const postCriado = await criarPost(novoPost);
    // Gera um novo nome para a imagem com base no ID do post.
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
    // Move o arquivo da imagem para o diretório de uploads com o novo nome.
    fs.renameSync(req.file.path, imagemAtualizada)
    // Envia uma resposta HTTP com status 200 (sucesso) e os dados do post criado.
    res.status(200).json(postCriado);
  } catch(erro) {
    // Loga o erro no console para facilitar a depuração.
    console.error(erro.message);
    // Envia uma resposta HTTP com status 500 (erro interno do servidor) e uma mensagem de erro genérica.
    res.status(500).json({"Erro":"Falha na requisição"})
  }
}
export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`
  try {
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imgBuffer);
    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
    const postCriado = await atualizarPost(id, post);
    res.status(200).json(postCriado);
  } catch(erro) {
    console.error(erro.message);
    res.status(500).json({"Erro":"Falha na requisição"})
  }
}