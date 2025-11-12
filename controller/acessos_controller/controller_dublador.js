/******************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulaçao de dados entre o APP e a model 
 *                      (Validaçoes, tratamento de dados, tratamentos de erros, etc)
 * Data:12/11/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

const { json } = require('body-parser')

const dubladorDAO = require('../../model/DAO/dublador.js')


const { MESSAGE_SUCESS_REQUEST } = require('../../controller/modulo/config_message.js')

const MESSAGE_DEFAULT = require('../../controller/modulo/config_message.js')


const listarDublador = async function(){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let voltaDublador = await dubladorDAO.getSelectAllDublador() 

        if(voltaDublador !== false){
            if(voltaDublador.length > 0){
                MESSAGE.HEADER.status       = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.ator = voltaDublador
    
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

const buscarDubladorId = async function(id){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let dublador = await dubladorDAO.getSelectByidDublador(parseInt(id))

            if(dublador){
                if(dublador.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.ator = dublador

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

const inserirDublador = async function(dublador, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){

            let statusValidacao = await validarDadosDublador(dublador, MESSAGE_DEFAULT); 
            
            if(!statusValidacao){

                let dadosRetorno = await dubladorDAO.setInsertDublador(dublador);

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
        console.error("ERRO NO CONTROLLER DIRETOR:", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDadosDublador = function(dublador, MESSAGE_DEFAULT) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    if (!dublador.nome || dublador.nome.length === 0 || dublador.nome.length > 150) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido! (Obrigatório, e deve ter no máximo 150 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (dublador.idade === null || dublador.idade === undefined || isNaN(dublador.idade) || dublador.idade <= 0 || dublador.idade >= 1000) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [IDADE] inválido! (Obrigatório, deve ser numérico com no máximo 4 dígitos no total e 1 decimal)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (!dublador.data_nascimento || dublador.data_nascimento.length === 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA_NASCIMENTO] inválido! (Obrigatório)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (dublador.nacionalidade && dublador.nacionalidade.length > 15) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NACIONALIDADE] inválido! (Deve ter no máximo 15 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (dublador.atuando === null || dublador.atuando === undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ATUANDO] inválido! (Obrigatório, deve ser booleano)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (dublador.estado_civil && dublador.estado_civil.length > 40) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ESTADO_CIVIL] inválido! (Deve ter no máximo 40 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (!dublador.genero || dublador.genero.length === 0 || dublador.genero.length > 70) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GENERO] inválido! (Obrigatório, e deve ter no máximo 70 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (dublador.biografia !== null && dublador.biografia !== undefined && typeof dublador.biografia === 'string' && dublador.biografia.length === 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [BIOGRAFIA] inválido! (Não pode ser uma string vazia se estiver preenchido)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (dublador.foto && dublador.foto.length > 500) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [FOTO] inválido! (URL da foto deve ter no máximo 500 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    return false;
}

const atualizarDublador = async function(dublador, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    

    try {
        
        if (id === '' || id === undefined || isNaN(id) || parseInt(id) < 1) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!! (Deve ser um número inteiro positivo)';
            return MESSAGE.ERROR_REQUIRED_FIELDS;
        }

        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
    
            let validarDados = validarDadosDublador(dublador, MESSAGE_DEFAULT)
    
            if(!validarDados){

                let validarId = await buscarDubladorId(id) 

                if(validarId.status_code === 200){
                    
                    dublador.id = parseInt(id)

                    let result = await dubladorDAO.setUpdateDublador(dublador)
                        
                    if(result){
                        
                        MESSAGE.HEADER.status       =   MESSAGE.SUCESS_UPDATE_TTER.status
                        MESSAGE.HEADER.status_code  =   MESSAGE.SUCESS_UPDATE_TTER.status_code
                        MESSAGE.HEADER.message      =   MESSAGE.SUCESS_UPDATE_TTER.message
                        MESSAGE.HEADER.response     =   dublador
        
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
        console.error("ERRO CRÍTICO NA ATUALIZAÇÃO DO DIRETOR (Controller):", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const excluirDublador = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (id != '' && id != null && id != undefined && !isNaN(id)) {
            
            let validarID = await buscarDubladorId(id)

            if (validarID.status_code == 200) {

                let result = await dubladorDAO.setDeleteDublador(parseInt(id))

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
    listarDublador,
    buscarDubladorId,
    inserirDublador,
    validarDadosDublador,
    atualizarDublador,
    excluirDublador
}