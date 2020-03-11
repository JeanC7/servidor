const util = require('util');
const Pool = require('pg').Pool


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'dispositivos',
  password: '123456',
  port: 5432,
})


pool.connect((err) => {
    if (err) throw console.log(util.inspect(err, false, null, true /* enable colors */))
    console.log('postgre Connected...');
});
const getIgnore = (request, response) => {
  const iee = request.params.name
  //  response.status(200).json(results.rows)
 		 pool.query('SELECT DISTINCT "Latitud", "Longitud" FROM "Celulares" where "Nombre_app"=$1', [iee],(error, results) => {
    if (error) throw console.log(util.inspect(error, false, null, true /* enable colors */))
   // response.status(200).json(results.rows)
    response.render('users_maps', {
            results: results.rows
        });

  })


}

const deleteCelulares = (request, response) => {
   let sql = 'DELETE FROM "Celulares"  WHERE email=$1'
  pool.query(sql,[request.body.email],(error, results) => {
 if (error) throw console.log(util.inspect(error, false, null, true /* enable colors */))
        response.redirect('/celulares');
  })
}

const getCelulares = (request, response) => {
  pool.query('SELECT DISTINCT email FROM "Celulares"', (error, results) => {
    if (error) throw console.log(util.inspect(error, false, null, true /* enable colors */))
 response.render('users_view', {
            results: results.rows
        });
 
  })
}

const getAplicaciones = (request, response) => {
  const iem = request.params.name
  const email2  = request.query.email
  console.log(iem,email2 )
  pool.query('SELECT * FROM "Aplicaciones" WHERE name=$1 and email=$2   order by count desc ', [iem,email2], (error, results) => {
  //pool.query('SELECT date as "Fecha" FROM "Aplicaciones" WHERE name=$1 and email=$2 and type=$3 order by type,count', [iem,email2,2], (error, results) => {
    if (error) throw console.log(util.inspect(error, false, null, true /* enable colors */));

    response.render('users_view_aplicaciones', {
              
            results:results.rows        });
 

      //})
  })

}
const getreport1 = (request, response) => {
		const fecha1  = request.query.fecha1
		const fecha2  = request.query.fecha2
		const form = 'DD/MM/YYYY'
		 console.log(fecha1,fecha2 )
//   let sql = 'select "Nombre_app",count("Nombre_app") as "Uso" from "Celulares"group by  "Nombre_app" having count("Nombre_app")>0 order by "Uso" desc'
     let sql =' select  TO_DATE("Fecha",$1) as "Fecha" ,"Nombre_app",SUM(CAST("T_uso" AS INTEGER)) as "Uso" from "Celulares" where "Fecha">=$2 and  TO_DATE("Fecha",$3)<=$4 group by "Nombre_app","Fecha"  order by "Uso" desc'
  pool.query(sql, [form,fecha1,form,fecha2],(error, results) => {
    if (error) throw console.log(util.inspect(error, false, null, true /* enable colors */))
    response.render('report1_view', {

            results: results.rows
        });
  })
}
const getCelularesbyemail = (request, response) => {
  const iem = (request.params.email)
  pool.query('SELECT DISTINCT "Nombre_app","Fecha","Tiempo_uso","Nombe_packete","Tipo_app","Nombre_dispositivo","email","T_uso","Direccion" FROM "Celulares" WHERE email = $1', [iem], (error, results) => {
    if (error) throw console.log(util.inspect(error, false, null, true /* enable colors */))
    response.render('datos_user_view', {
            results: results.rows
        });
   // response.status(200).json(results.rows)
 
  })
}


const createCelulares = (request, response) => {

  const {  date, package_name, name, is_system, duration,  mobile,email,uso,latitud,longitud,direccion} = request.body
  let tip=""
    if (is_system==1) {tip="usuario"}else{tip="sistema"}
  pool.query('INSERT INTO "Celulares" ("Fecha", "Nombe_packete", "Nombre_app", "Tipo_app", "Tiempo_uso", "Nombre_dispositivo",email,"T_uso","Latitud","Longitud","Direccion") VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11)', [ date, package_name, name, tip,secondsToTime(Number(duration)), mobile,email,uso,latitud,longitud,direccion], (error, results) => {
     if (error) {
      throw error
    }
    response.status(200).send(`Conectado`)
  })
}


const createAplicaciones = (request, response) => {

  const {  name, package_name, date,total,type, is_system,count,email} = request.body


  pool.query('INSERT INTO "Aplicaciones"( name, package_name, date, total, type, is_system, count, email) VALUES ($1, $2,$3,$4,$5,$6,$7,$8)  ', [ name, package_name, date,secondsToTime(Number(total)),type, is_system,count,email], (error, results) => {
     if (error) {
      throw error
    }
    response.status(200).send(`Conectado2`)
  })
}

var secondsToTime = function (s) {

    function addZ(n) {
      return (n<10? '0':'') + n;
    }

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs)+ '.' + addZ(ms);
  }

module.exports = {
  getIgnore,
//  getIgnoree,
  getCelulares,
  getAplicaciones,
  getCelularesbyemail,
  createCelulares,
  deleteCelulares,
  getreport1,
  createAplicaciones,
  //deleteUser,
}
