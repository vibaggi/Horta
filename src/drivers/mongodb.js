var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://nodeUser:nodepassword@ds111568.mlab.com:11568/acessodb";

MongoClient.connect(url, function(err, db) {
    if (err) console.log(err);
    console.log("Database existe!");
    db.close();
  });

  function registrarAbastecimento(porta){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("acessodb");

          var data = new Date()
          var myobj = { porta: porta, data: data.toUTCString()};
          dbo.collection("abastecimento").insertOne(myobj, function(err, res) {
            if (err) reject(err);
            db.close();
            resolve("success");
          });
        });
      })
  }

  //inicialmente buscando todos os dados
  function getListaAbastecimento(){
    return new Promise(function(resolve, reject){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("acessodb");
            dbo.collection("abastecimento").find({}).toArray(function(err, docs) {
                if (err) reject(err);
                resolve(docs)
            });
        })
    })
  }

  function getBercarios(){
    return new Promise(function(resolve, reject){
      MongoClient.connect(url, function(err, db) {
        var dbo = db.db("acessodb");
        const collection = dbo.collection('bercarios');

        collection.find({"_id": 1}).toArray(function(err, docs) {
          // assert.equal(err, null);
          console.log("Found the following records");
          // console.log(docs)
          resolve(docs);
        });

    });

    })
  }
  module.exports = {
    registrarAbastecimento: registrarAbastecimento,
    getListaAbastecimento: getListaAbastecimento,
    getBercarios: getBercarios
  }