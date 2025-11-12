/******************************************************************************************
 * Objetivo: Arquivo responsavel pela realização do CRUD de genero no Banco de Dados MYSQL
 * Data:29/10/2025
 * Autor: Joao Blesa
 * Versao: 1.0
 *****************************************************************************************/

//import da biblioteca do prismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//funçao para listar todos os atores
    const getSelectAllAtor = async function (){
        
        try {
            //script SQL
            let sql = `select * from tbl_ator` 
    
            //Executa no BD o script SQL
            let ator = await prisma.$queryRawUnsafe(sql)

            if(Array.isArray(ator) && ator.length > 0)
                return ator
            else
                return false
        } catch (error) {
            console.error("ERRO CRÍTICO DAO getSelectAllAtor:", error);
            return false
        }
    }

    // Função para buscar Ator pelo ID
    const getSelectByidAtor = async function (id){
    
        try {
            
            let sql = `select * from tbl_ator where id=${id}`
    
            let ator = await prisma.$queryRawUnsafe(sql)
    
            if(Array.isArray(ator) && ator.length > 0)
                return ator
            else
                return false
    
        } catch (error) {
            console.error("ERRO CRÍTICO DAO getSelectByidAtor:", error);
            return false
        }
    }

    // Função para buscar o último ID da tabela de atores
const getSelectLastIdAtors = async function() {
    try {
        // Script SQL para selecionar o ID do último ator inserido
        let sql = `select id from tbl_ator order by id desc limit 1`
        
        // Executa a query no BD (SELECT usa $queryRawUnsafe)
        let result = await prisma.$queryRawUnsafe(sql)
        
        // Validação para identificar se o retorno do BD é uma ARRAY
        if (Array.isArray(result) && result.length > 0)
            return Number(result[0].id)
        else
            return false 
            
    } catch (error) {
        console.error("Erro em getSelectLastIdActors:", error);
        return false
    }
}

const setInsertAtor = async function(ator) {
    try {
        
        let sql = `
            insert into tbl_ator (
                nome, idade, data_nascimento, data_falecimento, nacionalidade, atuando, 
                estado_civil, genero, altura, biografia, foto
            )
            values(
                '${ator.nome}',
                ${ator.idade},
                '${ator.data_nascimento}',
                ${ator.data_falecimento ? `'${ator.data_falecimento}'` : null},
                '${ator.nacionalidade}',
                ${ator.atuando},
                '${ator.estado_civil}',
                '${ator.genero}',
                ${ator.altura},
                '${ator.biografia}',
                '${ator.foto}'
            );
        `

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false
            
    } catch (error) {
        console.error("Erro no DAO (setInsertAtor):", error);
        return false 
    }
}

const setUpdateAtor = async function(ator){
    try {
        let sql = `update tbl_ator set 
                    nome                    =   '${ator.nome}',
                    idade                   =   '${ator.idade}',
                    data_nascimento         =   '${ator.data_nascimento}',
                    data_falecimento          =   ${ator.data_falecimento ? `'${ator.data_falecimento}'` : 'NULL'},
                    nacionalidade           =   '${ator.nacionalidade}',
                    atuando                 =   '${ator.atuando}',
                    estado_civil            =   '${ator.estado_civil}',
                    genero                  =   '${ator.genero}',
                    altura                  =   '${ator.altura}',
                    biografia               =   '${ator.biografia}',
                    foto                    =   '${ator.foto}'
                where id = ${ator.id}`

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

const setDeleteAtor = async function(id){
    try {

        let sql = `DELETE FROM tbl_ator WHERE id = ${id}`

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
        getSelectAllAtor,
        getSelectByidAtor,
        setInsertAtor,
        getSelectLastIdAtors,
        setUpdateAtor,
        setDeleteAtor
    }

    