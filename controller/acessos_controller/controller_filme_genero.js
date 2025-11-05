/******************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulaçao de dados entre o APP e a model 
 * (Validaçoes, tratamento de dados, tratamentos de erros, etc)
 * Data:05/11/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

const { json } = require('body-parser')

const filmeGeneroDAO = require('../model/DAO/filme_genero.js')

// Assumindo que o caminho corrigido '.. /modulo/config_message.js' está funcionando
const { MESSAGE_SUCESS_REQUEST, MESSAGE_DEFAULT, MESSAGE_SUCESS_CREATED_TTER, MESSAGE_SUCESS_UPDATE_TTER, SUCCESS_DELETED_ITEM, ERROR_NOT_FOUND, ERROR_INTERNAL_SERVER_MODEL, ERROR_INTERNAL_SERVER_CONTROLLER, ERROR_REQUIRED_FIELDS, ERROR_CONTENT_TYPE } = require('../../modulo/config_message.js');


const ListarFilmsGeneros = async function(){
    let MESSAGE = { ...MESSAGE_DEFAULT }; // CLONAGEM CORRIGIDA

    try {
        let voltaFilmsGeneros = await filmeGeneroDAO.getSelectAllFilmsGeneros() 

        if(voltaFilmsGeneros !== false){
            if(voltaFilmsGeneros.length > 0){
                MESSAGE.HEADER.status       = MESSAGE_SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code  = MESSAGE_SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films_generos = voltaFilmsGeneros
    
                return MESSAGE.HEADER
            } else {
                return ERROR_NOT_FOUND // Usando a constante importada
            }
        } else {
            return ERROR_INTERNAL_SERVER_MODEL // Usando a constante importada
        }

    } catch (error) {
        console.error(error);
        return ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarFilmsGerenoId = async function(id){
    let MESSAGE = { ...MESSAGE_DEFAULT }; // CLONAGEM CORRIGIDA

    try {
        
        if(id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

            // CORRIGIR: Aqui está faltando o nome da função no DAO, você colocou 'g'
            // Assumindo que o nome da função é 'getSelectFilmsGeneroById' ou similar
            let result = await filmeGeneroDAO.getSelectFilmsGeneroById(parseInt(id)) // Mude g para o nome correto da função

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE_SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE_SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.films_generos = result

                    return MESSAGE.HEADER //200
                }else {
                    return ERROR_NOT_FOUND //404
                }
            }else{
                return ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] invalido!!!'
            return ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

//retorna os filme filtrando pelo id do genero
const listarGenerosIdFilme = async function(idFilme){
    let MESSAGE = { ...MESSAGE_DEFAULT }; // CLONAGEM CORRIGIDA

    try {
        
        // CORREÇÃO: !isNaN(id) mudado para !isNaN(idFilme)
        if(idFilme != '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0){

            let result = await filmeGeneroDAO.getSelectGenresByidFilme(parseInt(idFilme))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE_SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE_SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.films_generos = result

                    return MESSAGE.HEADER //200
                }else {
                    return ERROR_NOT_FOUND //404
                }
            }else{
                return ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_FILME] invalido!!!'
            return ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

//retorna os generos filtrando pelo id do filme
const listarFilmeIdGenero = async function(idGenero){
    let MESSAGE = { ...MESSAGE_DEFAULT }; // CLONAGEM CORRIGIDA

    try {
        
        // CORREÇÃO: !isNaN(id) mudado para !isNaN(idGenero)
        if(idGenero != '' && idGenero != null && idGenero != undefined && !isNaN(idGenero) && idGenero > 0){

            let result = await filmeGeneroDAO.getSelectFilmsByidGenre(parseInt(idGenero))

            if(result){
                if(result.length > 0){
                    MESSAGE.HEADER.status = MESSAGE_SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE_SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.films_generos = result

                    return MESSAGE.HEADER //200
                }else {
                    return ERROR_NOT_FOUND //404
                }
            }else{
                return ERROR_INTERNAL_SERVER_MODEL
            }
        }else{
            ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_GENERO] invalido!!!'
            return ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
        return ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const inserirFilmeGenero = async function(filme_genero, contentType){
    let MESSAGE = { ...MESSAGE_DEFAULT };

    try {
        
        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){

            // CORREÇÃO: Passando MESSAGE_DEFAULT para a função de validação
            let statusValidacao = validarDadosFilmeGenero(filme_genero, MESSAGE_DEFAULT); 
            
            if(!statusValidacao){

                let dadosRetorno = await filmeGeneroDAO.setInsertFilmsGenero(filme_genero);

                if(dadosRetorno){ 
                    
                    MESSAGE.HEADER.status      = MESSAGE_SUCESS_CREATED_TTER.status
                    MESSAGE.HEADER.status_code = MESSAGE_SUCESS_CREATED_TTER.status_code
                    MESSAGE.HEADER.message     = MESSAGE_SUCESS_CREATED_TTER.message
                    MESSAGE.HEADER.response    = dadosRetorno

                    return MESSAGE.HEADER
                    
                } else {
                    return ERROR_INTERNAL_SERVER_MODEL
                }
            } else {
                return statusValidacao
            }
        } else {
            return ERROR_CONTENT_TYPE
        }
    } catch (error) {
        console.error("ERRO NO CONTROLLER:", error);
        return ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const validarDadosFilmeGenero = function(filme_genero, MESSAGE_DEFAULT) {
    // CORREÇÃO: Usando spread operator para clonagem segura
    let MESSAGE = { ...MESSAGE_DEFAULT };

    if (filme_genero.filme_id === '' || filme_genero.filme_id === null || filme_genero.filme_id === undefined || isNaN(filme_genero.filme_id)) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [FILME_ID] inválido! (Obrigatório e numérico)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    } 
    
    if (filme_genero.genero_id === '' || filme_genero.genero_id === null || filme_genero.genero_id === undefined || isNaN(filme_genero.genero_id)) { 
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GENERO_ID] inválido! (Obrigatório e numérico)';
        return MESSAGE.ERROR_REQUIRED_FIELDS;
    } 
    
    return false;
};

const atualizarFilmeGenero = async function(filme_genero, id, contentType){

    let MESSAGE = { ...MESSAGE_DEFAULT }; // CLONAGEM CORRIGIDA
    
    try {
        
        if (id === '' || id === undefined || isNaN(id) || parseInt(id) < 1) {
            ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!! (Deve ser um número inteiro positivo)';
            return ERROR_REQUIRED_FIELDS;
        }

        if(String(contentType).toUpperCase() === 'APPLICATION/JSON'){
    
            // CORREÇÃO: Passando 'filme_genero' e 'MESSAGE_DEFAULT'
            let validarDados = validarDadosFilmeGenero(filme_genero, MESSAGE_DEFAULT)
    
            if(!validarDados){

                let validarId = await buscarFilmsGerenoId(id) 

                if(validarId.status_code === 200){
                    
                    // CORREÇÃO: Atribuindo ID a 'filme_genero'
                    filme_genero.id = parseInt(id)

                    let result = await filmeGeneroDAO.setUpdateFilmeGeneros(filme_genero)
                        
                    if(result){
                        
                        MESSAGE.HEADER.status       =   MESSAGE_SUCESS_UPDATE_TTER.status
                        MESSAGE.HEADER.status_code  =   MESSAGE_SUCESS_UPDATE_TTER.status_code
                        MESSAGE.HEADER.message      =   MESSAGE_SUCESS_UPDATE_TTER.message
                        MESSAGE.HEADER.response     =   filme_genero
        
                        return MESSAGE.HEADER
                    }else{
                        return ERROR_INTERNAL_SERVER_MODEL
                    }
                }else {
                    return validarId
                }
            }else{
                return validarDados 
            }
        }else {
            return ERROR_CONTENT_TYPE
        } 
    } catch (error) {
        console.error("ERRO CRÍTICO NA ATUALIZAÇÃO DO GÊNERO (Controller):", error);
        return ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


const excluirGenero = async function (id) {
    let MESSAGE = { ...MESSAGE_DEFAULT }; // CLONAGEM CORRIGIDA

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id)) {
            
            let validarID = await buscarFilmsGerenoId(id)

            if (validarID.status_code == 200) {

                let result = await filmeGeneroDAO.setDeleteFilmeGenero(parseInt(id))

                if (result) {

                    MESSAGE.HEADER.status       = SUCCESS_DELETED_ITEM.status
                    MESSAGE.HEADER.status_code  = SUCCESS_DELETED_ITEM.status_code
                    MESSAGE.HEADER.message      = SUCCESS_DELETED_ITEM.message

                    return MESSAGE.HEADER // 200

                } else {
                    return ERROR_INTERNAL_SERVER_MODEL 
                }
            } else { 
                
                return validarID
            }
        } else {
            ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!!'
            return ERROR_REQUIRED_FIELDS 
        }
    } catch (error) {
        console.log(error)
        return ERROR_INTERNAL_SERVER_CONTROLLER // 500 (Erro no Controller)
    }
}
module.exports = {
    ListarFilmsGeneros,
    buscarFilmsGerenoId,
    listarGenerosIdFilme,
    listarFilmeIdGenero,
    inserirFilmeGenero,
    validarDadosFilmeGenero,
    atualizarFilmeGenero,
    excluirGenero 
}