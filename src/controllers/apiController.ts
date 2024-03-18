import { Request, Response } from 'express';
import { Produto } from '../models/Produto';
import { Cliente } from '../models/Cliente';
import { Pedido } from '../models/Pedido';

export const ping = (req: Request, res: Response) => {
    res.json({ pong: true });
}
