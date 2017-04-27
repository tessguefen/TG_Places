function initMap() {
	selected_place = '';
	var map = new google.maps.Map(document.getElementById('TGPlaces_map'), {
		center: {lat: 39.50, lng: -98.35},
		zoom: 4
	});

	var input = document.getElementById('pac-input');

	var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var infowindow = new google.maps.InfoWindow();

	var marker = new google.maps.Marker({
		map: map
	});

	marker.addListener('click', function() {
		var purty = place.formatted_address.match(/([^,]*),(.*)/);
		infowindow.setContent('<div class="gm-info secondary-font"><strong class="gm-info--name">' + place.name + '</strong>' +
			'<div class="gm-info--address">' +
			purty[1] + '<br />' + purty[2]);
		infowindow.open(map, marker);
		selected_place = place.place_id;
	});

	autocomplete.addListener('place_changed', function() {
		infowindow.close();
		var place = autocomplete.getPlace();

		if (!place.geometry) {
			return;
		}

		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}

		// Set the position of the marker using the place ID and location.
		marker.setPlace({
			placeId: place.place_id,
			location: place.geometry.location
		});
		marker.setVisible(true);

		var purty = place.formatted_address.match(/([^,]*),(.*)/);
		infowindow.setContent('<div class="gm-info secondary-font"><strong class="gm-info--name">' + place.name + '</strong>' +
			'<div class="gm-info--address">' +
			purty[1] + '<br />' + purty[2]);
		infowindow.open(map, marker);
		selected_place = place.place_id;
	});
}

window.addEventListener('message', function (e) {
	if ( typeof e.data != 'string' ) {
		return;
	}

	var data = JSON.parse( e.data );

	if ( data.command == 'InitMap' ) {
		initMap();
		return;
	}

	var mainWindow = e.source;

	if ( data.command == 'GetCurrentPlaceID' ) {
		var result = JSON.stringify( { 'command': 'SendPlaceID', 'place_id': selected_place } );
		mainWindow.postMessage(result, e.origin);
		return;
	}
});