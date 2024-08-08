/*const request = require("supertest");
import * as server from "../server";
import { app } from "../server"; // Certifique-se de que o caminho está correto
import { Request, Response } from "express";
import { Pedido } from "../models/Pedido";

describe("Teste da Rota incluirPedido", () => {
  let pedidoId: number;

  it("Deve incluir um novo pedido com sucesso", async () => {
    const novoPedido = {
      data: "2024-08-01T00:00:00.000Z",
      id_cliente: "120"
    };

    const response = await request(app).post("/incluirPedido").send(novoPedido);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.data).toBe(novoPedido.data);
    expect(response.body.id_cliente).toBe(novoPedido.id_cliente);

    pedidoId = response.body.id; // Armazena o ID do cliente recém-criado para limpeza posterior
  });

  /*
  it("Deve retornar erro ao tentar incluir um produto com a descricao ja existente", async () => {
    const produtoExistente = {
      descricao: "Produto teste"
    };

    // Tenta incluir um cliente com CPF já existente
    const response = await request(app).post("/incluirProduto").send(produtoExistente);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Produto já cadastrado");
  });


  afterAll(async () => {
    // Remove o cliente criado no teste
    if (pedidoId) {
      await Pedido.destroy({ where: { id: pedidoId } });
    }
  });
});


describe("Teste da Rota GetPedidoById", () => {
  it("Deve retornar o pedido correto quando o id é valido", async () => {
    const idPedido = 1; // Supondo que este seja um Id válido existente no seu banco de dados
    const response = await request(app).get(`/pedidos/${idPedido}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", idPedido);
  });

  it("Deve retornar um status 404 quando o Id do pedido nao existe", async () => {
    const idPedido = 999;

    const response = await request(app).get(`/pedidos/${idPedido}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Pedido não encontrado");
  });
});


describe("Teste da Rota listarPedidos", () => {
  it("Deve retornar uma lista de pedidos", async () => {
    const response = await request(app).get("/pedidos");

    expect(response.status).toBe(200);
    expect(response.body.pedidos).toBeInstanceOf(Array);
  });

  it("Deve retornar a lista de pedidos dentro de um tempo aceitavel", async () => {
    const start = Date.now();
    const response = await request(app).get("/pedidos");
    const duration = Date.now() - start;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(100); // Verifica se a resposta é retornada em menos de 500ms
  });
});

describe("Teste da Rota excluirPedido", () => {
  beforeAll(async () => {
    // Cria um cliente com um ID único para o teste de exclusão
    await Pedido.create({ id: "99", data: "2024-07-31T00:00:00.000Z", id_cliente: "120"});
    // Adicione lógica para garantir que não há pedidos vinculados, se necessário
  });

  afterAll(async () => {
    // Limpa o banco de dados após os testes
    await Pedido.destroy({ where: { id: 99 } });
  });

  it("Deve excluir um pedido existente", async () => {
    // Faz a requisição para excluir o cliente com ID 99
    const response = await request(app).delete("/excluirPedido/99");

    // Verifica se a resposta da API está correta
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Pedido excluído com sucesso");

    // Verifica se o cliente foi realmente excluído
    const pedidoExcluido = await Pedido.findByPk(99);
    expect(pedidoExcluido).toBeNull(); // Deve retornar null se o cliente foi excluído
  });
});

describe("Teste da Rota atualizarPedido", () => {
  let pedidoId: number;
  let pedidoExistenteId: number;

  beforeAll(async () => {
    // Cria um cliente para testes
    const pedido = await Pedido.create({
      data: "2024-07-20T00:00:00.000Z",
      id_cliente: "120"
    });
    pedidoExistenteId = pedido.id;

    // Cria outro cliente para ser atualizado
    const pedidoParaAtualizar = await Pedido.create({
      data: "2024-07-25T00:00:00.000Z",
      id_cliente: "154"
    });
    pedidoId = pedidoParaAtualizar.id;
  });

  it("Deve atualizar um pedido com sucesso", async () => {
    const pedidoAtualizado = {
      data: "2024-07-26T00:00:00.000Z",
      id_cliente: "154"
    };

    const response = await request(app).put(`/atualizarPedido/${pedidoId}`).send(pedidoAtualizado);

    expect(response.status).toBe(200);
    expect(response.body.data).toBe(pedidoAtualizado.data);
    expect(response.body.id_cliente).toBe(pedidoAtualizado.id_cliente);
  });

  /*
  it("Deve retornar erro ao tentar atualizar cliente com CPF já existente", async () => {
    const clienteAtualizado = {
      nome: "Novo Nome",
      sobrenome: "Novo Sobrenome",
      cpf: "12345678900" // CPF já usado por clienteExistenteId
    };

    const response = await request(app).put(`/atualizarPedido/${pedidoId}`).send(pedidoAtualizado);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "CPF já está sendo usado por outro cliente");
  });
  

  it("Deve retornar erro ao tentar atualizar um pedido inexistente", async () => {
    const pedidoInexistenteId = 999999;
    const pedidoAtualizado = {
      data: "2024-08-20T00:00:00.000Z",
      id_cliente: "120"
    };

    const response = await request(app).put(`/atualizarPedido/${pedidoInexistenteId}`).send(pedidoAtualizado);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Pedido não encontrado");
  });

  afterAll(async () => {
    // Limpeza dos clientes criados
    await Pedido.destroy({ where: { id: [pedidoId, pedidoExistenteId] } });
  });

});
*/
