document.addEventListener("DOMContentLoaded", function() {

    let btnsAddCarrinho = document.querySelectorAll(".addCarrinho");

    atualizarContador();

    document.getElementById("modalCarrinho").addEventListener("show.bs.modal", montarCarrinho);

    for(let i = 0; i < btnsAddCarrinho.length; i++) {
        btnsAddCarrinho[i].addEventListener("click", addCarrinho);
    }

    document.getElementById("btnConfirmar").addEventListener("click", gravarPedido);

    function montarCarrinho() {
       let carrinho = localStorage.getItem("carrinho");
       if(carrinho) {
        let listaCarrinho = JSON.parse(carrinho);
        let html = `<table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Imagem</th>
                                <th>Nome</th>
                                <th>Quantidade</th>
                                <th>Valor unitário</th>
                                <th>Valor total</th>
                                <th>Ações</th>
                            </tr>
                        <thead>
                        <tbody>`;

            for(let i =0; i<listaCarrinho.length; i++) {
                    html += `<tr data-produto="${listaCarrinho[i].id}">
                                <td>${listaCarrinho[i].id}</td>

                                <td><img width="50" src="${listaCarrinho[i].imagem}"/></td>

                                <td>${listaCarrinho[i].nome}</td>

                                <td>
                                    <div style="display:flex;">
                                        <button data-produto="${listaCarrinho[i].id}" class="btn btn-secondary btnAdd">+</button>
                                        <input data-produto="${listaCarrinho[i].id}" value="${listaCarrinho[i].quantidade}" style="width:80px;" class="form-control inputQtde" type="text" />
                                        <button data-produto="${listaCarrinho[i].id}" class="btn btn-secondary btnDecrementa">-</button>
                                    </div>
                                </td>

                                <td>R$ ${listaCarrinho[i].valor}</td>

                                <td>R$ ${listaCarrinho[i].valor * listaCarrinho[i].quantidade}</td>

                                <td><button data-produto="${listaCarrinho[i].id}" class="btn btn-danger btnRemoverCarrinho">Remover</button></td>
                            </tr>`;
            } 

            html += `   </tbody>
                    </table>`

            //adicionar interface do carrinho
            document.getElementById("corpoCarrinho").innerHTML = "<div class='table-responsive'>" + html + "</div>" ;
            //inicializa eventos para os botões da interface do carrinho
            inicializarEventos();
       }
       else{
        document.getElementById("corpoCarrinho").innerHTML = "O carrinho está vazio!";
        
       }
       calcularValorTotalPedido();
    }

    function gravarPedido() {

        let carrinho = localStorage.getItem("carrinho");
        if(carrinho) {

            fetch("/pedido/confirmar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: carrinho,
            })
            .then(resposta => {
                return resposta.json();
            })
            .then(corpoResposta => {
                if(corpoResposta.ok) {
                    alert(corpoResposta.msg);
                    localStorage.removeItem("carrinho");
                    montarCarrinho();
                }
                else {
                    if(corpoResposta.listaValidacao.length > 0) {
                        //erro na requisição, se a validação de estoque não passou, exibir na interface
                        for(let i = 0; i<corpoResposta.listaValidacao.length; i++) {
                            let prdId = corpoResposta.listaValidacao[i];
                            let tr = document.querySelector(`tr[data-produto='${prdId}']`);

                            tr.style.backgroundColor = '#ff000063';
                        }

                        alert(corpoResposta.msg);
                    }
                    else {
                        //erro generico
                        alert(corpoResposta.msg);
                    }
                }
            })
        }
        else {
            alert("Nenhum produto adicionado ao carrinho");
        }

    }

    function inicializarEventos() {

        let btnsRemover = document.querySelectorAll(".btnRemoverCarrinho");
        for(let i = 0; i< btnsRemover.length; i++) {
            btnsRemover[i].addEventListener("click", removerProdutoCarrinho);
        }

        //add
        let btnsAdd = document.querySelectorAll(".btnAdd");
        for(let i = 0; i< btnsAdd.length; i++) {
            btnsAdd[i].addEventListener("click", function() {
                let produtoId = this.dataset.produto;
                let value = parseInt(document.querySelector(`input[data-produto='${produtoId}']`).value);
                alterarQuantidade(produtoId, value+1);
            });
        }

        //decrementa
        let btnsDecrementa = document.querySelectorAll(".btnDecrementa");
        for(let i = 0; i< btnsDecrementa.length; i++) {
            btnsDecrementa[i].addEventListener("click",function() {
                let produtoId = this.dataset.produto;
                let value = parseInt(document.querySelector(`input[data-produto='${produtoId}']`).value);
                alterarQuantidade(produtoId, value-1);
            } );
        }

        //alterar input
        let inputsQtde = document.querySelectorAll(".inputQtde");
        for(let i = 0; i< inputsQtde.length; i++) {
            inputsQtde[i].addEventListener("blur", function() {
                let produtoId = this.dataset.produto;
                let quantidadeAtual = this.value;
                alterarQuantidade(produtoId, quantidadeAtual);
            });
        }
    }

    function alterarQuantidade(produtoId, novaQuantidade) {

        if(novaQuantidade < 1) {
            alert("Não é permitido quantidades negativas!");
            novaQuantidade = 1;
        }

        if(novaQuantidade > 999) {
            alert("Não é permitido pedir mais que 999 produtos!");
            novaQuantidade = 1;
        }

        if(isNaN(novaQuantidade)) {
            alert("Digite apenas números para representar a quantidade!");
            novaQuantidade = 1;
        }

        let carrinho = localStorage.getItem("carrinho");
        if(carrinho) {
            let lista = JSON.parse(carrinho);
            //buscar o produto para alterar
            for(let i = 0; i< lista.length; i++) {
                if(lista[i].id == produtoId) {
                    lista[i].quantidade = novaQuantidade;
                    i = lista.length;
                }            
            }

            //salvar a lista alterada
            localStorage.setItem("carrinho", JSON.stringify(lista));
            montarCarrinho();
        }
    }

    function removerProdutoCarrinho() {
        let produtoRemocao = this.dataset.produto;

        let carrinho = localStorage.getItem("carrinho");
        if(carrinho) {
            let listaCarrinho = JSON.parse(carrinho);
            listaCarrinho = listaCarrinho.filter(x=> x.id != produtoRemocao);
            if(listaCarrinho.length > 0)
                localStorage.setItem("carrinho", JSON.stringify(listaCarrinho));
            else
                localStorage.removeItem("carrinho");

            montarCarrinho();
            atualizarContador();
        }
    }

    function calcularValorTotalPedido() {

        let carrinho = localStorage.getItem("carrinho");
        if(carrinho) {

            let valorTotal = 0;
            let listaCarrinho = JSON.parse(carrinho);
            for(let produto of listaCarrinho) {
                valorTotal += produto.quantidade * produto.valor;
            }

            document.getElementById("valorTotalPedido").innerHTML = `<h3>Valor total: R$ ${valorTotal}</h3>`
        }
        else {
            document.getElementById("valorTotalPedido").innerHTML = "";
        }
    }


    function atualizarContador() {
        let carrinho = localStorage.getItem("carrinho");
        if(carrinho) {
            document.getElementById("contadorCarrinho").innerText = JSON.parse(carrinho).length;
        }
        else {
            document.getElementById("contadorCarrinho").innerText = "0";
        }
    }

    function addCarrinho() {
        let that = this;
        let produtoId = this.dataset.produto;
        fetch("/produto/" + produtoId)
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(corpoResposta) {
            console.log(corpoResposta);
            if(corpoResposta.ok == false) {
                alert("Produto não encontrado!");
            } 
            else {
                let carrinho = localStorage.getItem("carrinho");
                //carrinho já existe
                if(carrinho != null) {
                    let arrCarrinho = JSON.parse(carrinho);

                    //decidir se vai aumentar a quantidade ou adicionar um novo
                    let existe = false;
                    for(let i=0; i<arrCarrinho.length; i++) {
                        if(arrCarrinho[i].id == corpoResposta.produto.id){
                            arrCarrinho[i].quantidade += 1;
                            existe = true;
                        }
                    }

                    if(existe == false)
                    {
                        corpoResposta.produto.quantidade = 1;
                        arrCarrinho.push(corpoResposta.produto);
                    }
                    
                    localStorage.setItem("carrinho", JSON.stringify(arrCarrinho));
                }
                else {
                    let arrCarrinho = [];
                    corpoResposta.produto.quantidade = 1;
                    arrCarrinho.push(corpoResposta.produto);
                    localStorage.setItem("carrinho", JSON.stringify(arrCarrinho));
                }

                
                that.innerHTML = `<i class="bi-check"><i> Adicionado!`;

                setTimeout(function() {
                    that.innerHTML = `<i class="bi-cart-fill me-1"></i> Adicionar ao carrinho`; 
                }, 5000)

                atualizarContador();
            }
        })
    }
})