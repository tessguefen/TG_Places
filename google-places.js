function initMap() {
	var self = this;

	this.map;
	this.geocoder;
	this.bounds;
	this.map_center = {
		lat: 39.50,
		lng: -98.35
	};

	this.address_input = document.getElementById('js-address');
	this.radius_input = document.getElementById('js-radius');
	this.places_div = document.getElementById('js-places');
	this.places_header = document.getElementById('js-place-header');
	this.map_container = document.getElementById('js-google-map');
	this.search_button = document.getElementById('js-places-search-button');

	// This only works on HTTPS
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			self.map_center = initialLocation;
			self.user_location = initialLocation;
		});
	}

	this.markerClusterOptions = {
		gridSize: 30,
		//cssClass: 'marker-cluster', //Uncomment this area to use your own Marker Cluster Class. This must include an image path in the CSS.
		imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
	}

	this.service;
	this.storesList = [];
	this.locations_html = '';


	this.infowindow = new google.maps.InfoWindow();

	this.map = new google.maps.Map(self.map_container, {
				center: self.map_center,
				zoom: 4,
				streetViewControl: false,
				mapTypeControl: true,
				mapTypeControlOptions: {
					position: google.maps.ControlPosition.TOP_RIGHT
				}
			});

	self.places_div.innerHTML = '';

	loadJson( 'js/places.js', function( response ) {
		if ( typeof response != 'string') {
			console.log('error');
			return;
		}
		self.locations = JSON.parse( response );

		for (var i = 0; i < self.locations.length; i++) {
			var marker = new google.maps.Marker({
				position: self.locations[i].geometry.location,
				map: self.map,
				title: self.locations[i].name,
				animation: google.maps.Animation.DROP
			});

			// This will seperate the `formatted_address` to have a break tag.
			var seperated_address = self.locations[i].formatted_address.match(/([^,]*),(.*)/);
			self.locations[i].seperated_address = seperated_address[1] + '<br />' + seperated_address[2];
			self.locations[i].place_index = i;

			marker.set('place_index', i);
			marker.set('formatted_address', self.locations[i].formatted_address);
			marker.set('seperated_address', self.locations[i].seperated_address);
			marker.set('name', self.locations[i].name);

			google.maps.event.addListener(marker, 'click', function() {
				self.infowindow.setContent('<div class="google-places-infowindow"><div class="google-places-infowindow__name"><strong>' + this.name + '</strong></div><div class="google-places-infowindow__address">' + this.seperated_address + '</div></div>');
				self.infowindow.open(self.map, this);
			});

			self.storesList.push( marker );

			if ( self.locations[i] && i < 10) {
				self.places_div.innerHTML += closePlacesHTML( self.locations[i] );
			}
		}

		new MarkerClusterer(self.map, self.storesList, self.markerClusterOptions);

	});
}

function codeAddress() {
	var geocoder = new google.maps.Geocoder(),
		address = self.address_input.value,
		meter_to_mi = 1609.34,
		radius = self.radius_input.value,
		buffer = radius * meter_to_mi,
		numStores = 8,
		results = [],
		nearMe = [],
		nearbyLocations = 0;

	self.address_input.classList.remove( 'error');
	self.radius_input.classList.remove( 'error');

	if (!address || !radius) {
		if ( !address) {
			self.address_input.className += ' error';
		}
		if ( !radius) {
			self.radius_input.className += ' error';
		}
		return;
	}

	geocoder.geocode({
		'address': address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var searchCenter = results[0].geometry.location;
			self.map.setCenter(searchCenter);

			bounds = new google.maps.LatLngBounds();

			var nearbyLocations = 0;
			for (var i = 0; i < self.storesList.length; i++) {
				if (typeof(self.storesList[i]) !== 'undefined' && self.storesList[i].getPosition()) {
					if ( google.maps.geometry.spherical.computeDistanceBetween(self.storesList[i].getPosition(), searchCenter ) < buffer ) {
						nearMe.push(self.storesList[i]);
						bounds.extend( self.storesList[i].getPosition() );
						self.storesList[i].setMap( self.map );
						nearbyLocations++;
					}
				}

			}
			if (nearbyLocations == 0) {
				self.places_div.innerHTML = '<div class="column">Sorry! We found no locations near this address.</div>';
			}

			if (nearbyLocations > 1 || nearbyLocations == 0) {
				self.places_header.innerHTML = nearbyLocations + ' Stores within ' + htmlEntities(self.radius_input.value) + ' Miles of ' + htmlEntities(self.address_input.value);
			} else {
				self.places_header.innerHTML = nearbyLocations + ' Store within ' + htmlEntities(self.radius_input.value) + ' Miles of ' + htmlEntities(self.address_input.value);
			}
			calculateDistances(results[0].geometry.location, nearMe, 10);
		} else {
			self.places_div.innerHTML = 'The address you entered cannot be found.';
		}
	}); // END -> geocoder.geocode()

}

function closestClick( i ) {
	google.maps.event.trigger(self.storesList[i], 'click');
}

function calculateDistances( pt, close_places, numberOfResults ) {
	var service = new google.maps.DistanceMatrixService();
	var request = {
		origins: [pt],
		destinations: [],
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.METRIC,
		avoidHighways: false,
		avoidTolls: false
	};
	for (var i = 0; i < close_places.length; i++) request.destinations.push(close_places[i].getPosition());
	service.getDistanceMatrix(request, function( response, status ) {
		if (status == google.maps.DistanceMatrixStatus.OK) {
			var origins = response.originAddresses;
			var destinations = response.destinationAddresses;
			self.places_div.innerHTML = '';

			var results = response.rows[0].elements;
			for (var x = 0; x < close_places.length; x++) {
				close_places[x].set( 'distance', results[x].distance );
			}
			close_places.sort(sortByDist);

			for (var i = 0; i < close_places.length; i++) {
				if ( close_places[i] ) {
					self.places_div.innerHTML += closePlacesHTML( close_places[i] );
				} else {
					break;
				}
			}
		}
	});
}

function closePlacesHTML( place ) {
	var html = '<div class="google-places-close-location">' +
				'<div class="google-places-close-location__onclick" onclick="closestClick(' + place.place_index + ')">' +
					'<div class="google-places-close-location__name"><strong>' + place.name + '</strong></div>';
	if ( place.distance ) {
		html += '<div class="google-places-close-location__distance"><em>' + (place.distance.value * 0.000621371).toFixed(2) + ' Miles</em></div>';
	}
	
	html += '<div class="google-places-close-location__address">' + place.seperated_address + '</div>';
	
	if ( self.address_input.value ) {
		html += '<div class="google-places-close-location__directions"><a target="_blank" href="https://www.google.com/maps/dir/' + encodeURIComponent(self.address_input.value) + '/' + encodeURIComponent(place.formatted_address) + '" class="bold color--secondary no-decoration">Get Directions</a></div>';
	}
	html += '</div>' + '</div>';
	return html;
}

// Helper Functions
function htmlEntities( str ) {return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');}

function loadJson( url, callback ) {
	var xobj = new XMLHttpRequest();

	xobj.overrideMimeType( "application/json" );
	xobj.open( 'GET', url, true );
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback( xobj.responseText );
		}
	};
	xobj.send( null );
}

function sortByDist( a, b ) {
	return (a.distance.value - b.distance.value);
}