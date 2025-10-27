/******************************************************************************************
 * Objetivo: Arquivo responsavel pela realização do CRUD de genero no Banco de Dados MYSQL
 * Data:22/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/


const { PrismaClient, Prisma } = require('../../generated/prisma'); 
const prisma = new PrismaClient();


// Função para listar todos os Gêneros
const getSelectAllGenero = async function (){

    try {
        //script SQL
        let sql = `select * from tbl_genero order by id desc` // Adicionado order by para facilitar

        //Executa no BD o script SQL
        let genero = await prisma.$queryRawUnsafe(sql)
    
        // 3. CORREÇÃO: Validaçao para identificar se o retorno do BD e uma ARRAY e se tem dados.
        if(Array.isArray(genero) && genero.length > 0)
            return genero
        else
            return false
    } catch (error) {
        console.error("ERRO CRÍTICO DAO getSelectAllGenero:", error);
        return false
    }
}

// Função para buscar Gênero pelo ID
const getSelectByidGenero = async function (id){

    try {
        
        let sql = `select * from tbl_genero where id=${id}`

        let genero = await prisma.$queryRawUnsafe(sql)

        if(Array.isArray(genero) && genero.length > 0)
            return genero
        else
            return false

    } catch (error) {
        console.error("ERRO CRÍTICO DAO getSelectByidGenero:", error);
        return false
    }
}

// Função para inserir novo Gênero
const setInsertGenero = async function (dadosGenero){
    try {
        // CORREÇÃO: Usando o nome da tabela 'tbl_genero'
        const novoGenero = await prisma.tbl_genero.create({ 
            data: {
                nome: dadosGenero.nome,
                descricao: dadosGenero.descricao
            }
        });
        return novoGenero; 
        
    } catch (error) {
        console.error("ERRO CRÍTICO DAO setInsertGenero (Verifique a Conexão/Modelos):", error);
        return false;
    }
}

// Função para atualizar Gênero
const setUpdateGeneros = async function(genero){
    try {
        let result = await prisma.$executeRaw(Prisma.sql`
            UPDATE tbl_genero SET 
                nome = ${genero.nome},
                descricao = ${genero.descricao}
            WHERE id = ${genero.id}
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
const setDeleteGenero = async function(id){
    try {

        let sql = `DELETE FROM tbl_genero WHERE id = ${id}`

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
    getSelectAllGenero,
    getSelectByidGenero,
    setInsertGenero,
    setUpdateGeneros,
    setDeleteGenero
}