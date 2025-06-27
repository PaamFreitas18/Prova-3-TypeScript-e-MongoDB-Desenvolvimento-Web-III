import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import reservaRoutes from './routes/reservaRoutes';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/reservas', reservaRoutes);

mongoose.connect('mongodb://localhost:27017/reserva')
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar no MongoDB:', err);
  });
