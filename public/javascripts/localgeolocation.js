navigator.geolocation.getCurrentPosition(showPosition, fail);
function fail(msg){
    console.log(msg.code + msg.message);
}

function showPosition(position) {
    document.getElementById("us3-lat").value = position.coords.latitude ;
    document.getElementById("us3-lon").value = position.coords.longitude ; 

}

