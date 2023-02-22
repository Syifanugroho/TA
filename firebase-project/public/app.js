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

// Attach an asynchronous callback to read the data
databaseFloat.on('value', (snapshot) => {
  floatReading = snapshot.val();
  console.log(floatReading);
  document.getElementById("reading-activity").innerHTML = floatReading;
}, (errorObject) => {
  console.log('The read failed: ' + errorObject.name);
});

databaseD1.on('value', (snapshot) => {
  d1Reading = snapshot.val();
  console.log(d1Reading);
  document.getElementById("reading-d1").innerHTML = d1Reading;
}, (errorObject) => {
  console.log('The read failed: ' + errorObject.name);
});

databaseD2.on('value', (snapshot) => {
  d2Reading = snapshot.val();
  console.log(d2Reading);
  document.getElementById("reading-d2").innerHTML = d2Reading;
}, (errorObject) => {
  console.log('The read failed: ' + errorObject.name);
});

databaseD3.on('value', (snapshot) => {
  d3Reading = snapshot.val();
  console.log(d3Reading);
  document.getElementById("reading-d3").innerHTML = d3Reading;
}, (errorObject) => {
  console.log('The read failed: ' + errorObject.name);
});