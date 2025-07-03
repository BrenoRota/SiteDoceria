const Database = require('../db/database');
const banco = new Database();

class PerfilModel {

    #perfilId;
    #perfilNome;

    get perfilId() { return this.#perfilId; }
    set perfilId(valor) { this.#perfilId = valor; }

    get perfilNome() { return this.#perfilNome; }
    set perfilNome(valor) { this.#perfilNome = valor; }

    constructor(perfilId, perfilNome) {
        this.#perfilId = perfilId;
        this.#perfilNome = perfilNome;
    }

    async listar() {
        let sql = "SELECT * FROM tb_perfil";
        let rows = await banco.ExecutaComando(sql);

        let lista = [];
        for (let i = 0; i < rows.length; i++) {
            lista.push(new PerfilModel(rows[i]["per_id"], rows[i]["per_nome"]));
        }
        return lista;
    }

    async cadastrar() {
        if (this.#perfilId == 0) {
            let sql = "INSERT INTO tb_perfil (per_nome) VALUES (?)";
            let valores = [this.#perfilNome];
            let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
            return resultado;
        }
    }

    async alterar() {
        let sql = "UPDATE tb_perfil SET per_nome = ? WHERE per_id = ?";
        let valores = [this.#perfilNome, this.#perfilId];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_perfil WHERE per_id = ?";
        let valores = [id];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }
}

module.exports = PerfilModel;
