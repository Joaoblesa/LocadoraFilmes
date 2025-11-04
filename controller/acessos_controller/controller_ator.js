/******************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulaçao de dados entre o APP e a model 
 *                      (Validaçoes, tratamento de dados, tratamentos de erros, etc)
 * Data:29/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

const { json } = require('body-parser')

const atorDAO = require('../../model/DAO/ator.js')


const { MESSAGE_SUCESS_REQUEST } = require('../modulo/config_message.js')

const MESSAGE_DEFAULT = require('../modulo/config_message.js')

const listarAtor = async function(){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let voltaAtor = await atorDAO.getSelectAllAtor() 

        if(voltaAtor !== false){
            if(voltaAtor.length > 0){
                MESSAGE.HEADER.status       = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.ator = voltaAtor
    
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

const buscarAtorId = async function(id){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let ator = await atorDAO.getSelectByidAtor(parseInt(id))

            if(ator){
                if(ator.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.ator = ator

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

const inserirAtor = async function(ator, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){

            let statusValidacao = await validarDadosAtor(ator, MESSAGE_DEFAULT); 
            
            if(!statusValidacao){

                let dadosRetorno = await atorDAO.setInsertAtor(ator);

                if(dadosRetorno){ 
                    
                    MESSAGE.HEADER.status      = MESSAGE.SUCESS_CREATED_TTER.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_TTER.status_code
                    MESSAGE.HEADER.message     = MESSAGE.SUCESS_CREATED_TTER.message
                    MESSAGE.HEADER.response    = dadosRetorno

                    return MESSAGE.HEADER
                    
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
        console.error("ERRO NO CONTROLLER:", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDadosAtor = function(ator, MESSAGE_DEFAULT) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    if (!ator.nome || ator.nome.length === 0 || ator.nome.length > 150) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido! (Obrigatório, e deve ter no máximo 150 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (ator.idade === null || ator.idade === undefined || isNaN(ator.idade) || ator.idade <= 0 || ator.idade >= 1000) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [IDADE] inválido! (Obrigatório, deve ser numérico com no máximo 4 dígitos no total e 1 decimal)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (!ator.data_nascimento || ator.data_nascimento.length === 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA_NASCIMENTO] inválido! (Obrigatório)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (ator.nacionalidade && ator.nacionalidade.length > 15) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NACIONALIDADE] inválido! (Deve ter no máximo 15 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (ator.atuando === null || ator.atuando === undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ATUANDO] inválido! (Obrigatório, deve ser booleano)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (ator.estado_civil && ator.estado_civil.length > 40) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ESTADO_CIVIL] inválido! (Deve ter no máximo 40 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (!ator.genero || ator.genero.length === 0 || ator.genero.length > 70) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GENERO] inválido! (Obrigatório, e deve ter no máximo 70 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (ator.altura !== null && ator.altura !== undefined && (isNaN(ator.altura) || ator.altura < 0 || ator.altura >= 10)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ALTURA] inválido! (Deve ser numérico, com formato X.XX e máximo de 3 dígitos no total)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (ator.biografia !== null && ator.biografia !== undefined && typeof ator.biografia === 'string' && ator.biografia.length === 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [BIOGRAFIA] inválido! (Não pode ser uma string vazia se estiver preenchido)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (ator.foto && ator.foto.length > 500) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [FOTO] inválido! (URL da foto deve ter no máximo 500 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    return false;
};

const atualizarAtor = async function(ator, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    

    try {
        
        if (id === '' || id === undefined || isNaN(id) || parseInt(id) < 1) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!! (Deve ser um número inteiro positivo)';
            return MESSAGE.ERROR_REQUIRED_FIELDS;
        }

        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
    
            let validarDados = validarDadosAtor(ator, MESSAGE_DEFAULT)
    
            if(!validarDados){

                let validarId = await buscarAtorId(id) 

                if(validarId.status_code === 200){
                    
                    ator.id = parseInt(id)

                    let result = await atorDAO.setUpdateAtor(ator)
                        
                    if(result){
                        
                        MESSAGE.HEADER.status       =   MESSAGE.SUCESS_UPDATE_TTER.status
                        MESSAGE.HEADER.status_code  =   MESSAGE.SUCESS_UPDATE_TTER.status_code
                        MESSAGE.HEADER.message      =   MESSAGE.SUCESS_UPDATE_TTER.message
                        MESSAGE.HEADER.response     =   ator
        
                        return MESSAGE.HEADER
                    }else{
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL
                    }
                }else {
                    return validarId
                }
            }else{
                return validarDados 
            }
        }else {
            return MESSAGE.ERROR_CONTENT_TYPE
        } 
    } catch (error) {
        console.error("ERRO CRÍTICO NA ATUALIZAÇÃO DO ATOR (Controller):", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const excluirAtor = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (id != '' && id != null && id != undefined && !isNaN(id)) {
            
            let validarID = await buscarAtorId(id)

            if (validarID.status_code == 200) {

                let result = await atorDAO.setDeleteAtor(parseInt(id))

                if (result) {
                    
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETED_ITEM.message

                    return MESSAGE.HEADER // 200

                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL 
                }
            } else { 
                
                return validarID
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER 
    }
}

module.exports = {
    listarAtor,
    buscarAtorId,
    inserirAtor,
    atualizarAtor,
    excluirAtor

}