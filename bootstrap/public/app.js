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
  
  // Get a database reference 
  const databaseFloat = database.ref(dataFloatPath);
  const databaseD1 = database.ref(dataD1Path);
  const databaseD2 = database.ref(dataD2Path);
  const databaseD3 = database.ref(dataD3Path);
  
  // Variables to save database current values
  var floatReading;
  var d1Reading;
  var d2Reading;
  var d3Reading;
  
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
    if (floatReading == "Walking"){
      act_1.style.border = "6px solid #00b2ca";
      act_2.style.border = "6px solid #353535";
      act_3.style.border = "6px solid #353535";
    }
    else if (floatReading == "Falling"){
      act_1.style.border = "6px solid #353535";
      act_2.style.border = "6px solid #00b2ca";
      act_3.style.border = "6px solid #353535";
    }
    else if (floatReading == "Sleeping"){
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
  
  
        let ble_readings = [
          {
            x : 0.2,
            y : 0,
            distance : d1Reading
          },
          {
            x : 0,
            y : 2.4,
            distance : d2Reading
          },       
          {
            x : 1.2,
            y : 0,
            distance : d3Reading
          },
        ];
        ble_readings.sort(function(a,b){return a.distance-b.distance});
        console.log(ble_readings);
        let lokasi = getTrilateration(ble_readings[0],ble_readings[1],ble_readings[2]);
        console.log("X : "+lokasi.x);
        console.log("Y : "+lokasi.y);
        var x_1 = Math.floor(Math.abs(lokasi.x /3 * 100))+"%";
        var x_2 = Math.floor(Math.abs(lokasi.y /3.6 * 100))+"%";
        console.log(x_1);
        console.log(x_2);
        if (x_1 <15 &&  x_2<30){
          document.getElementById("reading-location").innerHTML = "Bedroom";
        }
        else{
          document.getElementById("reading-location").innerHTML = "Other room";
        }
        tracker_1.style.position = "absolute";
        tracker_1.style.bottom = x_1 ;
        tracker_1.style.left = x_2 ;
      });
    });
  });
  