# TG_Places

## Example
All the things!
http://tguefen.mivamerchantdev.com/mm5/merchant.mvc?Screen=find-us

## Features
- Import via Flat file
  - Import with the Place ID (Adds and Updates)
  - Import with Latitude, Longitude, and Name
    - Name is needed to do a keyword search (radius: 5)
- Add Places in Admin, using a Google Maps search
- Builds static file of all places, which has a the json structure
  - Currently `var places`
- Keeps track of when something was last updated (timestamp)
- Settings include the following:
  - Apikey
  - Auto activate places when adding in admin/ importing
- Item Components (yay!)
  - `<mvt:item name="tg_places" param="apikey( l.all_settings:places_key )"/>`
    - This will return the apikey to `l.settings:places_key` (or whatever variable is specified)
- `<mvt:item name="tg_places" param="PlacesFile( l.all_settings:places_file )"/>`
  - This will return the some variables to `l.settings:places_file`.
  - Members returned:
    - `:file_path` (/[ domain:mod_root ]/js/places.js)
    - `:script_tag` (`<script language="JavaScript" src="/[ domain:mod_root ]/js/places.js?v=1493130172"></script>`)
    - `:last_updated` (1493130172)
  
# TODOs
- Update File when Place is updated/ added
  - Keep button on batchlist just in case
- Add button to batchlist to 'Refresh' place with information from Google Places
  - Add warning that it will overwrite the following:
    - Name
    - Formatted Address
    - Geometry (lat/lng)
- Build "base" javascript file to have everything run
  - Create this file once on install (won't ever update)
  - Note to future self: INCLUDE CLUSTERING?? Will Justin feel dishonored?
  - Example from BBB
- Create "base" Page template (place-locator)
  - This will basically contain the references to the two javascript files, a div, a "form" & minimal styling (inline on the page)
