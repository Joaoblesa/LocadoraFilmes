/******************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulaçao de dados entre o APP e a model 
 *                      (Validaçoes, tratamento de dados, tratamentos de erros, etc)
 * Data:12/11/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

const { json } = require('body-parser')

const diretorDAO = require('../../model/DAO/diretor.js')


const { MESSAGE_SUCESS_REQUEST } = require('../modulo/config_message.js')

const MESSAGE_DEFAULT = require('../modulo/config_message.js')

const listarDiretor = async function(){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let voltaDiretor = await diretorDAO.getSelectAllDiretor() 

        if(voltaDiretor !== false){
            if(voltaDiretor.length > 0){
                MESSAGE.HEADER.status       = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.ator = voltaDiretor
    
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

const buscarDiretorId = async function(id){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let diretor = await diretorDAO.getSelectByidDiretor(parseInt(id))

            if(diretor){
                if(diretor.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.ator = diretor

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

const inserirDiretor = async function(diretor, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){

            let statusValidacao = await validarDadosDiretor(diretor, MESSAGE_DEFAULT); 
            
            if(!statusValidacao){

                let dadosRetorno = await diretorDAO.setInsertDiretor(diretor);

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

const validarDadosDiretor = function(diretor, MESSAGE_DEFAULT) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    if (!diretor.nome || diretor.nome.length === 0 || diretor.nome.length > 150) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido! (Obrigatório, e deve ter no máximo 150 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (diretor.idade === null || diretor.idade === undefined || isNaN(diretor.idade) || diretor.idade <= 0 || diretor.idade >= 1000) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [IDADE] inválido! (Obrigatório, deve ser numérico com no máximo 4 dígitos no total e 1 decimal)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (!diretor.data_nascimento || diretor.data_nascimento.length === 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA_NASCIMENTO] inválido! (Obrigatório)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (diretor.nacionalidade && diretor.nacionalidade.length > 15) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NACIONALIDADE] inválido! (Deve ter no máximo 15 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (diretor.atuando === null || diretor.atuando === undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ATUANDO] inválido! (Obrigatório, deve ser booleano)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (diretor.estado_civil && diretor.estado_civil.length > 40) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ESTADO_CIVIL] inválido! (Deve ter no máximo 40 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (!diretor.genero || diretor.genero.length === 0 || diretor.genero.length > 70) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GENERO] inválido! (Obrigatório, e deve ter no máximo 70 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (diretor.biografia !== null && diretor.biografia !== undefined && typeof diretor.biografia === 'string' && diretor.biografia.length === 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [BIOGRAFIA] inválido! (Não pode ser uma string vazia se estiver preenchido)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (diretor.foto && diretor.foto.length > 500) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [FOTO] inválido! (URL da foto deve ter no máximo 500 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    return false;
}

const atualizarDiretor = async function(diretor, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    

    try {
        
        if (id === '' || id === undefined || isNaN(id) || parseInt(id) < 1) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!! (Deve ser um número inteiro positivo)';
            return MESSAGE.ERROR_REQUIRED_FIELDS;
        }

        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
    
            let validarDados = validarDadosDiretor(diretor, MESSAGE_DEFAULT)
    
            if(!validarDados){

                let validarId = await buscarDiretorId(id) 

                if(validarId.status_code === 200){
                    
                    diretor.id = parseInt(id)

                    let result = await diretorDAO.setUpdateDiretor(diretor)
                        
                    if(result){
                        
                        MESSAGE.HEADER.status       =   MESSAGE.SUCESS_UPDATE_TTER.status
                        MESSAGE.HEADER.status_code  =   MESSAGE.SUCESS_UPDATE_TTER.status_code
                        MESSAGE.HEADER.message      =   MESSAGE.SUCESS_UPDATE_TTER.message
                        MESSAGE.HEADER.response     =   diretor
        
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

const excluirDiretor = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (id != '' && id != null && id != undefined && !isNaN(id)) {
            
            let validarID = await buscarDiretorId(id)

            if (validarID.status_code == 200) {

                let result = await diretorDAO.setDeleteDiretor(parseInt(id))

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
    listarDiretor,
    buscarDiretorId,
    inserirDiretor,
    atualizarDiretor,
    excluirDiretor
}