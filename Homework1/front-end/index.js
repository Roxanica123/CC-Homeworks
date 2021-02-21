const mock_data = '{"map_info":{"summary":{"sourcePoint":{"lat":50.9497,"lon":-106.6606},"targetPoint":{"lat":47.17410007862509,"lon":27.575072050094604}},"result":{"distanceInMeters":8267507.34}},"tweet_id":"1362823946148732931"}'
const my_tweet_embded = '<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">I wonder where the International Space Station might be right now 🤔🚀.</p>&mdash; Roxanica (@Roxanica9) <a href="https://twitter.com/Roxanica9/status/1362823946148732931?ref_src=twsrc%5Etfw">February 19, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'


async function load_data() {

    const xmlRequest = new XMLHttpRequest();
    xmlRequest.onload = () => {
        load_map(xmlRequest.response);
    }
    xmlRequest.open("GET", "http://localhost:5000/home");
    xmlRequest.send()
}

function load_map(data) {
    const data_json = JSON.parse(data)
    const tweet_id = data_json.tweet_id; 
    const iss_location = [data_json.map_info.summary.sourcePoint.lat, data_json.map_info.summary.sourcePoint.lon];
    const my_location = [data_json.map_info.summary.targetPoint.lat, data_json.map_info.summary.targetPoint.lon];
    const center = [(iss_location[0]+my_location[0])/2, (iss_location[1]+my_location[1])/2];
    const distance = data_json.map_info.result.distanceInMeters;
    console.log(tweet_id, iss_location, my_location);
    console.log(data_json)

    var mymap = L.map('mapid').setView(center, 3);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/dark-v10',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

    const myIcon = L.icon({
        iconUrl: 'my-icon.png',
        iconSize: [95, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });

    const myPopup = L.popup()
        .setContent(my_tweet_embded);

    const issIcon = L.icon({
        iconUrl: 'iss.png',
        iconSize: [95, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });

    const issPopup = L.popup().setContent(`It's location is ${iss_location[0]}, ${iss_location[1]}.\nIt's ${distance/1000} kilometers away!`)

    const myMarker = L.marker(my_location, { icon: myIcon }).addTo(mymap);
    myMarker.bindPopup(myPopup);
    const issMarker = L.marker(iss_location, { icon: issIcon }).addTo(mymap);
    issMarker.bindPopup(issPopup);


}

load_map(mock_data)