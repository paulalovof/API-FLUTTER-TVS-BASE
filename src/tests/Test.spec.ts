import { Cliente } from '../models/Cliente'

test('ta ok', () => {
    const cliente = new Cliente();

    cliente.nome = "Kayure"

    expect(cliente.nome).toEqual('Kayure')
})