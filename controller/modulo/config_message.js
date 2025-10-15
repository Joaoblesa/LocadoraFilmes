/*****************************************************************************************************
 * Objetivo: Arquivo responsavel pela padronizaçao de todas as mensagens da API de projeto de Filme
 * Data:07/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************************/


const dataAtual = new Date()

/************************MENSAGENS DE PADRONIZAÇÃO DO PROJETO***************************** */
const HEADER     = {
                            development:        'Joao Vitor Blesa Silva',
                            api_description:    'API para manipular daddos da locadora de filme',
                            version:            '1.0.10.25',
                            request_date:       dataAtual.toLocaleDateString(),
                            status:             Boolean,
                            status_code:        Number,
                            response: {}

}


/************************MENSAGENS DE ERRO DO PROJETO************************************* */
const ERROR_NOT_FOUND                   = {status: false, status_code: 404, message: 'Não foram encontrados dados de retorno!!!'}
const ERROR_INTERNAL_SERVER_MODEL       = {status: false, status_code: 500, message: 'Não foi possivel processar á requisição, devido a problemas na camada de MODELAGEM de dados !!!'}
const ERROR_INTERNAL_SERVER_CONTROLLER  = {status: false, status_code: 500, message: 'Não foi possivel processar á requisição, devido a problemas na camada de CONTROLE de dados !!!'}
const ERROR_REQUIRED_FIELDS             = {status: false, status_code: 400, message: 'Não foi possivel processar a requisição, devido a campos obrigatorio, que nao foram enviados corretamente, conforme a documentaçao da API !!!'}
const ERROR_CONTENT_TIPE                = {status: false, status_code: 415, message: 'Nao foi possivel processar a requisiçao, pois  o tipo de conteudo enviado no body não é permitido'}
/************************MENSAGENS DE SUCESSO DO PROJETO********************************** */
const SUCESS_REQUEST            =   {status: true, status_code: 200, message: 'Requisição bem sucedida!!!'}
const SUCESS_CREATED_TTER       =   {status: true, status_code: 201, message: 'Requisiçao bem sucedida, objeto criado com sucesso !!!'}
const SUCESS_UPDATE_TTER        =   {status: true, status_code: 200, message: 'Requisiçao bem sucedida, objeto atualizado com sucesso !!!'}
const SUCCESS_DELETED_ITEM      =   {status: true, status_code: 200, message: 'Requisição bem sucedida, objeto excluído com sucesso!!!'}


















module.exports = {
    HEADER,
    SUCESS_REQUEST,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    ERROR_REQUIRED_FIELDS,
    SUCESS_CREATED_TTER,
    ERROR_CONTENT_TIPE,
    SUCESS_UPDATE_TTER,
    SUCCESS_DELETED_ITEM
}