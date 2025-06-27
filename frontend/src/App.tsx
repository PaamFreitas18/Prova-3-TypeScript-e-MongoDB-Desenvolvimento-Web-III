import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Reserva {
  _id: string;
  nomeCliente: string;
  numeroMesa: number;
  dataHora: string;
  status: string;
  contatoCliente: string;
}

const styles = {
  container: {
    backgroundColor: '#ffe6f0',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#4a0033',

    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 600,
  },
  title: {
    color: '#d6336c',
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '30px',
  },
  th: {
    borderBottom: '2px solid #d6336c',
    padding: '10px',
    textAlign: 'left' as const,
  },
  td: {
    borderBottom: '1px solid #d6336c',
    padding: '8px',
  },
  button: {
    backgroundColor: '#d6336c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  input: {
    padding: '8px',
    margin: '5px 0',
    width: '100%',
    maxWidth: '300px',
    borderRadius: '5px',
    border: '1px solid #d6336c',
  },
  form: {
    maxWidth: '320px',
    margin: '0 auto',
  },
  label: {
    display: 'block',
    marginTop: '10px',
    fontWeight: 'bold' as const,
  },
};

function App() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const [nomeCliente, setNomeCliente] = useState('');
  const [numeroMesa, setNumeroMesa] = useState(1);
  const [dataHora, setDataHora] = useState('');
  const [status, setStatus] = useState('reservado');
  const [contatoCliente, setContatoCliente] = useState('');

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3000/reservas');
      setReservas(res.data);
    } catch (error) {
      alert('Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/reservas', {
        nomeCliente,
        numeroMesa,
        dataHora,
        status,
        contatoCliente,
      });
      setNomeCliente('');
      setNumeroMesa(1);
      setDataHora('');
      setStatus('reservado');
      setContatoCliente('');
      fetchReservas();
    } catch {
      alert('Erro ao criar reserva');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir essa reserva?')) return;
    try {
      await axios.delete(`http://localhost:3000/reservas/${id}`);
      fetchReservas();
    } catch {
      alert('Erro ao excluir reserva');
    }
  };

  if (loading) return <p>Carregando reservas...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        <h1 style={styles.title}>Reservas</h1>

        {reservas.length === 0 ? (
          <p>Nenhuma reserva encontrada.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nome Cliente</th>
                <th style={styles.th}>Mesa</th>
                <th style={styles.th}>Data e Hora</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Contato</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r._id}>
                  <td style={styles.td}>{r.nomeCliente}</td>
                  <td style={styles.td}>{r.numeroMesa}</td>
                  <td style={styles.td}>{new Date(r.dataHora).toLocaleString()}</td>
                  <td style={styles.td}>{r.status}</td>
                  <td style={styles.td}>{r.contatoCliente}</td>
                  <td style={styles.td}>
                    <button style={styles.button} onClick={() => handleDelete(r._id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 style={styles.title}>Nova Reserva</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Nome Cliente</label>
          <input
            style={styles.input}
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            required
          />

          <label style={styles.label}>Número Mesa</label>
          <input
            style={styles.input}
            type="number"
            min={1}
            value={numeroMesa}
            onChange={(e) => setNumeroMesa(parseInt(e.target.value))}
            required
          />

          <label style={styles.label}>Data e Hora</label>
          <input
            style={styles.input}
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            required
          />

          <label style={styles.label}>Status</label>
          <select
            style={styles.input}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="reservado">Reservado</option>
            <option value="ocupado">Ocupado</option>
            <option value="disponível">Disponível</option>
          </select>

          <label style={styles.label}>Contato Cliente</label>
          <input
            style={styles.input}
            type="text"
            value={contatoCliente}
            onChange={(e) => setContatoCliente(e.target.value)}
            required
          />

          <button type="submit" style={{ ...styles.button, marginTop: 10 }}>
            Adicionar Reserva
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
