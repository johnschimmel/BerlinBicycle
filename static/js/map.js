var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true
});

var polyline;

var markers = new collections.Markers;

function initialize() {
	var myOptions = {
	  center: new google.maps.LatLng(52.532408,13.41152),
	  zoom: 13,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("canvas"), myOptions);
	directionsDisplay.setMap(map);

	
    google.maps.event.addListener(map, "click", function(e){
    	var tmpMarker = new models.mapmarker({
    		marker : new google.maps.Marker({
	    		  map : map
	    		, position : e.latLng
	    	})
	    	, latLng : e.latLng
	    });
    	markers.add(tmpMarker);
    	
    });

    //calcRoute();
    polyline = new google.maps.Polyline({
    	map : map
    });
    
}
