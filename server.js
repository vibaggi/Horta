const express = require('express') 
const bodyParser = require('body-parser') //para formatar arquivos JSON de http requests
const cors = require('cors')

require('dotenv').load() //Carregar variaveis de ambiente


//SUBINDO OS SERVIDORES

const app = express() //usando a biblioteca express para usar Router()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.set('port', (process.env.PORT || 4000));
// app.use(formidable());
app.use(express.static(__dirname + '/public'));


let rotaMobile = require('./src/rotas/rotaMobile');


app.use(rotaMobile);
app.listen(app.get('port'), () => {
    console.log(`Servidor rodando em http://localhost:${app.get('port')}`)
    console.log('Para derrubar o servidor: ctrl + c');
})

//INICIANDO A HORTA

process.HORTA = new (require('./src/horta/controlador')).controlador()

process.HORTA.run()
