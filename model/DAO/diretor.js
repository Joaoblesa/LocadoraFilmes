/******************************************************************************************
 * Objetivo: Arquivo responsavel pela realização do CRUD de genero no Banco de Dados MYSQL
 * Data:29/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//funçao para listar todos os atores
const getSelectAllDiretor = async function (){
        
        try {
            //script SQL
            let sql = `select * from tbl_diretor` 
    
            //Executa no BD o script SQL
            let diretor = await prisma.$queryRawUnsafe(sql)
        
            
            if(Array.isArray(diretor) && diretor.length > 0)
                return diretor
            else
                return false
        } catch (error) {
            console.error("ERRO CRÍTICO DAO getSelectAllAtor:", error);
            return false
        }
    }

const getSelectByidDiretor = async function (id){
    
        try {
            
            let sql = `select * from tbl_diretor where id=${id}`
    
            let diretor = await prisma.$queryRawUnsafe(sql)
    
            if(Array.isArray(diretor) && diretor.length > 0)
                return diretor
            else
                return false
    
        } catch (error) {
            console.error("ERRO CRÍTICO DAO getSelectByidDiretor:", error);
            return false
        }
    }

const setInsertDiretor = async function(diretor) {
    try {
        
        let sql = `
            insert into tbl_diretor (
                nome, idade, data_nascimento, data_falecimento, nacionalidade, atuando, 
                estado_civil, genero, biografia, foto
            )
            values(
                '${diretor.nome}',
                '${diretor.idade}',
                '${diretor.data_nascimento}',
                '${diretor.data_falecimento}',
                '${diretor.nacionalidade}',
                '${diretor.atuando}',
                '${diretor.estado_civil}',
                '${diretor.genero}',
                '${diretor.biografia}',
                '${diretor.foto}'
            );
        `

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
            
    } catch (error) {
        console.error("Erro no DAO (setInsertDiretor):", error);
        return false 
    }
    }

const setUpdateDiretor = async function(diretor){
    try {
        let sql = `update tbl_diretor set 
                    nome                    =   '${diretor.nome}',
                    idade                   =   '${diretor.idade}',
                    data_nascimento         =   '${diretor.data_nascimento}',
                    data_falecimento        =   '${diretor.data_falecimento}',
                    nacionalidade           =   '${diretor.nacionalidade}',
                    atuando                 =   '${diretor.atuando}',
                    estado_civil            =   '${diretor.estado_civil}',
                    genero                  =   '${diretor.genero}',
                    biografia               =   '${diretor.biografia}',
                    foto                    =   '${diretor.foto}'
                where id = ${diretor.id}`

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

const setDeleteDiretor = async function(id){
    try {

        let sql = `DELETE FROM tbl_diretor WHERE id = ${id}`

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
    getSelectAllDiretor,
    getSelectByidDiretor,
    setInsertDiretor,
    setUpdateDiretor,
    setDeleteDiretor
}