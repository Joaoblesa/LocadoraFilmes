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

const controllerFilme = require('./controller/acessos_controller/controller_filme.js')

const controllerGenero = require('./controller/acessos_controller/controller_genero.js')

const controllerAtor = require('./controller/acessos_controller/controller_ator.js')

const controllerPersonagem = require('./controller/acessos_controller/controller_personagem.js')

const controllerIdioma = require('./controller/acessos_controller/controller_idioma.js')

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

//1
app.get('/v1/locadora/ator', cors(), async (request, response) => {
    let ator = await controllerAtor.listarAtor()

    const statusCode = ator?.status_code || 500; 

    response.status(statusCode)
    response.json(ator)
})

//2
app.get('/v1/locadora/ator/:id', cors(), async (request, response) => {

    let idAtor = request.params.id
    let ator = await controllerAtor.buscarAtorId(idAtor)

    response.status(ator.status_code)
    response.json(ator)

})

//3
app.post('/v1/locadora/ator', cors(), bodyParserJSON, async function (request, response){
    //Recebe o objeto JSON pelo body da requisição
    let dadosBody = request.body

    //Recebe o content type da requisição
    let contentType = request.headers['content-type']

    //chama a funçao da controller para inserir o ator, enviamos os dados do body e o content-type
    let ator = await controllerAtor.inserirAtor(dadosBody, contentType)

    response.status(ator.status_code)
    response.json(ator)
})

//4
app.put('/v1/locadora/ator/:id', cors(), bodyParserJSON, async function(request, response){
    let dadosBody = request.body
    let idAtor =  request.params.id
    let contentType = request.headers['content-type']

    let ator = await controllerAtor.atualizarAtor(dadosBody, idAtor, contentType)

    response.status(ator.status_code)
    response.json(ator)
})
//5
app.delete('/v1/locadora/ator/:id', cors(), async function (request, response) {
    let idAtor = request.params.id
    let Ator = await controllerAtor.excluirAtor(idAtor)
    response.status(Ator.status_code)
    response.json(Ator)
})

//1
app.get('/v1/locadora/personagem', cors(), async (request, response) => {
    let personagem = await controllerPersonagem.ListarPersonagem()

    const statusCode = personagem?.status_code || 500; 

    response.status(statusCode)
    response.json(personagem)
})

//2
app.get('/v1/locadora/personagem/:id', cors(), async (request, response) => {

    let idPersonagem = request.params.id
    let personagem = await controllerPersonagem.buscarPersonagemId(idPersonagem)

    response.status(personagem.status_code)
    response.json(personagem)

})

//3
app.post('/v1/locadora/personagem', cors(), bodyParserJSON, async function (request, response){
    let dadosBody = request.body

    let contentType = request.headers['content-type']

    let personagem = await controllerPersonagem.inserirPersonagem(dadosBody, contentType)

    response.status(personagem.status_code)
    response.json(personagem)
})

//4
app.put('/v1/locadora/personagem/:id', cors(), bodyParserJSON, async function(request, response){
    let dadosBody = request.body
    let idPersonagem =  request.params.id
    let contentType = request.headers['content-type']

    let personagem = await controllerPersonagem.atualizarPersonagem(dadosBody, idPersonagem, contentType)

    response.status(personagem.status_code)
    response.json(personagem)
})

//5
app.delete('/v1/locadora/personagem/:id', cors(), async function (request, response) {
    let idPersonagem = request.params.id
    let personagem = await controllerPersonagem.excluirPersonagem(idPersonagem)
    response.status(personagem.status_code)
    response.json(personagem)
})

//1
app.get('/v1/locadora/idioma', cors(), async (request, response) => {
    let idioma = await controllerIdioma.ListarIdioma()

    const statusCode = idioma?.status_code || 500; 

    response.status(statusCode)
    response.json(idioma)
})

//2
app.get('/v1/locadora/idioma/:id', cors(), async (request, response) => {

    let ididioma = request.params.id
    let idioma = await controllerIdioma.buscarIdiomaId(ididioma)

    response.status(idioma.status_code)
    response.json(idioma)

})

app.listen(PORT, () => {
    console.log('API aguardando requisições.....')
})