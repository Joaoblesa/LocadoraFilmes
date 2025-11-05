
/******************************************************************************************
 * Objetivo: Arquivo responsavel pela realização do CRUD de filme no Banco de Dados MYSQL
 * Data:05/11/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

//import da biblioteca do prismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//LISTAR PERSONAGEM
const getSelectAllIdioma = async function (){
        
        try {
            //script SQL
            let sql = `select * from tbl_idioma` 
    
            //Executa no BD o script SQL
            let idioma = await prisma.$queryRawUnsafe(sql)
        
            if(Array.isArray(idioma) && idioma.length > 0)
                return idioma
            else
                return false
        } catch (error) {
            console.error("ERRO CRÍTICO DAO getSelectAllIdioma:", error);
            return false
        }
    }

const getSelectByid = async function (id){
        
            try {
                
                let sql = `select * from tbl_idioma where id=${id}`
        
                let idioma = await prisma.$queryRawUnsafe(sql)
        
                if(Array.isArray(idioma) && idioma.length > 0)
                    return idioma
                else
                    return false
        
            } catch (error) {
                console.error("ERRO CRÍTICO DAO getSelectByidIdioma:", error);
                return false
            }
        }

const setInsertIdioma = async function(idioma) {
        try {
            
            let sql = `
                insert into tbl_idioma (
                    nome
                )
                values(
                    '${idioma.nome}'
                );
            `;
            let result = await prisma.$executeRawUnsafe(sql);
    
            if (result)
                return true;
            else
                return false;
                
        } catch (error) {
            console.error("Erro no DAO (setInsertIdioma):", error);
            return false; 
        }
    }

const setUpdateIdioma= async function(idioma){
        try {
            let sql = `update tbl_idioma set 
                            nome                      =   '${idioma.nome}'
                            
                        where id = ${idioma.id}`;
    
            let result = await prisma.$executeRawUnsafe(sql);
    
            if(result)
                return true;
            else
                return false;
        } catch (error) {
            console.error("Erro no DAO (setUpdateIIdioma):", error);
            return false;
        }
    }

const setDeleteIdioma= async function(id){
        try {
    
            let sql = `DELETE FROM tbl_idioma WHERE id = ${id}`
    
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
        getSelectAllIdioma,
        getSelectByid,
        setInsertIdioma,
        setUpdateIdioma,
        setDeleteIdioma
    }