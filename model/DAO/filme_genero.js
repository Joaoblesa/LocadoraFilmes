/******************************************************************************************
 * Objetivo: Arquivo responsavel pela realização do CRUD de genero no Banco de Dados MYSQL
 * Data:22/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/


const { PrismaClient, Prisma } = require('../../generated/prisma'); 
const prisma = new PrismaClient();


// Retornar todos os generos de filmes 
const getSelectAllFilmsGenres = async function () {
    try {
        let sql = 'select * from tbl_filme_genero order by id desc'

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectFilmGenreById = async function (id) {
    try {
        let sql = `select * from tbl_filme_genero where id=${id}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

const setInsertFilmsGenres = async function (filmeGenero) {
    try {
        let sql = `INSERT INTO tbl_filme_genero (id_filme, id_genero)
                    VALUES('${filmeGenero.id_filme}', '${filmeGenero.id_genero}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

const setUpdateFilmsGenres = async function (filmeGenero) {
    try {
        let sql = `UPDATE tbl_genero set id_filme = '${filmeGenero.id_filme}',
                    id_genero = '${filmeGenero.id_genero}',
                    WHERE id = ${filmeGenero.id}`

        let result = await prisma.$executeRawUnsafe(sql)
            
        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const setDeleteFilmsGenres = async function (id) {
    try {
        let sql =   `DELETE FROM tbl_filme_genero WHERE id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const getSelectLastId = async function () {
    try {
        let sql = 'select id from tbl_filme_genero order by id desc limit 1'

        //Executa no Banco de Dados o script sql
        let result = await prisma.$queryRawUnsafe(sql)

        //Validação para identificar para saber se o retorno do BD é um ARRAY (vazio ou com dados) 
        if (Array.isArray(result))
            return Number(result[0].id)
        else
            return false

    } catch (error) {
        return false
    }
}

//Retorna os generos filtrando pelo id do filme
const getSelectGenreByIdFilm = async function (idFilme) {
    try {
        let sql = `select tbl_genero.id, tbl_genero.nome from tbl_filme
                    inner join tbl_filme_genero
                        on tbl_filme.id = tbl_filme_genero.id_filme
                    inner join tbl_genero
                        on tbl_genero.id = tbl_flme_genero.idgenero
                    where tbl_filme.id =${idFilme}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

//Retorna os generos filtrando pelo id do genero
const getSelectFilmByIdGenre = async function (idGenero) {
    try {
        let sql = `select tbl_filme.id, tbl_filme.nome from tbl_filme
                    inner join tbl_filme_genero
                        on tbl_filme.id = tbl_filme_genero.id_filme
                    inner join tbl_genero
                        on tbl_genero.id = tbl_flme_genero.idgenero
                    where tbl_genero.id =${idGenero}`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result))
            return result
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllFilmsGenres,
    getSelectFilmByIdGenre,
    getSelectFilmGenreById,
    getSelectGenreByIdFilm,
    getSelectLastId,
    setInsertFilmsGenres,
    setUpdateFilmsGenres,
    setDeleteFilmsGenres
}

