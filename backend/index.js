const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(cors());

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'users',
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL.');
  }
});

// Configuração do JWT
const secretKey = 'suaChaveSecretaSuperSecreta';

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido.' });
    }
    req.user = user;
    next();
  });
}

// Rotas públicas
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuários:', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
      } else {
        res.json(results);
      }
    });
  });

app.post('/users', (req, res) => {
    const { nome, idade } = req.body;
    db.query('INSERT INTO users (nome, idade) VALUES (?, ?)', [nome, idade], (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).json({ message: 'Erro interno do servidor.' });
      } else {
        res.json({ message: 'Usuário cadastrado com sucesso.' });
      }
    });
  });

// Rotas protegidas por autenticação JWT
app.use(authenticateToken);

app.put('/users/:id', (req, res) => {
  const { nome, idade } = req.body;
  const userId = req.params.id;
  db.query('UPDATE users SET nome = ?, idade = ? WHERE userId = ?', [nome, idade, userId], (err, result) => {
    if (err) {
      console.error('Erro ao atualizar usuário:', err);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } else {
      res.json({ message: 'Usuário atualizado com sucesso.' });
    }
  });
});

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  db.query('DELETE FROM users WHERE userId = ?', [userId], (err, result) => {
    if (err) {
      console.error('Erro ao excluir usuário:', err);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    } else {
      res.json({ message: 'Usuário excluído com sucesso.' });
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});