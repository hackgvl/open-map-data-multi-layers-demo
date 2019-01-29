var Maps = (function () {
    var fs = require('fs'),
        path = require('path');
        const DATA_FILE_PATH = path.join(__dirname, "/data/");
        const MAPS_FILE_PATH = path.join(DATA_FILE_PATH, "map_data.json");
        console.log(fs);
    /*
    async function retrieveGeoJsonData(context) {
        let response, data;
        try {
            //response = await Vue.http.get('/public/geojson_data.json');
            console.log("Here we would get the data");
            response = {body:"meh"};
        } catch (ex) {
            console.err("Failed to retrieve GeoJson Data", ex);
            return;
        }

        if (response) {
            data = response.body;
        }
        return data;
    }
    */

    //Retrieve Geo JSON data from the file system
    function retrieveGeoJsonData(){
        let content = fs.readFileSync(MAPS_FILE_PATH, 'utf8');
        let geo_json_data = JSON.parse(content);
        return geo_json_data;
    }

    return {
        retrieveGeoJsonData: retrieveGeoJsonData,
    }

}());

export default Maps;