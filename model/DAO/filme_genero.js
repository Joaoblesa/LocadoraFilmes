/******************************************************************************************
 * Objetivo: Arquivo responsavel pela realização do CRUD de genero no Banco de Dados MYSQL
 * Data:22/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/


const { PrismaClient, Prisma } = require('../../generated/prisma'); 
const prisma = new PrismaClient();


// Função para listar todos os filmes e Gêneros
const getSelectAllFilmsGeneros = async function (){

    try {
        //script SQL
        let sql = `select * from tbl__filme_genero order by id desc` // Adicionado order by para facilitar

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)
    
        // 3. CORREÇÃO: Validaçao para identificar se o retorno do BD e uma ARRAY e se tem dados.
        if(Array.isArray(result) && result.length > 0)
            return  result
        else
            return false
    } catch (error) {
        console.error("ERRO CRÍTICO DAO getSelectAllGenero:", error);
        return false
    }
}

// Função para buscar Gênero pelo ID
const getSelectByidFilmeGenero = async function (id){

    try {
        
        let sql = `select * from tbl__filme_genero where id=${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result) && result.length > 0)
            return result
        else
            return false

    } catch (error) {
        console.error("ERRO CRÍTICO DAO getSelectByidGenero:", error);
        return false
    }
}

//retorna os generos filtrando pelo id do filme do banco de dados
const getSelectGenresByidFilme = async function (idFilme){

    try {
        
        let sql = `select tbl__genero.id, tbl_genero.nome
         from tbl_filme
            inner join tbl_filme_genero 
                on tbl_filme.id = tbl_filme_genero.filme_id
            inner join tbl_genero
                on tbl_genero.id = tbl_filme.genero_id
         where tbl_filme.id=${idFilme}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result) && result.length > 0)
            return result
        else
            return false

    } catch (error) {
        console.error("ERRO CRÍTICO DAO getSelectByidGenero:", error);
        return false
    }
}

//retorna os generos filtrando pelo id do genero do banco de dados
const getSelectFilmsByidGenre = async function (idGenero){

    try {
        
        let sql = `select tbl__filme.id, tbl_tbl.nome
         from tbl_filme
            inner join tbl_filme_genero 
                on tbl_filme.id = tbl_filme_genero.filme_id
            inner join tbl_genero
                on tbl_genero.id = tbl_filme.genero_id
         where tbl_genero.id=${idGenero}`

        let result = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(result) && result.length > 0)
            return result
        else
            return false

    } catch (error) {
        console.error("ERRO CRÍTICO DAO getSelectByidGenero:", error);
        return false
    }
}


// Função para inserir novo Gênero
const setInsertFilmsGenero = async function(filmeGenero){
    try {
        let sql = `
        insert into tbl__filme_genero (filme_id, genero_id)
           values( 
                    ${filmeGenero.filme_id}, ${filmeGenero.genero_id}
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

// Função para atualizar Gênero
const setUpdateFilmeGeneros = async function(filmeGenero){
    try {
        let result = await prisma.$executeRaw(Prisma.sql`
            UPDATE tbl__filme_genero SET 
                filme_id       =                ${filmeGenero.filme_id},
                genero_id  =                ${filmeGenero.genero_id}
                WHERE filme_genero_id   =                ${filmeGenero.id}
        `);

        if(result)
            return true
        else
            return false
    } catch (error) {
        console.error("ERRO CRÍTICO DAO setUpdateGeneros:", error);
        return false
    }
}

// Função para deletar Gênero
const setDeleteFilmeGenero = async function(id){
    try {

        let sql = `DELETE FROM tbl__filme_genero WHERE id = ${id}`

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
    getSelectAllFilmsGeneros,
    getSelectByidFilmeGenero,
    getSelectAllFilmsGeneros,
    getSelectGenresByidFilme,
    getSelectFilmsByidGenre,
    setInsertFilmsGenero,
    setUpdateFilmeGeneros,
    setDeleteFilmeGenero
}