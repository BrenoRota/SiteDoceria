const Database = require('../db/database');
const banco = new Database();

class CoberturaModel {

    #coberturaId;
    #coberturaNome;

    get coberturaId() { return this.#coberturaId; }
    set coberturaId(valor) { this.#coberturaId = valor; }

    get coberturaNome() { return this.#coberturaNome; }
    set coberturaNome(valor) { this.#coberturaNome = valor; }

    constructor(coberturaId, coberturaNome) {
        this.#coberturaId = coberturaId;
        this.#coberturaNome = coberturaNome;
    }

    async listar() {
        let sql = "SELECT * FROM tb_cobertura";
        let rows = await banco.ExecutaComando(sql);

        let lista = [];
        for (let row of rows) {
            lista.push(new CoberturaModel(row.cob_id, row.cob_nome));
        }
        return lista;
    }

    async cadastrar() {
        if (this.#coberturaId == 0) {
            let sql = "INSERT INTO tb_cobertura (cob_nome) VALUES (?)";
            let valores = [this.#coberturaNome];
            let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
            return resultado;
        }
    }

    async alterar() {
        let sql = "UPDATE tb_cobertura SET cob_nome = ? WHERE cob_id = ?";
        let valores = [this.#coberturaNome, this.#coberturaId];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_cobertura WHERE cob_id = ?";
        let valores = [id];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }
}

module.exports = CoberturaModel;
