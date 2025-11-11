/******************************************************************************************
 * Objetivo: Arquivo responsavel pela realização do CRUD de filme no Banco de Dados MYSQL
 * Data:11/11/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

//import da biblioteca do prismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllPais = async function (){
        
        try {
            //script SQL
            let sql = `select * from tbl_pais` 
    
            //Executa no BD o script SQL
            let pais = await prisma.$queryRawUnsafe(sql)
        
            if(Array.isArray(pais) && pais.length > 0)
                return pais
            else
                return false
        } catch (error) {
            console.error("ERRO CRÍTICO DAO getSelectAllPais:", error);
            return false
        }
    }

const getSelectByidPais = async function (id){
    
        try {
            
            let sql = `select * from tbl_pais where pais_id=${id}`
    
            let pais = await prisma.$queryRawUnsafe(sql)
    
            if(Array.isArray(pais) && pais.length > 0)
                return pais
            else
                return false
    
        } catch (error) {
            console.error("ERRO CRÍTICO DAO getSelectByidPais:", error);
            return false
        }
    }

const setInsertPais = async function(pais) {
        try {
            
            let sql = `
                insert into tbl_pais (
                    pais
                )
                values(
                    '${pais.pais}'
                );
            `;
            let result = await prisma.$executeRawUnsafe(sql);
    
            if (result)
                return true;
            else
                return false;
                
        } catch (error) {
            console.error("Erro no DAO (setInsertPais):", error);
            return false; 
        }
    }

const setUpdatePais = async function(pais){
        try {
            let sql = `update tbl_pais set 
                            pais                     =   '${pais.pais}'
                           
                        where pais_id = ${pais.id}`;
    
            let result = await prisma.$executeRawUnsafe(sql);
    
            if(result)
                return true;
            else
                return false;
        } catch (error) {
            console.error("Erro no DAO (setUpdatePais):", error);
            return false;
        }
    }

const setDeletePais = async function(id){
        try {
    
            let sql = `DELETE FROM tbl_pais WHERE pais_id = ${id}`
    
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
    getSelectAllPais,
    getSelectByidPais,
    setInsertPais,
    setUpdatePais,
    setDeletePais
}
