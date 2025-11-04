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

    module.exports = {
        getSelectAllIdioma,
        getSelectByid
    }