function TGPlaces_Batchlist() {
	MMBatchList.call( this, 'TGPlaces_Batchlist_id' );
	this.Feature_SearchBar_SetPlaceholderText( 'Search Questions...' );
	this.SetDefaultSort( 'id', '' );
	this.Feature_Delete_Enable('Delete Question(s)');
	this.Feature_Edit_Enable('Edit Question(s)');
	this.Feature_RowDoubleClick_Enable();
	this.Feature_GoTo_Enable('Go To Question', '');
	this.Feature_Add_Enable('Add Question');
}

DeriveFrom( MMBatchList, TGPlaces_Batchlist );

TGPlaces_Batchlist.prototype.onLoad = TGPlaces_List_Load_Query;

TGPlaces_Batchlist.prototype.onCreateRootColumnList = function() {
	var columnlist =
	[
		new MMBatchList_Column_CheckboxSlider('Active', 'active', 'active', function( item, checked, delegator ) { TGPlaces_Batchlist.Update_Active( item, checked, delegator ); } ),
		new TGPlaces_MapPopup_Column( 'Place ID', 'place_id', 'place_id'),
		new MMBatchList_Column_Text( 'Name', 'name', 'name' ),
		new MMBatchList_Column_Text( 'Formatted Address', 'formatted_address', 'formatted_address' ),
		new MMBatchList_Column_Text( 'Geometry', 'geometry', 'geometry' )
		.SetOnDisplayEdit( function( record, item, mmbatchlist ) {
			return DrawMMBatchListString_Data( record.geometry );
		}),
		new MMBatchList_Column_Text( 'Type', 'type', 'type' )
		.SetOnDisplayEdit( function( record, item, mmbatchlist ) {
			return DrawMMBatchListString_Data( record.type );
		}),
		new MMBatchList_Column_DateTime( 'Last Updated', 'last_updated', 'last_updated')
		.SetOnDisplayEdit( function( record, item, mmbatchlist ) {
			return DrawMMBatchListString_Data( convertTime( record.last_updated ) );
		})
	];
	return columnlist;
}

// On Save/ Edit
TGPlaces_Batchlist.prototype.onSave = function( item, callback, delegator ) {
var wrapped_callback = function( response ) {
	if ( response.success )
	{
		item.record.last_updated = ( ( new Date() ).getTime() ) / 1000;
	}

	callback( response );
}
	TGPlaces_Update( item.record.place_id, item.record.mmbatchlist_fieldlist, wrapped_callback, delegator );
}
// On Toggle'd Active
TGPlaces_Batchlist.Update_Active = function( item, checked, delegator ) {
	TGPlaces_Batchlist_Active( item.record.place_id, checked, function( response ) {}, delegator );
}
// On Delete
TGPlaces_Batchlist.prototype.onDelete = function( item, callback, delegator ) {
	TGPlaces_Batchlist_Delete( item.record.place_id, callback, delegator );
}
// on Goto
TGPlaces_Batchlist.prototype.onGoTo = function( item, e ) {
	return OpenLinkHandler( e, adminurl, { 'Screen': 'SMOD', 'Store_Code': Store_Code, 'Tab': 'QNA_QNA', 'Edit_QNA': item.record.place_id, 'Module_Type': 'system' } );
}
TGPlaces_Batchlist.prototype.onCreate = function() {
	var record;
	record = new Object();
	record.active = 0;
	record.place_id = '';
	record.name = '';
	record.formatted_address = '';
	record.geometry = '';
	record.type = 'Admin';
	record.last_updated = Date.now() / 1000 | 0;
	return record;
}
// On Create
TGPlaces_Batchlist.prototype.onInsert = function( item, callback, delegator ) {
	TGPlaces_Batchlist_Insert( item.record.mmbatchlist_fieldlist, callback, delegator );
}