(function (window, document) { //IIFE immediately invoked function expression
    
    "use strict"
    var Simulador
    var StatusSimulador = ["Parado", "Executando","Finalizado"]

    var statusProcesso = {
        NOVO: 0,
        PROCESSANDO: 1,
        AGUARDANDO: 2,
        CONCLUIDO:3,
        ESPERANDO_IO:4,
    }

    var btnExecutarSimulador = document.querySelector('#btnExecutar')
    var statusSimulator = document.querySelector('#simulatorStatus')

    btnExecutarSimulador.addEventListener("click",function(){Simulador.iniciar()})

    Simulador = {
        Status: null,

        quantum: document.querySelector('#quantum'),
        processPerMin: document.querySelector('#ppm'),
        processTime: document.querySelector('#lifeTime'),
        ioChance: document.querySelector('#ioChance'),
        waitTimeIO: document.querySelector('#waitTimeIO'),
        cycles: document.querySelector('#cycles'),
        createdProcess: document.querySelector('#createdProcess'),
        completedProcess: document.querySelector('#completedProcess'),
        IoProcessQtd: document.querySelector('#IoProcess'),
        processTable: document.querySelector('#processTable'),

        iniciar: function () {
            this.processTable.innerHTML = ''
            
            if (this.validaParametros()) {
                this.setStatus(1)
                Escalonador.iniciar({
                    esc_quantum: this.quantum.value.trim(),
                    esc_processPerMin: this.processPerMin.value.trim(),
                    esc_processTime: this.processTime.value.trim(),
                    esc_ioChance: this.ioChance.value.trim(),
                    esc_waitTimeIO: this.waitTimeIO.value.trim(),
                })
            } 
        },

        validaParametros: function () {
            return this.validaInput(1, this.quantum, this.processPerMin, this.waitTimeIO, this.processTime) &&
            this.validaInput(0, this.ioChance)
        },


        validaInput: function() {
            var valorMinimo = arguments[0]
            var erro = false
            var valor = null
            var regex = /^\d+$/

            for (var i = 1, l = arguments.length; i < l; i++) {

                valor = arguments[i].value.trim()

                if ( valor === "" || valor.match(regex) !== null) {                  
                    if (valorMinimo && window.parseInt(valor, 10) < valorMinimo) {

                        window.alert('insira um valor maior ou igual' + valorMinimo +'.')
                        erro = true
                    
                    }else if(valor === "") {
                        window.alert('insira algum valor numérico válido!')
                        erro = true
                    }
                }

                if(erro === true) {
                    arguments[i].select()
                    arguments[i].focus()
                    return false     
                }

            }

            return true
        },

        setStatus: function(status) {
            this.Status = status
            statusSimulator.value = StatusSimulador[status]
            return true
        },

        defineValoresPadrao: function () {
            this.quantum.value = 1000
            this.processPerMin.value = 20
            this.processTime.value = 1000
            this.ioChance.value = 10
            this.waitTimeIO.value = 1000
        },

        atualizaQtdProcessos: function(qtd) {
            this.createdProcess.value = qtd
        },

        atualizaQtdConcluido: function(qtd) {
            this.completedProcess.value = qtd
        },

        atualizaQtdIO: function (qtd) {
            this.IoProcessQtd.value = qtd
        },

        atualizaQtdCiclos: function (qtd) {
            this.cycles.value = qtd
        },

        statusProcesso: function(processo) {
            switch(processo.status) {
              case statusProcesso.NOVO:
                  return {
                      nome: "Novo",
                      className: "processo-status-novo"
                  };
              case statusProcesso.PROCESSANDO:
                  return {
                      nome: "Processando",
                      className: "processo-status-processando"
                  };
              case statusProcesso.AGUARDANDO:
                  return {
                      nome: "Aguardando",
                      className: "processo-status-aguardando"
                  };
              case statusProcesso.CONCLUIDO:
                  return {
                      nome: "Concluído",
                      className: "processo-status-concluido"
                  };
              case statusProcesso.ESPERANDO_IO:
                  return {
                      nome: "Esperando IO",
                      className: "processo-status-esperando-io"
                  };
        }
      },

     adicionaProcesso: function(processo) {
        this.processTable.value += 
        '<tr id="processo' + processo.PID + '">' +
            '<td>' + processo.PID + '</td>' +
            '<td class="tempo-de-vida">' + processo.tempoVida + 'ms </td>' +
            '<td class="tempo-em-processamento">' + processo.tempoEmProcesso + 'ms </td>' +
            '<td class="tempo-espera">' + processo.tempoEmEspera + 'ms </td>' + 
            '<td>' + this.statusProcesso(processo).nome + '</td>' +
        '</tr>'
     },
     
     atualizaProcesso: function (processo) {
        var rowProcesso = document.querySelector("#processo" + processo.PID)
        var estado = this.statusProcesso(processo)
        var colunaStatus = rowProcesso.querySelector("td:last-child")

        colunaStatus.className = estado.className
        colunaStatus.innerHTML = estado.nome

        rowProcesso.querySelector('.tempo-em-processamento').innerHTML = processo.tempoEmProcesso + ' ms'
        rowProcesso.querySelector('.tempo-espera').innerHTML = processo.tempoEmEspera + ' ms'
     }

    }

    var Escalonador = {
		quantum: 0, 
		qtdProcPorMin: 0,
		tempoVidaProc: 0, 
		percIOBound: 0, 
		tempoEspera: 0,

        indiceProcAtual: 0,

		processos: [],

	}

	Simulador.defineValoresPadrao()
	Simulador.setStatus(0)

}(window, document))