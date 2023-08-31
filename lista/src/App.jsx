import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './app.css';

const App = () => {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users'); 
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingIndex === -1) {
      try {
        await axios.post('http://localhost:3001/users', { nome, idade });
        fetchUsers();
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
      }
    } else {
      try {
        const userId = users[editingIndex].id; 
        await axios.put(`http://localhost:3001/users/${userId}`, { nome, idade }); 
        fetchUsers();
        setEditingIndex(-1);
      } catch (error) {
        console.error('Erro ao editar usuário:', error);
      }
    }

    setNome('');
    setIdade('');
  };

  const handleEdit = (index) => {
    const userToEdit = users[index];
    setNome(userToEdit.nome);
    setIdade(userToEdit.idade);
    setEditingIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      const userId = users[index].id; 
      await axios.delete(`http://localhost:3001/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  return (
    <div>
      <h1>Cadastro de Usuários</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
        </label>
        <br />
        <label>
          Idade:
          <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} />
        </label>
        <br />
        <button type="submit">{editingIndex === -1 ? 'Cadastrar' : 'Editar'}</button>
      </form>
      <h2>Lista de Usuários</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.nome}, {user.idade} anos
            <button onClick={() => handleEdit(index)}>Editar</button>
            <button onClick={() => handleDelete(index)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;