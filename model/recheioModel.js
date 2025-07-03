const Database = require('../db/database');
const banco = new Database();

class RecheioModel {

    #recheioId;
    #recheioNome;
    #recheioVariante;

    get recheioId() { return this.#recheioId; }
    set recheioId(valor) { this.#recheioId = valor; }

    get recheioNome() { return this.#recheioNome; }
    set recheioNome(valor) { this.#recheioNome = valor; }

    get recheioVariante() { return this.#recheioVariante; }
    set recheioVariante(valor) { this.#recheioVariante = valor; }

    constructor(recheioId, recheioNome, recheioVariante) {
        this.#recheioId = recheioId;
        this.#recheioNome = recheioNome;
        this.#recheioVariante = recheioVariante;
    }

    async listar() {
        let sql = "SELECT * FROM tb_recheio";
        let rows = await banco.ExecutaComando(sql);

        let lista = [];
        for (let row of rows) {
            lista.push(new RecheioModel(row.rec_id, row.rec_nome, row.rec_variante));
        }
        return lista;
    }

    async cadastrar() {
        if (this.#recheioId == 0) {
            let sql = "INSERT INTO tb_recheio (rec_nome, rec_variante) VALUES (?, ?)";
            let valores = [this.#recheioNome, this.#recheioVariante];
            let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
            return resultado;
        }
    }

    async alterar() {
        let sql = "UPDATE tb_recheio SET rec_nome = ?, rec_variante = ? WHERE rec_id = ?";
        let valores = [this.#recheioNome, this.#recheioVariante, this.#recheioId];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_recheio WHERE rec_id = ?";
        let valores = [id];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }
}

module.exports = RecheioModel;
