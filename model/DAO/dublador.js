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
const getSelectAllDublador = async function (){
        
        try {
            //script SQL
            let sql = `select * from tbl_dublador` 
    
            //Executa no BD o script SQL
            let dublador = await prisma.$queryRawUnsafe(sql)
        
            
            if(Array.isArray(dublador) && dublador.length > 0)
                return dublador
            else
                return false
        } catch (error) {
            console.error("ERRO CRÍTICO DAO getSelectAllDublador:", error);
            return false
        }
    }

const getSelectByidDublador = async function (id){
    
        try {
            
            let sql = `select * from tbl_dublador where id=${id}`
    
            let dublador = await prisma.$queryRawUnsafe(sql)
    
            if(Array.isArray(dublador) && dublador.length > 0)
                return dublador
            else
                return false
    
        } catch (error) {
            console.error("ERRO CRÍTICO DAO getSelectByidDublador:", error);
            return false
        }
    }

const setInsertDublador = async function(dublador) {
    try {
        
        let sql = `
            insert into tbl_dublador (
                nome, idade, data_nascimento, data_falecimento, nacionalidade, atuando, 
                estado_civil, genero, biografia, foto
            )
            values(
                '${dublador.nome}',
                '${dublador.idade}',
                '${dublador.data_nascimento}',
                '${dublador.data_falecimento}',
                '${dublador.nacionalidade}',
                '${dublador.atuando}',
                '${dublador.estado_civil}',
                '${dublador.genero}',
                '${dublador.biografia}',
                '${dublador.foto}'
            );
        `

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
            
    } catch (error) {
        console.error("Erro no DAO (setInsertDublador):", error);
        return false 
    }
    }

const setUpdateDublador = async function(dublador){
    try {
        let sql = `update tbl_dublador set 
                    nome                    =   '${dublador.nome}',
                    idade                   =   '${dublador.idade}',
                    data_nascimento         =   '${dublador.data_nascimento}',
                    data_falecimento        =   '${dublador.data_falecimento}',
                    nacionalidade           =   '${dublador.nacionalidade}',
                    atuando                 =   '${dublador.atuando}',
                    estado_civil            =   '${dublador.estado_civil}',
                    genero                  =   '${dublador.genero}',
                    biografia               =   '${dublador.biografia}',
                    foto                    =   '${dublador.foto}'
                where id = ${dublador.id}`

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

const setDeleteDublador = async function(id){
    try {

        let sql = `DELETE FROM tbl_dublador WHERE id = ${id}`

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
    getSelectAllDublador,
    getSelectByidDublador,
    setInsertDublador,
    setUpdateDublador,
    setDeleteDublador
}