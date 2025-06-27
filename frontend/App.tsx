import { useEffect, useState } from 'react';

interface Reserva {
  _id?: string;
  nomeCliente: string;
  numeroMesa: number;
  dataHora: string;
  status: string;
  contato: string;
}

function App() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [novaReserva, setNovaReserva] = useState<Reserva>({ nomeCliente: '', numeroMesa: 1, dataHora: '', status: 'reservado', contato: '' });

  const carregar = () => {
    fetch('http://localhost:3000/reservas')
      .then(res => res.json())
      .then(setReservas);
  };

  useEffect(() => { carregar(); }, []);

  const salvar = async () => {
    await fetch('http://localhost:3000/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaReserva)
    });
    setNovaReserva({ nomeCliente: '', numeroMesa: 1, dataHora: '', status: 'reservado', contato: '' });
    carregar();
  };

  const excluir = async (id?: string) => {
    await fetch(`http://localhost:3000/reservas/${id}`, { method: 'DELETE' });
    carregar();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Sistema de Reservas</h1>
      <input placeholder="Nome" value={novaReserva.nomeCliente} onChange={e => setNovaReserva({ ...novaReserva, nomeCliente: e.target.value })} />
      <input type="number" placeholder="Mesa" value={novaReserva.numeroMesa} onChange={e => setNovaReserva({ ...novaReserva, numeroMesa: +e.target.value })} />
      <input placeholder="Data e Hora" value={novaReserva.dataHora} onChange={e => setNovaReserva({ ...novaReserva, dataHora: e.target.value })} />
      <input placeholder="Contato" value={novaReserva.contato} onChange={e => setNovaReserva({ ...novaReserva, contato: e.target.value })} />
      <button onClick={salvar}>Reservar</button>

      <ul>
        {reservas.map(r => (
          <li key={r._id}>
            {r.nomeCliente} - Mesa {r.numeroMesa} - {r.dataHora} - {r.status}
            <button onClick={() => excluir(r._id)}>Cancelar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
