const request = require("supertest");
import * as server from "../server";
import { app } from "../server"; // Certifique-se de que o caminho está correto
import { Request, Response } from "express";
import { Produto } from "../models/Produto";

describe("Teste da Rota incluirProduto", () => {
  let produtoId: number;

  it("Deve incluir um novo produto com sucesso", async () => {
    const novoProduto = {
      descricao: "Produto teste"
    };

    const response = await request(app).post("/incluirProduto").send(novoProduto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.descricao).toBe(novoProduto.descricao);

    produtoId = response.body.id; // Armazena o ID do cliente recém-criado para limpeza posterior
  });


  it("Deve retornar erro ao tentar incluir um produto com a descricao ja existente", async () => {
    const produtoExistente = {
      descricao: "Produto teste"
    };

    const response = await request(app).post("/incluirProduto").send(produtoExistente);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Produto já cadastrado");
  });


  afterAll(async () => {
    // Remove o cliente criado no teste
    if (produtoId) {
      await Produto.destroy({ where: { id: produtoId } });
    }
  });
});


describe("Teste da Rota GetProdutoById", () => {
  let produtoExistenteId: number;

  it("Deve retornar o produto correto quando o id é valido", async () => {
    const produto = await Produto.create({
      descricao: "Produto Novo Teste"
    });
    produtoExistenteId = produto.id;


    const response = await request(app).get(`/produtos/${produtoExistenteId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", produtoExistenteId);
  });

  it("Deve retornar um status 404 quando o Id do produto nao existe", async () => {
    const idProduto = 999;

    const response = await request(app).get(`/produtos/${idProduto}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Produto não encontrado");
  });

  afterAll(async () => {
    // Remove o cliente criado no teste
    if (produtoExistenteId) {
      await Produto.destroy({ where: { id: produtoExistenteId } });
    }
  });
});


describe("Teste da Rota listarProdutos", () => {
  it("Deve retornar uma lista de produtos", async () => {
    const response = await request(app).get("/produtos");

    expect(response.status).toBe(200);
    expect(response.body.produtos).toBeInstanceOf(Array);
  });
  /*
  it("Deve retornar a lista de produtos dentro de um tempo aceitavel", async () => {
    const start = Date.now();
    const response = await request(app).get("/produtos");
    const duration = Date.now() - start;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(100); // Verifica se a resposta é retornada em menos de 500ms
  });
  */
});

describe("Teste da Rota excluirProduto", () => {
  beforeAll(async () => {
    // Cria um cliente com um ID único para o teste de exclusão
    await Produto.create({ id: "99", descricao: "decricao qualquer" });
    // Adicione lógica para garantir que não há pedidos vinculados, se necessário
  });

  afterAll(async () => {
    // Limpa o banco de dados após os testes
    await Produto.destroy({ where: { id: 99 } });
  });

  it("Deve excluir um produto existente", async () => {
    // Faz a requisição para excluir o cliente com ID 99
    const response = await request(app).delete("/excluirProduto/99");

    // Verifica se a resposta da API está correta
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Produto excluído com sucesso");

    // Verifica se o cliente foi realmente excluído
    const produtoExcluido = await Produto.findByPk(99);
    expect(produtoExcluido).toBeNull(); // Deve retornar null se o cliente foi excluído
  });
});

describe("Teste da Rota atualizarProduto", () => {
  let produtoId: number;
  let produtoExistenteId: number;

  beforeAll(async () => {
    // Cria um cliente para testes
    const produto = await Produto.create({
      descricao: "Descrição",
    });
    produtoExistenteId = produto.id;

    // Cria outro cliente para ser atualizado
    const produtoParaAtualizar = await Produto.create({
      descricao: "Descrição p atualizar"
    });
    produtoId = produtoParaAtualizar.id;
  });

  it("Deve atualizar um produto com sucesso", async () => {
    const produtoAtualizado = {
      descricao: "Descricao Atualizada"
    };

    const response = await request(app).put(`/atualizarProduto/${produtoId}`).send(produtoAtualizado);

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe(produtoAtualizado.descricao);
  });

  /*
  it("Deve retornar erro ao tentar atualizar cliente com CPF já existente", async () => {
    const produtoAtualizado = {
      nome: "Novo Nome",
      sobrenome: "Novo Sobrenome",
      cpf: "12345678900" // CPF já usado por clienteExistenteId
    };

    const response = await request(app).put(`/atualizarProduto/${produtoId}`).send(produtoAtualizado);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "CPF já está sendo usado por outro cliente");
  });*/
  

  it("Deve retornar erro ao tentar atualizar um produto inexistente", async () => {
    const produtoInexistenteId = 999999;
    const produtoAtualizado = {
      descricao: "Inexistente"
    };

    const response = await request(app).put(`/atualizarProduto/${produtoInexistenteId}`).send(produtoAtualizado);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Produto não encontrado");
  });

  afterAll(async () => {
    // Limpeza dos clientes criados
    await Produto.destroy({ where: { id: [produtoId, produtoExistenteId] } });
  });

});

