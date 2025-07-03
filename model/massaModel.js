const Database = require('../db/database');
const banco = new Database();

class MassaModel {

    #massaId;
    #massaNome;

    get massaId() { return this.#massaId; }
    set massaId(valor) { this.#massaId = valor; }

    get massaNome() { return this.#massaNome; }
    set massaNome(valor) { this.#massaNome = valor; }

    constructor(massaId, massaNome) {
        this.#massaId = massaId;
        this.#massaNome = massaNome;
    }

    async listar() {
        let sql = "SELECT * FROM tb_massa";
        let rows = await banco.ExecutaComando(sql);

        let lista = [];
        for (let row of rows) {
            lista.push(new MassaModel(row.mas_id, row.mas_nome));
        }
        return lista;
    }

    async cadastrar() {
        if (this.#massaId == 0) {
            let sql = "INSERT INTO tb_massa (mas_nome) VALUES (?)";
            let valores = [this.#massaNome];
            let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
            return resultado;
        }
    }

    async alterar() {
        let sql = "UPDATE tb_massa SET mas_nome = ? WHERE mas_id = ?";
        let valores = [this.#massaNome, this.#massaId];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_massa WHERE mas_id = ?";
        let valores = [id];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }
}

module.exports = MassaModel;
