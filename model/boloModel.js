const Database = require('../db/database');
const banco = new Database();

class BoloModel {

    #boloId;
    #boloNome;
    #massaId;
    #coberturaId;
    #formatoId;
    #tamanhoId;
    #recheio1Id;
    #recheio2Id;
    #boloPreco;
    #boloObservacoes;

    get boloId() { return this.#boloId; }
    set boloId(valor) { this.#boloId = valor; }

    get boloNome() { return this.#boloNome; }
    set boloNome(valor) { this.#boloNome = valor; }

    get massaId() { return this.#massaId; }
    set massaId(valor) { this.#massaId = valor; }

    get coberturaId() { return this.#coberturaId; }
    set coberturaId(valor) { this.#coberturaId = valor; }

    get formatoId() { return this.#formatoId; }
    set formatoId(valor) { this.#formatoId = valor; }

    get tamanhoId() { return this.#tamanhoId; }
    set tamanhoId(valor) { this.#tamanhoId = valor; }

    get recheio1Id() { return this.#recheio1Id; }
    set recheio1Id(valor) { this.#recheio1Id = valor; }

    get recheio2Id() { return this.#recheio2Id; }
    set recheio2Id(valor) { this.#recheio2Id = valor; }

    get boloPreco() { return this.#boloPreco; }
    set boloPreco(valor) { this.#boloPreco = valor; }

    get boloObservacoes() { return this.#boloObservacoes; }
    set boloObservacoes(valor) { this.#boloObservacoes = valor; }

    constructor(boloId, boloNome, massaId, coberturaId, formatoId, tamanhoId, recheio1Id, recheio2Id, boloPreco, boloObservacoes) {
        this.#boloId = boloId;
        this.#boloNome = boloNome;
        this.#massaId = massaId;
        this.#coberturaId = coberturaId;
        this.#formatoId = formatoId;
        this.#tamanhoId = tamanhoId;
        this.#recheio1Id = recheio1Id;
        this.#recheio2Id = recheio2Id;
        this.#boloPreco = boloPreco;
        this.#boloObservacoes = boloObservacoes;
    }

    async listar() {
        let sql = "SELECT * FROM tb_bolo";
        let rows = await banco.ExecutaComando(sql);

        let lista = [];
        for (let row of rows) {
            lista.push(new BoloModel(
                row.bol_id,
                row.bol_nome,
                row.mas_id,
                row.cob_id,
                row.for_id,
                row.tam_id,
                row.rec1_id,
                row.rec2_id,
                row.bol_preco,
                row.bol_observacoes
            ));
        }

        return lista;
    }

    async cadastrar() {
        if (this.#boloId == 0) {
            let sql = `
                INSERT INTO tb_bolo (bol_nome, mas_id, cob_id, for_id, tam_id, rec1_id, rec2_id, bol_preco, bol_observacoes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            let valores = [
                this.#boloNome, this.#massaId, this.#coberturaId, this.#formatoId,
                this.#tamanhoId, this.#recheio1Id, this.#recheio2Id, this.#boloPreco,
                this.#boloObservacoes
            ];

            let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
            return resultado;
        }
    }

    async alterar() {
        let sql = `
            UPDATE tb_bolo SET bol_nome = ?, mas_id = ?, cob_id = ?, for_id = ?, tam_id = ?,
            rec1_id = ?, rec2_id = ?, bol_preco = ?, bol_observacoes = ?
            WHERE bol_id = ?`;

        let valores = [
            this.#boloNome, this.#massaId, this.#coberturaId, this.#formatoId,
            this.#tamanhoId, this.#recheio1Id, this.#recheio2Id, this.#boloPreco,
            this.#boloObservacoes, this.#boloId
        ];

        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }

    async excluir(id) {
        let sql = "DELETE FROM tb_bolo WHERE bol_id = ?";
        let valores = [id];
        let resultado = await banco.ExecutaComandoNonQuery(sql, valores);
        return resultado;
    }
}

module.exports = BoloModel;
