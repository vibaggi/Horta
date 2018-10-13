var router = require('express').Router();

router.post('/mudarTimer', function(req, res){
    process.HORTA.setTimers([1,1,1])
    res.send("ola mundo")
})

module.exports = router;