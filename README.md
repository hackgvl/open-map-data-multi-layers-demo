# open_data_gvl

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


### Updating Map Data
```
Map data is not updated automatically yet. There is a python script included which will scrape
the https://data.openupstate.org website for Greenville-related GeoJSON map data. With Python
installed, you can manually run the scraper and update the map data with the following command:

python retrieve_map_data.py > data/map_data.json

This would ideally be automatic, but the script needs to be more efficient and generate less web
traffic on data.openupstate.org
```




### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
