const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

const sequelize = require('./config/bd');
const Estudante = require('./models/estudante.model');

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    try {
        const estudantes = await Estudante.findAll({ raw: true });
        res.render('listarEstudantes', { estudantes });
    } catch (erro) {
        console.error('Erro ao listar estudantes:', erro);
        res.status(500).send('Erro ao carregar estudantes');
    }
});

app.get('/estudantes/create', (req, res) => {
    res.render('cadastrarEstudante');
});

app.post('/estudantes/create', async (req, res) => {
    const { nome, idade } = req.body;

    try {
        await Estudante.create({ nome, idade });
        res.redirect('/');
    } catch (erro) {
        console.error('Erro ao cadastrar estudante:', erro);
        res.status(500).send('Erro ao cadastrar estudante');
    }
});

app.delete('/estudantes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const estudante = await Estudante.findByPk(id);
        if (!estudante) {
            return res.status(404).send('Estudante não encontrado');
        }

        await estudante.destroy();
        res.status(200).send('Estudante deletado com sucesso');
    } catch (erro) {
        console.error('Erro ao deletar estudante:', erro);
        res.status(500).send('Erro ao deletar estudante');
    }
});

app.get('/estudantes/:id/edit', async (req, res) => {
    const { id } = req.params;

    try {
        const estudante = await Estudante.findByPk(id);

        res.render('editarEstudante', { estudante: estudante.get({ raw: true }) });
    } catch (erro) {
        console.error('Erro ao buscar estudante para edição:', erro);
        res.status(500).send('Erro ao buscar estudante para edição');
    }
});

app.put('/estudantes/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, idade } = req.body;

    try {
        const estudante = await Estudante.findByPk(id);
        if (!estudante) {
            return res.status(404).send('Estudante não encontrado');
        }

        estudante.nome = nome;
        estudante.idade = idade;
        await estudante.save();

        res.redirect('/');
    } catch (erro) {
        console.error('Erro ao atualizar estudante:', erro);
        res.status(500).send('Erro ao atualizar estudante');
    }
});
async function conectarBD() {
    try {
        await sequelize.sync();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
    } catch (erro) {
        console.error('Erro ao conectar:', erro);
    }
}

conectarBD();

app.listen(3000, () => console.log('Servidor em execução'));