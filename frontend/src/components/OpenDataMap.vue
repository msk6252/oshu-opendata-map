<template>
  <div id="app">
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions(
  {
    iconUrl : require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl   : require( 'leaflet/dist/images/marker-icon-2x.png' ),
    shadowUrl       : require( 'leaflet/dist/images/marker-shadow.png' )
  }
)

export default {
  name: 'OpenDataMap',
  data() {
    return {
      path: 'https://script.google.com/macros/s/AKfycbzTPV0C4y8EV6JJ6gD8FGEGZAj4xggWerrVC9q8ZkFw_EmcvWSAKIaFWa8kthhG_mgCmg/exec'
    }
  },
  methods: {
    getMarker: () => {
      const request = {
        headers: { 'Content-Type': 'application/json' },
        response: true
      }
      axios.get(this.path, request).then(response => {
        console.log(response)
      }).catch(error => {
        console.log(error)
      })
      return [[39.19767, 141.188945],[39.195669, 141.188779],[39.154929, 141.359271]]
    }
  },
  mounted() {
    let map = L.map( 'app', { center: L.latLng( 39.14481501086482, 141.13926409203623 ), zoom: 12 } ).addLayer(
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
    )
    this.getMarker().forEach(ele => {
      let marker = map.addLayer( L.marker(ele) )
      map.on('click', (e) => {
        let popup = L.popup()
        popup
          .setLatLng(e.latlng)
          .setContent("<p>クリックで表示される</p>")
          .openOn(map)
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
html, body, #app { height: 100% }
body: { margin: 0 }
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
