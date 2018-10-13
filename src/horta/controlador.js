let HortaControlador = function(){
    this.canosPortaArduino   = [1,2,3]
    this.cicloEntradaCanos   = [26, 26, 26]
    this.cicloEsperaCanos    = [300, 300, 300] 
    this.bombaLigada = false
}

HortaControlador.prototype.run = async function(){
  
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

    while(true){

        

        console.log("Bomba Desligada")
        console.log("Sistema em espera")
        await sleep(10000) //simulando espera
        
        console.log("Regando")

        for(i = 0; i < this.canosPortaArduino.length; i++){
            console.log("Abrindo valvula "+this.canosPortaArduino[i])
            this.bombaLigada = true
            console.log("Bomba iniciada: "+this.bombaLigada)

            await sleep(this.cicloEntradaCanos[i]*1000) //enchendo
            this.bombaLigada = false
            console.log("Bomba iniciada: "+this.bombaLigada)
            console.log("Fechando valvula "+this.canosPortaArduino[i])

            
            await sleep(10000)
        }
        
        console.log("Esvaziando...")  
        await sleep(10000) //10segundos
           
    

    }
}

HortaControlador.prototype.setTimers = function(timers){
    console.log('trocamos?')
    this.cicloEntradaCanos = timers
}

module.exports.controlador = HortaControlador

// Usage

// HortaControlador = require('horta')
// ctrl = new HortaControlador()
// ctrl.setTimers([])
// ctrl.run();


