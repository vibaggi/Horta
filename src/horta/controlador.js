var mongo = require('./../drivers/mongodb')
const Gpio = require('onoff').Gpio;



let HortaControlador = function(){
    this.bercarios = {
        
        portasRaspberry:    [17],
        tempoInundacao:     300,
        tempoAbastecimento: 26,
        portaSaida: 27
    }
    this.bombaLigada = false
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }


/**
 * Inicia o clico de funcionamento da Horta
 **/  
HortaControlador.prototype.run = async function(){
    const valvulaSaida = new Gpio(this.bercarios.portaSaida, 'out')
  

    while(true){
        valvulaSaida.writeSync(0) //fechando valvula de esvaziamento
        console.log("Bomba Desligada")
        console.log("Sistema em espera")
        await sleep(4000) //simulando espera
        
        console.log("Regando")
        console.log(this.bercarios.portasRaspberry.length)
        for(i = 0; i < this.bercarios.portasRaspberry.length; i++){
           await this.inundaPorta(this.bercarios.portasRaspberry[i])
        }
        
        console.log("Esvaziando...")  
        await sleep(this.bercarios.tempoInundacao*1000) //tempo que os bercarios ficam inundados 
        valvulaSaida.writeSync(1) //esvaziando
        await sleep(10000)

    }
}

HortaControlador.prototype.setTimers = function(timers){
    console.log('Alteração no tempo de enchimento de cano: ',timers)
    this.bercarios.tempoAbastecimento   = timers.tempoAbastecimento
    this.bercarios.tempoInundacao       = timers.tempoInundacao
}

/**
 * Inunda o bercario de acordo com a porta informada
 * @param {*} porta é a porta do raspberry, que está controlando algum dos bercarios.
 */
HortaControlador.prototype.inundaPorta = async function(porta){
    console.log("Abrindo valvula "+porta)
    const valvula = new Gpio(porta, 'out')
    valvula.writeSync(1)
    console.log("Bomba iniciada")
    await sleep(this.bercarios.tempoAbastecimento*1000) //enchendo
    valvula.writeSync(0)
    console.log("Bomba iniciada")
    console.log("Fechando valvula"+porta)

    mongo.registrarAbastecimento(porta) //registra no mongo a porta e a data inundada
    await sleep(1000) //tempo para agua terminar de escoar
}

module.exports.controlador = HortaControlador

// Usage

// HortaControlador = require('horta')
// ctrl = new HortaControlador()
// ctrl.setTimers([])
// ctrl.run();


