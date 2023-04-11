function getTrilateration(position1, position2, position3) {
  var xa = position1.x;
  var ya = position1.y;
  var xb = position2.x;
  var yb = position2.y;
  var xc = position3.x;
  var yc = position3.y;
  var ra = position1.distance;
  var rb = position2.distance;
  var rc = position3.distance;

  var S = (Math.pow(xc, 2.) - Math.pow(xb, 2.) + Math.pow(yc, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(rc, 2.)) / 2.0;
  var T = (Math.pow(xa, 2.) - Math.pow(xb, 2.) + Math.pow(ya, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(ra, 2.)) / 2.0;
  var y = ((T * (xb - xc)) - (S * (xb - xa))) / (((ya - yb) * (xb - xc)) - ((yc - yb) * (xb - xa)));
  var x = ((y * (ya - yb)) - T) / (xb - xa);

  return {
      x: x,
      y: y
  };
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index,1);
    }
    return arr;
  };

let tracker_1 = document.querySelector('.tracker');


// Database Paths
var dataFloatPath = 'test/activity';
var dataD1Path = 'distance1';
var dataD2Path = 'distance2';
var dataD3Path = 'distance3';
var dataD4Path = 'distance4';
var dataD5Path = 'distance5';
var dataD6Path = 'distance6';
var dataD7Path = 'distance7';
var dataD8Path = 'distance8';
var dataD9Path = 'distance9';
var dataD10Path = 'distance10';

// Get a database reference 
const databaseFloat = database.ref(dataFloatPath);
const databaseD1 = database.ref(dataD1Path);
const databaseD2 = database.ref(dataD2Path);
const databaseD3 = database.ref(dataD3Path);
const databaseD4 = database.ref(dataD4Path);
const databaseD5 = database.ref(dataD5Path);
const databaseD6 = database.ref(dataD6Path);
const databaseD7 = database.ref(dataD7Path);
const databaseD8 = database.ref(dataD7Path);
const databaseD9 = database.ref(dataD9Path);
const databaseD10 = database.ref(dataD10Path);

// Variables to save database current values
var floatReading;
var d1Reading;
var d2Reading;
var d3Reading;
var d4Reading;
var d5Reading;
var d6Reading;
var d7Reading;
var d8Reading;
var d9Reading;
var d10Reading;

//Various Var
var delay = 1000;
var i;
var j;

var act_1 = document.querySelector(".logo-act-1");
var act_2 = document.querySelector(".logo-act-2");
var act_3 = document.querySelector(".logo-act-3");


// Attach an asynchronous callback to read the data
databaseFloat.on('value', (snapshot) => {
  floatReading = snapshot.val();
  console.log(floatReading);
  document.getElementById("reading-activity").innerHTML = floatReading;
  if (floatReading == "Jalan"){
    act_1.style.border = "6px solid #00b2ca";
    act_2.style.border = "6px solid #353535";
    act_3.style.border = "6px solid #353535";
  }
  else if (floatReading == "Jatuh"){
    act_1.style.border = "6px solid #353535";
    act_2.style.border = "6px solid #00b2ca";
    act_3.style.border = "6px solid #353535";
  }
  else if (floatReading == "Tidur"){
    act_1.style.border = "6px solid #353535";
    act_2.style.border = "6px solid #353535";
    act_3.style.border = "6px solid #00b2ca";
  };
}, 
(errorObject) => {
  console.log('The read failed: ' + errorObject.name);
});



databaseD1.on('value', (snapshot) => {
  d1Reading = snapshot.val();
  databaseD2.on('value', (snapshot) => {
    d2Reading = snapshot.val();
    databaseD3.on('value', (snapshot) => {
      d3Reading = snapshot.val();
      databaseD4.on('value', (snapshot)=>{
        d4Reading = snapshot.val();
        databaseD5.on('value', (snapshot)=>{
          d5Reading = snapshot.val();
          databaseD6.on('value',(snapshot)=>{
            d6Reading = snapshot.val();
            databaseD7.on('value',(snapshot)=>{
              d7Reading = snapshot.val();
              databaseD8.on('value',(snapshot)=>{
                d8Reading = snapshot.val();
                databaseD9.on('value',(snapshot)=>{
                  d9Reading = snapshot.val();
                  databaseD10.on('value',(snapshot)=>{
                    d10Reading = snapshot.val();
                    let ble_readings = [
                      {
                        x : 0,
                        y : 0,
                        distance : d1Reading
                      },
                      {
                        x : 3.5,
                        y : 0,
                        distance : d2Reading
                      },       
                      {
                        x : 1.5,
                        y : 3.6,
                        distance : d3Reading
                      },
                      {
                        x : 5.2,
                        y : 0,
                        distance : d4Reading
                      },       
                      {
                        x : 5.2,
                        y : 3.7,
                        distance : d5Reading
                      },
                      {
                        x : 9,
                        y : 0,
                        distance : d6Reading
                      },
                      {
                        x : 9,
                        y : 3.7,
                        distance : d7Reading
                      },       
                      {
                        x : 6,
                        y : 5.1,
                        distance : d8Reading
                      },
                      {
                        x : 7.6,
                        y : 6,
                        distance : d9Reading
                      },       
                      {
                        x : 9.1,
                        y : 6,
                        distance : d10Reading
                      },
                    ];
                    ble_readings.sort(function(a,b){return a.distance-b.distance});
                    console.log(ble_readings);
                    let lokasi = getTrilateration(ble_readings[0],ble_readings[1],ble_readings[2]);
                    console.log("X : "+lokasi.x);
                    console.log("Y : "+lokasi.y);
                    var x_1 = Math.floor(Math.abs(lokasi.x / 12 * 100))*30/100+"%";
                    var y_1 = Math.floor(Math.abs(lokasi.y /9.5 * 100))*(50/100)+25+"%";
                    console.log(x_1);
                    console.log(y_1);
                    if (x_1 <15 &&  y_1<30){
                      document.getElementById("reading-location").innerHTML = "Bedroom";
                    }
                    else{
                      document.getElementById("reading-location").innerHTML = "Other room";
                    }
                    tracker_1.style.position = "absolute";
                    tracker_1.style.left = x_1 ;
                    tracker_1.style.bottom = y_1 ;
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

