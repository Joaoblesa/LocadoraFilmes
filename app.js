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

const controllerGenero = require('./controller/filme/controller_genero.js')

//1
app.get('/v1/locadora/filme', cors(), async (request, response) => {
    let filme = await controllerFilme.listarFilmes()

    response.status(filme.status_code)
    response.json(filme)
})

//2
app.get('/v1/locadora/filme/:id', cors(), async (request, response) => {
    
    //Recebe o Id enviado na requisiçao via parametro
    let idFilme = request.params.id
    
    let filme = await controllerFilme.buscarFilmeId(idFilme)

    response.status(filme.status_code)
    response.json(filme)
})

//3
app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function (request, response){
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //chama a funçao da controller para inserir o filme, enviamos os dados do body e o content-type
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

//4
app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON, async function(request, response){
    let dadosBody = request.body
    let idFilme =  request.params.id
    let contentType = request.headers['content-type']

    let filme = await controllerFilme.atualizarFilme(dadosBody, idFilme, contentType)

    response.status(filme.status_code)
    response.json(filme)
})

//5
app.delete('/v1/locadora/filme/:id', cors(), async function (request, response) {
    let idFilme = request.params.id
    let filme = await controllerFilme.excluirFilme(idFilme)
    response.status(filme.status_code)
    response.json(filme)
})

//1
app.get('/v1/locadora/genero', cors(), async (request, response) => {
    let genero = await controllerGenero.ListarGenero()

    const statusCode = genero?.status_code || 500; 

    response.status(statusCode)
    response.json(genero)
})

//2
app.get('/v1/locadora/genero/:id', cors(), async (request, response) => {

    let idGenero = request.params.id
    let genero = await controllerGenero.buscarGeneroId(idGenero)

    response.status(genero.status_code)
    response.json(genero)

})

//3
app.post('/v1/locadora/genero', cors(), bodyParserJSON, async function (request, response){

    const contentType = request.header('content-type'); 
    const defaultError = { status_code: 500, message: "ERRO CRÍTICO INTERNO: Falha na conexão ou na inicialização do modelo." };

    const genero = await controllerGenero.inserirGenero(request.body, contentType);

    const responseBody = (genero && (genero.HEADER || genero.status_code)) ? genero : defaultError;

    const statusCode = responseBody.HEADER 
        ? responseBody.HEADER.status_code 
        : (responseBody.status_code || 500);

    response.status(statusCode).json(responseBody);
});

//4
app.put('/v1/locadora/genero/:id', cors(), bodyParserJSON, async function(request, response){
    let dadosBody = request.body
    let idGenero =  request.params.id
    let contentType = request.headers['content-type']

    let genero = await controllerGenero.atualizarGenero(dadosBody, idGenero, contentType)

    const defaultError = { status_code: 500, message: "ERRO CRÍTICO INTERNO: Falha na camada de Controller/DAO." };
    const responseBody = (genero && (genero.HEADER || genero.status_code)) ? genero : defaultError;
    const statusCode = responseBody.HEADER ? responseBody.HEADER.status_code : (responseBody.status_code || 500);

    response.status(statusCode).json(responseBody);
})

//5
app.delete('/v1/locadora/genero/:id', cors(), async function (request, response) {
    let idGenero = request.params.id
    let genero = await controllerGenero.excluirGenero(idGenero)
    response.status(genero.status_code)
    response.json(genero)
})


app.listen(PORT, () => {
    console.log('API aguardando requisições.....')
})