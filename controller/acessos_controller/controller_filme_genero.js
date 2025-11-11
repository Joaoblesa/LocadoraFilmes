/******************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulaçao de dados entre o APP e a model 
 *                      (Validaçoes, tratamento de dados, tratamentos de erros, etc)
 * Data:05/11/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

const { json } = require('body-parser')

const filmeGeneroDAO = require('../../model/DAO/filme_genero.js')

const { MESSAGE_SUCESS_REQUEST } = require('../modulo/config_message.js')

const MESSAGE_DEFAULT = require('../modulo/config_message.js')

const listarFilmesGeneros = async function () {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await filmeDAO.getSelectAllFilmsGenres()

        if(result){
            if(result.length > 0){
                MESSAGE.HEADER.status           = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code      = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.filmsGenders  = result 

                return MESSAGE.HEADER //200 retorna a mensagem bonitinha
            }else{
                return MESSAGE.ERROR_NOT_FOUND //404 veio o JSON result, mas vazio   
            }
        }else{
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500 nao veio o json result da model erro na própia if(result)
         }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500 ele nao vai passr do try catch, logo erro neste arquivo
    }
    
}

const buscarFilmeGeneroPeloId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if( id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let result = await filmeDAO.getSelectFilmGenreById(parseInt(id))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmsGenre = result

                    return MESSAGE.HEADER //200

                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const inserirFilmeGenero = async function (filmeGenero, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validarDados = await validarDadosGenero(filmeGenero)

            if(!validarDados){

                let result = await filmeDAO.setInsertFilmsGenres(filmeGenero)

                if(result){
                     let lastIdGenero = await filmeDAO.getSelectLastId()

                     if(lastIdGenero){
                        filmeGenero.id              = lastIdGenero
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = filmeGenero

                        return MESSAGE.HEADER //201
                     }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                     }
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validarDados
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415 esse erro se dá, devido ao formato de dados que foi enviado só acitamos JSON
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }

}

const atualizarFilmeGenero = async function (filmeGenero, id, contentType) {
   let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){
            let validarDados = await validarDadosFilmeGenero(filmeGenero)

            if(!validarDados){
                let validarId = await buscarFilmeGeneroPeloId(parseInt(id))

                if(validarId.status_code == 200){
                    filmeGenero.id = parseInt(id)

                    let result = filmeDAO.setUpdateFilmsGenres(filmeGenero)

                    if(result){
                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response     = filmeGenero

                        return MESSAGE.HEADER //201
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                    }
                }else{
                    return validarId
                }
            }else{
                return validarDados
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

const excluirFilmeGenero = async function (id) {
     let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

     try {
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){
            let validarId = await buscarFilmeGeneroPeloId(id)
            
            if(validarId.status_code == 200){
                let result = await filmeDAO.setDeleteFilmsGenres(parseInt(id))
                if(result){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_DELETED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_DELETED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCESS_DELETED_ITEM.message

                    delete MESSAGE.HEADER.response

                    return MESSAGE.HEADER //200
                }else{
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
                }
            }else{
                return validarId //404
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
     } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
     }
}

const validarDadosGenero = async function (filmeGenero) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(filmeGenero.id_filme == '' || filmeGenero.id_filme == null || filmeGenero.id_filme == undefined || filmeGenero.id_filme.length <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo id filme inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400
    }else if(filmeGenero.id_genero == '' || filmeGenero.id_genero == null || filmeGenero.id_genero == undefined || filmeGenero.id_genero.length <= 0){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo id genero inválido!'
        return MESSAGE.ERROR_REQUIRED_FIELDS //400

    }else{
        return false
    }
}

//Retorna os generos pelo id do filme 
const listarGenerosIdFilme = async function (idFilme) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if( idFilme != '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0){

            let result = await filmeDAO.getSelectGenreByIdFilm(parseInt(idFilme))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmsGenre = result

                    return MESSAGE.HEADER //200

                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo id_filme inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Retorna os filmes pelo id do genero 
const listarFilmesIdGenero = async function (idGenero) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if( idGenero != '' && idGenero != null && idGenero != undefined && !isNaN(idGenero) && idGenero > 0){

            let result = await filmeDAO.getSelectFilmByIdGenre(parseInt(idGenero))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmsGenre = result

                    return MESSAGE.HEADER //200

                }else{
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo id genero inválido!!!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

module.exports = {
    inserirFilmeGenero,
    listarFilmesGeneros,
    listarFilmesIdGenero,
    listarGenerosIdFilme,
    atualizarFilmeGenero,
    excluirFilmeGenero,
    buscarFilmeGeneroPeloId
}