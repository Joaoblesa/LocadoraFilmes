/******************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulaçao de dados entre o APP e a model 
 *                      (Validaçoes, tratamento de dados, tratamentos de erros, etc)
 * Data:07/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const { json } = require('body-parser')
const filmeDAO = require('../../model/DAO/filme.js')
const { MESSAGE_SUCESS_REQUEST } = require('../modulo/config_message.js')

const MESSAGE_DEFAULT = require('../modulo/config_message.js')

//Retorna uma lista de films
const listarFilmes = async function(){

    //Realizando uma copia do objeto MESSAGE_DEFAULT, Permintindo que as alteraçoes dessa funçao nao interfiram nessas funçoes
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
    //chama a funçao do DAO para retornar a lista de filmes
    let result = await filmeDAO.getSelectAllFilms()

    if(result){
        if(result.length > 0){
            MESSAGE.HEADER.status       = MESSAGE.SUCESS_REQUEST.status
            MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_REQUEST.status_code
            MESSAGE.HEADER.response.films = result

            return MESSAGE.HEADER //200
        }else{
            return MESSAGE.ERROR_NOT_FOUND //404
        }
    }else{
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
    }
}catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
}}

//Retorna um filme filtrando  pelo ID
const buscarFilmeId = async function(id){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

        
    try {
        //validaçao de campo obrigatorio
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){
            //chama funçao para filtrar pelo ID
            let result = await filmeDAO.getSelectByidFilms(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film = result

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_NOT_FOUND//404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo filme
const inserirFilme = async function(filme, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

try {

    if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

        //chama a funçao de validaçao dos dados de cadastro
        let validarDados = await validarDadosFilme(filme)

        if(!validarDados){

            //Chama a funçao do DAO para inserir um novo filme
            let result = await filmeDAO.setInsertFilms(filme)
               
            if(result){
                MESSAGE.HEADER.status   =   MESSAGE.SUCESS_CREATED_TTER.status
                MESSAGE.HEADER.status_code   =   MESSAGE.SUCESS_CREATED_TTER.status_code
                MESSAGE.HEADER.message   =   MESSAGE.SUCESS_CREATED_TTER.message
    
                return MESSAGE.HEADER //201
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            return validarDados //400
        }
    }else {
        return MESSAGE.ERROR_CONTENT_TYPE
    } 
} catch (error) {
    return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
}

}

//atualiza um filme filtrando pelo ID
const atualizarFilme = async function(filme, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        //validaçao do contetnt
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
    
            //chama a funçao de validaçao dos dados de cadastro
            let validarDados = await validarDadosFilme(filme)
    
            if(!validarDados){

                //chama a funçao para validar a consistencia do ID e  verificar se existe no BD
                let validarId = await buscarFilmeId(id)

                if(validarId.status_code == 200){
                    
                    //adicionando o id no jason com os dados do filme
                    filme.id = parseInt(id)

                //Chama a funçao do DAO para atualizar um filme
                let result = await filmeDAO.setUpdateFilms(filme)
                   
                if(result){
                    MESSAGE.HEADER.status           =   MESSAGE.SUCESS_UPDATE_TTER.status
                    MESSAGE.HEADER.status_code      =   MESSAGE.SUCESS_UPDATE_TTER.status_code
                    MESSAGE.HEADER.message          =   MESSAGE.SUCESS_UPDATE_TTER.message
                    MESSAGE.HEADER.response         = filme
        
                    return MESSAGE.HEADER //201
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
                }else {
                    return validarId// retorno da funçao de buscarID (400 ou 401 ou 500)
                }
            }else{
                return validarDados //retorno da funçao de validar dados do filme400
            }
        }else {
            return MESSAGE.ERROR_CONTENT_TYPE
        } 
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

//Apaga um filme filtrando pelo ID-
const excluirFilme = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (id != '' && id != null && id != undefined && !isNaN(id)) {
            let validarID = await buscarFilmeId(id)

            if (validarID.status_code == 200) {

                let result = await filmeDAO.setDeleteFilms(parseInt(id))

                if (result) {
                    MESSAGE.HEADER.status = MESSAGE_SUCCESS_DELETED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE_SUCCESS_DELETED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE_SUCCESS_DELETED_ITEM.message

                    return MESSAGE.HEADER // 200

                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            } else { // Retorna o erro da função buscarFilmeId (pode ser 404, 400 ou 500)
                return validarID
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL_CONTROLLER // 500
    }
}

// validaçao dos dados de cadastro do filme
const validarDadosFilme = async function(filme){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(filme.nome == "" || filme.nome == null || filme.nome == undefined || filme.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] invalido!!!' //400
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }else if(filme.sinopse == undefined){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [SINOPSE] invalido!!!' //400
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }else if(filme.data_lancamento == undefined || filme.data_lancamento.length != 10 ){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA LANÇAMENTO] invalido!!!' 
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filme.duracao == '' || filme.duracao == null || filme.duracao == undefined || filme.duracao.length > 8 ){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DURAÇÂO] invalido!!!' 
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filme.orcamento == '' || filme.orcamento == null || filme.orcamento == undefined || filme.orcamento.length > 14 || typeof(filme.orcamento) != 'number'){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ORÇAMENTO] invalido!!!' 
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filme.trailer == undefined || filme.trailer.length > 200 ) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [TRAILER] invalido!!!' 
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa.length > 200){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CAPA] invalido!!!' 
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else{
        return false
    }
}

module.exports = {
    listarFilmes,
    buscarFilmeId,
    inserirFilme,
    atualizarFilme,
    excluirFilme
}