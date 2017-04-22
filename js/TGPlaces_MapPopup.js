function TGPlaces_MapPopup_Column( header_text, code, fieldname )
{
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
	if ( record.placeId !== '' && record.geometry !== '') {
		return DrawMMBatchListString_Data( record.placeId );
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

TGPlaces_MapPopup_Column.prototype.Lookup = function( item )
{
	console.log('test');
}