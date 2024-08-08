import { ItemDoPedido } from './../models/ItemDoPedido';
const request = require("supertest");
import * as server from "../server";
import { app } from "../server"; // Certifique-se de que o caminho está correto
import { Request, Response } from "express";
//import { ItemDoPedido } from "../models/ItemDoPedido";

describe("Teste da Rota incluirItemPedido", () => {
  let itemPedidoId: number;

  it("Deve incluir um novo item do pedido com sucesso", async () => {
    const novoItemPedido = {
      id_pedido: "1",
      id_produto: "1",
      qtdade: 2
    };

    const response = await request(app).post("/incluirItemDoPedido").send(novoItemPedido);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.id_pedido).toBe(novoItemPedido.id_pedido);
    expect(response.body.id_produto).toBe(novoItemPedido.id_produto);
    expect(response.body.qtdade).toBe(novoItemPedido.qtdade);

    itemPedidoId = response.body.id; // Armazena o ID do cliente recém-criado para limpeza posterior
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
*/

  afterAll(async () => {
    // Remove o cliente criado no teste
    if (itemPedidoId) {
      await ItemDoPedido.destroy({ where: { id: itemPedidoId } });
    }
  });
});


describe("Teste da Rota GetItemDoPedidoById", () => {
  it("Deve retornar o item do pedido correto quando o id é valido", async () => {
    const idItemPedido = 1; // Supondo que este seja um Id válido existente no seu banco de dados
    const response = await request(app).get(`/itemPedidos/${idItemPedido}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", idItemPedido);
  });

  it("Deve retornar um status 404 quando o Id do item do pedido nao existe", async () => {
    const idItemPedido = 999;

    const response = await request(app).get(`/itemPedidos/${idItemPedido}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Item do Pedido não encontrado");
  });
});


describe("Teste da Rota listarItemPedidos", () => {
  it("Deve retornar uma lista de itens de pedidos", async () => {
    const response = await request(app).get("/itemPedidos");

    expect(response.status).toBe(200);
    expect(response.body.ItemDoPedido).toBeInstanceOf(Array);
  });

  it("Deve retornar a lista de itens de pedidos dentro de um tempo aceitavel", async () => {
    const start = Date.now();
    const response = await request(app).get("/itemPedidos");
    const duration = Date.now() - start;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(100); // Verifica se a resposta é retornada em menos de 500ms
  });
});

describe("Teste da Rota excluirItemPedido", () => {
  beforeAll(async () => {
    // Cria um cliente com um ID único para o teste de exclusão
    await ItemDoPedido.create({ id: "99", id_produto: "10", id_pedido: "10", qtdade: "1"});
    // Adicione lógica para garantir que não há pedidos vinculados, se necessário
  });

  afterAll(async () => {
    // Limpa o banco de dados após os testes
    await ItemDoPedido.destroy({ where: { id: 99 } });
  });

  it("Deve excluir um item do pedido existente", async () => {
    // Faz a requisição para excluir o cliente com ID 99
    const response = await request(app).delete("/excluirItemPedido/99");

    // Verifica se a resposta da API está correta
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Pedido excluído com sucesso");

    // Verifica se o cliente foi realmente excluído
    const itemPedidoExcluido = await ItemDoPedido.findByPk(99);
    expect(itemPedidoExcluido).toBeNull(); // Deve retornar null se o cliente foi excluído
  });
});

describe("Teste da Rota atualizarPedido", () => {
  let itemPedidoId: number;
  let itemPedidoExistenteId: number;

  beforeAll(async () => {
    // Cria um cliente para testes
    const itemPedido = await ItemDoPedido.create({
      id_produto: "1",
      id_pedido: "2",
      qtdade: 1
    });
    itemPedidoExistenteId = itemPedido.id;

    // Cria outro cliente para ser atualizado
    const itemPedidoParaAtualizar = await ItemDoPedido.create({
      id_produto: "2",
      id_pedido: "3",
      qtdade: 2
    });
    itemPedidoId = itemPedidoParaAtualizar.id;
  });

  it("Deve atualizar um item do pedido com sucesso", async () => {
    const itemPedidoAtualizado = {
      id_produto: "2",
      id_pedido: "3",
      qtdade: 5
    };

    const response = await request(app).put(`/atualizarItemPedido/${itemPedidoId}`).send(itemPedidoAtualizado);

    expect(response.status).toBe(200);
    expect(response.body.id_pedido).toBe(itemPedidoAtualizado.id_pedido);
    expect(response.body.id_produto).toBe(itemPedidoAtualizado.id_produto);
    expect(response.body.qtdade).toBe(itemPedidoAtualizado.qtdade);
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
  */

  it("Deve retornar erro ao tentar atualizar um item de pedido inexistente", async () => {
    const itemPedidoInexistenteId = 999999;
    const itemPedidoAtualizado = {
      id_produto: "90",
      id_pedido: "90",
      qtdade: 1
    };

    const response = await request(app).put(`/atualizarItemPedido/${itemPedidoInexistenteId}`).send(itemPedidoAtualizado);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Item do Pedido não encontrado");
  });

  afterAll(async () => {
    // Limpeza dos clientes criados
    await ItemDoPedido.destroy({ where: { id: [itemPedidoId, itemPedidoExistenteId] } });
  });

});

