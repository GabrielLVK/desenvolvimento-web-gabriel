const express = require('express');

const PORT = 3000;
const app = express();
app.use(express.json());

let usuarios = [
    { id: 1, nome: "Ana",    idade: 20 },
    { id: 2, nome: "Carlos", idade: 25 },
    { id: 3, nome: "Maria",  idade: 30 },
];

app.get('/usuarios', (req, res) => {
    const { nome } = req.query;
    if (nome) {
        const filtrados = usuarios.filter(u => 
            u.nome.toLowerCase().includes(nome.toLowerCase())
        );
        return res.json(filtrados);
    }
    res.json(usuarios);
});

app.get('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
    }
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    return res.json(usuario);
});

app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body || {};
    if (!nome?.trim() || !email?.trim()) {
        return res.status(400).json({
            erro: "Nome e email são obrigatórios"
        });
    }
    const novoId = usuarios.length > 0
        ? Math.max(...usuarios.map(u => u.id)) + 1
        : 1;
    const novoUsuario = {
        id: novoId,
        nome: nome.trim(),
        email: email.trim()
    }
    usuarios.push(novoUsuario);
    return res.status(201).json(novoUsuario);
});

app.put('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
    }
    const { nome, email, idade } = req.body;
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    if (nome?.trim()) usuario.nome = nome.trim();
    if (email?.trim()) usuario.email = email.trim();
    if (idade !== undefined) usuario.idade = idade;
    return res.json(usuario);
});

app.delete('/usuarios/:id', (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
    }
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    usuarios.splice(index, 1);
    return res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});