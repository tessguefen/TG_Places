function TGPlaces_MapPopup_Column( header_text, code, fieldname ) {
	MMBatchList_Column.call( this, header_text, code );

	this.SetSortByField( code );
	this.SetDefaultActive( true );
	this.SetFieldName( fieldname );
	this.SetHeaderAttributeList( { 'class': 'mm9_batchlist_column_header' } );
	this.SetHeaderStyleList( { 'width': '150px' } );
	this.SetOnDisplayEdit( this.onDisplayEdit );

	return this;
}

DeriveFrom( MMBatchList_Column, TGPlaces_MapPopup_Column );

TGPlaces_MapPopup_Column.prototype.onDisplayEdit = function( record, item ) {
	if ( record.place_id !== '' && record.geometry !== '') {
		return DrawMMBatchListString_Data( record.place_id );
	}
	var self = this;
	var container, input, input_container, button;

	container			= newElement( 'span',	{ 'class': 'mm9_batchlist_column_popup_container' },									null, null );
	input_container		= newElement( 'span',	{ 'class': 'mm9_batchlist_column_popup_input_container' },								null, container );
	input				= newElement( 'input',	{ 'type': 'text', 'name': this.code, 'class': 'mm9_batchlist_data_col_editableinput' },	null, input_container );
	button				= new MMButton( container );

	input.placeholder	= this.header_text;
	input.value			= this.onRetrieveValue( record );
	input.onfocus		= function( event ) { input_container.className = classNameAdd( input_container, 'active' ); };
	input.onblur		= function( event ) { input_container.className = classNameRemove( input_container, 'active' ); };

	button.SetText( '' );
	button.SetImage( 'lookup' );
	button.SetClassName( 'mm9_batchlist_column_popup_button' );
	button.SetOnClickHandler( function( e ) { self.Lookup( item ); } );

	return container;
}

TGPlaces_MapPopup_Column.prototype.Lookup = function( item ) {
	googlemaps_dialog = new TGPlaces_GoogleMap_Popup();
	googlemaps_dialog.AddPlace	= function() {
		var i, i_len, inputlist;

		if ( !item.row || !selected_place ) {
			return;
		}

		inputlist = item.row[ 'column_place_id' ].getElementsByTagName( 'input' );

		for ( i = 0, i_len = inputlist.length; i < i_len; i++ ){
			if ( inputlist[ i ].name == 'place_id' ){
				inputlist[ i ].value = selected_place;
				this.Hide();
				return;
			}
		}
	};
	googlemaps_dialog.Show();
}


/*
 =====================
 */
function TGPlaces_GoogleMap_Popup(){
	var self = this;
	var selected_place = '';

	MMDialog.call( this, 'tg_places_googlemap', 575, 575 );

	this.SetResizeEnabled();
	this.SetTitle( 'Search for a Thingy' );

	// Controls
	this.button_cancel				= this.ActionItem_Add( 'Cancel',					function() { self.Cancel(); } );
	this.button_add_place			= this.ActionItem_Add( 'Add Selected Place',		function() { self.AddPlace(); } );

	this.button_add_place.Hide();
}

DeriveFrom( MMDialog, TGPlaces_GoogleMap_Popup );
var run = 1;

TGPlaces_GoogleMap_Popup.prototype.onModalShow = function( z_index ){
	MMDialog.prototype.onModalShow.call( this, z_index );
	initMap(run);
	run = 0;
}

TGPlaces_GoogleMap_Popup.prototype.onSetContent = function() {
	this.button_add_place.Show();
}

TGPlaces_GoogleMap_Popup.prototype.Cancel = function(){
	this.Hide();
	this.oncancel();
}

TGPlaces_GoogleMap_Popup.prototype.AddPlace = function() {
	this.Hide();
}

TGPlaces_GoogleMap_Popup.prototype.oncancel = function() { ; }


function initMap( run ) {
	if (!run) {
		return;
	}
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