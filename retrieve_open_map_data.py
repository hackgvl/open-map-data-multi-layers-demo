#Retrieve map layer data from data.openupstate.org
#
#TODOS:
#   ~If implemented in browser, cache data for each layer retrieved.
#       ?Give the option to update via a button eventually?
#   
#

import requests
import time
import json
from bs4 import BeautifulSoup
from bs4 import SoupStrainer

BASE_URL = "https://data.openupstate.org"
MAP_URL_DIRECTORY = "/map/"
geo_json_collection = {}

geojson_url_exceptions = {
    'co-working-spaces': 'coworking-spaces',
    'go-karts-mini-golf-and-arcades': 'go-karts-mini-golf-arcades',
    'schools-k12': 'ib-schools-k12',
    'quilting-quilds': 'quilting-guilds'
}

def retrieve_json_blob(url):
    map_category_page = requests.get(url)
    return json.loads(map_category_page.text) 

def pull_geojson_from_json(blob):
    for category in blob:
        if 'field_geojson_link' in category.keys():
            print(category['field_geojson_link'])
            internal_url = category['field_geojson_link'][0]['uri'].replace('internal:','')
            geojson_url = BASE_URL + internal_url
            print(geojson_url)
            geojson_page = requests.get(geojson_url)
            if (geojson_page.status_code == 200 and geojson_page.text is not None):
                print(geojson_page.text)

#map_layer_url = BASE_URL + '/map-layers'
#map_categories = web(1, map_layer_url)
#print(json.dumps(map_categories))

json_blob_url = "https://data.openupstate.org/rest/maps?_format=json"
map_data = retrieve_json_blob(json_blob_url)
pull_geojson_from_json(map_data)

#Retrieve map category URL
def retrieve_map_category_urls(url):
    map_layer_url = BASE_URL + 'map-layers'
    map_categories = web(1, map_layer_url)
    for map_category in map_categories:
        map_category_url = map_category
        #Don't want to spam the server too quickly
        time.sleep(5)
        map_category_page = requests.get(map_category_url)
        geojson_link_anchor = s.select(".field--name-field-geojson-link a")
        geojson_link_anchor.text