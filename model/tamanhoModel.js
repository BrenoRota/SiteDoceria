const Database = require('../db/database');
const banco = new Database();

class TamanhoModel {

    #tamanhoId;
    #tamanhoNome;
    #tamanhoDiametro;
    #tamanhoFatias;

    get tamanhoId() { return this.#tamanhoId; }
    set tamanhoId(valor) { this.#tamanhoId = valor; }

    get tamanhoNome() { return this.#tamanhoNome; }
    set tamanhoNome(valor) { this.#tamanhoNome = valor; }

    get tamanhoDiametro() { return this.#tamanhoDiametro; }
    set tamanhoDiametro(valor) { this.#tamanhoDiametro = valor; }

    get tamanhoFatias() { return this.#tamanhoFatias; }
    set tamanhoFatias(valor) { this.#tamanhoFatias = valor; }

    constructor(tamanhoId, tamanhoNome, tamanhoDiametro, tamanhoFatias) {
        this.#tamanhoId = tamanhoId;
        this.#tamanhoNome = tamanhoNome;
        this.#tamanhoDiametro = tamanhoDiametro;
        this.#tamanhoFatias = tamanhoFatias;
    }

    async listar() {
        let sql = "SELECT * FROM tb_tamanho";
        let rows = await banco.ExecutaComando(sql);

        let lista = [];
        for (let row of rows) {
            lista.push(new TamanhoModel(
                row.tam_id,
                row.tam_nome,
                row.tam_diametro_cm,
                row.tam_fatias_estimadas
            ));
        }
        return lista;
    }

    async cadastrar() {
        if (this.#tamanhoId == 0) {
            let sql = "INSERT INTO tb_tamanho (tam_nome, tam_diametro_cm, tam_fatias_estimadas) VALUES (?, ?, ?)";
            let valores = [this.#tamanhoNome, this.#tamanhoDiametro, this.#tamanhoFatias];
            let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
            return resultado;
        }
    }

    async alterar() {
        let sql = "UPDATE tb_tamanho SET tam_nome = ?, tam_diametro_cm = ?, tam_fatias_estimadas = ? WHERE tam_id = ?";
        let valores = [this.#tamanhoNome, this.#tamanhoDiametro, this.#tamanhoFatias, this.#tamanhoId];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_tamanho WHERE tam_id = ?";
        let valores = [id];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }
}

module.exports = TamanhoModel;
