/* =====================================================
   AUDITFLOW
   Sistema de Auditoria de Qualidade
===================================================== */


/* =====================================================
   CHECKLIST
===================================================== */

const itensChecklist = [

    "O artefato foi identificado corretamente e está disponível para auditoria?",

    "As informações contidas no artefato estão completas e consistentes?",

    "O documento ou evidência segue o padrão estabelecido pela organização?",

    "A revisão ou validação do artefato foi realizada conforme previsto?",

    "As ações descritas no artefato foram executadas corretamente?",

    "Há rastreabilidade adequada entre o artefato e os registros relacionados?",

    "O artefato apresenta conformidade com procedimentos, normas ou requisitos aplicáveis?",

    "Não há divergências, erros ou inconsistências relevantes no conteúdo?",

    "A evidência de execução ou conclusão está adequada e legível?",

    "O artefato está pronto para aprovação, armazenamento ou uso posterior?"

];


/* =====================================================
   VARIÁVEIS
===================================================== */

let respostas =
    JSON.parse(
        localStorage.getItem("auditflow_respostas")
    ) ||
    new Array(itensChecklist.length).fill(null);

let naoConformidades =
    JSON.parse(
        localStorage.getItem("auditflow_ncs")
    ) || [];

let auditoria =
    JSON.parse(
        localStorage.getItem("auditflow_auditoria")
    ) || null;

let arquivoArtefato =
    localStorage.getItem("auditflow_arquivo") ||
    null;


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const respostasSalvas =
            JSON.parse(
                localStorage.getItem("auditflow_respostas")
            );

        respostas =
            Array.isArray(respostasSalvas)
                ? respostasSalvas
                : new Array(itensChecklist.length).fill(null);

        if (
            respostas.length !== itensChecklist.length
        ) {
            respostas =
                new Array(
                    itensChecklist.length
                ).fill(null);
        }

        criarChecklist();

        configurarMenu();

        configurarBotoes();

        configurarAnexoArquivo();

        carregarData();

        atualizarNCs();

        atualizarDashboard();

    }
);


/* =====================================================
   MENU
===================================================== */

function configurarMenu() {

    const botoes =
        document.querySelectorAll(".menu-btn");

    botoes.forEach(function (botao) {

        botao.addEventListener(
            "click",
            function () {

                const pagina =
                    botao.dataset.page;


                /*
                   Remove a classe active
                   de todos os botões
                */

                botoes.forEach(function (b) {

                    b.classList.remove("active");

                });


                /*
                   Ativa o botão clicado
                */

                botao.classList.add("active");


                /*
                   Esconde todas as páginas
                */

                document
                    .querySelectorAll(".page")
                    .forEach(function (p) {

                        p.classList.remove("active");

                    });


                /*
                   Mostra a página escolhida
                */

                document
                    .getElementById(pagina)
                    .classList.add("active");

            }
        );

    });

}


/* =====================================================
   DATA AUTOMÁTICA
===================================================== */

function carregarData() {

    const campo =
        document.getElementById(
            "dataAuditoria"
        );

    const hoje =
        new Date()
            .toISOString()
            .split("T")[0];

    campo.value = hoje;

}


/* =====================================================
   ANEXO DO ARTEFATO
===================================================== */

function configurarAnexoArquivo() {

    const input =
        document.getElementById(
            "arquivoArtefato"
        );

    const info =
        document.getElementById(
            "arquivoInfo"
        );

    const nomeSpan =
        document.getElementById(
            "arquivoNome"
        );

    const btnRemover =
        document.getElementById(
            "removerArquivo"
        );


    /*
       Restaura o nome do arquivo
       anexado anteriormente
    */

    if (arquivoArtefato) {

        nomeSpan.textContent =
            "📎 " + arquivoArtefato;

        info.classList.add(
            "mostrar"
        );

    } else {

        info.classList.remove(
            "mostrar"
        );

    }


    input.addEventListener(
        "change",
        function () {

            if (
                input.files &&
                input.files.length > 0
            ) {

                arquivoArtefato =
                    input.files[0].name;

                nomeSpan.textContent =
                    "📎 " + arquivoArtefato;

                info.classList.add(
                    "mostrar"
                );

                localStorage.setItem(
                    "auditflow_arquivo",
                    arquivoArtefato
                );

            }

        }
    );


    btnRemover.addEventListener(
        "click",
        function () {

            arquivoArtefato = null;

            input.value = "";

            nomeSpan.textContent = "";

            info.classList.remove(
                "mostrar"
            );

            localStorage.removeItem(
                "auditflow_arquivo"
            );

        }
    );

}


/* =====================================================
   CRIA CHECKLIST
===================================================== */

function criarChecklist() {

    const container =
        document.getElementById(
            "checklist"
        );


    container.innerHTML = "";


    itensChecklist.forEach(
        function (item, indice) {

            const div =
                document.createElement("div");


            div.className =
                "check-item";


            div.innerHTML = `

                <div class="check-titulo">

                    ${indice + 1}.
                    ${item}

                </div>


                <div class="opcoes">

                    <button
                        class="opcao conforme ${respostas[indice] === "conforme" ? "selecionado" : ""}"
                        data-indice="${indice}"
                        data-valor="conforme">

                        ✓ Conforme

                    </button>


                    <button
                        class="opcao nc ${respostas[indice] === "nc" ? "selecionado" : ""}"
                        data-indice="${indice}"
                        data-valor="nc">

                        ✕ Não Conforme

                    </button>


                    <button
                        class="opcao na ${respostas[indice] === "na" ? "selecionado" : ""}"
                        data-indice="${indice}"
                        data-valor="na">

                        — N/A

                    </button>

                </div>

            `;


            container.appendChild(div);

        }
    );


    configurarOpcoesChecklist();

}


/* =====================================================
   OPÇÕES DO CHECKLIST
===================================================== */

function configurarOpcoesChecklist() {

    const botoes =
        document.querySelectorAll(
            ".opcao"
        );


    botoes.forEach(function (botao) {

        botao.addEventListener(
            "click",
            function () {

                const indice =
                    Number(
                        botao.dataset.indice
                    );


                const valor =
                    botao.dataset.valor;


                respostas[indice] =
                    valor;

                salvarRespostas();


                /*
                   Remove seleção das
                   outras opções
                */

                const grupo =
                    botao.parentElement;

                grupo
                    .querySelectorAll(".opcao")
                    .forEach(function (b) {

                        b.classList.remove(
                            "selecionado"
                        );

                    });


                /*
                   Marca a opção escolhida
                */

                botao.classList.add(
                    "selecionado"
                );


                calcularAderencia();

            }
        );

    });

}


/* =====================================================
   CALCULA ADERÊNCIA
===================================================== */

function calcularAderencia() {

    const aplicaveis =
        respostas.filter(
            function (resposta) {

                return (
                    resposta === "conforme" ||
                    resposta === "nc"
                );

            }
        ).length;


    const conformes =
        respostas.filter(
            function (resposta) {

                return resposta === "conforme";

            }
        ).length;


    let percentual = 0;


    if (aplicaveis > 0) {

        percentual =
            (conformes / aplicaveis) * 100;

    }


    document.getElementById(
        "aderencia"
    ).textContent =
        percentual.toFixed(1) + "%";


    document.getElementById(
        "progress"
    ).style.width =
        percentual + "%";


    document.getElementById(
        "contagem"
    ).textContent =

        `${conformes} conformes / ` +
        `${aplicaveis} aplicáveis`;


    return {

        aplicaveis,

        conformes,

        percentual

    };

}


/* =====================================================
   CONFIGURA BOTÕES
===================================================== */

function configurarBotoes() {


    document
        .getElementById(
            "finalizarAuditoria"
        )
        .addEventListener(
            "click",
            finalizarAuditoria
        );


    document
        .getElementById(
            "limparChecklist"
        )
        .addEventListener(
            "click",
            limparChecklist
        );


    document
        .getElementById(
            "exportarPdf"
        )
        .addEventListener(
            "click",
            exportarPdf
        );


    document
        .getElementById(
            "reiniciarAuditoria"
        )
        .addEventListener(
            "click",
            reiniciarAuditoria
        );


    document
        .getElementById(
            "abrirModal"
        )
        .addEventListener(
            "click",
            abrirModal
        );


    document
        .getElementById(
            "fecharModal"
        )
        .addEventListener(
            "click",
            fecharModal
        );


    document
        .getElementById(
            "salvarNC"
        )
        .addEventListener(
            "click",
            salvarNC
        );


    document
        .getElementById(
            "selectNC"
        )
        .addEventListener(
            "change",
            gerarMensagem
        );


    document
        .getElementById(
            "emailDestinatario"
        )
        .addEventListener(
            "input",
            registrarEmailNoConsole
        );


    document
        .getElementById(
            "enviarEmail"
        )
        .addEventListener(
            "click",
            enviarEmailNCAssunto
        );

}


/* =====================================================
   FINALIZA AUDITORIA
===================================================== */

function finalizarAuditoria() {

    const resultado =
        calcularAderencia();


    if (resultado.aplicaveis === 0) {

        alert(
            "Responda pelo menos um item do checklist."
        );

        return;

    }


    const processo =
        document
            .getElementById("processo")
            .value;


    const auditor =
        document
            .getElementById("auditor")
            .value ||
        "Não informado";


    const data =
        document
            .getElementById("dataAuditoria")
            .value;


    auditoria = {

        processo,

        auditor,

        data,

        arquivo:
            arquivoArtefato ||
            "Nenhum arquivo anexado",

        conformes:
            resultado.conformes,

        aplicaveis:
            resultado.aplicaveis,

        percentual:
            resultado.percentual

    };


    localStorage.setItem(

        "auditflow_auditoria",

        JSON.stringify(auditoria)

    );


    /*
       Cria NC automaticamente
       para cada item marcado
       como Não Conforme.
    */

    respostas.forEach(
        function (resposta, indice) {

            if (resposta === "nc") {

                criarNCAutomatica(
                    indice,
                    auditor,
                    data
                );

            }

        }
    );


    alert(

        "Auditoria finalizada!\n\n" +

        "Aderência: " +

        resultado.percentual.toFixed(1) +

        "%"

    );


    atualizarNCs();

    atualizarDashboard();

}


/* =====================================================
   CRIA NC AUTOMÁTICA
===================================================== */

function criarNCAutomatica(
    indice,
    auditor,
    data
) {


    /*
       Evita criar a mesma NC
       várias vezes.
    */

    const existe =
        naoConformidades.some(
            function (nc) {

                return (

                    nc.item === indice &&

                    nc.dataAuditoria === data

                );

            }
        );


    if (existe) {

        return;

    }


    const id =
        gerarID();


    const prazo =
        calcularPrazo();


    const novaNC = {

        id: id,

        descricao:
            itensChecklist[indice],

        responsavel:
            auditor,

        prazo: prazo,

        status:
            "Aberta",

        escalonamento:
            "Nível 1",

        item:
            indice,

        dataAuditoria:
            data,

        criadaEm:
            new Date().toISOString()

    };


    naoConformidades.push(
        novaNC
    );


    salvarNCs();

}


/* =====================================================
   GERA ID DA NC
===================================================== */

function gerarID() {

    const numero =
        naoConformidades.length + 1;


    return (

        "NC-" +

        String(numero)
            .padStart(3, "0")

    );

}


/* =====================================================
   PRAZO PADRÃO
===================================================== */

function calcularPrazo() {

    const data =
        new Date();


    /*
       Prazo de 7 dias
    */

    data.setDate(
        data.getDate() + 7
    );


    return data
        .toISOString()
        .split("T")[0];

}


/* =====================================================
   MODAL
===================================================== */

function abrirModal() {

    document
        .getElementById("modal")
        .classList.add("aberto");

}


function fecharModal() {

    document
        .getElementById("modal")
        .classList.remove("aberto");

}


/* =====================================================
   SALVAR NC MANUAL
===================================================== */

function salvarNC() {

    const descricao =
        document
            .getElementById(
                "ncDescricao"
            )
            .value
            .trim();


    const responsavel =
        document
            .getElementById(
                "ncResponsavel"
            )
            .value
            .trim();


    const prazo =
        document
            .getElementById(
                "ncPrazo"
            )
            .value;


    if (!descricao) {

        alert(
            "Informe a descrição da NC."
        );

        return;

    }


    const novaNC = {

        id: gerarID(),

        descricao: descricao,

        responsavel:
            responsavel ||
            "Não definido",

        prazo:
            prazo ||
            calcularPrazo(),

        status:
            "Aberta",

        escalonamento:
            "Nível 1",

        item: null,

        dataAuditoria: "",

        criadaEm:
            new Date().toISOString()

    };


    naoConformidades.push(
        novaNC
    );


    salvarNCs();


    limparCamposNC();


    fecharModal();


    atualizarNCs();


    atualizarDashboard();


    alert(
        "Não conformidade registrada!"
    );

}


/* =====================================================
   SALVA NO NAVEGADOR
===================================================== */

function salvarNCs() {

    localStorage.setItem(

        "auditflow_ncs",

        JSON.stringify(
            naoConformidades
        )

    );

}


function salvarRespostas() {

    localStorage.setItem(

        "auditflow_respostas",

        JSON.stringify(
            respostas
        )

    );

}


/* =====================================================
   ATUALIZA TABELA DE NC
===================================================== */

function atualizarNCs() {

    const tabela =
        document.getElementById(
            "tabelaNC"
        );


    tabela.innerHTML = "";


    if (
        naoConformidades.length === 0
    ) {

        tabela.innerHTML = `

            <tr>

                <td colspan="7">

                    Nenhuma NC registrada.

                </td>

            </tr>

        `;

        atualizarSelectNC();

        return;

    }


    naoConformidades.forEach(
        function (nc, indice) {

            const tr =
                document.createElement("tr");


            let classeStatus =
                "status-aberta";


            if (
                nc.status ===
                "Em tratamento"
            ) {

                classeStatus =
                    "status-tratamento";

            }


            if (
                nc.status ===
                "Aguardando verificação"
            ) {

                classeStatus =
                    "status-verificacao";

            }


            if (
                nc.status ===
                "Resolvida"
            ) {

                classeStatus =
                    "status-resolvida";

            }


            const atrasada =
                verificarAtraso(nc);

            const escalonamento =
                nc.escalonamento ||
                "Nível 1";


            tr.innerHTML = `

                <td>
                    <strong>
                        ${nc.id}
                    </strong>
                </td>


                <td>

                    ${nc.descricao}

                    ${
                        atrasada
                        ?
                        `<div class="alerta">
                            ⚠ Prazo vencido.
                            Escalonamento necessário.
                         </div>`
                        :
                        ""
                    }

                </td>


                <td>
                    ${nc.responsavel}
                </td>


                <td>
                    ${formatarData(nc.prazo)}
                </td>


                <td>

                    <span
                        class="status ${classeStatus}">

                        ${nc.status}

                    </span>

                </td>


                <td>
                    <span class="badge-escalonamento">
                        ${escalonamento}
                    </span>
                </td>


                <td>

                    <div class="acoes-nc">

                        <select
                            onchange="
                                alterarStatus(
                                    ${indice},
                                    this.value
                                )
                            ">

                            <option
                                ${
                                    nc.status === "Aberta"
                                    ? "selected"
                                    : ""
                                }>

                                Aberta

                            </option>


                            <option
                                ${
                                    nc.status === "Em tratamento"
                                    ? "selected"
                                    : ""
                                }>

                                Em tratamento

                            </option>


                            <option
                                ${
                                    nc.status === "Aguardando verificação"
                                    ? "selected"
                                    : ""
                                }>

                                Aguardando verificação

                            </option>


                            <option
                                ${
                                    nc.status === "Resolvida"
                                    ? "selected"
                                    : ""
                                }>

                                Resolvida

                            </option>

                        </select>

                        <button
                            class="btn btn-mini escalonar"
                            type="button"
                            onclick="escalarNC(${indice})">
                            Escalar
                        </button>

                        <button
                            class="btn btn-mini excluir"
                            type="button"
                            onclick="excluirNC(${indice})">
                            Excluir
                        </button>

                    </div>

                </td>

            `;


            tabela.appendChild(tr);

        }
    );


    atualizarSelectNC();

}


/* =====================================================
   ALTERAR STATUS
===================================================== */

function alterarStatus(
    indice,
    novoStatus
) {

    naoConformidades[
        indice
    ].status =
        novoStatus;

    if (
        novoStatus === "Resolvida"
    ) {
        naoConformidades[indice].escalonamento =
            "Resolvido";
    }


    salvarNCs();


    atualizarNCs();


    atualizarDashboard();

}


/* =====================================================
   ESCALONAR NC
===================================================== */

function escalarNC(indice) {

    const nc =
        naoConformidades[indice];

    if (!nc) {
        return;
    }

    const niveis = [
        "Nível 1",
        "Nível 2",
        "Nível 3"
    ];

    const indiceAtual =
        niveis.indexOf(
            nc.escalonamento ||
            "Nível 1"
        );

    const proximoNivel =
        niveis[
            Math.min(
                indiceAtual + 1,
                niveis.length - 1
            )
        ];

    nc.escalonamento =
        proximoNivel;

    nc.status =
        nc.status === "Resolvida"
            ? "Resolvida"
            : "Em tratamento";

    salvarNCs();
    atualizarNCs();
    atualizarDashboard();

    alert(
        `NC escalada para ${proximoNivel}.`
    );

}


/* =====================================================
   EXCLUIR NC
===================================================== */

function excluirNC(indice) {

    const nc =
        naoConformidades[indice];

    if (!nc) {
        return;
    }

    const confirmar =
        window.confirm(
            `Deseja excluir ${nc.id} - ${nc.descricao}?`
        );

    if (!confirmar) {
        return;
    }

    naoConformidades.splice(
        indice,
        1
    );

    salvarNCs();
    atualizarNCs();
    atualizarDashboard();

    alert(
        "Não conformidade excluída."
    );

}


/* =====================================================
   VERIFICA PRAZO
===================================================== */

function verificarAtraso(nc) {

    if (
        nc.status ===
        "Resolvida"
    ) {

        return false;

    }


    const hoje =
        new Date();


    const prazo =
        new Date(
            nc.prazo +
            "T23:59:59"
        );


    return hoje > prazo;

}


/* =====================================================
   FORMATA DATA
===================================================== */

function formatarData(data) {

    if (!data) {

        return "-";

    }


    return new Date(
        data + "T12:00:00"
    ).toLocaleDateString(
        "pt-BR"
    );

}


/* =====================================================
   ATUALIZA DASHBOARD
===================================================== */

function atualizarDashboard() {


    const aderencia =
        auditoria
        ?
        auditoria.percentual
        :
        0;


    const conformes =
        auditoria
        ?
        auditoria.conformes
        :
        0;


    const abertas =
        naoConformidades.filter(
            function (nc) {

                return (
                    nc.status !==
                    "Resolvida"
                );

            }
        ).length;


    const resolvidas =
        naoConformidades.filter(
            function (nc) {

                return (
                    nc.status ===
                    "Resolvida"
                );

            }
        ).length;


    document
        .getElementById(
            "dashboardAderencia"
        )
        .textContent =
        aderencia.toFixed(1) +
        "%";


    document
        .getElementById(
            "dashboardConformes"
        )
        .textContent =
        conformes;


    document
        .getElementById(
            "dashboardAbertas"
        )
        .textContent =
        abertas;


    document
        .getElementById(
            "dashboardResolvidas"
        )
        .textContent =
        resolvidas;


    document
        .getElementById(
            "dashboardProgress"
        )
        .style.width =
        aderencia + "%";


    const resultado =
        document.getElementById(
            "resultadoAuditoria"
        );


    if (auditoria) {

        resultado.textContent =

            `Processo: ${
                auditoria.processo
            } | Auditor: ${
                auditoria.auditor
            } | Data: ${
                formatarData(
                    auditoria.data
                )
            } | Arquivo: ${
                auditoria.arquivo ||
                "Nenhum arquivo anexado"
            }`;

    }


    atualizarDashboardNCs();

}


/* =====================================================
   NCs NO DASHBOARD
===================================================== */

function atualizarDashboardNCs() {

    const container =
        document.getElementById(
            "dashboardNCs"
        );


    const pendentes =
        naoConformidades.filter(
            function (nc) {

                return (
                    nc.status !==
                    "Resolvida"
                );

            }
        );


    if (
        pendentes.length === 0
    ) {

        container.innerHTML =
            "<p>Nenhuma NC pendente.</p>";

        return;

    }


    container.innerHTML = "";


    pendentes.forEach(
        function (nc) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "check-item";


            div.innerHTML = `

                <strong>
                    ${nc.id}
                </strong>

                -

                ${nc.descricao}

                <br>

                <small>

                    Responsável:
                    ${nc.responsavel}

                    |

                    Prazo:
                    ${formatarData(
                        nc.prazo
                    )}

                </small>

                ${
                    verificarAtraso(nc)
                    ?
                    `<div class="alerta">
                        ⚠ Prazo vencido.
                        Escalonar para o responsável superior.
                     </div>`
                    :
                    ""
                }

            `;


            container.appendChild(div);

        }
    );

}


/* =====================================================
   SELECT DE NC
===================================================== */

function atualizarSelectNC() {

    const select =
        document.getElementById(
            "selectNC"
        );


    select.innerHTML = `

        <option value="">

            Selecione uma NC

        </option>

    `;


    naoConformidades.forEach(
        function (nc, indice) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                indice;


            option.textContent =

                `${nc.id} - ${
                    nc.descricao
                }`;


            select.appendChild(
                option
            );

        }
    );

}


/* =====================================================
   GERA COMUNICAÇÃO
===================================================== */

function gerarMensagem() {

    const indice =
        document.getElementById(
            "selectNC"
        ).value;


    const campo =
        document.getElementById(
            "mensagem"
        );


    if (indice === "") {

        campo.value = "";

        return;

    }


    const nc =
        naoConformidades[
            indice
        ];


    campo.value =

`COMUNICAÇÃO DE NÃO CONFORMIDADE

NC: ${nc.id}

Descrição:
${nc.descricao}

Responsável:
${nc.responsavel}

Prazo:
${formatarData(nc.prazo)}

Status:
${nc.status}

Escalonamento:
${nc.escalonamento || "Nível 1"}

Solicitamos o tratamento da não conformidade dentro do prazo estabelecido e a implementação das ações corretivas.

Se necessário, o caso será escalado para a hierarquia superior conforme o nível de criticidade e prazo definido.

Após a correção, deverá ser registrada a evidência para posterior verificação e encerramento da NC.`;


}


/* =====================================================
   ENVIAR EMAIL
===================================================== */

function registrarEmailNoConsole() {

    const email =
        document
            .getElementById("emailDestinatario")
            .value
            .trim();

    if (!email) {
        return;
    }

    console.log(
        "E-mail registrado para comunicação:",
        email
    );

}


function enviarEmailNCAssunto() {

    const email =
        document
            .getElementById("emailDestinatario")
            .value
            .trim();

    const mensagem =
        document
            .getElementById("mensagem")
            .value
            .trim();

    const select =
        document
            .getElementById("selectNC");

    if (select.value === "") {
        alert(
            "Selecione uma NC primeiro."
        );
        return;
    }

    if (!email) {
        alert(
            "Informe o e-mail do destinatário antes de enviar."
        );
        return;
    }

    if (!mensagem) {
        alert(
            "A mensagem da NC ainda não foi gerada."
        );
        return;
    }

    console.log(
        "E-mail enviado para:",
        email
    );

    console.log(
        "Mensagem da NC:",
        mensagem
    );

    const assunto =
        encodeURIComponent(
            "Comunicação de Não Conformidade"
        );

    const corpo =
        encodeURIComponent(mensagem);

    window.location.href =
        `mailto:${email}?subject=${assunto}&body=${corpo}`;

    alert(
        "Seu cliente de e-mail foi aberto com a comunicação pronta para envio."
    );

}


/* =====================================================
   LIMPA CHECKLIST
===================================================== */

function limparChecklist() {

    respostas =
        new Array(
            itensChecklist.length
        ).fill(null);

    salvarRespostas();

    criarChecklist();

    calcularAderencia();

}


function reiniciarAuditoria() {

    const confirmar =
        window.confirm(
            "Deseja limpar o checklist e remover a última auditoria salva?"
        );

    if (!confirmar) {
        return;
    }

    respostas =
        new Array(
            itensChecklist.length
        ).fill(null);

    auditoria = null;

    arquivoArtefato = null;

    localStorage.removeItem(
        "auditflow_auditoria"
    );

    localStorage.removeItem(
        "auditflow_arquivo"
    );

    salvarRespostas();

    criarChecklist();
    configurarAnexoArquivo();
    calcularAderencia();
    atualizarDashboard();

    alert(
        "Dados da auditoria reiniciados."
    );

}


function exportarPdf() {

    const resultado =
        calcularAderencia();

    const processo =
        document
            .getElementById("processo")
            .value || "Artefato não informado";

    const auditor =
        document
            .getElementById("auditor")
            .value || "Não informado";

    const data =
        document
            .getElementById("dataAuditoria")
            .value || new Date().toISOString().split("T")[0];

    const ncsPendentes =
        naoConformidades.filter(
            function (nc) {

                return nc.status !== "Resolvida";

            }
        ).length;

    const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Relatório de Auditoria</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; color: #2d2d2d; }
                h1 { color: #74142c; }
                .box { border: 1px solid #e7dfe2; border-radius: 10px; padding: 16px; margin-bottom: 20px; }
                .linha { margin: 8px 0; }
                .badge { display: inline-block; background: #f8e9ed; color: #74142c; padding: 6px 10px; border-radius: 999px; font-weight: bold; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th, td { border: 1px solid #e7dfe2; padding: 8px; text-align: left; }
                th { background: #fcf3f5; }
            </style>
        </head>
        <body>
            <h1>Relatório de Auditoria</h1>
            <div class="box">
                <div class="linha"><strong>Processo:</strong> ${processo}</div>
                <div class="linha"><strong>Auditor:</strong> ${auditor}</div>
                <div class="linha"><strong>Data:</strong> ${formatarData(data)}</div>
                <div class="linha"><strong>Arquivo anexado:</strong> ${arquivoArtefato || "Nenhum arquivo anexado"}</div>
                <div class="linha"><strong>Aderência:</strong> <span class="badge">${resultado.percentual.toFixed(1)}%</span></div>
                <div class="linha"><strong>Conformes:</strong> ${resultado.conformes} / ${resultado.aplicaveis} aplicáveis</div>
                <div class="linha"><strong>NCs pendentes:</strong> ${ncsPendentes}</div>
            </div>
            <div class="box">
                <h3>Resumo do Checklist</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Pergunta</th>
                            <th>Resposta</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itensChecklist.map(function (item, indice) {
                            const valor = respostas[indice] || "não avaliado";
                            const legenda = {
                                conforme: "Conforme",
                                nc: "Não Conforme",
                                na: "N/A"
                            };
                            return `
                                <tr>
                                    <td>${indice + 1}</td>
                                    <td>${item}</td>
                                    <td>${legenda[valor] || "Não avaliado"}</td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
        </body>
        </html>
    `;

    const janela =
        window.open(
            "",
            "_blank",
            "width=900,height=700"
        );

    if (!janela) {
        alert(
            "O navegador bloqueou a janela de impressão. Permita pop-ups e tente novamente."
        );
        return;
    }

    janela.document.write(html);
    janela.document.close();
    janela.focus();

    setTimeout(
        function () {
            janela.print();
        },
        500
    );

}


/* =====================================================
   LIMPA FORMULÁRIO DE NC
===================================================== */

function limparCamposNC() {

    document
        .getElementById(
            "ncDescricao"
        )
        .value = "";


    document
        .getElementById(
            "ncResponsavel"
        )
        .value = "";


    document
        .getElementById(
            "ncPrazo"
        )
        .value = "";

}