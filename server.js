// Configurando o servidor
const express = require("express")
const server = express()

// Configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

// Habilitar o body do formulário
server.use(express.urlencoded({ extended: true }))

// Configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '123',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})

// Configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})

// Após a conexão com o banco de dados
// não será mais necessária essa configuração 
// Lista de doadores: Vetor ou Array
// const donors = [
//     {
//         name: "Diego Fernandes",
//         blood: "AB+"
//     },
//     {
//         name: "Cleiton Souza",
//         blood: "B+"
//     },
//     {
//         name: "Robson Marques",
//         blood: "O+"
//     },
//     {
//         name: "Mayk Brito",
//         blood: "AB-"
//     },
// ]

// Configurar a apresentação da página
server.get("/", function (req, res) {
    
    db.query("SELECT * FROM donors", function (err, result) {
        if (err) return res.send("Erro de banco de dados")
        const donors = result.rows
        return res.render("index.html", { donors })
    })
    
    // return res.send("ok, cheguei aqui com o nodemon")
})

server.post("/", function (req, res) {
    // Pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // Se nome for igual a vazio
    // ou email for igual a vazio
    // ou blood for igual a vazio
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }

    // Colocar valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name","email","blood")
        VALUES ($1, $2, $3)`
    const values = [name, email, blood]

    db.query(query, values, function (err) {
        // Fluxo de erros
        if (err) return res.send("erro no banco de dados")

        // Fluxo ideal
        return res.redirect("/")
    })

    // Colocar valores dentro do array
    // donors.push({
    //     name: name,
    //     blood: blood
    // })
})

// Ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log("Servidor iniciado")
})