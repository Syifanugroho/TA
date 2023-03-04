// Database Paths
var activityPath = 'test/activity';
var dataD1Path = 'distance1';
var dataD2Path = 'distance2';
var dataD3Path = 'distance3';

// Get a database reference 
const databaseAct = database.ref(activityPath);
const databaseD1 = database.ref(dataD1Path);
const databaseD2 = database.ref(dataD2Path);
const databaseD3 = database.ref(dataD3Path);

// Variables to save database current values
var actReading;
var d1Reading;
var d2Reading;
var d3Reading;

// Attach an asynchronous callback to read the data
databaseAct.on('value', (snapshot) => {
  actReading = snapshot.val();
  document.getElementById("reading-activity").innerHTML = actReading;
});

databaseD1.on('value', (snapshot) => {
  d1Reading = snapshot.val();
  document.getElementById("reading-d1").innerHTML = d1Reading;
});

databaseD2.on('value', (snapshot) => {
  d2Reading = snapshot.val();
  document.getElementById("reading-d2").innerHTML = d2Reading;
});

databaseD3.on('value', (snapshot) => {
  d3Reading = snapshot.val();
  document.getElementById("reading-d3").innerHTML = d3Reading;
});

// Fungsi require yang masih error trs gatau cape
define(['require','./trilateration/index'], function (require) {
  var trilateration=require('./trilateration/index');
  trilateration.addBeacon(0, trilateration.vector(0.22, 0));
  trilateration.addBeacon(1, trilateration.vector(2, 0.22));
  trilateration.addBeacon(2, trilateration.vector(0.1, 1.5));
 

  trilateration.setDistance(0, d1Reading);
  trilateration.setDistance(1, d2Reading);
  trilateration.setDistance(2, d3Reading);
 
  var pos = trilateration.calculatePosition();
  var lokasi=pos.x;
  var lokasi2=pos.y;
  document.getElementById("lokasi").innerHTML = lokasi;
  document.getElementById("lokasi-2").innerHTML = lokasi2;
});


