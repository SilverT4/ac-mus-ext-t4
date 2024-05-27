'use strict';
let apiKey;
let loc;
let lastSearch;

function get_settings() {
    chrome.storage.sync.get({
        WxApiKey: '',
        WxLocValue: 'auto:ip',
        WxLocType: 'local-ip',
        WxLatLong: ["51.50", "-0.12"], // The coordinates of London!
        WxIpAddr: "",
        WxUsZip: "10001", // A NYC zip code
        WxUkPostCode: "E1 7HT", // Uses a London postal code by default
        WxCanPostCode: "V5J", // Uses a Vancouver postal code by default
        WxMetarCode: "",
        WxIataCode: "LGA", // using laguardia
        WxLastSearch: ""
    }, items => {
        document.getElementById('wxapi-key').value = apiKey = items.WxApiKey;
        loc = items.WxLocValue;
        document.getElementById(items.WxLocType).checked = true;
        document.getElementById("latitude").value = items.WxLatLong[0];
        document.getElementById("longitude").value = items.WxLatLong[1];
        document.getElementById("us-zip").value = items.WxUsZip;
        document.getElementById("uk-post").value = items.WxUkPostCode;
        document.getElementById("ca-post").value = items.WxCanPostCode;
        document.getElementById("metar-code").value = items.WxMetarCode;
        document.getElementById("iata-code").value = items.WxIataCode;
        var ls = items.WxLastSearch ? items.WxLastSearch : "N/A";
        document.querySelector('label[for="last-used-search"]').innerHTML = "<span><span></span></span>Last used search location: " + ls;
        if (ls != "N/A") {
            document.getElementById("last-used-search").disabled = false;
            lastSearch = ls;
        }
    });
}

function save_settings() {
    let WxApiKey = apiKey;
    let WxLocValue = loc;
    let WxLocType = "local-ip";

    var pp = ['local-ip','ip-input','lat-lon','zip-code','uk-postal','canada-post','metar','iata'];

    for (egg in pp) {
        if (document.getElementById(egg).checked) {
            WxLocType = egg;
            break;
        }
    }

    let [lat, long] = [document.getElementById("latitude").value, document.getElementById("longitude").value];
    let WxLatLong = [lat, long];
    let WxIpAddr = document.getElementById("ip-address").value;
    let WxUsZip = document.getElementById("us-zip").value;
    let WxUkPostCode = document.getElementById("uk-post").value;
    let WxCanPostCode = document.getElementById("ca-post").value;
    let WxMetarCode = document.getElementById("metar-code").value;
    let WxIataCode = document.getElementById("iata-code").value;
    var piss = document.getElementById("search-query").value; // search query box value
    let WxLastSearch = piss ? piss : "N/A";

    chrome.storage.sync.set({
        WxApiKey,
        WxLocValue,
        WxLocType,
        WxLatLong,
        WxIpAddr,
        WxUsZip,
        WxUkPostCode,
        WxCanPostCode,
        WxMetarCode,
        WxIataCode,
        WxLastSearch
    });
}
function update_location() {
    // gotta add onclicks
    let LocationType = "";
    let pp = document.querySelectorAll('input[name="location-type"]');

    pp.forEach(element => {
        var id = element.id;
        if (element.checked) LocationType = id;
    });

    var locationTypes = ["local-ip", "ip-input", "lat-long", "zip-code", "uk-postal", "canada-post", "metar", "iata", "search", "last-used-search"];
    
    switch (LocationType) {
        case 'local-ip':
            loc = 'auto:ip';
            return;
        case 'ip-input':
            loc = document.getElementById("ip-address").value;
            return;
        case 'lat-long':
            let [lat, long] = [document.getElementById('latitude').value, document.getElementById('longitude').value];
            loc = `${lat},${long}`;
            return;
        case 'zip-code':
            loc = document.getElementById("us-zip").value;
            return;
        case 'uk-postal':
            loc = document.getElementById("uk-post").value;
            return;
        case 'canada-post':
            loc = document.getElementById('ca-post').value;
        case 'metar':
            loc = `metar:${document.getElementById('metar-code').value}`;
        case 'iata':
            loc = `iata:${document.getElementById('iata-code').value}`;
        case 'search':
            // nothing until i figure out search lmao
        case 'last-used-search':
            loc = lastSearch;
        default:
            loc = 'auto:ip';
    }
    loc = 'auto:ip'; // In case 
}
function get_weather() {
    apiKey = document.getElementById("wxapi-key").value;
    let url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${loc}`;

}

get_settings();