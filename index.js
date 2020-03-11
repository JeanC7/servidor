const express = require('express')
const bodyParser = require('body-parser')
const hbs = require('hbs');
const app = express()
const path = require('path');
const db = require('./queries')
const  morgan  =  require ( 'morgan' ) ;
const port = 3000

//set views file
app.set('views', path.join(__dirname, 'views'));
//set view engine
app.set('view engine', 'hbs');
app.use('/assets', express.static(__dirname + '/public'));

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})


app.get('/ubicacion/:name', db.getIgnore)
app.get('/celulares', db.getCelulares)

//app.get('/ubicacion', db.getIgnoree)
app.get('/aplicaciones/:name', db.getAplicaciones)

app.post('/aplicaciones/:email', db.getAplicaciones)
app.get('/cell/:email', db.getCelularesbyemail)
app.post('/celulares', db.createCelulares)
app.post('/aplicaciones', db.createAplicaciones)
app.post('/delete',db.deleteCelulares)
app.get('/reporte1',db.getreport1)
//app.put('/users/:id', db.updateUser)
//app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
