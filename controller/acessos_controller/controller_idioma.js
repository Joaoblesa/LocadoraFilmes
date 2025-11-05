

const { json } = require('body-parser')

const idiomaDAO = require('../../model/DAO/idioma.js')


const { MESSAGE_SUCESS_REQUEST } = require('../modulo/config_message.js')

const MESSAGE_DEFAULT = require('../modulo/config_message.js')


const ListarIdioma = async function(){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let voltaIdioma = await idiomaDAO.getSelectAllIdioma() 

        if(voltaIdioma !== false){
            if(voltaIdioma.length > 0){
                MESSAGE.HEADER.status       = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code  = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films = voltaIdioma
    
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

const buscarIdiomaId = async function(id){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            let idioma = await idiomaDAO.getSelectByid(parseInt(id))

            if(idioma){
                if(idioma.length > 0){
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.ator = idioma

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

const inserirIdioma = async function(idioma, contentType){
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    try {
        
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){

            let statusValidacao = await validarDadosIdioma(idioma, MESSAGE_DEFAULT); 
            
            if(!statusValidacao){

                let dadosRetorno = await idiomaDAO.setInsertIdioma(idioma);

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

const validarDadosIdioma = function(idioma, MESSAGE_DEFAULT) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT));

    if (!idioma.nome || idioma.nome.length === 0 || idioma.nome.length > 80) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido! (Obrigatório, e deve ter no máximo 80 caracteres)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    }
    
    
    return false;
};

const atualizarIdioma = async function(idioma, id, contentType){

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    

    try {
        
        if (id === '' || id === undefined || isNaN(id) || parseInt(id) < 1) {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!! (Deve ser um número inteiro positivo)';
            return MESSAGE.ERROR_REQUIRED_FIELDS;
        }

        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
    
            let validarDados = validarDadosIdioma(idioma, MESSAGE_DEFAULT)
    
            if(!validarDados){

                let validarId = await buscarIdiomaId(id) 

                if(validarId.status_code === 200){
                    
                    idioma.id = parseInt(id)

                    let result = await idiomaDAO.setUpdateIdioma(idioma)
                        
                    if(result){
                        
                        MESSAGE.HEADER.status       =   MESSAGE.SUCESS_UPDATE_TTER.status
                        MESSAGE.HEADER.status_code  =   MESSAGE.SUCESS_UPDATE_TTER.status_code
                        MESSAGE.HEADER.message      =   MESSAGE.SUCESS_UPDATE_TTER.message
                        MESSAGE.HEADER.response     =   idioma
        
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

const excluirIdioma= async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (id != '' && id != null && id != undefined && !isNaN(id)) {
            
            let validarID = await buscarIdiomaId(id)

            if (validarID.status_code == 200) {

                let result = await idiomaDAO.setDeleteIdioma(parseInt(id))

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

module.exports  = {
    ListarIdioma,
    buscarIdiomaId,
    inserirIdioma,
    atualizarIdioma,
    excluirIdioma
}