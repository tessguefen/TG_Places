function TGPlaces_Batchlist() {
	MMBatchList_AssignList.call( this, 'TGPlaces_Batchlist_id', true );
	this.Feature_SearchBar_SetPlaceholderText( 'Search Places...' );
	this.SetDefaultSort( 'id', '' );
	this.Feature_Delete_Enable('Delete Place(s)');
	this.Feature_Edit_Enable('Edit Place(s)');
	this.Feature_RowDoubleClick_Enable();
	this.Feature_Add_Enable('Add Place');
	this.button_rebuild_file = this.Feature_Buttons_AddButton_Persistent( 'Rebuild File', '', '', this.Rebuild_File );
	this.processingdialog = new ProcessingDialog();

	this.auto_activate = <MvEVAL EXPR ="{ g.auto_active }">;
}

DeriveFrom( MMBatchList_AssignList, TGPlaces_Batchlist );

TGPlaces_Batchlist.prototype.onLoad = function( filter, sort, offset, count, callback, delegator ) {
	TGPlaces_List_Load_Query( this.load_assigned, this.load_unassigned, filter, sort, offset, count, callback, delegator );
}

TGPlaces_Batchlist.prototype.onSaveAssigned = function( item, callback, delegator ) {
	TGPlaces_Batchlist_Active( item.record.place_id, item.record.assigned, function( response ) {}, delegator );
	//wat
}

TGPlaces_Batchlist.prototype.onCreateRootColumnList = function() {
	var columnlist =
	[
		new MMBatchList_Column_Name( 'ID', 'id', 'id')
		.SetDisplayInMenu(false)
		.SetDisplayInList(false)
		.SetAdvancedSearchEnabled(false),
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
	console.log(item);
	TGPlaces_Batchlist_Active( item.record.place_id, checked, function( response ) {}, delegator );
}
// On Delete
TGPlaces_Batchlist.prototype.onDelete = function( item, callback, delegator ) {
	TGPlaces_Batchlist_Delete( item.record.place_id, callback, delegator );
}

TGPlaces_Batchlist.prototype.onCreate = function() {
	var record;
	record = new Object();
	record.active = this.auto_activate;
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

TGPlaces_Batchlist.prototype.TGPlaces_Rebuild_File = function ( callback ) {
	return AJAX_Call_Module_FieldList(	callback,
										'admin',
										'tg_places',
										'Rebuild_File',
										'',
										'',
										'' );
}

// Rebuild File
TGPlaces_Batchlist.prototype.Rebuild_File_Callback = function ( response ) {
	return this.processingdialog.Hide();
}

// Rebuild File
TGPlaces_Batchlist.prototype.Rebuild_File = function () {
	var self = this;
	this.processingdialog.Show( 'Updating File...' );
	this.TGPlaces_Rebuild_File( function( response ) { self.Rebuild_File_Callback( response ); } );
}
