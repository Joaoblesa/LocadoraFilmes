/******************************************************************************************
 * Objetivo: Arquivo responsavel pela realização do CRUD de filme no Banco de Dados MYSQL
 * Data:01/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/
/**
 * Dependencias do node para Banco de Dados Relacinal
 *      sequelize -> Foi uma biblioteca para acesso a banco de dados
 *      Prisma    -> E uma biblioteca atual para acesso e manipulaçao de dados; utilizando
 *                              SQL OU DBA (Mysql, PostgreSQl, SQLserver)
 *      knex      -> É uma biblioteca atual para acesso é manipulação de dados, utilizando
 *                              SQL (Mysql) 
 *
 * Dependecias de node para Banco de Dados Nao relacional
 *      mongoo    -> É uma biblioteca para acesso a banco de dados nao relacional (MongoDB)
 * 
 * Instalaçao do Prisma
 * npm install prisma --save            -> Realiza a conexao com o BD
 * npm install @prisma/client --save    -> Permite executar scripts SQL no BD
 * npx prisma migrate dev               -> Permite sincronizar o Prisma com o BD
 *                                         conforme as configuraçoes do BD
 * npx prisma migrate reset             -> Realiza o reset do dataBase
 * npx prisma generate                  
 * 
 * 
 *  $queryRawUnsafe()                   -> Permite executar apenas scripts SQL que retornam
 *      dados do BD (SELECT), permite tambem executar um script SQL atraves
 *      de uma variavel
 * 
 *  $executeRawUnsafe()                 -> Permite executar scripts SQL que NÂO retornam dados
 *      do BD (INSERT, UPDATE, DELETE)
 * 
 * $queryRaw()                          -> Permite executar apenas scripts SQL que retornam
 *      dados do BD (SELECT), permite apenas  executar um script SQL direto no metodo. Permite
 *      tambem aplicar segurança contra SQL injection
 * 
 *  $executeRaw()                       -> Permite executar scripts SQL que NÂO retornam dados
 *      do BD (INSERT, UPDATE, DELETE), permite APENAS executar um script SQL direto no metodo. 
 *      Permite tambem aplicar segurança contra SQL Injection
 *
*/

//import da biblioteca do prismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes do banco de dados
const getSelectAllFilms = async function(){

try {
    //script SQL
    let sql = `select * from tbl_filme order by id desc`

    //Executa no BD o script SQL
    let result = await prisma.$queryRawUnsafe(sql)

    //validaçao para identificar se o retorno do BD e uma ARRAY (vazio ou com dados)
    if(Array.isArray(result))
        return result
    else
        return false

} catch (error) {

        return false
    }
}

//Retorna um filme filtrando pelo ID do banco de dados
const getSelectByidFilms = async function(id){
    try {
        //script SQL
        let sql = `select * from tbl_filme where id=${id}`
    
        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)
    
        //validaçao para identificar se o retorno do BD e uma ARRAY (vazio ou com dados)
        if(Array.isArray(result))
            return result
        else
            return false
    
    } catch (error) {
    
            return false
        }
}

//Insere um Filme no banco de dados
const setInsertFilms = async function(filme){
    try {
        let sql = `
        insert into tbl_filme (nome, sinopse, data_lancamento, duracao, orcamento, trailer, capa)
           values( 
                                                                                                    '${filme.nome}',
                                                                                                    '${filme.sinopse}',
                                                                                                    '${filme.data_lancamento}',
                                                                                                    '${filme.duracao}',
                                                                                                    '${filme.orcamento}',
                                                                                                    '${filme.trailer}',
                                                                                                    '${filme.capa}'
                                                                                );
        `

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//Atualiza um filme existente no banco de dados filtrando pelo ID
const setUpdateFilms = async function(filme){
    try {
        let sql = `update tbl_filme set 
                    nome                    =   '${filme.nome}',
                    sinopse                 =   '${filme.sinopse}',
                    data_lancamento         =   '${filme.data_lancamento}',
                    duracao                 =   '${filme.duracao}',
                    orcamento               =   '${filme.orcamento}',
                    trailer                 =   '${filme.trailer}',
                    capa                    =   '${filme.capa}'
                where id = ${filme.id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

//
const setDeleteFilms = async function(id){
    try {

        let sql = `DELETE FROM tbl_filme WHERE id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    getSelectAllFilms,
    getSelectByidFilms,
    setInsertFilms,
    setUpdateFilms,
    setDeleteFilms
}