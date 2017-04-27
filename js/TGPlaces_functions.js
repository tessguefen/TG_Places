function TGPlaces_List_Load_Query( active, inactive, filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'tg_places',
								'TGPlaces_Load_Query',
								'&Filter=' + EncodeArray( filter ) +
								'&Sort=' + encodeURIComponent( sort ) +
								'&Offset=' + encodeURIComponent( offset ) +
								'&Active=' + ( active ? '1' : '0' ) +
					  			'&Inactive='	+ ( inactive ? '1' : '0' ) +
								'&Count=' + encodeURIComponent( count ),
								delegator );
}
//On Edit
function TGPlaces_Update( id, fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList(	callback,
										'admin',
										'tg_places',
										'Place_Update',
										'PlaceID=' +
										encodeURIComponent( id ),
										fieldlist,
										delegator );
}
// On Active
function TGPlaces_Batchlist_Active ( id, checked, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'tg_places',
								'Place_Active',
								'PlaceID='		+ encodeURIComponent( id ) +
								'&Active='	+ ( checked ? 1 : 0 ),
								delegator );
}

// On Delete
function TGPlaces_Batchlist_Delete( id, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'tg_places',
								'Place_Delete',
								'PlaceID=' + encodeURIComponent( id ),
								delegator );
}
// On Create
function TGPlaces_Batchlist_Insert( fieldlist, callback, delegator ) {
	return AJAX_Call_Module_FieldList(	callback,
										'admin',
										'tg_places',
										'Place_Insert',
										'',
										fieldlist,
										delegator );
}