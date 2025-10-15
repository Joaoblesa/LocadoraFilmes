//import dabiblioteca para criar a API
const express       = require('express')
const cors          = require('cors')
const bodyParser    = require('body-parser')

//Cria um objeto expecialista no formato JSON para receber os dados do body (POST E PUT)
const bodyParserJSON = bodyParser.json()

//Porta
const PORT = process.PORT || 8080

//Instancia na classe do express
const app = express()



app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    app.use(cors())
    next()
})

const controllerFilme = require('./controller/filme/controller_filme.js')

app.get('/v1/locadora/filme', cors(), async (request, response) => {
    let filme = await controllerFilme.listarFilmes()

    response.status(filme.status_code)
    response.json(filme)
})

app.get('/v1/locadora/filme/:id', cors(), async (request, response) => {
    
    //Recebe o Id enviado na requisiçao via parametro
    let idFilme = request.params.id
    
    let filme = await controllerFilme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})


app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function (request, response){
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //chama a funçai da controller para inserir o filme, enviamos os dados do body e o content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON, async function(request, response){
    let dadosBody = request.body
    let idFilme =  request.params.id
    let contentType = request.headers['content-type']

    let filme = await controllerFilme.atualizarFilme(dadosBody, idFilme, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

app.delete('/v1/locadora/filme/:id', cors(), async function (request, response) {
    let idFilme = request.params.id
    let filme = await controllerFilme.excluirFilme(idFilme)
    response.status(filme.status_code)
    response.json(filme)
})

app.listen(PORT, () => {
    console.log('API aguardando requisições.....')
})