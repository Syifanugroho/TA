// file buat coba library trilateration
var trilateration = require('/Users/syifanugroho/Documents/Kuliah/TA/Code/firebase-project/node_modules/trilateration/index.js');
 
trilateration.addBeacon(0, trilateration.vector(2, 4));
trilateration.addBeacon(1, trilateration.vector(5.5, 13));
trilateration.addBeacon(2, trilateration.vector(11.5, 2));

var d1Reading=6;
var d2Reading=1;
var d3Reading=9;

trilateration.setDistance(0, d1Reading);
trilateration.setDistance(1, d2Reading);
trilateration.setDistance(2, d3Reading);
 
var pos = trilateration.calculatePosition();
var lokasi=pos.x;
var lokasi2=pos.y;
console.log(lokasi,lokasi2); 
