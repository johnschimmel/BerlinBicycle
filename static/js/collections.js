var collections = (function() {
    return {
    	  Questions : Backbone.Collection.extend({
    	  	
    	  })
    	, Choices : Backbone.Collection.extend({})
    	, Markers : Backbone.Collection.extend({
			  model : models.mapmarker
			, initialize: function() {
		        this.bind('add', this.onModelAdded, this );
		    }
		    , onModelAdded: function(model, collection, options) {
		    	this.directionRequest();

		        //drawRoute();
		    }
		    , directionRequest : function() {
		    	that = this;
		    	if (this.length > 1) {
		    		//prepare the direction request object
		    		var tmpLatLngs = _.map(markers.models, function(marker){
		    			return {location:marker.get('latLng')};
		    		});
		    		var middleOfArray = _.initial(_.rest(tmpLatLngs)); // remove first and last element of array
		    		var request = {
						origin:_.first(this.models).get('latLng'), 
						destination:_.last(this.models).get('latLng'),
						waypoints:middleOfArray,
						travelMode: google.maps.TravelMode.WALKING
					};
					directionsService.route(request, function(response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							survey.set({markers:that, directions:response.routes[0]});

							polyline.setPath(response.routes[0].overview_path);
							polyline.setVisible(true);

						}
					});
		    	}
		    	
		    }
		    , reset : function() {

		    	_.each(this.models, function(marker){
		    		marker.hide();
		    		polyline.setVisible(false);

		    	});

		    	this.remove(this.models);

		    }
		})

    };
})();
