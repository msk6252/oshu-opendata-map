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
      path: 'https://880ekvckqk.execute-api.ap-northeast-1.amazonaws.com/production/?info=SHELTER',
      responseData: []
    }
  },
  methods: {
    getData: async function() {
      const request = {
        headers: { 'Content-Type': 'application/json' },
        response: true
      }
      await axios.get(this.path, request).then(response => {
        this.responseData = response.data
      }).catch(error => {
        console.log(error)
      })
    }
  },
  async mounted() {
    let map = L.map( 'app', {
                              center: [39.14481501086482, 141.13926409203623],
                              closePopupOnClick: false,
                              zoom: 12
                            } )

    let osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: "<a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
    })
    osm.addTo(map)

    await this.getData()
    await this.responseData.forEach(ele => {
      let popup = L.popup({
        autoClose: false
      })
      popup.setContent(
                       `<h4>${ele.name}</h4>` +
                       `推定収容人数: ${ele.capacity == 0 ? '不明' : ele.capacity + '人'}<br />` +
                       `海抜: ${ele.ele}m<br />` +
                       `住所: <a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${ele.lat},${ele.lon}">${ele.address}`
                       )
      let marker = L.marker([ele.lat, ele.lon])
      marker.bindPopup(popup)
      marker.addTo(map)
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
