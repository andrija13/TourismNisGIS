// Leaflet map
var map;

// Layers
var adventureContentsLayer;
var churchesLayer;
var pathsLayer;
var souvernirsLayer;
var pointsInPathsLayer;
var organizationsLayer;
var restourantsLayer;
var culturalsLayer;
var vinariesLayer;
var landmarksLayer;

//Layers styles
var pathsStyle = { "color": "#000000", "weight": 3, "opacity": 1 };

//Layers name
const adventureContentsLayerName = "AvanturistickiSadrzaji";
const churchesLayerName = "CrkveManastiri";
const pathsLayerName = "Staze";
const souvernirsLayerName = "Suveniri";
const pointsInPathsLayerName = "TackeOdInteresaStaze";
const organizationsLayerName = "Udruzenja";
const restourantsLayerName = "UgostiteljskiObjekti";
const culturalsLayerName = "UstanoveKulture"; 
const vinariesLayerName = "Vinarije";
const landmarksLayerName = "Znamenitosti";

//Layer group
var layerGroup = new L.LayerGroup();

//Legend
var legend = L.control({ position: 'topright' });

//Properties
var lineProperties = [];
var pointProperties = [];
var polyProperties = [];

var mapLabelAndProperty = {
    vrsta: "Vrsta",
    vrsta_name: "Vrsta",
    vrsta_en: "Type",
    naziv: "Naziv",
    udruzenja: "Naziv",
    naziv_en: "Name",
    adresa: "Adresa/Address",
    kontakt: "Telefon/Phone",
    phone: "Telefon/Phone",
    e_mail: "Email",
    opis: "Opis",
    opis_en: "Description",
    website: "Website",
    web_site: "Website",
    kvalitet_m: "Markiranje/Marking",
    duzina: "Dužina/Length (km)",
    vreme: "Vreme/Time",
    tezina: "Težina/Difficulty",
    pocetna_ta: "Početna tačka/Start point (m)",
    zavrsna_ta: "Krajnja tačka/End point (m)",
    najniza_ta: "Najniža tačka/Lowest point (m)",
    najvisa_ta: "Najviša tačka/Highest point (m)",
    ukupna_vis: "Ukupna visina/Total height (m)",
    start: "Početak/Start",
    cilj: "Cilj/Goal",
    snabdeveno: "Voda/Water",
    vidikovci: "Vidikovci/Viewpoints",
    podloga: "Podloga/Surface",
    bezbednost: "Bezbedna/Secure",
    staza: "Naziv staze/Name of path",
    elevation: "Visina/Height (m)"
}

$(document).ready(function () {
    map = L.map('map').setView([43.323, 21.894700], 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | Podaci preuzeti sa <a target="_blank" href="https://data.gov.rs/sr/datasets/turizam/"><i>Portala otvorenih podataka Republike Srbije</i></a>'
    }).addTo(map);

    layerGroup.addTo(map);
    legend.addTo(map);

    L.control.locate({
        setView: false,
        showPopup: false,
        strings: {
            title: "Locate me"
        },
        circleStyle: {
            radius: 10
        }
    }).addTo(map);
});

function adventureContentChange() {
    if ($('#adventureContentCheck').is(':checked')) {
        callWFSService(adventureContentsLayer, null, adventureContentsLayerName, 'marker-avanturistickisadrzaji.png').then((res) => {
            adventureContentsLayer = res;
        });
    }
    else {
        layerGroup.removeLayer(adventureContentsLayer);
    }
}

function churchesChange() {
    if ($('#churchesCheck').is(':checked')) {
        callWFSService(churchesLayer, null, churchesLayerName, 'marker-crkvemanastiri.png').then((res) => {
            churchesLayer = res;
        });
    }
    else {
        layerGroup.removeLayer(churchesLayer);
    }
}

function pathsChange() {
    if ($('#pathsCheck').is(':checked')) {
        callWFSService(pathsLayer, pathsStyle, pathsLayerName, null).then((res) => {
            pathsLayer = res;

            callWFSService(pointsInPathsLayer, null, pointsInPathsLayerName, 'marker-tacke.png').then((res) => {
                pointsInPathsLayer = res;
            });
        });
    }
    else {
        layerGroup.removeLayer(pathsLayer);
        layerGroup.removeLayer(pointsInPathsLayer);
    }
}

function souvernisChange() {
    if ($('#souvernisCheck').is(':checked')) {
        callWFSService(souvernirsLayer, null, souvernirsLayerName, 'marker-suveniri.png').then((res) => {
            souvernirsLayer = res;
        });
    }
    else {
        layerGroup.removeLayer(souvernirsLayer);
    }
}

function organizationsChange() {
    if ($('#organizationsCheck').is(':checked')) {
        callWFSService(organizationsLayer, null, organizationsLayerName, 'marker-udruzenja.png').then((res) => {
            organizationsLayer = res;
        });
    }
    else {
        layerGroup.removeLayer(organizationsLayer);
    }
}

function restourantsChange() {
    if ($('#restourantsCheck').is(':checked')) {
        callWFSService(restourantsLayer, null, restourantsLayerName, 'marker-ugostiteljskiobjekti.png').then((res) => {
            restourantsLayer = res;
        });
    }
    else {
        layerGroup.removeLayer(restourantsLayer);
    }
}

function culturalsChange() {
    if ($('#culturalsCheck').is(':checked')) {
        callWFSService(culturalsLayer, null, culturalsLayerName, 'marker-kulturneustanove.png').then((res) => {
            culturalsLayer = res;
        });
    }
    else {
        layerGroup.removeLayer(culturalsLayer);
    }
}

function vinariesChange() {
    if ($('#vinariesCheck').is(':checked')) {
        callWFSService(vinariesLayer, null, vinariesLayerName, 'marker-vinarije.png').then((res) => {
            vinariesLayer = res;
        });
    }
    else {
        layerGroup.removeLayer(vinariesLayer);
    }
}

function landmarksChange() {
    if ($('#landmarksCheck').is(':checked')) {
        callWFSService(landmarksLayer, null, landmarksLayerName, 'marker-znamenitosti.png').then((res) => {
            landmarksLayer = res;
        });
    }
    else {
        layerGroup.removeLayer(landmarksLayer);
    }
}

/* COMMON FUNCTIONS BELLOW */
// Ajax call WFS service - GetFeature request
function callWFSService(layer, style, type, markerName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "http://localhost:8080/geoserver/GIS/wfs",
            data: {
                service: "WFS",
                version: "1.0.0",
                request: "GetFeature",
                typeName: type,
                outputFormat: "application/json",
                srsName: "epsg:4326",
            },
            dataType: "json",
            success: function (response) {
                if (response.features.length > 0) {
                    layer = L.geoJSON(response, {
                        style: style,
                        pointToLayer: function (feature, latlng) {
                            return createCustomMarker(markerName, feature, latlng);
                        },
                        onEachFeature: addPopup
                    });

                    layerGroup.addLayer(layer);
                    resolve(layer);
                }
                else {
                    alert('No results found.');
                }
            },
            error: function (error) {
                alert(error.responseText);
                reject(error);
            }
        })
    })
}

// Add popup to layer
function addPopup(feature, layer) {
    if (feature.properties != null) {
        var infoText = '';

        if (feature.properties.slika != null) {
            infoText += `<div style="text-align:center;margin-bottom: 5px;"><img src="${feature.properties.slika}" height="150px" width="200px"/></div>`;
        }

        for (const [key, value] of Object.entries(feature.properties)) {
            if (key != 'objectid' && key != 'slika' && key != 'predsednik' && key != 'izvor_poda' && key.indexOf('_sr') == -1 && value != null) {
                if (key == 'website' || key == 'web_site') {
                    var prefix = "";
                    if (value.indexOf('http') == -1) {
                        prefix = "//";
                    }

                    if (value == '/') {
                        infoText += `<b>${getLabelFromKey(key)}: </b>${value}<br>`;
                    }
                    else {
                        infoText += `<b>${getLabelFromKey(key)}: </b><a href="${prefix}${value}" target="_blank">link za opširnije...</a><br> `;
                    }
                }
                else if (key == 'phone' || key == 'kontakt') {
                    if (value == '/') {
                        infoText += `<b>${getLabelFromKey(key)}: </b>${value}<br>`;
                    }
                    else {
                        infoText += `<b>${getLabelFromKey(key)}: </b><a href="tel:${value}">${value}</a><br> `;
                    }
                }
                else if (key == 'e_mail') {
                    if (value == '/') {
                        infoText += `<b>${getLabelFromKey(key)}: </b>${value}<br>`;
                    }
                    else {
                        infoText += `<b>${getLabelFromKey(key)}: </b><a href="mailto:${value}">${value}</a><br> `;
                    }
                }
                else {
                    infoText += `<b> ${getLabelFromKey(key)}: </b> ${value} <br> `;
                }
            }
        }

        layer.bindPopup(infoText);
    }
}

// Get label name
function getLabelFromKey(key) {
    return mapLabelAndProperty[key];
}

// Custom marker to layer
function createCustomMarker(name, feature, latlng) {
        var myIcon = L.icon({
            iconUrl: 'markers/' + name,
            iconSize: [20, 38],
            iconAnchor: [10, 38],
            popupAnchor: [0, -38],
        })
        return L.marker(latlng, { icon: myIcon });
}

//Add Legend on MAP
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = `
        <div class="form-check form-switch">
            <div class="legend-tag">
                <img class="marker" src="markers/marker-znamenitosti.png" />
            </div>
            <input class="form-check-input" type="checkbox" onchange="landmarksChange()" id="landmarksCheck">
            <label class="form-check-label" for="flexSwitchCheckChecked">Znamenitosti</label>
        </div>
        <div class="form-check form-switch">
            <div class="legend-tag">
                <img class="marker" src="markers/marker-crkvemanastiri.png" />
            </div>
            <input class="form-check-input" type="checkbox" onchange="churchesChange()" id="churchesCheck">
            <label class="form-check-label" for="flexSwitchCheckChecked">Crkve i manastiri</label>
        </div>
        <div class="form-check form-switch">
            <div class="legend-tag">
                <img class="marker" src="markers/marker-kulturneustanove.png" />
            </div>
            <input class="form-check-input" type="checkbox" onchange="culturalsChange()" id="culturalsCheck">
            <label class="form-check-label" for="flexSwitchCheckChecked">Ustanove kulture</label>
        </div>
        <div class="form-check form-switch" style="margin-top: 5px;">
            <div class="legend-tag">
                <img class="marker" src="markers/marker-avanturistickisadrzaji.png" />
            </div>
            <input class="form-check-input" type="checkbox" onchange="adventureContentChange()" id="adventureContentCheck">
            <label class="form-check-label" for="flexSwitchCheckChecked">Avanturisticki sadržaj</label>
        </div>
        <div class="form-check form-switch">
            <div class="legend-tag">
                <img class="marker" src="markers/marker-ugostiteljskiobjekti.png" />
            </div>
            <input class="form-check-input" type="checkbox" onchange="restourantsChange()" id="restourantsCheck">
            <label class="form-check-label" for="flexSwitchCheckChecked">Ugostiteljski objekti</label>
        </div>
        <div class="form-check form-switch">
            <div class="legend-tag">
                <img class="marker" src="markers/marker-vinarije.png" />
            </div>
            <input class="form-check-input" type="checkbox" onchange="vinariesChange()" id="vinariesCheck">
            <label class="form-check-label" for="flexSwitchCheckChecked">Vinarije i proizvođači rakije</label>
        </div>
        <div class="form-check form-switch">
            <div class="legend-tag">
                <img class="marker" src="markers/marker-udruzenja.png" />
            </div>
            <input class="form-check-input" type="checkbox" onchange="organizationsChange()" id="organizationsCheck">
            <label class="form-check-label" for="flexSwitchCheckChecked">Udruženja</label>
        </div>
        <div class="form-check form-switch">
            <div class="legend-tag">
                <img class="marker" src="markers/marker-suveniri.png" />
            </div>
            <input class="form-check-input" type="checkbox" onchange="souvernisChange()" id="souvernisCheck">
            <label class="form-check-label" for="flexSwitchCheckChecked">Suvenirnice</label>
        </div>
        <div class="form-check form-switch">
            <div class="legend-tag">
                <img class="marker" src="stazeitacke.png" />
            </div>
            <input class="form-check-input" type="checkbox" onchange="pathsChange()" id="pathsCheck">
            <label class="form-check-label" for="flexSwitchCheckChecked">Staze i tačke od interesa</label>
        </div>`;
    return div;
}