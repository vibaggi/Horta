var mongo = require('./../drivers/mongodb')
const Gpio = require('onoff').Gpio;



let HortaControlador = function(){
    // this.bercarios = [
    //     {
    //         portaRaspberry:    17,
    //         tempoAbastecimento: 26
    //     }
    // ]
    // this.tempoInundacao = 300;
    // this.portaSaida = 27 //Valvula que esvazia todos os níveis
    // this.portaBomba = 18 //Rele que liga a bomba 

    //Buscando dados do MLAB
    mongo.getBercarios().then(resp=>{
        var data = resp[0]
        this.bercarios = data.bercarios
        this.tempoInundacao = data.tempoInundacao
        this.tempoAbastecimento = data.tempoAbastecimento
        this.portaSaida = data.portaSaida
    })

}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }


/**
 * Inicia o clico de funcionamento da Horta
 **/  
HortaControlador.prototype.run = async function(){
    //A valvula de Saida quando aberta esvazia todos os níveis de uma vez
    const valvulaSaida  = new Gpio(this.portaSaida, 'out')
    const bomba         = new Gpio(this.portaBomba, 'out')
    //Todas as portas são da saida para acionar os Reles

   
    while(true){
        
        valvulaSaida.writeSync(1) //fechando valvula de esvaziamento
        console.log("Bomba Desligada")
        console.log("Sistema em espera")
        await sleep(4000) //simulando espera
        
         //Ligamos a bomba
        bomba.writeSync(0)

        //A bomba é ligada
        console.log("Regando")

        //Inicia-se o chaveamento das valvulas para abastecer cada nível
        for(i = 0; i < this.bercarios.length; i++){
           await this.inundaBercario(this.bercarios[i])
        }

        //bomba é desligada
        bomba.writeSync(1)
        
        console.log("Espera...") 
        await sleep(this.tempoInundacao*1000) //tempo que os bercarios ficam inundados 
        console.log("Esvaziando...") 
        valvulaSaida.writeSync(0) //esvaziando
        await sleep(10000)

    }
   
}

HortaControlador.prototype.setTimers = function(configuracao){
    console.log('Alterando configuração da Horta')
    this.tempoInundacao         = configuracao.tempoInundacao
    this.portaSaida             = configuracao.portaSaida
    this.portaBomba             = configuracao.portaBomba
    this.bercarios              = configuracao.bercarios
    console.log('Salvar alterações no MONGO')
    //TODO: salvar alterações no mongo para recuperar mais tarde.
}

/**
 * Inunda o bercario de acordo com a porta informada
 * @param {*} porta é a porta do raspberry, que está controlando algum dos bercarios.
 */
HortaControlador.prototype.inundaBercario = async function(bercario){
    console.log("Abrindo valvula "+bercario.portaRaspberry)
    const valvula = new Gpio(bercario.portaRaspberry, 'out')
    valvula.writeSync(0)
    console.log("Bomba iniciada")
    //TODO: iniciar bomba
    await sleep(bercario.tempoAbastecimento*1000) //enchendo
    valvula.writeSync(1)
    console.log("Fechando valvula"+bercario.portaRaspberry)

    mongo.registrarAbastecimento(bercario.portaRaspberry) //registra no mongo a porta e a data inundada
    await sleep(1000) //tempo para agua terminar de escoar
}

module.exports.controlador = HortaControlador

// Usage

// HortaControlador = require('horta')
// ctrl = new HortaControlador()
// ctrl.setTimers([])
// ctrl.run();


