// routes/reservaRoutes.ts
import { Router, Request, Response } from 'express';
import Reserva, { IReserva } from '../models/Reserva';

const router = Router();

// CREATE - adicionar nova reserva
router.post('/', async (req: Request, res: Response) => {
  try {
    const reserva = new Reserva(req.body);
    const savedReserva = await reserva.save();
    res.status(201).json(savedReserva);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar reserva', details: error });
  }
});

// READ - listar todas reservas (com filtro opcional por cliente ou mesa)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { nomeCliente, numeroMesa } = req.query;
    const filtro: any = {};

    if (nomeCliente) filtro.nomeCliente = nomeCliente;
    if (numeroMesa) filtro.numeroMesa = Number(numeroMesa);

    const reservas = await Reserva.find(filtro);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar reservas' });
  }
});

// UPDATE - atualizar reserva pelo ID
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedReserva = await Reserva.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReserva) return res.status(404).json({ error: 'Reserva não encontrada' });
    res.json(updatedReserva);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar reserva', details: error });
  }
});

// DELETE - excluir reserva pelo ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedReserva = await Reserva.findByIdAndDelete(req.params.id);
    if (!deletedReserva) return res.status(404).json({ error: 'Reserva não encontrada' });
    res.json({ message: 'Reserva excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir reserva' });
  }
});

export default router;
