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
		TGPlaces_GoogleMap_Popup.current_item = item;
		googlemaps_dialog.getCurrentPlaceID();
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
	this.SetTitle( 'Search for a Place' );

	// Controls
	this.button_cancel				= this.ActionItem_Add( 'Cancel',					function() { self.Cancel(); } );
	this.button_add_place			= this.ActionItem_Add( 'Add Selected Place',		function() { self.AddPlace(); } );
	this.current_item = '';

	this.map_frame = document.getElementById("GoogleMap");

	this.button_add_place.Hide();
}

DeriveFrom( MMDialog, TGPlaces_GoogleMap_Popup );
var run = 1;

TGPlaces_GoogleMap_Popup.prototype.onModalShow = function( z_index ){
	var self = this;
	MMDialog.prototype.onModalShow.call( this, z_index );
	if ( run == 1 ) {
		self.InitializeMap();
		run = 0;
	}
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


TGPlaces_GoogleMap_Popup.prototype.InitializeMap = function() {
	var data = JSON.stringify( { 'command': 'InitMap' } );
	this.map_frame.contentWindow.postMessage(data, '*');
}

TGPlaces_GoogleMap_Popup.prototype.getCurrentPlaceID = function() {
	var data = JSON.stringify( { 'command': 'GetCurrentPlaceID' } );
	this.map_frame.contentWindow.postMessage(data, '*');
}

window.addEventListener('message', function (e) {
	if ( typeof e.data != 'string' ) {
		return;
	}

	var data = JSON.parse( e.data );
	
	if ( data.command == 'SendPlaceID' && data.place_id ) {

		var i, i_len, inputlist;

		if ( !TGPlaces_GoogleMap_Popup.current_item.row || !data.place_id ) {
			return;
		}
		inputlist = TGPlaces_GoogleMap_Popup.current_item.row[ 'column_place_id' ].getElementsByTagName( 'input' );

		for ( i = 0, i_len = inputlist.length; i < i_len; i++ ){
			if ( inputlist[ i ].name == 'place_id' ){
				inputlist[ i ].value = data.place_id;
				googlemaps_dialog.Hide();
				return;
			}
		}
		return;
	}
});


