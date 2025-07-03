const Database = require('../db/database');
const banco = new Database();

class FormatoModel {

    #formatoId;
    #formatoNome;

    get formatoId() { return this.#formatoId; }
    set formatoId(valor) { this.#formatoId = valor; }

    get formatoNome() { return this.#formatoNome; }
    set formatoNome(valor) { this.#formatoNome = valor; }

    constructor(formatoId, formatoNome) {
        this.#formatoId = formatoId;
        this.#formatoNome = formatoNome;
    }

    async listar() {
        let sql = "SELECT * FROM tb_formato";
        let rows = await banco.ExecutaComando(sql);

        let lista = [];
        for (let row of rows) {
            lista.push(new FormatoModel(row.for_id, row.for_nome));
        }
        return lista;
    }

    async cadastrar() {
        if (this.#formatoId == 0) {
            let sql = "INSERT INTO tb_formato (for_nome) VALUES (?)";
            let valores = [this.#formatoNome];
            let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
            return resultado;
        }
    }

    async alterar() {
        let sql = "UPDATE tb_formato SET for_nome = ? WHERE for_id = ?";
        let valores = [this.#formatoNome, this.#formatoId];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_formato WHERE for_id = ?";
        let valores = [id];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }
}

module.exports = FormatoModel;
