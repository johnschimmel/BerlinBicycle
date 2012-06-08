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
		        drawRoute();
		    }
		})

    };
})();
