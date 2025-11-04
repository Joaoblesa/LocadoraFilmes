
/******************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulaçao de dados entre o APP e a model 
 *                      (Validaçoes, tratamento de dados, tratamentos de erros, etc)
 * Data:04/11/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

const { json } = require('body-parser')

const personagemDAO = require('../../model/DAO/personagem.js')


const { MESSAGE_SUCESS_REQUEST } = require('../modulo/config_message.js')

const MESSAGE_DEFAULT = require('../modulo/config_message.js')

const ListarPersonagem = async function(){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let voltaPersonagem = await personagemDAO.getSelectAllPersonagem() 

        if(voltaPersonagem !== false){
            if(voltaPersonagem.length > 0){
                MESSAGE.HEADER.status       = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films = voltaPersonagem
    
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

const buscarPersonagemId = async function(id){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let personagem = await personagemDAO.getSelectByidPersonagem(parseInt(id))

            if(personagem){
                if(personagem.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.ator = personagem

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

const inserirPersonagem = async function(personagem, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){

            let statusValidacao = await validarDadosPersonagem(personagem, MESSAGE_DEFAULT); 
            
            if(!statusValidacao){

                let dadosRetorno = await personagemDAO.setInsertPersonagem(personagem);

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

const validarDadosPersonagem = function(personagem, MESSAGE_DEFAULT) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    if (!personagem.nome || personagem.nome.length === 0 || personagem.nome.length > 150) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido! (Obrigatório, e deve ter no máximo 150 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (!personagem.universo || personagem.universo.length === 0 || personagem.universo.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [UNIVERSO] inválido! (Obrigatório, e deve ter no máximo 100 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (!personagem.apelido || personagem.apelido.length === 0 || personagem.apelido.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [APELIDO] inválido! (Obrigatório, e deve ter no máximo 100 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (!personagem.genero || personagem.genero.length === 0 || personagem.genero.length > 30) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GÊNERO] inválido! (Obrigatório, e deve ter no máximo 30 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (personagem.idade === null || personagem.idade === undefined || isNaN(personagem.idade) || personagem.idade <= 0 || personagem.idade >= 1000) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [IDADE] inválido! (Obrigatório, deve ser numérico, ex: 50.0)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (personagem.especie && personagem.especie.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ESPÉCIE] inválido! (Deve ter no máximo 100 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (personagem.origem && personagem.origem.length > 150) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ORIGEM] inválido! (Deve ter no máximo 150 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }

    if (personagem.classe && personagem.classe.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CLASSE] inválido! (Deve ter no máximo 100 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (!personagem.habilidades || personagem.habilidades.length === 0 || personagem.habilidades.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [HABILIDADES] inválido! (Obrigatório, e deve ter no máximo 200 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    if (!personagem.caracteristica || personagem.caracteristica.length === 0 || personagem.caracteristica.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CARACTERÍSTICA] inválido! (Obrigatório, e deve ter no máximo 200 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    return false;
};

const atualizarPersonagem = async function(personagem, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    

    try {
        
        if (id === '' || id === undefined || isNaN(id) || parseInt(id) < 1) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!! (Deve ser um número inteiro positivo)';
            return MESSAGE.ERROR_REQUIRED_FIELDS;
        }

        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
    
            let validarDados = validarDadosPersonagem(personagem, MESSAGE_DEFAULT)
    
            if(!validarDados){

                let validarId = await buscarPersonagemId(id) 

                if(validarId.status_code === 200){
                    
                    personagem.id = parseInt(id)

                    let result = await personagemDAO.setUpdatePersonagem(personagem)
                        
                    if(result){
                        
                        MESSAGE.HEADER.status       =   MESSAGE.SUCESS_UPDATE_TTER.status
                        MESSAGE.HEADER.status_code  =   MESSAGE.SUCESS_UPDATE_TTER.status_code
                        MESSAGE.HEADER.message      =   MESSAGE.SUCESS_UPDATE_TTER.message
                        MESSAGE.HEADER.response     =   personagem
        
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
        console.error("ERRO CRÍTICO NA ATUALIZAÇÃO DO PERSONAGEM (Controller):", error);
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const excluirPersonagem = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (id != '' && id != null && id != undefined && !isNaN(id)) {
            
            let validarID = await buscarPersonagemId(id)

            if (validarID.status_code == 200) {

                let result = await personagemDAO.setDeletePersonagem(parseInt(id))

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
ListarPersonagem,
buscarPersonagemId,
inserirPersonagem,
atualizarPersonagem,
excluirPersonagem
}