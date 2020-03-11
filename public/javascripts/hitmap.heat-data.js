/* Data points defined as an array of LatLng objects */

function createCoordinate(){
  var minLat = 19.342750;
  var maxLat = 19.532111;
  var minLng = -99.014250;
  var maxLng = -99.260586;

  var coord = {};
  coord.lat = Math.random() * (maxLat - minLat) + minLat;
  coord.lng = Math.random()  * (maxLng - minLng) + minLng;
  return coord
}

function LatLngGen(coordinate){ 
  return new google.maps.LatLng(coordinate.lat, coordinate.lng);
}

var heatmapData = []

for (var i = 1000; i >= 0; i--) {  
  heatmapData.push( LatLngGen(createCoordinate(createCoordinate())) )
};

var cdmx = new google.maps.LatLng(19.390519, -99.4238064);

map = new google.maps.Map(document.getElementById('map'), {
  center: cdmx,
  zoom: 10
  //mapTypeId: 'satellite'
});

var heatmap = new google.maps.visualization.HeatmapLayer({
  data: heatmapData
});
heatmap.setMap(map);