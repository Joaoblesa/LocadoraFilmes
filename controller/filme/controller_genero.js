/******************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulaçao de dados entre o APP e a model 
 *                      (Validaçoes, tratamento de dados, tratamentos de erros, etc)
 * Data:22/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

const { json } = require('body-parser')

const generoDAO = require('../../model/DAO/genero.js')

const { MESSAGE_SUCESS_REQUEST } = require('../modulo/config_message.js')

const MESSAGE_DEFAULT = require('../modulo/config_message.js')

const ListarGenero = async function(){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let voltaGenero = await generoDAO.getSelectAllGenero() 

        if(voltaGenero !== false){
            if(voltaGenero.length > 0){
                MESSAGE.HEADER.status       = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films = voltaGenero
    
                return MESSAGE.HEADER
            } else {
                return MESSAGE.ERROR_NOT_FOUND
            }
        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.error(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
    }
}

const buscarGeneroId = async function(id){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let genero = await generoDAO.getSelectByidGenero(parseInt(id))

            if(genero){
                if(genero.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film = genero

                    return MESSAGE.HEADER //200
                }else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const inserirGenero = async function(dadosGenero, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){

            let statusValidacao = await validarDados(dadosGenero) 

            if(!statusValidacao){ 

                let statusInsert = await generoDAO.setInsertGenero(dadosGenero)

                if(statusInsert){

                    let idGenero = await generoDAO.getSelectByidGenero()

                    if(idGenero){
                        let dadosRetorno = dadosGenero; 
                        dadosRetorno.id = idGenero

                        MESSAGE.HEADER.status       = MESSAGE.SUCESS_CREATED_TTER.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_CREATED_TTER.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCESS_CREATED_TTER.message
                        MESSAGE.HEADER.response     = dadosRetorno

                        return MESSAGE.HEADER
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }
                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return statusValidacao
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error(error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados  = async function(genero){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if(genero.nome == "" || genero.nome == null || genero.nome == undefined || genero.nome.length > 100){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] invalido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS
    }else if(genero.descricao == undefined || genero.descricao > 200 ){
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DESCRICAO] invalido!!!'
    }else{
        return false
    }
}


module.exports = {
    ListarGenero,
    buscarGeneroId,
    inserirGenero
}