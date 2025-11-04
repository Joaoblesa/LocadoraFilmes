/******************************************************************************************
 * Objetivo: Arquivo responsavel pela realização do CRUD de filme no Banco de Dados MYSQL
 * Data:04/11/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

//import da biblioteca do prismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//LISTAR PERSONAGEM
const getSelectAllPersonagem = async function (){
        
        try {
            //script SQL
            let sql = `select * from tbl_personagem` 
    
            //Executa no BD o script SQL
            let personagem = await prisma.$queryRawUnsafe(sql)
        
            if(Array.isArray(personagem) && personagem.length > 0)
                return personagem
            else
                return false
        } catch (error) {
            console.error("ERRO CRÍTICO DAO getSelectAllPersonagem:", error);
            return false
        }
    }

const getSelectByidPersonagem = async function (id){
    
        try {
            
            let sql = `select * from tbl_personagem where id=${id}`
    
            let personagem = await prisma.$queryRawUnsafe(sql)
    
            if(Array.isArray(personagem) && personagem.length > 0)
                return personagem
            else
                return false
    
        } catch (error) {
            console.error("ERRO CRÍTICO DAO getSelectByidPersonagem:", error);
            return false
        }
    }

    const setInsertPersonagem = async function(personagem) {
        try {
            
            let sql = `
                insert into tbl_personagem (
                    nome, universo, apelido, genero, idade, especie, 
                    origem, classe, habilidades, caracteristica
                )
                values(
                    '${personagem.nome}',
                    '${personagem.universo}',
                    '${personagem.apelido}',
                    '${personagem.genero}',
                    ${personagem.idade},
                    ${personagem.especie ? `'${personagem.especie}'` : 'NULL'},
                    ${personagem.origem ? `'${personagem.origem}'` : 'NULL'},
                    ${personagem.classe ? `'${personagem.classe}'` : 'NULL'},
                    '${personagem.habilidades}',
                    '${personagem.caracteristica}'
                );
            `;
            let result = await prisma.$executeRawUnsafe(sql);
    
            if (result)
                return true;
            else
                return false;
                
        } catch (error) {
            console.error("Erro no DAO (setInsertPersonagem):", error);
            return false; 
        }
    }

    const setUpdatePersonagem = async function(personagem){
        try {
            let sql = `update tbl_personagem set 
                            nome                      =   '${personagem.nome}',
                            universo                  =   '${personagem.universo}',
                            apelido                   =   '${personagem.apelido}',
                            genero                    =   '${personagem.genero}',
                            idade                     =   ${personagem.idade},
                            especie                   =   ${personagem.especie ? `'${personagem.especie}'` : 'NULL'},
                            origem                    =   ${personagem.origem ? `'${personagem.origem}'` : 'NULL'},
                            classe                    =   ${personagem.classe ? `'${personagem.classe}'` : 'NULL'},
                            habilidades               =   '${personagem.habilidades}',
                            caracteristica            =   '${personagem.caracteristica}'
                        where id = ${personagem.id}`;
    
            let result = await prisma.$executeRawUnsafe(sql);
    
            if(result)
                return true;
            else
                return false;
        } catch (error) {
            console.error("Erro no DAO (setUpdatePersonagem):", error);
            return false;
        }
    }

    const setDeletePersonagem = async function(id){
        try {
    
            let sql = `DELETE FROM tbl_personagem WHERE id = ${id}`
    
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
    getSelectAllPersonagem,
    getSelectByidPersonagem,
    setInsertPersonagem,
    setUpdatePersonagem,
    setDeletePersonagem
}