/******************************************************************************************
 * Objetivo: Arquivo responsavel pela realização do CRUD de genero no Banco de Dados MYSQL
 * Data:22/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

//import da biblioteca do prismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//retorna todos os genero do banco de dados
const getSelectAllGenero = async function (){

    try {
        //script SQL
        let sql = `select * from tbl_genero`
    
        //Executa no BD o script SQL
        let genero = await prisma.$queryRawUnsafe(sql)
    
        //validaçao para identificar se o retorno do BD e uma ARRAY (vazio ou com dados)
        if(Array.isArray(genero))
            return genero
        else
            return false
    } catch (error) {
        console.error("ERRO REAL DO PRISMA:", error);
            return false
        }

}

const getSelectByidGenero = async function (id){

    try {
        
        let sql = `select * from tbl_genero where id=${id}`

        let genero = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(genero))
            return genero
        else
        return  false

    } catch (error) {
        return false
    }

}

const setInsertGenero = async function (dadosGenero){
    try {
        let sql = `
        insert into tbl_genero (nome, descricao)
            values( 
                '${dadosGenero.nome}',
                '${dadosGenero.descricao}'
            );
        `

        let statusInsert = await prisma.$executeRawUnsafe(sql) 

        if(statusInsert)
            return true
        else
            return false
    } catch (error) {
        console.error("ERRO CRÍTICO DAO setInsertGenero (Verifique a Conexão/SQL):", error)
        return false
    }
}



module.exports = {
    getSelectAllGenero,
    getSelectByidGenero,
    setInsertGenero
}