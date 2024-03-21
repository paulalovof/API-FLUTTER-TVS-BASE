const request = require('supertest');
import * as server from '../server';
const app = server.server;
import {Request, Response} from 'express';

describe('Teste da rota getCLientById', () => {
    it('deve retornar o cliente correto quando o ID é valido', async () => {
        const clientId = 1;

        const response = await request(app).get(`/clientes/${clientId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', clientId);
    });
    
    it('deve retornar um status 404 quando o ID do cliente não existe', async () => {
        const clientId = 99999;

        const response = await request(app).get(`/clientes/${clientId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Cliente não encontrado');
    });
})