/******************************************************************************************
 * Objetivo: Arquivo responsavel pela manipulaçao de dados entre o APP e a model 
 *                      (Validaçoes, tratamento de dados, tratamentos de erros, etc)
 * Data:07/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

//Import do arquivo DAO para manipular o CRUD no BD
const { json } = require('body-parser')

//Importe do arquivo DAO para manipular o CRUD no BD
const filmeDAO = require('../../model/DAO/filme.js')

//Inport da controller_filme_genero
const controllerFilmeGenero = require('./controller_filme_genero.js')

const MESSAGE_DEFAUT = require('../modulo/config_message.js')

//Retorna uma lista de filmes
const listarFilmes = async function () {

    //Realizando uma copia do objeto MESSAGE_DEFAUT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAUT))
    try {

        //Chama a função do DAO para retornar a lista de filmes
        let result = await filmeDAO.getSelectAllFilms()

        // Verifica se o BD retornou algum registro
        if (result) {

            // Verifica se a consulta retornou registros
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films = result

                return MESSAGE.HEADER  // 200
            } else {
                return MESSAGE.ERROR_NOT_FOUND  // 404
            }

        } else {
            return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
        }


    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }

}

//Retorna um filme filtrando pelo ID
const buscarFilmesId = async function (id) {

    //Realizando uma copia do objeto MESSAGE_DEFAUT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAUT))

    try {
        //Validação de campo obrigatorio 
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {
            //Chama a função para filtrar pelo ID    
            let result = await filmeDAO.getSelectByIdAllFilms(parseInt(id))

            // Verifica se o BD retornou algum registro
            if (result) {
                // Verifica se a consulta retornou registros
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }

            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }

        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Id] Invalido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {

        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Insere um novo filme
const inserirFilmes = async function (filme, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAUT))

    try {
        // Validação do content-type
        if (String(contentType).toLocaleUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilme(filme)

            //Verifica se a validação dos dados retornou algum erro
            if (!validarDados) {
                //Processamento verdadeiro

                //Chama a função do DAO para inserir um novo filme
                let result = await filmeDAO.setInsertFilms(filme)

                //Verifica se o BD inseriu um novo registro
                if (result) {

                    //Chama a função para receber o ID gerado do BD
                    let lastIdFilme = await filmeDAO.getSelectLastId()

                    //Verifica se o ID retornado é validos
                    if (lastIdFilme) {

                        // Processamento para inserir dados na tabela de relação entre filme e genero

                        // Repetição para pegar cada genero e enviar para o DAO do filmeGenero
                        //filme.genero.forEach(async (genero) => {
                        for(genero of filme.genero){
                            let filmeGenero = { filme_id: lastIdFilme, genero_id: genero.id }

                            let resultFilmesGeneros = await controllerFilmeGenero.inserirFilmeGenero(filmeGenero, contentType)
                        
                            if (resultFilmesGeneros.status_code != 201) {
                                return MESSAGE.ERROR_RELATION_TABLE // 200, porem com problemas na tabela de relação
                            }
                        }
                        // Adiciona no JSON de filme o ID que foi gerado pelo BD
                        filme.id = lastIdFilme
                        MESSAGE.HEADER.status = MESSAGE.SUCESS_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_CREATED_ITEM.message

                        // Processamento para trazer dados dos generos cadastrados na tabela de relação
                        //Apaga o atributo Genero que chegou pelo post apenas com id
                        delete filme.genero

                        //Pesquisa no BD quais os generos e os seus dados que foram inseridos na tabela relacional
                        let resultGenerosFilme = await controllerFilmeGenero.listarGenerosByIdFilme(lastIdFilme)

                        // Adiciona novamente o atributo genero com todas as informações do genero(ID, Nome)
                        filme.genero = resultGenerosFilme.response

                        MESSAGE.HEADER.response = filme

                        return MESSAGE.HEADER //201 
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                    }

                } else {
                    return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                }
            } else {
                return validarDados //400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Atualiza um filme filtrando pelo id
const atualizarFilmes = async function (filme, id, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAUT))

    try {
        //Validação do content-type
        if (String(contentType).toLocaleUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilme(filme)

            if (!validarDados) {

                //Chama a função para validar a concistencia do Id e verificar se existe no BD
                let validarId = await buscarFilmesId(id)

                //Verifica se o id existe no BD, caso o ID exista teremos o status 200
                if (validarId.status_code == 200) {

                    //Adicionando o ID no JSON com os dados do filme
                    filme.id = parseInt(id)

                    //Processamento verdadeiro
                    let result = await filmeDAO.setUpdateFilms(filme)

                    if (result) {

                        MESSAGE.HEADER.status = MESSAGE.SUCESS_UPDATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCESS_UPDATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCESS_UPDATED_ITEM.message
                        MESSAGE.HEADER.response = filme

                        return MESSAGE.HEADER //201 
                    } else {
                        return MESSAGE.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                } else {
                    return validarId //Retorno da função de buscarFilmeId 400 ou 404 ou 505
                }

            } else {
                return validarDados //Retorno da função de validar dados do Filme 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Exclui um filme filtrando pelo id
const excluirFilmes = async function (id) {
    // Realizando uma copia do objeto MESSAGE_DEFAUT, permitindo que as alterações desta função não interfiram em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAUT))

    try {
        //Chama a função para validar a concistencia do Id e verificar se existe no BD
        let validarId = await buscarFilmesId(id)

        //Verifica se o id existe no BD, caso o ID exista teremos o status 200
        if (validarId.status_code == 200) {
            //Processamento verdadeiro

            //Chama a função do DAO para excluir o filme
            let result = await filmeDAO.setDeleteFilms(parseInt(id))

            // Verifica se o BD excluiu o registro
            if (result) {
                MESSAGE.HEADER.status = MESSAGE.SUCESS_DELETE_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCESS_DELETE_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCESS_DELETE_ITEM.message

                return MESSAGE.HEADER //204
            } else {
                return MESSAGE.ERROR_INTERNAL_SERVER_MODEL //500
            }

        } else {
            return validarId //Retorno da função de buscarFilmeId 400 ou 404 ou 505
        }
    } catch (error) {
        return MESSAGE.ERROR_INTERNAL_SERVER_CONTROLLER //500
    }
}

//Validação dos dados de cadastro do Filme
const validarDadosFilme = async function (filme) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAUT))

    if (filme.nome == "" || filme.nome == null || filme.nome == undefined || filme.nome.length > 100) {
        //ERRO
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [nome] invalido!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS // 400

    } else if (filme.sinopse == undefined) {
        //ERRO
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [sinopne] invalido!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS // 400

    } else if (filme.data_lancamento == undefined || filme.data_lancamento.length != 10) {
        //ERRO
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Data Lançamento] invalido!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS // 400

    } else if (filme.duracao == "" || filme.duracao == null || filme.duracao == undefined || filme.duracao.length > 8) {
        //ERRO
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Duração] invalido!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS // 400

    } else if (filme.orcamento == "" || filme.orcamento == null || filme.orcamento == undefined || filme.orcamento.length > 14 || typeof (filme.orcamento) != 'number') {
        //ERRO
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Orçamento] invalido!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS // 400

    } else if (filme.trailer == undefined || filme.trailer.length > 200) {
        //ERRO
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Trailer] invalido!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS // 400

    } else if (filme.capa == undefined || filme.capa.length > 200) {
        //ERRO
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Capa] invalido!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS // 400

    } else {
        return false
    }
}

module.exports = {
    listarFilmes,
    buscarFilmesId,
    inserirFilmes,
    atualizarFilmes,
    excluirFilmes
}