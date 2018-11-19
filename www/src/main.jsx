
import Vue from 'vue';
import $ from "jquery";


window.app = new Vue({
    el: '#app',
    // store: store,
    data: {
        rolle: "doctor",
    },

    mounted: function () {
        console.log("vue mounted ");

    },
    methods: {},

    computed: {},

    components: {
        patient: function (resolve) {
            require(['./views/Patient/index.jsx'], resolve)
        },
        doctor: function (resolve) {
            require(['./views/Doctor/index.jsx'], resolve)
        }


    }
});

