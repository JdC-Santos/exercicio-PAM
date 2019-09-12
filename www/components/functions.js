var latitude;
var longitude;
$(document).on('click','#btnCarregarMapa',function(){
  if(checkConnection() == "offline"){
    navigator.notification.alert("voce está sem conexão com internet, por favor, conecte-se a uma rede!");
  }else if(checkConnection() != "WiFi" && checkConnection() != "Ethernet"){
    confirmarCarregamento();
  }else{
    carregarCoordenadas();
  }
});

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Internet desconhecia';
    states[Connection.ETHERNET] = 'Ethernet';
    states[Connection.WIFI]     = 'WiFi';
    states[Connection.CELL_2G]  = 'Conexão 2G';
    states[Connection.CELL_3G]  = 'Conexão 3G';
    states[Connection.CELL_4G]  = 'Conexão 4G';
    states[Connection.CELL]     = 'Conexão móvel';
    states[Connection.NONE]     = 'offline';

    return states[networkState];
}

function onConfirm(buttonIndex) {
  carregarCoordenadas();
}

function confirmarCarregamento(){
  var net = checkConnection();
  navigator.notification.confirm(
    'Voce está usando '+net+' tem certeza que deseja continuar?', // message
     onConfirm,            // callback to invoke with index of button pressed
    '',           // title
    ['Sim','Não']     // buttonLabels
  );
}

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
var onSuccess = function(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude
  try{
    carregarMapa();
  }catch(e){
    navigator.notification.alert("Não foi possivel carregar o mapa");
  }
    // 'Latitude: '          + position.coords.latitude          + '\n' +
    // 'Longitude: '         + position.coords.longitude         + '\n' +
    // 'Altitude: '          + position.coords.altitude          + '\n' +
    // 'Accuracy: '          + position.coords.accuracy          + '\n' +
    // 'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    // 'Heading: '           + position.coords.heading           + '\n' +
    // 'Speed: '             + position.coords.speed             + '\n' +
    // 'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
function carregarCoordenadas(){
  try{
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }catch(e){
    navigator.notification.alert("Não foi possivel carregar a geolocalização do aparelho");
  }
}
//geocoding---------------------------------------------------------
 L.mapquest.key = 'YSXyVeMe1fUZnJI24MX8ishhAXJ3g8MN';
 var baseLayer = null;
 if(baseLayer == null){
  baseLayer = L.mapquest.tileLayer('light');
 }

function showMap(err, data) {
  var map = createMap();
  map.addControl(L.mapquest.control());
  addLayerControl(map);
}

function createMap() {
  var map = L.mapquest.map('map', {
    center: [latitude, longitude],
    zoom: 14,
    layers: baseLayer
  });
  return map;
}

function addLayerControl(map) {
  L.control.layers({
    'Map': L.mapquest.tileLayer('map'),
    'Satellite': L.mapquest.tileLayer('satellite'),
    'Hybrid': L.mapquest.tileLayer('hybrid'),
    'Light': L.mapquest.tileLayer('light'),
    'Dark': baseLayer
  }, {}, { position: 'topleft'}).addTo(map);
}

function carregarMapa(){
  $('#map').fadeIn();
  try{
    var map = L.mapquest.map('map', {
      center: [(latitude+0.001),longitude],
      layers: L.mapquest.tileLayer('map'),
      zoom: 15
    });

    L.marker([latitude,longitude], {
      icon: L.mapquest.icons.marker(),
      draggable: false
    }).bindPopup('Voce está aqui!').addTo(map);
  }catch(e){
    navigator.notification.alert("Não foi possivel carregar o mapa, por favor, verifique sua conexão com a internet");
  }
}

