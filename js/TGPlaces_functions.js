function TGPlaces_List_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'tg_places',
								'TGPlaces_Load_Query',
								'&Filter=' + EncodeArray( filter ) +
								'&Sort=' + encodeURIComponent( sort ) +
								'&Offset=' + encodeURIComponent( offset ) +
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

// Misc. Functions
function convertTime( timestamp ) {
	var d = new Date(timestamp * 1000),
		yyyy = d.getFullYear(),
		mm = d.getMonth(),
		dd = d.getDate(),
		hh = d.getHours(),
		h = hh,
		s = ( '0' + d.getSeconds()).slice(-2),
		min = ('0' + d.getMinutes()).slice(-2),
		ampm = 'AM',
		time;
			
	if (hh > 12) {
		h = hh - 12;
		ampm = 'PM';
	} else if (hh === 12) {
		h = 12;
		ampm = 'PM';
	} else if (hh == 0) {
		h = 12;
	}

	time = mm + '/' + dd + '/' + yyyy + ', ' + h + ':' + min + ':' + s + ' ' + ampm;
		
	return time;
}