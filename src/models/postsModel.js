import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Conecta ao banco de dados utilizando a string de conexão fornecida como variável de ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// **Função assíncrona para obter todos os posts do banco de dados**
export async function getTodosPosts() {
  // **Obtém o banco de dados específico**
  const db = conexao.db("imersao-instalike");
  // **Obtém a coleção de posts dentro do banco de dados**
  const colecao = db.collection("posts");
  // **Encontra e retorna todos os documentos da coleção como um array**
  return colecao.find().toArray();
}

// **Função assíncrona para criar um novo post no banco de dados**
export async function criarPost(novoPost) {
  // **Obtém o banco de dados específico**
  const db = conexao.db("imersao-instalike");
  // **Obtém a coleção de posts dentro do banco de dados**
  const colecao = db.collection("posts");
  // **Insere um novo documento (post) na coleção e retorna o resultado da inserção**
  return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
  const db = conexao.db("imersao-instalike");
  const colecao = db.collection("posts");
  const objID = ObjectId.createFromHexString(id);
  return colecao.updateOne({_id: new ObjectId(objID)}, {$set: novoPost});
}