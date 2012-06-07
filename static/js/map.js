var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true
});

var polyline = new google.maps.Polyline();

function initialize() {
	var myOptions = {
	  center: new google.maps.LatLng(40.74667,-73.9879),
	  zoom: 14,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	directionsDisplay.setMap(map);

	google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
      computeTotalDistance(directionsDisplay.directions);
    });

    calcRoute();

    polyline.setMap(map);
}

var calcRoute = function() {

	var request = {
		origin:"8th ave and 24th st ny ny", 
		destination:"20th st and 5th avenue ny ny",
		waypoints:[{location:"14th st and 8th ave ny ny"},{location:"12th st and 7th ave ny ny"},{location:"union sq park ny ny"}],
		travelMode: google.maps.TravelMode.WALKING
	};
	directionsService.route(request, function(response, status) {
		console.log(response);
	  if (status == google.maps.DirectionsStatus.OK) {

	  	polyline.setPath(response.routes[0].overview_path);
	  	polyline.setVisible(true);
	    //directionsDisplay.setDirections(response);
	    /*
	    var legs = response.routes[0].legs;

	    for (var leg = 0; leg<legs.length; leg++){
	    	var steps = response.routes[0].legs[0].steps;
	       
	        for(var step = 0; step < steps.length; step++)
	        {
	            polylineOptions = {
	                    map: map,
	                    strokeColor: "#FF0000",
	                    strokeOpacity: 0.7,
	                    strokeWeight: 2,
	                    path: steps[step].path
	            }
	        police = new google.maps.Polyline(polylineOptions);
	        }
	    }
	    */
        
        //police.getPath().push(ble);
	  }
	});
}

var calcRoute2 = function() {
	var request = {
	origin:"8th ave and 24th st ny ny", 
	destination:"20th st and 5th avenue ny ny",
	travelMode: google.maps.TravelMode.WALKING
	};


	directionsService.route(request, function(response, status) {
	    if (status == google.maps.DirectionsStatus.OK)
	    {
	        
	        var steps = response.routes[0].legs[0].steps;
	        
	        for(var step = 0; step < steps.length; step++)
	        {
	            polylineOptions = {
	                    map: mapa,
	                    strokeColor: "#FF0000",
	                    strokeOpacity: 0.7,
	                    strokeWeight: 2,
	                    path: steps[step].path
	            }
	        police = new google.maps.Polyline(polylineOptions);
	        }
	        
	        police.getPath().push(ble);
	        
	    }
	    
	});
}

var computeTotalDistance = function(result) {
	var total = 0;
	var myroute = result.routes[0];
	for (i = 0; i < myroute.legs.length; i++) {
	  total += myroute.legs[i].distance.value;
	}
	total = total / 1000.
	document.getElementById("total").innerHTML = total + " km";
}   