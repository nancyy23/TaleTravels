

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/light-v10',
    center: campground.geometry.coordinates, 
    zoom: 9 
});

map.addControl(new mapboxgl.NavigationControl(), 'top-left');
const marker = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates, )
.setPopup(
    new mapboxgl.Popup({offset:29})
    .setHTML(`<h5><i>${campground.location}</i></h5>`)
)
.addTo(map);