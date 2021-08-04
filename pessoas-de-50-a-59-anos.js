/*
//HOMOLOGACAO
https://backcomunicacaohmlg.uberlandia.mg.gov.br

//PRODUCAO
https://backcomunicacao.uberlandia.mg.gov.br
*/
////////////////////////////////////////////////////////////////////////////////
//ALERTA CIDADAO
////////////////////////////////////////////////////////////////////////////////

var jq_ = $.noConflict(true);

$("#cad_cep").blur(function () {
    showMsg('#boxCep');
    var cep = $(this).val();
    if (cep != '') {
        $('#cad_logradouro').prop("readonly", true);
        $('#cad_bairro').prop("readonly", true);
        $('#cad_cidade').prop("readonly", true);
        cep = cep.replace("-", "");
        cep = apenasNumeros(cep); //38400-389
        if (cep.length >= 8) {
            $dados = "acao=CEP&cep=" + cep;
            $pag = "https://agedi3.com/cep/index.php";
            jq_.ajax({
                type: "post",
                url: $pag,
                cache: false,
                data: $dados,
                dataType: 'text',
                success: function (retorno) {
                    //console.log(retorno);
                    $('#boxCep').html('&nbsp;');
                    //[{"logradouro":"Avenida Estr\u00eala do Sul","bairro":"Osvaldo Rezende","cidade":"UBERL\u00c2NDIA","cep":"38400389","uf":"MG"}]
                    var obj = JSON.parse(retorno);
                    var strjson = '';
                    var logradouro = "";
                    var bairro = "";
                    var cidade = "";
                    var uf = "";
                    $('#cad_numero').val('');
                    $('#cad_complemento').val('');
                    obj.forEach(function (o, index) {
                        logradouro = o.logradouro;
                        bairro = o.bairro;
                        cidade = o.cidade;
                        uf = o.uf;
                    });
                    if (logradouro == '' || logradouro == null){
                        $('#cad_logradouro').prop("readonly",false);
                    }
                    if (bairro == '' || bairro == null) {
                        $('#cad_bairro').prop("readonly", false);
                    }
                    var cidadeCheck = especialCharMask(cidade);
                    if (cidadeCheck == 'UBERLANDIA') {
                        $('#boxCep').html('&nbsp;');
                        var logra = logradouro.split(" ");
                        var tipo = logra[0].toLowerCase();
                        var vtipo = tipo.substr(0, 1);
                        vtipo = vtipo.toUpperCase();
                        var vtipo2 = tipo.substr(1, tipo.length);
                        var tipo_final = removeAcento(vtipo + vtipo2,1);
                        $('#cad_tipo_logradouro').val(tipo_final).change();
                        var strlogra = "";
                        for (var i = 1; i < logra.length; i++) {
                            strlogra += logra[i] + " ";
                        }
                        if (cidade != '') {
                            cidade = cidade + "-" + uf;
                        }
                        $('#cad_logradouro').val($.trim(strlogra));
                        $('#cad_bairro').val(bairro);
                        $('#cad_cidade').val(cidade);
                        //$('#cad_logradouro').prop("readonly", true);
                        //$('#cad_bairro').prop("readonly", true);
                        //$('#cad_cidade').prop("readonly", true);
                    } else {
                        $('#cad_cep').val('');
                        $('#boxCep').html('<span style="color:red;">CEP inválido!</span>');
                        hiddMsg('#boxCep', 3000);
                        $('#cad_logradouro').prop("readonly", true);
                        $('#cad_bairro').prop("readonly", true);
                        $('#cad_cidade').prop("readonly", true);
                        $('#cad_logradouro').val('');
                        $('#cad_bairro').val('');
                        $('#cad_cidade').val('');
                    }

                },
                beforeSend: function () {
                    $('#boxCep').html('<i class=\"fa fa-refresh fa-spin\"></i>');
                }
            });
        } else {
            $('#boxCep').html('<span style="color:red;">CEP não encontrado!');
            hiddMsg('#boxCep', 3000);
            $('#cad_cep').val('');
            //$('#cad_logradouro').prop("readonly", false);
            //$('#cad_bairro').prop("readonly", false);
        }
    }

});

function limparFormCad() {
    $('#boxBtnBuscando1').css("display", "block");
    $('#boxBtnBuscando2').css("display", "none");
    $('#btnLimpar').css("display", "none");
    $('#boxMsgPadrao').css("display", "none");

    $('#cad_cpf').prop("disabled", false);
    $('#cad_datanasc').prop("disabled", false);
    limpaInputHid();
    initChecks();
    grecaptcha.reset();

    $('#boxProsseguir').css("display", "block");

    //redUrl('profissional-de-saude', 60000);
    resetFrm('#frmsaude')
    $('.cardshow').css("display", "none");
    $('#boxCaptcha').css("display", "block");
    $('#haveBPC1').css("display", "block");
    
}

function showModalNew(msg, cleaninp){
    $('#modalLoader').modal();
    $('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-info-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">' + msg + '</div><br><br><br>');
    if (cleaninp != ''){
        $('#' + cleaninp).val('');
        $('#' + cleaninp).focus();
    }
}

function validaData(target) {
    var data = $('#' + target).val();
    if (data != '') {
        var RegExPattern = checaData(data);
        if (RegExPattern == false) {
            return false;
        } else {
            return true;
        }
    }
}


function buscaNis(cpf, idPbc){
    if (cpf != '') {
        var pag = PG_SITE_URL + "/rest.php";
        var dados = "acao=$2y$10$eIE3N9LohHw05Vwe7hZ2c.QM3Pq4Xb1McSHw.zUF0zlRTTvJqx6dy&cpf=" + btoa(crip(cpf));
        jq_.ajax({
            type: "GET",
            url: pag,
            data: dados,
            cache: false,
            dataType: 'text',
            success: function (retorno) {
                //console.log("BUSCA NISS = " + retorno);
                var json = $.parseJSON(retorno);
                var existe = 0;
                $.each(json, function (idx, obj) {
                    //console.log("NIS = " + obj.dsNis);
                    if (obj.dsNis != '' && obj.dsNis != null) {
                        existe++;
                        $('#tembpc2_1').attr("checked", true);
                        $('#cad_nis').val(obj.dsNis);
                        $('#cad_nis').attr("readonly",true);
                        $('#nNis').val(obj.dsNis);
                        $('#tembpc2_0').attr("disabled",true);
                        $('#tembpc2_1').attr("disabled",true);
                        
                        if(idPbc == ''){
                            showBPC('S', '.defi');
                        } else{
                            showBPC(idPbc, '.defi');
                        }
                    }
                });
                if(existe == 0){
                    $('#tembpc2_0').attr("checked", true);
                    
                    $('#tembpc2_0').attr("disabled",false);
                    $('#tembpc2_1').attr("disabled",false);
                    $('#cad_nis').attr("readonly",false);
                    if(idPbc == 'S'){
                        showBPC('S', '.defi');
                    } else{
                        showBPC('N', '.defi');
                    }
                }

            }
        });
    }
}

function checaNis(nis)
{
    if (nis != '') {
        $('#boxBtns').css("display","none");
        var pag = PG_SITE_URL + "/rest.php";
        var dados = "acao=$2y$10$7VnjgXl86iKznQuudsmCverxl8nGtqlc4cer/zroxO3/EiXJ2qek2&nis=" + btoa(crip(nis));
        jq_.ajax({
            type: "GET",
            url: pag,
            data: dados,
            cache: false,
            dataType: 'text',
            success: function (retorno) {
                //console.log(retorno);
                $('#boxMsgNis').html('&nbsp;');
    
                var cpf = $('#cad_cpf').val();
                cpf = apenasNumeros(cpf);
                var json = $.parseJSON(retorno);
                var existe = 0;
                $.each(json, function (idx, obj) {
                    //console.log("NIS = " + obj.dsNis);
                    if (obj.dsNis != '' && obj.dsNis != null) {
                        existe++;
                        if (cpf != obj.dsCpf){
                            showModalNew("Este número de NIS não pertence ao CPF <strong>" + cpf + "</strong>!", "");
                            $('#cad_nis').val('');
                        }
                    }
                });
                if(existe == 0){
                    showModalNew("Este número de NIS não está cadastrado na Secretaria de Desenvolvimento Social!", "");
                    $('#cad_nis').val('');
                }
                $('#boxBtns').css("display","block");
            },
            beforeSend: function () {
                $('#boxMsgNis').html('<i class="fa fa-refresh fa-spin"></i>');
            },
        });
    }
}

function validaCaptach() {
    
    hideBtnIni();
    $('#btnFooter').css("display", "block");
    $('#close_window').css("display", "block");

    var cpf = $('#cad_cpf').val();
    var dn = $('#cad_datanasc').val();
    var dn2 = formatData(dn);
    var idade = calculaIdade(dn2);
    console.log("idade = " + idade);
    var idadeFull = calcIdade();

    if (cpf == ''){
        showModalNew("O campo CPF não pode ser vazio!", "");
        showBtnIni();
    } else if (checCNPJECPF(cpf) == false) {
        showModalNew("CPF inválido!", "cad_cpf");
        showBtnIni();
    } else if (dn == '') {
        showModalNew("Data de nascimento não pode ser vazio!", "cad_datanasc");
        showBtnIni();
    } else if (validaData('cad_datanasc') == false) {
        showModalNew("Data de nascimento inválida!", "cad_datanasc");
        showBtnIni();
    } else if (parseInt(idade) < 26 || parseInt(idadeFull) > 59) {
        showModalNew("É permitido apenas pessoas entre 29 e 59 anos!", "");
        showBtnIni();
    }
    else {
        var g = $('#g-recaptcha-response').val();
        var dados = "acao=VALIDACAPTCHA&g-recaptcha-response=" + g;
        jq_.ajax({
            type: "POST",
            url: PG_SITE_URL + "/ajax.php",
            cache: false,
            data: dados,
            dataType: 'text',
            success: function (retorno) {
                if (parseInt(retorno) == 1) {
                    checaCPF();
                } else if (parseInt(retorno) == 200) {
                    $('#modalLoader').modal();
                    $('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-info-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">Prove que você não é um robô!</div><br><br><br>');
                    showBtnIni();
                } else if (parseInt(retorno) == 300) {
                    $('#modalLoader').modal();
                    $('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-info-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">Prove que você não é um robô!</div><br><br><br>');
                    showBtnIni();
                }
            }
        });
    }


}

function buscaEducador(cpf){
    var pag = PG_SITE_URL + "/rest.php";
    var dados = "acao=$2y$10$F6CmWdD59vg2CWxXTU.zWeewptYsfKFjzwQMf842UVaQNSH6cuhvO&cpf=" + btoa(crip(cpf));
    jq_.ajax({
        type: "GET",
        url: pag,
        data: dados,
        cache: false,
        dataType: 'text',
        success: function (retorno) {
            console.log("EDUCADOR = " + retorno);
            
            /*
            [{"dsUsuAlter":"INSERT","dtUltAlter":"2021-05-30T13:01:16.000+0000","vsVersao":0,
            "idCadastroEducador":9898,"nrCnpj":"12345678901234","nrCpfResponsavel":7655929670,
            "nmEmpresa":"EMPRESA TESTE","dsAtividadePessoa":"PROFESSORES","nmUsuario":"JOSÉ SERGIO DA SILVA",
            "dsCpf":"12345678901","dtNascimento":"1950-05-24T13:00:44.000+0000","dsAtuacaoPessoa":"CRECHE",
            "idRedeEscola":"P","dtCadastro":"2021-05-11T13:02:46.000+0000","nrCarteiraProfissional":"31321231"}]
            */
            if(retorno != ''){
                var idCadastroEducador = "";
                var nrCnpj = "";
                var nrCpfResponsavel = "";
                var nmEmpresa = "";
                var dsAtividadePessoa = "";
                var nmUsuario = "";
                var dsCpf = "";
                var dtNascimento = "";
                var dsAtuacaoPessoa = "";
                var idRedeEscola = "";
                var nrCarteiraProfissional = "";
                var json = JSON.parse(retorno);
                if (typeof (json[0]) !== undefined){
                    $.each(json, function (idx, obj) {
                        idCadastroEducador = obj.idCadastroEducador;
                        nrCnpj = obj.nrCnpj;
                        nrCpfResponsavel = obj.nrCpfResponsavel;
                        nmEmpresa = obj.nmEmpresa;
                        dsAtividadePessoa = obj.dsAtividadePessoa;
                        nmUsuario = obj.nmUsuario;
                        dsCpf = obj.dsCpf;
                        dtNascimento = obj.dtNascimento;
                        dtNascimento = dtNascimento.split("T");
                        dtNascimento = dtNascimento[0];

                        dsAtuacaoPessoa = obj.dsAtuacaoPessoa;
                        idRedeEscola = obj.idRedeEscola;
                        nrCarteiraProfissional = obj.nrCarteiraProfissional;
                        $('#e_idCadastroEducador').val(idCadastroEducador);
                        $('#e_nrCnpj').val(nrCnpj);
                        $('#e_nrCpfResponsavel').val(nrCpfResponsavel);
                        $('#e_nmEmpresa').val(nmEmpresa);
                        $('#e_dsAtividadePessoa').val(dsAtividadePessoa);
                        $('#e_nmUsuario').val(nmUsuario);
                        $('#e_dsCpf').val(dsCpf);
                        $('#e_dtNascimento').val(dtNascimento);
                        $('#e_dsAtuacaoPessoa').val(dsAtuacaoPessoa);
                        $('#e_idRedeEscola').val(idRedeEscola);

                        //COMPLETA CAMPOS
                        $('#cad_empresa').val(nmEmpresa);
                        $('#cad_atividade').val(dsAtividadePessoa);
                        $('#cad_atuacao').val(dsAtuacaoPessoa);
                        $('#cad_clt').val(nrCarteiraProfissional);
                        $('#cad_nome').val(nmUsuario);
                    });
                }

                if(nmUsuario != ''){
                    var dn = $('#cad_datanasc').val();
                    checaCPF();
                    /*dn = formatData(dn);
                    if (dn != '' && dn != dtNascimento.replaceAll("/", "-")) {
                        showModalNew("Data de nascimento diferente do cadastro existente. Favor informe a data de nascimento correta!", "cad_datanasc");
                        showBtnIni();
                    } else{
                        checaCPF();
                    }*/
                } else {
                    showModalNew("Não encontramos seu cadastro! Favor procurar a instituição onde você trabalha.", "");
                    showBtnIni();
                }

            }

        }
    });
}

function hideBtnIni() {
    $('#boxBtnBuscando1').css("display", "none");
    $('#boxBtnBuscando2').css("display", "block");
}

function showBtnIni() {
    $('#boxBtnBuscando1').css("display", "block");
    $('#boxBtnBuscando2').css("display", "none");
    grecaptcha.reset();
}

function especialCharMask(str) {
    com_acento = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
    sem_acento = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
    novastr = "";
    for (i = 0; i < str.length; i++) {
        troca = false;
        for (a = 0; a < com_acento.length; a++) {
            if (str.substr(i, 1) == com_acento.substr(a, 1)) {
                novastr += sem_acento.substr(a, 1);
                troca = true;
                break;
            }
        }
        if (troca == false) {
            novastr += str.substr(i, 1);
        }
    }
    return novastr;
}

function calcIdade() {
    if (typeof ($('#cad_datanasc').val()) !== undefined && $('#cad_datanasc').val() != null && $('#cad_datanasc').val() != '') {
        var nascimento = $('#cad_datanasc').datepicker("getDate");
        var hoje = new Date();
        var diferencaAnos = hoje.getFullYear() - nascimento.getFullYear();
        if ( new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) < 
             new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate()) ){
                diferencaAnos--;
        }
        console.log("calc idade = " + diferencaAnos);  
        return diferencaAnos;
    }
}

function calculaIdade(cad_datanasc) {
    var idade = "";
    if (typeof (cad_datanasc) !== undefined && cad_datanasc != null && cad_datanasc != '') {
        var dnc = cad_datanasc.split("-");
        var year = $('#anoatual').val();
        var idade = parseInt(year) - parseInt(dnc[0]);
    }
    console.log(idade);
    return idade;
}

function confirmAltCadDados(target, tipo) {

    var cad_cpf = jq_('#cad_cpf').val();

    var cad_datanasc = jq_('#cad_datanasc').val();
    cad_datanasc = formatData(cad_datanasc);
    var idade = calculaIdade(cad_datanasc);
    var idadeFull = calcIdade();

    var cad_nome = jq_('#cad_nome').val();
    var cad_nome_mae = jq_('#cad_nome_mae').val();
    var cad_telefone = jq_('#cad_telefone').val();

    var cad_celular = jq_('#cad_celular').val();
    var cad_cep = jq_('#cad_cep').val();
    var cad_tipo_logradouro = jq_('#cad_tipo_logradouro option:selected').val();
    var cad_logradouro = jq_('#cad_logradouro').val();

    var cad_numero = jq_('#cad_numero').val();
    var cad_complemento = jq_('#cad_complemento').val();
    var cad_bairro = jq_('#cad_bairro').val();
    var cad_email = jq_('#cad_email').val();

    var dsCid = removeAcento($('#cad_cidade').val(), 1);
    var dsUf = "";
    if ($('#cad_cidade').val() != '') {
        dsCid = dsCid.split("-");
        dsCidade = dsCid[0];
        dsUf = dsCid[1];
        if (dsUf == '' || dsUf == null) {
            dsUf = 'MG';
        }
    }

    var cad_rg = jq_('#cad_rg').val();

    var vdsDocumentoConselho = jq_('#cad_conselho').val();
    var voidCategoriasProfissoes = jq_('#cad_categoria').val();
    var voidSetoresMedicos = jq_('#cad_setor').val();
    var cad_instituicao = jq_('#cad_instituicao').val();
    var sexo = "";
    if (jq_('#sexo1').is(":checked")) {
        sexo = "M";
    }
    if (jq_('#sexo2').is(":checked")) {
        sexo = "F";
    }

    var possuicep = "";
    if (jq_('#possuicep1').is(":checked")) {
        possuicep = "S";
    }
    if (jq_('#possuicep2').is(":checked")) {
        possuicep = "N";
    }

    var acamado = "";
    if (jq_('#cad_acamado1').is(":checked")) {
        acamado = "N";
    }
    if (jq_('#cad_acamado2').is(":checked")) {
        acamado = "S";
    }
    
    if (parseInt(idade) < 26 || parseInt(idadeFull) > 59) {
        showModalNew("É permitido apenas pessoas entre 29 e 59 anos!","")
    } else if (cad_cpf == '') {
        showModalNew("Digite o CPF!","");
    } else if (cad_datanasc == '') {
        showModalNew("Digite a data de nascimento!", "");
    } else if (cad_rg == '') {
        showModalNew("Digite o número do RG!", "");
    } else if (sexo == '') {
        showModalNew("Selecione o SEXO!", "");
    } else if (acamado == '') {
        showModalNew("Selecione se é acamado ou não!");
    } else if (cad_nome == '') {
        showModalNew("Digite o nome!", "");
    } else if (cad_nome_mae == '') {
        showModalNew("Digite o nome da mãe!", "");
    } else if (cad_celular == '') {
        showModalNew("Digite o telefone celular!", "");
    } else if (cad_cep == '' && possuicep == 'S') {
        showModalNew("Digite o CEP!", "");
    } else if (cad_tipo_logradouro == '') {
        showModalNew("Digite o tipo de logradouro!", "");
    } else if (cad_logradouro == '') {
        showModalNew("Digite o logradouro!", "");
    } else if (cad_numero == '') {
        showModalNew("Digite o número!", "");
    } else if (cad_bairro == '') {
        showModalNew("Digite o bairro!", "");
    } else if (dsCid == '') {
        showModalNew("Digite a cidade!", "");
    } else {
        $('#modalLoader').modal();
        var htm = '<p>Vamos encaminhar uma mensagem de texto com a <strong>data</strong>, <strong>hora</strong> e <strong>local</strong> da vacinação para o celular informado.<br><br>Este número está correto?</p>';
        htm += '<div class="card">';
        htm += '<div class="card-body">';
        htm += '<form class="form-inline" onsubmit="return false;">';
        htm += '<label class="sr-only" for="cad_celular_confirm_alt">Celular <sup><i class="fas fa-asterisk icoObrig"></i></sup> <span id="boxMsgTeleCel2"><span></label><br>';
        htm += '<input type="text" class="form-control mb-2 mr-sm-2 celular_with_ddd" name="cad_celular_confirm_alt" id="cad_celular_confirm_alt" placeholder="Confirme o celular" maxlength=15 onblur="validaCelular(this.value, \'#boxMsgTeleCel2\');">';
        if (tipo == 2) {
            htm += '<button type="submit" class="btn btn-primary mb-2" onClick="getNumCel(2)">Confirmar</button>';
        } else {
            htm += '<button type="submit" class="btn btn-primary mb-2" onClick="getNumCel(1)">Confirmar</button>';
        }

        htm += '</form>';
        htm += '<div id="boxMsgConfirm"></div>';
        htm += '</div>';
        htm += '</div>'
        $(target).html(htm);
        $('#cad_celular_confirm_alt').val($('#cad_celular').val());
        initMasks();
    }
}

function getNumCel(tipo) {
    var celular = $('#cad_celular_confirm_alt').val();
    if (celular == '') {
        $('#boxMsgConfirm').html('<div class="alert alert-warning text-center" role="alert">Confirme o celular!</div>');
    } else {
        $('#cad_celular').val(celular);
        if (tipo == 2) {
            alteraDados('#boxLoad');
        } else {
            gravaDados('#boxLoad');
        }
    }

}

function gravaDados(target) {
    var cad_cpf = jq_('#cad_cpf').val();

    var cad_datanasc = jq_('#cad_datanasc').val();
    cad_datanasc = formatData(cad_datanasc);
    var idade = calculaIdade(cad_datanasc);
    var idadeFull = calcIdade();

    var cad_nome = jq_('#cad_nome').val();
    var cad_nome_mae = jq_('#cad_nome_mae').val();
    var cad_telefone = jq_('#cad_telefone').val();

    var cad_celular = jq_('#cad_celular').val();
    var cad_cep = jq_('#cad_cep').val();
    var cad_tipo_logradouro = jq_('#cad_tipo_logradouro option:selected').val();
    var cad_logradouro = jq_('#cad_logradouro').val();

    var cad_numero = jq_('#cad_numero').val();
    var cad_complemento = jq_('#cad_complemento').val();
    var cad_bairro = jq_('#cad_bairro').val();
    var cad_email = jq_('#cad_email').val();

    var dsCid = removeAcento($('#cad_cidade').val(), 1);
    var dsUf = "";
    if ($('#cad_cidade').val() != '') {
        dsCid = dsCid.split("-");
        dsCidade = dsCid[0];
        dsUf = dsCid[1];
        if (dsUf == '' || dsUf == null) {
            dsUf = 'MG';
        }
    }

    var cad_rg = jq_('#cad_rg').val();

    var vdsDocumentoConselho = jq_('#cad_conselho').val();
    var voidCategoriasProfissoes = jq_('#cad_categoria').val();
    var voidSetoresMedicos = jq_('#cad_setor').val();
    var cad_instituicao = jq_('#cad_instituicao').val();
    var sexo = "";
    if (jq_('#sexo1').is(":checked")) {
        sexo = "M";
    }
    if (jq_('#sexo2').is(":checked")) {
        sexo = "F";
    }

    var possuicep = "";
    if (jq_('#possuicep1').is(":checked")) {
        possuicep = "S";
    }
    if (jq_('#possuicep2').is(":checked")) {
        possuicep = "N";
    }

    var acamado = "";
    if (jq_('#cad_acamado1').is(":checked")) {
        acamado = "N";
    }
    if (jq_('#cad_acamado2').is(":checked")) {
        acamado = "S";
    }

    
    if (parseInt(idade) < 26 || parseInt(idadeFull) > 59) {
        showModalNew("É permitido apenas pessoas entre 29 e 59 anos!","")
    } else if (cad_cpf == '') {
        showModalNew("Digite o CPF!","");
    } else if (cad_datanasc == '') {
        showModalNew("Digite a data de nascimento!", "");
    } else if (cad_rg == '') {
        showModalNew("Digite o número do RG!", "");
    } else if (sexo == '') {
        showModalNew("Selecione o SEXO!", "");
    } else if (acamado == '') {
        showModalNew("Selecione se é acamado ou não!");
    } else if (cad_nome == '') {
        showModalNew("Digite o nome!", "");
    } else if (cad_nome_mae == '') {
        showModalNew("Digite o nome da mãe!", "");
    } else if (cad_celular == '') {
        showModalNew("Digite o telefone celular!", "");
    } else if (cad_cep == '' && possuicep == 'S') {
        showModalNew("Digite o CEP!", "");
    } else if (cad_tipo_logradouro == '') {
        showModalNew("Digite o tipo de logradouro!", "");
    } else if (cad_logradouro == '') {
        showModalNew("Digite o logradouro!", "");
    } else if (cad_numero == '') {
        showModalNew("Digite o número!", "");
    } else if (cad_bairro == '') {
        showModalNew("Digite o bairro!", "");
    } else if (dsCid == '') {
        showModalNew("Digite a cidade!", "");
    } else {
        $('#modalLoader').modal();

        var tpUsuario = "O";

        var da = getCurrentDateLocal();
        da = da.split('T');
        cad_datanasc = cad_datanasc + "T00:00:00";

        if (cad_cep == '' && possuicep == 'N') {
            cad_cep = '00000000';
        }

        var dsAtividadePessoa = $('#e_dsAtividadePessoa').val();
        dsAtividadePessoa = retiraCaracEsp(dsAtividadePessoa);
        var dsAtuacaoPessoa = $('#e_dsAtuacaoPessoa').val();
        dsAtuacaoPessoa = retiraCaracEsp(dsAtuacaoPessoa);
        var idRedeEscola = $('#e_idRedeEscola').val();
        var nmEmpresa = $('#e_nmEmpresa').val();
        nmEmpresa = retiraCaracEsp(nmEmpresa);
        var nrCarteiraProfissional = $('#e_nrCarteiraProfissional').val();
        var nrCnpj = $('#e_nrCnpj').val();
        var nrCpfResponsavel = $('#e_nrCpfResponsavel').val();

        var sdata = {
            dsAtividadePessoa: dsAtividadePessoa,
            dsAtuacaoPessoa: dsAtuacaoPessoa,
            idRedeEscola: idRedeEscola,
            nmEmpresa: nmEmpresa,
            nrCarteiraProfissional: nrCarteiraProfissional,
            nrCnpj: nrCnpj,
            nrCpfResponsavel: nrCpfResponsavel,
            dsBairro: cad_bairro,
            dsCep: apenasNumeros(cad_cep),
            dsComplLograd: cad_complemento,
            dsCpf: apenasNumeros(cad_cpf),
            dsLogradouro: cad_logradouro,
            dsTelefoneCelular: apenasNumeros(cad_celular),
            dsTelefoneFixo: apenasNumeros(cad_telefone),
            dsTipoLogradouro: cad_tipo_logradouro,
            dsUsuAlter: "admin",
            dtCadastro: getCurrentDateLocal(),
            dtNascimento: cad_datanasc,
            dtUltAlter: getCurrentDateLocal(),
            nmMaeUsuario: cad_nome_mae,
            nmUsuario: cad_nome,
            nrImovelLograd: parseInt(cad_numero),
            idProcessado: 'N',
            dsEmail: cad_email,
            dsCidade: dsCidade,
            dsUf: dsUf,
            tpUsuario: tpUsuario,
            dsDocumentoConselho: vdsDocumentoConselho,
            oidCategoriasProfissoes: voidCategoriasProfissoes,
            oidSetoresMedicos: voidSetoresMedicos,
            dsDocumentoIdentidade: cad_rg,
            nmInstituicaoTrabalho: cad_instituicao,
            dsSexo: sexo,
            idAcamado: acamado
        };

        console.log("ENVIA JS CADASTRO = " + JSON.stringify(sdata));
        var pag = PG_SITE_URL + "/rest.php";
        var dados = "acao=$2y$10$5dIFU6z.jtGhwVEjsqlvz.j9CTLjm0dEg9HHT3ePaprTci0eK3fYq&sdata=" + JSON.stringify(sdata);
        jq_.ajax({
            type: "POST",
            url: pag,
            data: dados,
            cache: false,
            dataType: 'text',
            success: function (retorno) {
                console.log("GRAVA RETORNO GRAVADO = " + retorno);
                
                var vret = false;
                if (retorno.indexOf("{") !== -1) {
                    vret = true;
                }

                var vret2 = false;
                if (retorno.indexOf("[{") !== -1) {
                    vret2 = true;
                }

                if (retorno != '0' && retorno != '' && vret == true) {
                    
                    var msg = getMsgPadrao();

                    
                    var json = $.parseJSON(retorno);
                    var dsCpf = "";
                    if(vret2 == true){
                        $.each(json, function (idx, obj) {
                            dsCpf = obj.dsCpf;
                        });
                    } else{
                        dsCpf = json.dsCpf;
                    }

                    if (dsCpf != '' && dsCpf != null) {
                        initChecks();
                        limpaInputHid();
                        grecaptcha.reset();
                        //redUrl('profissional-de-saude', 60000);
                        resetFrm('#frmsaude')
                        jq_('.cardshow').css("display", "none");

                        $('#boxCaptcha').css("display", "block");
                        $('#boxBtnBuscando1').css("display", "block");
                        $('#boxBtnBuscando2').css("display", "none");
                        $('#btnLimpar').css("display", "none");
                        
                        //gravaLog("Cadastrou novo registro " + oidAgendamentoSaude);
                        var msgcad = 'Sr(a) <strong>' + cad_nome.toUpperCase() + '</strong>, obrigado por se cadastrar no Agendamento Saúde.';
                        if (msg != '') {
                            msgcad += '<br><br>No ato da vacinação, você deverá apresentar:<br>';
                            msgcad += '<strong>' + msg + '</strong><br>';
                        }

                        $('#close_window').css("display", "none");
                        $('#btnFooter').css("display", "none");

                        msgcad += 'Fique atento(a)!<br><br>';
                        msgcad += '<span style="font-weight:bold;">Declaro que todas as informações apresentadas são verdadeiras, estando ciente da sujeição às sanções aplicáveis em caso de falsidade.</span><br><br>'
                        msgcad += 'Vamos encaminhar uma mensagem de texto(SMS) com a <strong>data</strong>, <strong>hora</strong> e <strong>local</strong> da vacinação para  este número <strong>' + cad_celular + '</strong>';
                        jq_('#boxLoad').html('<p class="text-center" style="color:green;"><i class="far fa-check-circle fa-4x"></i></p><div class="alert alert-success text-left" role="alert">' + msgcad + '</div><p class="text-center"><button type="button" class="btn btn-info btn-lg" data-dismiss="modal">Concordo</button></p>');
                    } else {
                        jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-warning text-center" role="alert">Ops! Servidor não responde, tente mais tarde.</div>');
                    }

                } else {
                    jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-warning text-center" role="alert">Ops! Servidor não responde, tente mais tarde.</div>');
                }
            },
            beforeSend: function () {
                $('#boxLoad').html('<br><p class="text-center" style="color: #ccc;"><i class=\"fa fa-refresh fa-spin fa-4x\"></i></p><br><br><div class="alert alert-warning text-center" role="alert"><br><br>Aguarde, gravando...</div><br><br><br>');
            },
            error: function (request, status, error) {
                console.log(request.responseText);
                $('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">Erro inesperado. Entre em contato com o administrador do sistema.</div><br><br><br>');
                gravaLog("Erro ao cadastrar registro. Erro: " + request.responseText);
            }
        });
    }
}

function alteraDados(target) {
    var cad_cpf = jq_('#cad_cpf').val();

    var cad_datanasc = jq_('#cad_datanasc').val();
    cad_datanasc = formatData(cad_datanasc);
    var idade = calculaIdade(cad_datanasc);
    var idadeFull = calcIdade();

    var cad_nome = jq_('#cad_nome').val();
    var cad_nome_mae = jq_('#cad_nome_mae').val();
    var cad_telefone = jq_('#cad_telefone').val();

    var cad_celular = jq_('#cad_celular').val();
    var cad_cep = jq_('#cad_cep').val();
    var cad_tipo_logradouro = jq_('#cad_tipo_logradouro option:selected').val();
    var cad_logradouro = jq_('#cad_logradouro').val();

    var cad_numero = jq_('#cad_numero').val();
    var cad_complemento = jq_('#cad_complemento').val();
    var cad_bairro = jq_('#cad_bairro').val();
    var cad_email = jq_('#cad_email').val();

    var dsCid = removeAcento($('#cad_cidade').val(), 1);
    var dsUf = "";
    if ($('#cad_cidade').val() != '') {
        dsCid = dsCid.split("-");
        dsCidade = dsCid[0];
        dsUf = dsCid[1];
        if (dsUf == '' || dsUf == null) {
            dsUf = 'MG';
        }
    }

    var cad_rg = jq_('#cad_rg').val();

    var vdsDocumentoConselho = jq_('#cad_conselho').val();
    var voidCategoriasProfissoes = jq_('#cad_categoria').val();
    var voidSetoresMedicos = jq_('#cad_setor').val();
    var cad_instituicao = jq_('#cad_instituicao').val();
    var sexo = "";
    if (jq_('#sexo1').is(":checked")) {
        sexo = "M";
    }
    if (jq_('#sexo2').is(":checked")) {
        sexo = "F";
    }

    var possuicep = "";
    if (jq_('#possuicep1').is(":checked")) {
        possuicep = "S";
    }
    if (jq_('#possuicep2').is(":checked")) {
        possuicep = "N";
    }

    
    var acamado = "";
    if (jq_('#cad_acamado1').is(":checked")) {
        acamado = "N";
    }
    if (jq_('#cad_acamado2').is(":checked")) {
        acamado = "S";
    }
    

    
    if (parseInt(idade) < 26 || parseInt(idadeFull) > 59) {
        showModalNew("É permitido apenas pessoas entre 29 e 59 anos!","")
    } else if (cad_cpf == '') {
        showModalNew("Digite o CPF!","");
    } else if (cad_datanasc == '') {
        showModalNew("Digite a data de nascimento!", "");
    } else if (cad_rg == '') {
        showModalNew("Digite o número do RG!", "");
    } else if (sexo == '') {
        showModalNew("Selecione o SEXO!", "");
    } else if (acamado == '') {
        showModalNew("Selecione se é acamado ou não!");
    } else if (cad_nome == '') {
        showModalNew("Digite o nome!", "");
    } else if (cad_nome_mae == '') {
        showModalNew("Digite o nome da mãe!", "");
    } else if (cad_celular == '') {
        showModalNew("Digite o telefone celular!", "");
    } else if (cad_cep == '' && possuicep == 'S') {
        showModalNew("Digite o CEP!", "");
    } else if (cad_tipo_logradouro == '') {
        showModalNew("Digite o tipo de logradouro!", "");
    } else if (cad_logradouro == '') {
        showModalNew("Digite o logradouro!", "");
    } else if (cad_numero == '') {
        showModalNew("Digite o número!", "");
    } else if (cad_bairro == '') {
        showModalNew("Digite o bairro!", "");
    } else if (dsCid == '') {
        showModalNew("Digite a cidade!", "");
    } else {
        $('#modalLoader').modal();

        if (cad_cep == '' && possuicep == 'N') {
            cad_cep = '00000000';
        }

        var tpUsuario = "O";
        var oidAgendamentoSaude = jq_('#oidAgendamentoSaude').val();
        var idAtivo = jq_('#idAtivo').val();

        var da = getCurrentDateLocal();
        da = da.split('P');
        cad_datanasc = cad_datanasc + "T00:00:00";

        var dsAtividadePessoa = $('#e_dsAtividadePessoa').val();
        dsAtividadePessoa = retiraCaracEsp(dsAtividadePessoa);
        var dsAtuacaoPessoa = $('#e_dsAtuacaoPessoa').val();
        dsAtuacaoPessoa = retiraCaracEsp(dsAtuacaoPessoa);
        var idRedeEscola = $('#e_idRedeEscola').val();
        var nmEmpresa = $('#e_nmEmpresa').val();
        nmEmpresa = retiraCaracEsp(nmEmpresa);
        var nrCarteiraProfissional = $('#e_nrCarteiraProfissional').val();
        var nrCnpj = $('#e_nrCnpj').val();
        var nrCpfResponsavel = $('#e_nrCpfResponsavel').val();

        var sdata = {
            dsAtividadePessoa: dsAtividadePessoa,
            dsAtuacaoPessoa: dsAtuacaoPessoa,
            idRedeEscola: idRedeEscola,
            nmEmpresa: nmEmpresa,
            nrCarteiraProfissional: nrCarteiraProfissional,
            nrCnpj: nrCnpj,
            nrCpfResponsavel: nrCpfResponsavel,
            dsBairro: cad_bairro,
            dsCep: apenasNumeros(cad_cep),
            dsComplLograd: cad_complemento,
            dsCpf: apenasNumeros(cad_cpf),
            dsLogradouro: cad_logradouro,
            dsTelefoneCelular: apenasNumeros(cad_celular),
            dsTelefoneFixo: apenasNumeros(cad_telefone),
            dsTipoLogradouro: cad_tipo_logradouro,
            dsUsuAlter: "admin",
            dtNascimento: cad_datanasc,
            nmMaeUsuario: cad_nome_mae,
            nmUsuario: cad_nome,
            nrImovelLograd: parseInt(cad_numero),
            oidAgendamentoSaude: oidAgendamentoSaude,
            idAtivo: idAtivo,
            idProcessado: 'N',
            dsEmail: cad_email,
            dsCidade: dsCidade,
            dsUf: dsUf,
            tpUsuario: tpUsuario,
            dsDocumentoConselho: vdsDocumentoConselho,
            oidCategoriasProfissoes: voidCategoriasProfissoes,
            oidSetoresMedicos: voidSetoresMedicos,
            dsDocumentoIdentidade: cad_rg, 
            nmInstituicaoTrabalho: cad_instituicao,
            dsSexo: sexo,
            idAcamado: acamado
        };

        console.log("ENVIA JS ALTERACAO = " +JSON.stringify(sdata));
        var pag = PG_SITE_URL + "/rest.php";
        var dados = "acao=$2y$10$tIHPiTJlNt/s892zIrSKwuRdWcPp9CzWiACOr1.KkYUB2todUF/.y&sdata=" + JSON.stringify(sdata);
        jq_.ajax({
            type: "POST",
            url: pag,
            data: dados,
            cache: false,
            dataType: 'text',
            success: function (retorno) {
                console.log("RETORNO ALTERACAO " + retorno);
                var vret = false;
                if (retorno.indexOf("{") !== -1) {
                    vret = true;
                }

                var vret2 = false;
                if (retorno.indexOf("[{") !== -1) {
                    vret2 = true;
                }

                if (retorno != '0' && retorno != '' && vret == true) {
 
                    var json = $.parseJSON(retorno);
                    var dsCpf = "";
                    if(vret2 == true){
                        $.each(json, function (idx, obj) {
                            dsCpf = obj.dsCpf;
                        });
                    } else{
                        dsCpf = json.dsCpf;
                    }

                    if (dsCpf != '' && dsCpf != null) {
                        
                        var msg = getMsgPadrao();

                        jq_('#cad_cpf').prop("disabled", false);
                        jq_('#cad_datanasc').prop("disabled", false);
                        limpaInputHid();
                        initChecks();
                        grecaptcha.reset();

                        jq_('#boxProsseguir').css("display", "block");
                        jq_('#boxRg').css("display", "none");
                        jq_('#boxSexo').css("display", "none");

                        //redUrl('profissional-de-saude', 60000);
                        resetFrm('#frmsaude')
                        $('.cardshow').css("display", "none");
                        $('#boxCaptcha').css("display", "block");
                        $('#boxBtnBuscando1').css("display", "block");
                        $('#boxBtnBuscando2').css("display", "none");
                        $('#btnLimpar').css("display", "none");

                        //gravaLog("Alterou registro " + oidAgendamentoSaude);
                        var msgcad = 'Sr(a) <strong>' + cad_nome.toUpperCase() + '</strong>, obrigado por confirmar seu cadastro no Agendamento Saúde.';
                        if (msg != '') {
                            msgcad += '<br><br>No ato da vacinação, você deverá apresentar:<br>';
                            msgcad += '<strong>' + msg + '</strong><br>';
                        }

                        $('#btnFooter').css("display", "none");
                        $('#close_window').css("display", "none");

                        msgcad += 'Fique atento(a)!<br><br>';
                        msgcad += '<span style="font-weight:bold;color:#448ccb;">Declaro que todas as informações apresentadas são verdadeiras, estando ciente da sujeição às sanções aplicáveis em caso de falsidade.</span><br><br>'
                        msgcad += 'Vamos encaminhar uma mensagem de texto(SMS) com a <strong>data</strong>, <strong>hora</strong> e <strong>local</strong> da vacinação para  este número <strong>' + cad_celular + '</strong>';
                        jq_('#boxLoad').html('<p class="text-center" style="color:green;"><i class="far fa-check-circle fa-4x"></i></p><div class="alert alert-success text-left" role="alert">' + msgcad + '</div><p class="text-center"><button type="button" class="btn btn-info btn-lg" data-dismiss="modal">Concordo</button></p>');

                    } else {
                        jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-warning text-center" role="alert">Ops! Servidor não responde, tente mais tarde.</div>');
                    }
                } else {
                    jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-warning text-center" role="alert">Ops! Servidor não responde, tente mais tarde.</div>');
                }

            },
            beforeSend: function () {
                $('#boxLoad').html('<br><p class="text-center" style="color: #ccc;"><i class=\"fa fa-refresh fa-spin fa-4x\"></i></p><br><br><div class="alert alert-warning text-center" role="alert"><br><br>Aguarde, salvando...</div><br><br><br>');
            },
            error: function (request, status, error) {
                console.log(request.responseText);
                $('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">Erro inesperado. Entre em contato com o administrador do sistema.</div><br><br><br>');
                gravaLog("Erro ao alterar o registro " + oidAgendamentoSaude + ". Erro: " + request.responseText);
            }
        });
    }
}

function getMsgPadrao(t) {
    var msg = "<br>Documento com foto e Cartão de Vacina.";

    return msg;
}

function changeTipoCad(t) {
    $('#modal_change_tipo').modal("hide");
    if (t == 'S')
    {
        var dn = $('#cad_datanasc').val();
        dn = formatData(dn);

        var dn2 = $('#dtNascimento').val();
        dn2 = dn2.split("T");
        d2 = dn2[0];
a
       
        if(typeof (dn) !== "undefined" && typeof (dn2) !== "undefined")
        {
            if(dn2 != '' && dn != '')
            {
                if (d2 != '' && d2 != dn.replaceAll("/", "-")) {
                    showModalNew("Data de nascimento diferente do cadastro existente. Favor informe a data de nascimento correta!", "cad_datanasc");
                    showBtnIni();
                    vErro++;
                } else{
                    //CONTROLE SMS
                    $('#boxInputValidCodeSMS').css("display", "block");
                    $('#boxBtnValidCodeSMS').css("display", "block");
                    $('#boxCaptcha').css("display", "none");
                    $('#boxCPF').css("display", "none");
                    $('#boxDataNasc').css("display", "none");
                    $('#boxMsgSMSInfo').css("display", "block");
                    $('#boxTitTopo').css("display", "none");
                    
                    var dsTelefoneCelular = $('#dsTelefoneCelular').val();
                    //34998999999
                    dsTelefoneCelular = dsTelefoneCelular.toString();
                    if (dsTelefoneCelular != ''){
                        dsTelefoneCelular = dsTelefoneCelular.substring(7);
                    } else{
                        dsTelefoneCelular = "XXXX";
                    }
                    
                    $('#rash_fone').html("(XX) X.XXXX-" + dsTelefoneCelular);
                    var oidAgendamentoSaude = $('#oidAgendamentoSaude').val();
                    var idcode = parseInt(oidAgendamentoSaude);
                    enviaCodeSMS(idcode);
                }
            } else{
                showModalNew("Data de nascimento diferente do cadastro existente. Favor informe a data de nascimento correta!", "cad_datanasc");
                showBtnIni();
            }
        } else{
            showModalNew("Data de nascimento diferente do cadastro existente. Favor informe a data de nascimento correta!", "cad_datanasc");
            showBtnIni();
        }


    } else {
        $('#modal_change_tipo').modal("hide");
        var redirect = $('#perg_redirect').val();
        redUrl(redirect, 1000);
    }
}

function checaCPF() {
    var cpf = $('#cad_cpf').val();
    cpf = apenasNumeros(cpf);
    var pag = PG_SITE_URL + "/rest.php";
    var dados = "acao=$2y$10$JIZGpMALCGWwIQcSCW/O8uENjisIwaYtCLPJJLyHDJShYPnftDI8m&cpf=" + btoa(crip(cpf));
    //console.log(pag);
    jq_.ajax({
        type: "GET",
        url: pag,
        data: dados,
        cache: false,
        dataType: 'text',
        success: function (json) {
            console.log("JSON FIND = " + json);
            limpaInputHid(); //limpa os campos hidden
            jq_('#boxMsgValida').html('');
            //console.log("RETORNO JSON CPF = "+json);

            var IS_JSON = true;
            try {
                var obj = $.parseJSON(json);
            }
            catch (err) {
                IS_JSON = false;
            }
        
            var json2 = $.parseJSON(json);
            if (obj.length > 0)
            {
                var vErro = 0;

                $.each(json2, function (idx, obj) {
                    if (obj.dsCpf != '') {
                        var dn = $('#cad_datanasc').val();
                        dn = formatData(dn);

                        var dn2 = obj.dtNascimento;
                        dn2 = dn2.split("T");
                        d2 = dn2[0];


                        if (d2 != '' && d2 != dn.replaceAll("/", "-")) {
                            showModalNew("Data de nascimento diferente do cadastro existente. Favor informe a data de nascimento correta!", "cad_datanasc");
                            showBtnIni();
                            vErro++;
                        }
                        
                        var temOutroTpUser = getTpUser(obj.tpUsuario, 'O', 'PESSOAS DE 29 A 59 ANOS');

                        if (parseInt(vErro) == 0)
                        {
                            //jq_('#cad_nome').val(obj.nmUsuario);
                            jq_('#oidAgendamentoSaude').val(obj.oidAgendamentoSaude);
                            jq_('#nmUsuario').val(obj.nmUsuario);
                            var dn = obj.dtNascimento;
                            dn = dn.split("T");
                            jq_('#dtNascimento').val(dn[0]);

                            jq_('#dsCpf').val(obj.dsCpf);
                            jq_('#nmMaeUsuario').val(obj.nmMaeUsuario.toUpperCase());
                            jq_('#dsTelefoneCelular').val(obj.dsTelefoneCelular);
                            jq_('#dsTelefoneFixo').val(obj.dsTelefoneFixo);
                            jq_('#dsCep').val(obj.dsCep);
                            if(obj.dsCep == '00000000'){
                                $('#possuicep2').prop("checked",true);
                            }
                            jq_('#dsTipoLogradouro').val(obj.dsTipoLogradouro.toUpperCase());
                            jq_('#dsLogradouro').val(obj.dsLogradouro.toUpperCase());
                            jq_('#dsBairro').val(obj.dsBairro.toUpperCase());
                            jq_('#nrImovelLograd').val(obj.nrImovelLograd);
                            if (typeof (obj.dsComplLograd) !== undefined && obj.dsComplLograd != null && obj.dsComplLograd != '') {
                                jq_('#dsComplLograd').val(obj.dsComplLograd.toUpperCase());
                            }
                            jq_('#dtCadastro').val(obj.dtCadastro);
                            jq_('#idAtivo').val(obj.idAtivo);
                            jq_('#dtInativacao').val(obj.dtInativacao);
                            jq_('#idProcessado').val(obj.idProcessado);
                            jq_('#dsEmail').val(obj.dsEmail);

                            if (typeof (obj.dsCidade) !== undefined && obj.dsCidade != null && obj.dsCidade != '') {
                                jq_('#dsCidade').val(obj.dsCidade.toUpperCase());
                            }
                            if (typeof (obj.dsUf) !== undefined && obj.dsUf != null && obj.dsUf != '') {
                                jq_('#dsUf').val(obj.dsUf.toUpperCase());
                            }
                            
                            if (typeof (obj.dsDocumentoIdentidade) !== undefined && obj.dsDocumentoIdentidade != null && obj.dsDocumentoIdentidade != '') {
                                $('#dsDocumentoIdentidade').val(obj.dsDocumentoIdentidade.toUpperCase());
                            }

                            $('#dsSexo').val(obj.dsSexo);

                            $('#sexo1').prop("checked", false);
                            $('#sexo2').prop("checked", false);
                            if (obj.dsSexo == 'M') {
                                $('#sexo1').prop("checked", true);
                            }
                            if (obj.dsSexo == 'F') {
                                $('#sexo2').prop("checked", true);
                            }

                            initChecks();

                            if ($('#idProcessado').val() == '') {
                                limpaInputHid();
                            }
                            if ($('#idProcessado').val() == 'P' || jq_('#idProcessado').val() == 'N') {
                                $('#boxMsgPadrao').css("display", "block");
                                $('#msgPadrao').html('<i class="fas fa-info-circle"></i> Caso seja necessário, altere as informações abaixo e clique em salvar para confirmar o cadastro.');
                            }

                            if ($('#oidAgendamentoSaude').val() == '') {
                                $('#boxMsgPadrao').css("display", "block");
                                $('#msgPadrao').html('<i class="fas fa-info-circle"></i> Preencha seus dados pessoais abaixo e clique em salvar para confirmar seu cadastro.');
                            }

                            
                            if (obj.idAcamado == 'N') {
                                $('#cad_acamado1').prop("checked", true);
                            }
                            if (obj.idAcamado == 'S') {
                                $('#cad_acamado2').prop("checked", true);
                            }
                            

                            $('#cad_cpf').prop("disabled", true);
                            $('#cad_datanasc').prop("disabled", true);
                            $('#boxProsseguir').css("display", "none");
                            $('#boxCaptcha').css("display", "none");
                            $('#boxBtnBuscando1').css("display", "none");
                            $('#boxBtnBuscando2').css("display", "none");

                            grecaptcha.reset();

                            $('#boxMsgPadrao').css("display", "none");
                            $('#msgPadrao').html('<i class="fas fa-info-circle"></i> Encontramos um pré-cadastro com esse CPF.');
                            $('#msgPadrao').css("display", "none");
                            //$('.cardshow').css("display", "block");
                            $('#btnLimpar').css("display", "none");

                            copyForm();

                            var upg = 0;
                            if ($('#idProcessado').val() == 'S') {
                                $('#btnInsert').css("display", "none");
                                $('#btnUpdate').css("display", "none");
                                showModalNew("Cadastro já foi processado pela Secretária de Saúde e não poderá sofrer alterações!", "");
                                $('#cad_cpf').prop("disabled", false);
                                $('#cad_datanasc').prop("disabled", false);
                                $('#boxProsseguir').css("display", "block");
                                $('#boxCaptcha').css("display", "block");
                                $('#boxBtnBuscando1').css("display", "block");
                                $('#boxBtnBuscando2').css("display", "none");
                                upg++;
                                linUpg = getTpUserLink(obj.tpUsuario, 'O');
                                if(linUpg != ''){
                                    upg++;
                                    setTimeout(function(){ window.location = PG_SITE_URL + "/" + linUpg }, 3000);
                                }
                                
                            }

                            if(upg == 0 && temOutroTpUser == 0){
                                //CONTROLE SMS
                                $('#boxInputValidCodeSMS').css("display", "block");
                                $('#boxBtnValidCodeSMS').css("display", "block");
                                $('#boxCaptcha').css("display", "none");
                                $('#boxCPF').css("display", "none");
                                $('#boxDataNasc').css("display", "none");
                                $('#boxMsgSMSInfo').css("display", "block");
                                $('#boxTitTopo').css("display", "none");
                                
                                var dsTelefoneCelular = $('#dsTelefoneCelular').val();
                                //34998999999
                                dsTelefoneCelular = dsTelefoneCelular.toString();
                                if (dsTelefoneCelular != ''){
                                    dsTelefoneCelular = dsTelefoneCelular.substring(7);
                                } else{
                                    dsTelefoneCelular = "XXXX";
                                }
                                
                                $('#rash_fone').html("(XX) X.XXXX-" + dsTelefoneCelular);
                                var idcode = parseInt(obj.oidAgendamentoSaude);
                                enviaCodeSMS(idcode);
                            }
                        } else{
                            $('#boxInputValidCodeSMS').css("display", "none");
                            $('#boxBtnValidCodeSMS').css("display", "none");
                            $('#boxCaptcha').css("display", "block");
                            $('#boxCPF').css("display", "block");
                            $('#boxDataNasc').css("display", "block");
                            $('#boxMsgSMSInfo').css("display", "none");
                            $('#boxTitTopo').css("display", "block");
                        }
                    }
                });
            } else {
                grecaptcha.reset();
                $('#cad_cpf').prop("disabled", true);
                $('#cad_datanasc').prop("disabled", true);
                $('#boxBtnBuscando1').css("display", "none");
                $('#boxBtnBuscando2').css("display", "none");
                $('#boxMsgPadrao').css("display", "none");
                $('#boxProsseguir').css("display", "none");
                $('.cardshow').css("display", "block");
                $('#btnLimpar').css("display", "block");
                $('#boxCaptcha').css("display", "none");

            }
            
        },
        error: function (request, status, error) {
            console.log(request.responseText);
            gravaLog("Erro ao buscar cpf: " + cpf + " - " + request.responseText);
            $('#cad_cpf').val('');
            $('#modalLoader').modal();
            jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-info-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">Ops! Pedimos desculpas, mas o servidor não responde. Tente mais tarde.</div><br><br><br>');
        }
    });

    
}



function enviaCodeSMS(idcode)
{
    var pag = PG_SITE_URL + "/rest.php";
    var dados = "acao=$2y$10$2bSDRMRmxnTbGLEpxvNmwe3EPEPAWYNvHgvDGPIu5byHUf1Hp0zoW&code=" + btoa(crip(idcode));
    jq_.ajax({
        type: "GET",
        url: pag,
        data: dados,
        cache: false,
        dataType: 'text',
        success: function (json) {
            //console.log("RETORNO ENVIA CODIGO SMS = " + json);
        }
    });
}

function validaCodeSMS() {
    var target = '#boxMsgValidaCode';
    showMsg(target);
    var codsms = $('#codigo_sms').val();
    codsms = codsms.toString();
    var qtcod = apenasNumeros(codsms);
    qtcod = qtcod.toString();
    var cpf = $('#dsCpf').val();
    var codeage = $('#oidAgendamentoSaude').val();
    if (codsms == ''){
        $(target).html("Digite o código!");
        hiddMsg(target, 3000);
    } else if (qtcod.length < 6) {
        $(target).html("Digite os 6 digitos!");
        hiddMsg(target, 3000);
    } else{
        var arr = {
            "dsCodigoSMS": apenasNumeros(codsms),
            "dsCpf": apenasNumeros(cpf),
            "oidAgendamentoSaude": codeage
        };
        var jsonstr = JSON.stringify(arr);
        //console.log("VALIDA SMS ENVIO = " + jsonstr);

        var pag = PG_SITE_URL + "/rest.php";
        var dados = "acao=$2y$10$9nAb.rI.SF/k6KcmMjkd0.sJ2k3RLTiqMJ5No7WmzTT9OtmptKdTK&sdata=" + jsonstr;
        jq_.ajax({
            type: "POST",
            url: pag,
            data: dados,
            cache: false,
            dataType: 'text',
            success: function (retorno) {
                //console.log("RETORNO VALIDA = " + retorno);
                if (parseInt(retorno) == 1){
                    $(target).html('<span style=\"color:green;\"><i class="fas fa-check"></i></span>');
                    hiddMsg(target, 3000);

                    $('#msgPadrao').css("display", "block");
                    $('#boxInputValidCodeSMS').css("display", "none");
                    $('#boxBtnValidCodeSMS').css("display", "none");
                    $('#boxCaptcha').css("display", "none");
                    $('#boxCPF').css("display", "block");
                    $('#boxDataNasc').css("display", "block");
                    //$('#msgPadrao').html('<i class="fas fa-info-circle"></i> Encontramos um pré-cadastro com esse CPF, digite a data de nascimento para prosseguir.');
                    $('#boxMsgSMSInfo').css("display", "none");
                    $('#btnUpdate').css("display", "block");

                    $('.cardshow').css("display", "block");
                    $('#btnLimpar').css("display", "block");
                } else{
                    //Código SMS Inválido, tente novamente ou solicite um novo código de acesso!
                    $(target).html('<span style=\"color:red;\">Código informado inválido!</span>');
                    hiddMsg(target, 6000);
                }
                
            },
            beforeSend: function () {
                $(target).html('<i class=\"fa fa-refresh fa-spin\"></i>');
            },
            error: function (request, status, error) {
                console.log(request.responseText);
                var newData = JSON.stringify(request.responseText);
                var obj = $.parseJSON(request.responseText);
                var message = obj.message;
                var code = obj.code;
                console.log(message);
                $(target).html('<span style=\"color:black;\">' + message + '</span>');
            }
        });
    }

}


function gravaLog(log) {
    var dados = "acao=GRAVALOG&log=" + encodeURIComponent(log);
    jq_.ajax({
        type: "post",
        url: PG_SITE_URL + "/ajax.php",
        cache: false,
        data: dados,
        dataType: 'text',
        success: function (retorno) {
            //console.log(retorno);
        }
    });
}

function checCNPJECPF(cnpjecpf) {
    var num = apenasNumeros(cnpjecpf);
    //console.log(num.length);
    if (num.length == 11) {
        var retorno = validaCPF(num);
    } else {
        var retorno = validarCNPJ(cnpjecpf);
    }
    return retorno;
}

function validarCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
        return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;

}

function validaName(tit, valor, input, target) {
    showMsg(target);

    if (valor != '') {
        nomeSobrenome = /\b[A-Za-zÀ-ú][A-Za-zÀ-ú]+,?\s[A-Za-zÀ-ú][A-Za-zÀ-ú]{2,19}\b/gi;
        // Regex para duas strings, separadas com espaço e com no mínimo 3 caracteres. Aceita acentuação e rejeita números.

        // Faz a validacao do regex no campo indicado
        if (!(nomeSobrenome.test(valor))) {
            //alert('Inválido');
            $(input).val('');
            $(target).html('<span style=\"color:red;font-size:0.8em;\">' + tit + ' inválido!</span>');
            hiddMsg(target, 3000);
        } else {
            $(target).html('<span style=\"color:green;\"><i class="fas fa-check"></i></span>');
            hiddMsg(target, 3000);
        }
    }
}

function vcarcesp(campo) {
    var valor = $(campo).val();
    valor = valor.replaceAll("`", '');
    valor = valor.replaceAll("'", '');
    valor = valor.replaceAll("!", '');
    valor = valor.replaceAll("@", '');
    valor = valor.replaceAll("#", '');
    valor = valor.replaceAll("$", '');
    valor = valor.replaceAll("%", '');
    valor = valor.replaceAll("^", '');
    valor = valor.replaceAll("&", '');
    valor = valor.replaceAll("*", '');
    valor = valor.replaceAll("(", '');
    valor = valor.replaceAll(")", '');
    valor = valor.replaceAll("-", '');
    valor = valor.replaceAll("_", '');
    valor = valor.replaceAll("+", '');
    valor = valor.replaceAll("=", '');
    valor = valor.replaceAll("/", '');
    valor = valor.replaceAll("~", '');
    valor = valor.replaceAll("<", '');
    valor = valor.replaceAll(">", '');
    valor = valor.replaceAll(",", '');
    valor = valor.replaceAll(";", '');
    valor = valor.replaceAll(":", '');
    valor = valor.replaceAll("|", '');
    valor = valor.replaceAll("?", '');
    valor = valor.replaceAll("{", '');
    valor = valor.replaceAll("}", '');
    valor = valor.replaceAll("[", '');
    valor = valor.replaceAll("]", '');
    valor = valor.replaceAll("¬", '');
    valor = valor.replaceAll("£", '');
    valor = valor.replaceAll("\\", '');
    $(campo).val(valor);
}

function retiraCaracEsp(valor) {
    valor = valor.replaceAll("`", '');
    valor = valor.replaceAll("'", '');
    valor = valor.replaceAll("!", '');
    valor = valor.replaceAll("@", '');
    valor = valor.replaceAll("#", '');
    valor = valor.replaceAll("$", '');
    valor = valor.replaceAll("%", '');
    valor = valor.replaceAll("^", '');
    valor = valor.replaceAll("&", '');
    valor = valor.replaceAll("*", '');
    valor = valor.replaceAll("(", '');
    valor = valor.replaceAll(")", '');
    valor = valor.replaceAll("-", '');
    valor = valor.replaceAll("_", '');
    valor = valor.replaceAll("+", '');
    valor = valor.replaceAll("=", '');
    valor = valor.replaceAll("/", '');
    valor = valor.replaceAll("~", '');
    valor = valor.replaceAll("<", '');
    valor = valor.replaceAll(">", '');
    valor = valor.replaceAll(",", '');
    valor = valor.replaceAll(";", '');
    valor = valor.replaceAll(":", '');
    valor = valor.replaceAll("|", '');
    valor = valor.replaceAll("?", '');
    valor = valor.replaceAll("{", '');
    valor = valor.replaceAll("}", '');
    valor = valor.replaceAll("[", '');
    valor = valor.replaceAll("]", '');
    valor = valor.replaceAll("¬", '');
    valor = valor.replaceAll("£", '');
    valor = valor.replaceAll("\\", '');
    return valor;
}

function isValid(str) {
    return !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
}

function digitosIguais(x) {
    var r1 = x % 10;
    while (x > 0) {
        var r2 = x % 10;
        if (r2 !== r1) return false;
        x = Math.floor(x / 10);
    }
    return true;
}

function validaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (digitosIguais(strCPF) == true) {
        return false;
    } else {
        for (i = 1; i <= 9; i++) {
            Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
        }
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) {
            Resto = 0;
        }
        if (Resto != parseInt(strCPF.substring(9, 10))) {
            return false;
        } else {
            Soma = 0;
            for (i = 1; i <= 10; i++) {
                Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
            }
            Resto = (Soma * 10) % 11;

            if ((Resto == 10) || (Resto == 11)) {
                Resto = 0;
            }
            if (Resto != parseInt(strCPF.substring(10, 11))) {
                return false;
            } else {
                return true;
            }
        }
    }
}

function validaEmail(email, target) {
    showMsg(target)
    if (email != '') {
        if (IsEmail(email)) {
            $(target).html('<span style=\"color:green;\"><i class="fas fa-check"></i></span>');
            hiddMsg(target, 3000);
        } else {
            $('#cad_email').val('');
            $('#cad_email').focus();
            $(target).html('<span style=\"color:red;font-size:0.8em;\">Email inválido!</span>');
            hiddMsg(target, 3000);
        }
    }
}

function IsEmail(email) {
    var emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
    return emailPattern.test(email);
}

function apenasNumeros(string) {
    var numsStr = string.replace(/[^0-9]/g, '');
    return numsStr;
}

function limparTela() {
    document.location.reload();
}

function getCountCarac(c) {
    var limite = 160;
    var informativo = "";//"caracteres restantes.";
    var caracteresDigitados = $('#' + c).val().length;
    var caracteresRestantes = limite - caracteresDigitados;

    if (caracteresRestantes <= 0) {
        var campo = $("textarea[name=" + c + "").val();
        $("textarea[name=" + c + "]").val(campo.substr(0, limite));
        //$(".caracteres").text("0 " + informativo);
        $(".caracteres").html("<strong>" + caracteresDigitados + "</strong><span style='color:#777;'>/" + limite + "</span>");
    } else {
        //$(".caracteres").text(caracteresDigitados + " de " + caracteresRestantes + " " + informativo);
        $(".caracteres").html("<strong>" + caracteresDigitados + "</strong>/<span style='color:#777;'>" + limite + "</span>");
    }
}

function getCurrentDateLocal() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    //var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19).replace('T', ' '); //RETIRA O T
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 19);
    var mySqlDT = localISOTime;
    return mySqlDT;
}

function hiddMsg(target, t) {
    setTimeout(function () {
        jq_(target).fadeOut();
        jq_(target).html("&nbsp;");
    }, t);
}

function hiddMsgModal(target, t) {
    setTimeout(function () {
        jq_(target).fadeOut();
        jq_(target).html("&nbsp;");
        $(".modal:visible").modal('toggle');
    }, t);
}

function showMsg(target) {
    jq_(target).fadeIn();
    jq_(target).html("&nbsp;");
}

function redUrl(url, t) {
    setTimeout(function () {
        jq_(location).attr('href', PG_SITE_URL + '/' + url);
    }, t);
}

function resetFrm(frm) {
    $(frm).each(function () {
        this.reset();
    });
}

function limpaInputHid() {
    jq_('#oidAgendamentoSaude').val('');
    jq_('#nmUsuario').val('');
    jq_('#dtNascimento').val('');
    jq_('#dsCpf').val('');
    jq_('#nmMaeUsuario').val('');
    jq_('#dsTelefoneCelular').val('');
    jq_('#dsTelefoneFixo').val('');
    jq_('#dsCep').val('');
    jq_('#dsTipoLogradouro').val('');
    jq_('#dsLogradouro').val('');
    jq_('#dsBairro').val('');
    jq_('#nrImovelLograd').val('');
    jq_('#dsComplLograd').val('');
    jq_('#dtCadastro').val('');
    jq_('#idAtivo').val('');
    jq_('#dtInativacao').val('');
    jq_('#dsEmail').val('');
    jq_('#dsCidade').val('');
    jq_('#dsUf').val('');

    jq_('#dsDocumentoConselho').val('');
    jq_('#oidCategoriasProfissoes').val('');
    jq_('#oidSetoresMedicos').val('');
    jq_('#dsDocumentoIdentidade').val('');
    jq_('#nmInstituicaoTrabalho').val('');
    jq_('#dsSexo').val('');

    jq_('#msgPadrao').html('');

    jq_('#cad_cpf').prop("disabled", false);
    jq_('#cad_datanasc').prop("disabled", false);
    jq_('#sexo1').prop("disabled", false);
    jq_('#sexo2').prop("disabled", false);
    jq_('#boxProsseguir').css("display", "block");
    jq_('#boxRg').css("display", "none");
    jq_('#boxSexo').css("display", "none");
}

function copyForm() {
    var oidAgendamentoSaude = jq_('#oidAgendamentoSaude').val();
    var nmUsuario = jq_('#nmUsuario').val();
    var dtNascimento = jq_('#dtNascimento').val();
    var dsCpf = jq_('#dsCpf').val();
    var nmMaeUsuario = jq_('#nmMaeUsuario').val();
    var dsTelefoneCelular = jq_('#dsTelefoneCelular').val();
    var dsTelefoneFixo = jq_('#dsTelefoneFixo').val();
    var dsCep = jq_('#dsCep').val();
    var dsTipoLogradouro = jq_('#dsTipoLogradouro').val();
    var dsLogradouro = jq_('#dsLogradouro').val();
    var dsBairro = jq_('#dsBairro').val();
    var nrImovelLograd = jq_('#nrImovelLograd').val();
    var dsComplLograd = jq_('#dsComplLograd').val();
    var dtCadastro = jq_('#dtCadastro').val();
    var idAtivo = jq_('#idAtivo').val();
    var dtInativacao = jq_('#dtInativacao').val();
    var dsEmail = jq_('#dsEmail').val();
    var dsCidade = jq_('#dsCidade').val();
    var dsUf = jq_('#dsUf').val();

    var dsDocumentoConselho = jq_('#dsDocumentoConselho').val();
    var oidCategoriasProfissoes = jq_('#oidCategoriasProfissoes').val();
    var oidSetoresMedicos = jq_('#oidSetoresMedicos').val();
    var dsDocumentoIdentidade = jq_('#dsDocumentoIdentidade').val();
    var nmInstituicaoTrabalho = jq_('#nmInstituicaoTrabalho').val();
    var dsSexo = jq_('#dsSexo').val();

    //grava nos campos
    jq_('#cad_rg').val(dsDocumentoIdentidade);
    jq_('#cad_nome').val(nmUsuario);
    jq_('#cad_nome_mae').val(nmMaeUsuario);
    jq_('#cad_telefone').val(dsTelefoneFixo);
    jq_('#cad_celular').val(dsTelefoneCelular);
    jq_('#cad_cep').val(dsCep);
    //dsTipoLogradouro = dsTipoLogradouro.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
    jq_('#cad_tipo_logradouro').val(dsTipoLogradouro).change();
    jq_('#cad_logradouro').val(dsLogradouro);
    jq_('#cad_numero').val(nrImovelLograd);
    jq_('#cad_complemento').val(dsComplLograd);
    jq_('#cad_bairro').val(dsBairro);
    jq_('#cad_email').val(dsEmail);

    if (typeof (dsCidade) !== undefined && dsCidade != null && dsCidade != '') {
        jq_('#cad_cidade').val(dsCidade + "-" + dsUf);
    }

    jq_('#cad_conselho').val(dsDocumentoConselho);
    jq_('#cad_categoria').val(oidCategoriasProfissoes).change();
    jq_('#cad_setor').val(oidSetoresMedicos).change();
    jq_('#cad_instituicao').val(nmInstituicaoTrabalho);

    if (dsSexo == 'M') {
        $('#sexo1').prop("checked", true);
    }
    if (dsSexo == 'F') {
        $('#sexo2').prop("checked", true);
    }

    initMasks();
    jq_('#btnInsert').css("display", "none");
    jq_('#btnUpdate').css("display", "block");
}

function checaData(data) {
    // Ex: 10/01/1985
    var regex = "\\d{2}/\\d{2}/\\d{4}";
    var dtArray = data.split("/");

    if (dtArray == null)
        return false;

    // Checks for dd/mm/yyyy format.
    var dtDay = dtArray[0];
    var dtMonth = dtArray[1];
    var dtYear = dtArray[2];

    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay > 31)
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
        return false;
    else if (dtMonth == 2) {
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        if (dtDay > 29 || (dtDay == 29 && !isleap))
            return false;
    }
    return true;
}

function validateDate(target) {
    var cpf = jq_('#cad_cpf').val();
    var id = jq_('#cad_datanasc').val();
    var RegExPattern = checaData(id);
    //console.log(RegExPattern);

    if (cpf == '') {
        $('#modalLoader').modal();
        jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">O campo CPF é obrigatório!</div><br><br><br>');
    } else if (RegExPattern == false) {
        $('#modalLoader').modal();
        jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">Data de nascimento inválida!</div><br><br><br>');
    } else{
        validaDataNascCpf(target);
    }
}

function validaDataNascCpf(target) {
    jq_('#boxLoad').html("&nbsp;");
    jq_('#boxLoad').fadeIn();
    var dtNascimento = jq_('#dtNascimento').val();
    var dnOrig = jq_('#cad_datanasc').val();
    var dn = jq_('#cad_datanasc').val();
    dn = formatData(dn);
    var cpf = jq_('#cad_cpf').val();

    if (cpf == '') {
        $('#modalLoader').modal();
        jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">O campo CPF é obrigatório!</div><br><br><br>');
    } else if (dnOrig == '') {
        $('#modalLoader').modal();
        jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">O campo Data de Nascimento é obrigatório!</div><br><br><br>');
    } else if (dtNascimento != '' && dtNascimento != dn.replaceAll("/", "-")) {
        $('#modalLoader').modal();
        jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">Data de nascimento diferente do cadastro existente. Favor informe a data de nascimento correta!</div><br><br><br>');
    } else {
        var dados = "acao=VALIDADATANASC&dn=" + dn;
        jq_.ajax({
            type: "POST",
            url: PG_SITE_URL + "/ajax.php",
            cache: false,
            data: dados,
            dataType: 'text',
            success: function (retorno) {
                //console.log(retorno);
                if (parseInt(retorno) > 120) {
                    $('#modalLoader').modal();
                    jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-info-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">Data de nascimento inválida. Idade maior que 120 anos!</div><br><br><br>');
                    jq_('#cad_datanasc').val('');
                } else if (parseInt(retorno) < 18) {
                    $('#modalLoader').modal();
                    jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-info-circle fa-4x"></i></p><br><br><div class="alert alert-danger text-center" role="alert">É permitido apenas pessoas acima de 18 anos!</div><br><br><br>');
                    jq_('#cad_datanasc').val('');
                } else {
                    if (dtNascimento != '') {
                        copyForm();
                    }
                    initChecks();
                    if (jq_('#idProcessado').val() == 'S') {
                        $('#modalLoader').modal();
                        jq_('#btnInsert').css("display", "none");
                        jq_('#btnUpdate').css("display", "none");
                        jq_('#boxLoad').html('<br><p class="text-center" style="color:red;"><i class="fas fa-exclamation-circle fa-4x"></i></p><br><br><div class="alert alert-warning text-center" role="alert">Cadastro já foi processado pela Secretária de Saúde e não poderá sofrer alterações.</div><br><br><br>');
                    }
                    if (jq_('#idProcessado').val() == '') {
                        limpaInputHid();
                    }
                    if (jq_('#idProcessado').val() == 'P' || jq_('#idProcessado').val() == 'N') {
                        jq_('#msgPadrao').html('<i class="fas fa-info-circle"></i> Caso seja necessário, altere as informações abaixo e clique em salvar para confirmar o cadastro.');
                    }

                    if (jq_('#oidAgendamentoSaude').val() == '') {
                        jq_('#msgPadrao').html('<i class="fas fa-info-circle"></i> Preencha seus dados pessoais abaixo e clique em salvar para confirmar seu cadastro.');
                    }

                    jq_('#cad_cpf').prop("disabled", true);
                    jq_('#cad_datanasc').prop("disabled", true);
                    jq_('#boxProsseguir').css("display", "none");
                    jq_('#boxRg').css("display", "block");
                    jq_('#boxSexo').css("display", "block");
                    

                    jq_('.cardshow').css("display", "block");
                } 
            },
            beforeSend: function () {
                jq_('#boxLoad').html('<i class=\"fa fa-refresh fa-spin\"></i>');
            }
        });
    }
}

function formatData(dn) {
    if (dn != '' && dn !== null){
        var adn = dn.split("/");
        dn = adn[2] + "-" + adn[1] + "-" + adn[0];
        return dn;
    }
}

function validaFone(tele, target) {
    showMsg(target)
    //(34) 99155-5248
    if (tele != '') {
        if (tele.length == 14) {
            validaTeleFixo(tele, target);
        } else if (tele.length == 15) {
            validaCelular(tele, target);
        } else {
            $(target).html('<span style=\"color:red;font-size:0.8em;\">Telefone inválido!</span>');
            hiddMsg(target, 3000);
            $('#cad_telefone').val('');
        }
    }
}

function validaCelular(tele, target) {
    if (tele != '') {
        showMsg(target);
        if (/^(.)\1+$/.test(apenasNumeros(tele)) == true) { //se todos os caracteres sao iguais
            $(target).html("<span style=\"color:red;font-size:0.8em;\">Celular inválido!</span>");
            $('#cad_celular').val('');
            hiddMsg(target, 3000);
        } else {
            var valido = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/.test(tele);
            if (valido == true) {
                $(target).html('<span style=\"color:green;\"><i class="fas fa-check"></i></span>');
                hiddMsg(target, 3000);
            } else {
                $(target).html("<span style=\"color:red;font-size:0.8em;\">Celular inválido!</span>");
                $('#cad_celular').val('');
                hiddMsg(target, 3000);
            }
        }

    }
}

function validaTeleFixo(tele, target) {
    if (tele != '') {
        showMsg(target);
        if (/^(.)\1+$/.test(apenasNumeros(tele)) == true) { //se todos os caracteres sao iguais
            $(target).html("<span style=\"color:red;font-size:0.8em;\">Telefone inválido!</span>");
            $('#cad_tele_fixo').val('');
            hiddMsg(target, 3000);
        } else {
            var valido = /^(\(11\) [9][0-9]{4}-[0-9]{4})|(\(1[2-9]\) [5-9][0-9]{3}-[0-9]{4})|(\([2-9][1-9]\) [1-9][0-9]{3}-[0-9]{4})$/.test(tele);
            if (valido == true) {
                $(target).html('<span style=\"color:green;\"><i class="fas fa-check"></i></span>');
                hiddMsg(target, 3000);
            } else {
                $(target).html("<span style=\"color:red;font-size:0.8em;\">Telefone inválido!</span>");
                $('#cad_tele_fixo').val('');
                hiddMsg(target, 3000);
            }
        }

    }
}

function validaNome(nome, target) {
    showMsg(target);
    nome = nome.split(" ");
    if (nome.length > 1) {
        $(target).html('<span style=\"color:green;\"><i class="fas fa-check"></i></span>');
        hiddMsg(target, 3000);
    } else {
        $(target).html("<span style=\"color:red;font-size:0.8em;\">Nome inválido!</span>");
        $('#cad_nome').val('');
        hiddMsg(target, 3000);
    }
}


function geraCategorias() {
    var target = 'cad_categoria';
    var pag = PG_SITE_URL + "/rest.php";
    var dados = "acao=$2y$10$PDQ6QHIFUWKD1szXtUKM8uHGCwmssVImyJveXLd3QgRLDxsFFi0u6";
    //console.log(pag);
    jq_.ajax({
        type: "GET",
        url: pag,
        data: dados,
        cache: false,
        dataType: 'text',
        success: function (json) {
            //console.log(json);
            var json2 = $.parseJSON(json);
            $("#" + target).find('option').remove();
            $("#" + target).append($("<option value=''>Selecione</option>").val('').html(""));
            //$('select[name=' + target + ']').selectpicker('refresh');
            $.each(json2, function (idx, obj) {
                if (obj.oidCategoriaProfissao <= 4) {
                    $("#" + target).append($("<option></option>").val(obj.oidCategoriaProfissao).html(obj.nmCategoriaProfissao));
                }
            });
            //$('select[name=' + target + ']').selectpicker('refresh');
        },
        beforeSend: function () {
            $("#" + target).find('option').remove();
            $("#" + target).append($("<option></option>").val('').html("[Carregando...]"));
            //$('select[name=' + target + ']').selectpicker('refresh');
        }
    });
}

function geraTiposDeficiencias() {
    var target = 'cad_tipos_defic';
    var pag = PG_SITE_URL + "/rest.php";
    var dados = "acao=$2y$10$k1v52HQWHHWDa7L9Cs0oSuywZnRC5uWwniVCtaAkRAkpzYlEMLAy2";
    //console.log(pag);
    jq_.ajax({
        type: "GET",
        url: pag,
        data: dados,
        cache: false,
        dataType: 'text',
        success: function (json) {
            //console.log(json);
            var json2 = $.parseJSON(json);
            $("#" + target).find('option').remove();
            $("#" + target).append($("<option value=''>Selecione</option>"));
            //$('select[name=' + target + ']').selectpicker('refresh');
            $.each(json2, function (idx, obj) {
                $("#" + target).append($("<option></option>").val(obj.oidTipoDeficiencia).html(obj.nmTipoDeficiencia));
            });
            //$('select[name=' + target + ']').selectpicker('refresh');
        },
        beforeSend: function () {
            $("#" + target).find('option').remove();
            $("#" + target).append($("<option></option>").val('').html("[Carregando...]"));
            //$('select[name=' + target + ']').selectpicker('refresh');
        }
    });
}

function validaUrlON(log) {
    var pag = PG_SITE_URL + "/rest.php";
    var dados = "acao=$2y$10$V2mSJbAbCggWwhUGLrbn0u1hlIKhyljc33fx92Uv/S5q1Q4HIIpO.";
    jq_.ajax({
        type: "GET",
        url: pag,
        data: dados,
        cache: false,
        dataType: 'text',
        success: function (resposta) {
            //console.log("ERRO = " + parseInt(resposta));
            if (parseInt(resposta) == 0) {
                var msg = '<div class="alert alert-danger alert-dismissible fade show" role="alert">';
                msg += '<strong> Ops! Pedimos desculpas, no momento o sistema não responde. Tente mais tarde.';
                msg += '<button type="button" class="close" data-dismiss="alert"aria-label="Close"> ';
                msg += '<span aria-hidden="true">&times;</span> ';
                msg += '</button> ';
                msg += '</div>';
                jq_('#rowErro').addClass("eshow");
                jq_('#rowErro').removeClass("ehide");
                $('#boxAlertaErro').html(msg);
                if (log == 1) {
                    gravaLog("Backend com problemas.");
                }
                setTimeout(function () {
                    validaUrlON(2);
                }, 60000);
            } else {
                jq_('#rowErro').removeClass("eshow");
                jq_('#rowErro').addClass("ehide");
                jq_('#boxAlertaErro').html('');
                setTimeout(function () {
                    validaUrlON(2);
                }, 60000);
            }
        }
    });
}

function removeAcento(text,t){       
    text = text.toLowerCase();                                                         
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    if(t == 1){
        return text.toUpperCase();  
    }else{
        return text.toLowerCase();  
    }               
}

function possuiCep(t) {
    if (t == 'N') {
        $('#cad_cep').val('');
        $('#cad_cep').attr("readonly", true);
        $('#cad_logradouro').attr("readonly", false);
        $('#cad_bairro').attr("readonly", false);
        $('#cad_cidade').attr("readonly", false);
    } else {
        $('#cad_cep').val('');
        $('#cad_cep').attr("readonly", false);
        $('#cad_logradouro').attr("readonly", true);
        $('#cad_bairro').attr("readonly", true);
        $('#cad_cidade').attr("readonly", true);
    }
}

var modalConfirm = function (callback) {

    $("#cad_acamado2").on("click", function () {
        $("#mi-modal").modal('show');
    });

    $("#modal-btn-si").on("click", function () {
        callback(true);
        $("#mi-modal").modal('hide');
    });

    $("#modal-btn-no").on("click", function () {
        callback(false);
        $("#mi-modal").modal('hide');
    });
};

modalConfirm(function (confirm) {
    if (confirm) {
        $('#cad_acamado2').prop("checked", true);
        //Acciones si el usuario confirma
        //$("#result").html("CONFIRMADO");
    } else {
        $('#cad_acamado1').prop("checked", true);
        //Acciones si el usuario no confirma
        //$("#result").html("NO CONFIRMADO");
    }
});

function getBase64(image, preview, string) {
    var arquivo = image.files[0];
    var mimiType = arquivo.type;
    var reader = new FileReader();
    reader.readAsDataURL(arquivo);

    reader.onload = function () {
        let file = new Blob([reader.result], { type: mimiType });
        var arq = reader.result;
        arq = arq.replace(mimiType, "");
        arq = arq.replace(";base64,", "");
        arq = arq.replace("data:", "");
        document.querySelector(string).value = arq;
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}


function buscaArquivo(id) {
    if (id != '') {
        var pag = PG_SITE_URL + "/rest.php";
        var dados = "acao=$2y$10$f3nqDipEZ2A2e4li2hTYEuB5ZY6XZzHO2h/.Roz/DvMuvZgj0QrWy&cod=" + btoa(crip(id));
        jq_.ajax({
            type: "GET",
            url: pag,
            data: dados,
            cache: false,
            dataType: 'text',
            success: function (retorno) {
                //console.log("ARQUIVO = " + retorno);
                var json = $.parseJSON(retorno);
                $.each(json, function (idx, obj) {
                    var nmImagem = obj.nmImagem;
                    $('#fileBase64').val(obj.dsImagem);
                    $('#file_tipo_nome').val(obj.nmImagem);

                    var filePath = obj.nmImagem;
                    var file_ext = filePath.substr(filePath.lastIndexOf('.') + 1, filePath.length);
                    $('#file_tipo').val(file_ext);

                    $('#file_download').attr("href", "javascript:makeDownload()");
                    $('#file_download').css("display", "block");
                });
                $('#boxLoadDown').html('');
                
            },
            beforeSend: function () {
                $('#boxLoadDown').html('<div class="spinner-border text-secondary spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>&nbsp;<strong>Carregando arquivo</strong>...');
            }
        });


        /*
        var urlbase64 = PG_SITE_URL + "/rest.php?acao=$2y$10$f3nqDipEZ2A2e4li2hTYEuB5ZY6XZzHO2h/.Roz/DvMuvZgj0QrWy&cod=" + btoa(crip(id));
        var request = makeHttpObject();
        request.open("GET", urlbase64, true);
        request.send(null);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                //console.log("ARQUIVO = " + request.responseText);
                var json = $.parseJSON(request.responseText);
                $.each(json, function (idx, obj) {
                    var nmImagem = obj.nmImagem;
                    //download("data:application/pdf;base64," + obj.dsImagem, obj.nmImagem, "application/pdf");

                    $('#fileBase64').val(obj.dsImagem);
                    $('#file_tipo_nome').val(obj.nmImagem);

                    var filePath = obj.nmImagem;
                    var file_ext = filePath.substr(filePath.lastIndexOf('.') + 1, filePath.length);
                    $('#file_tipo').val(file_ext);

                    $('#file_download').attr("href", "javascript:makeDownload()");
                    $('#file_download').css("display", "block");
                });

            }
        };*/
    }
}

function makeDownload() {
    var tipo = $('#file_tipo').val();
    var nome = $('#file_tipo_nome').val();
    var fileb64 = $('#fileBase64').val();
    if (tipo == 'pdf') {
        download("data:application/" + tipo + ";base64," + fileb64, nome, "application/" + tipo);
    } if (tipo == 'jpg') {
        download("data:image/" + tipo + ";base64," + fileb64, nome, "image/" + tipo);
    } if (tipo == 'gif') {
        download("data:image/" + tipo + ";base64," + fileb64, nome, "image/" + tipo);
    } if (tipo == 'png') {
        download("data:image/" + tipo + ";base64," + fileb64, nome, "image/" + tipo);
    } if (tipo == 'jpeg') {
        download("data:image/" + tipo + ";base64," + fileb64, nome, "image/" + tipo);
    }
}

function makeHttpObject() {
    try { return new XMLHttpRequest(); }
    catch (error) { }
    try { return new ActiveXObject("Msxml2.XMLHTTP"); }
    catch (error) { }
    try { return new ActiveXObject("Microsoft.XMLHTTP"); }
    catch (error) { }

    throw new Error("Não foi possível criar o objeto de solicitação HTTP.");
}

function showBPC(t, target){
    if(t == 'N'){
        $(target).css("display", "block");
        $('#boxTemBPC').css("display", "none");
    } else{
        $(target).css("display", "none");
        $('#boxTemBPC').css("display", "block");
    }
}

function limpaFiles(){
    $('#fileBase64').val('');
    $('#file_tipo').val('');
    $('#file_tipo_nome').val('');
    $('#file_download').css("display","none");
    $('#idArquivoAlterado_gest').val('S');
    $('#cad_tipos_defic').val('').change();
}

function limpaNis() {
    var nis = $('#nNis').val();
    if (nis == ''){
        $('#cad_nis').val('');
        $('#cad_nis').attr("readonly", false);
    }
}

