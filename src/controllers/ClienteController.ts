import { Request, Response } from 'express';
import { Produto } from '../models/Produto';
import { Cliente } from '../models/Cliente';
import { Pedido } from '../models/Pedido';
import { Op } from 'sequelize';

export const getClienteById = async (req: Request, res: Response) => {
    try {
        const clientId = parseInt(req.params.id, 10);
        const client = await Cliente.findByPk(clientId);

        if(client){
            res.json(client);
        }else {
            res.status(404).json({message: 'Cliente não encontrado'});
        }
    }catch (error){
        console.error('Erro ao buscar cliente: ', error);
        res.status(500).json({message: 'Erro ao buscar cliente'});
    }
};

