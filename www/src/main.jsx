
import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

window.baseUrl = 'http://localhost:3000';

window.app = new Vue({
    el: '#app',
    // store: store,
    data: {
        rolle: null,
        currentRoute: window.location.href.split("/").slice(-1)[0]
    },

    mounted: function () {
        console.log("vue mounted ");
        Vue.use(VueMaterial)

    },
    methods: {},

    computed: {},

    components: {
        patient: function (resolve) {
            require(['./views/Patient/index.jsx'], resolve)
        },
        doctor: function (resolve) {
            require(['./views/Doctor/index.jsx'], resolve)
        },
        pharmacy: function (resolve) {
            require(['./views/Pharmacy/index.jsx'], resolve)
        }


    }
});

