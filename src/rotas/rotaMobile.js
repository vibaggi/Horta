var router  = require('express').Router();
var mongo   = require('./../drivers/mongodb')
/**
 * Altera o tempo de enchimento da Horta.
 */
router.post('/mudarTimer', function(req, res){
    process.HORTA.setTimers({
        tempoAbastecimento: 10,
        tempoInundacao:     100
    })
    res.send("ola mundo")
})

/**
 * Abastecer manualmente um berceira pela porta raspberry
 */
router.post('/abastecer/:porta', function(req, res){
    process.HORTA.inundaPorta(req.params.porta)
    res.send("porta inundada")
})

/**
 * Busca dados dos controladores e retorna um JSON para a aplicação
 */
router.get('/recebeStatus', function(req,res){
    mongo.getListaAbastecimento().then(resp=>{
        res.send(resp)
    })
})

module.exports = router;