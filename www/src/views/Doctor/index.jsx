module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function () {
        return {
            patient:false,
            showDialog: false,
            receipts: [
                {name: "Paracetamol 500mg 50x", date: "12.04.2018"},
                {name: "Protozoen 50mg 10x", date: "21.09.2018"}
            ],
        }
    },
    created: function () {
        Vue.use(VueMaterial.default)
    },
    methods: {

    },
    components: {
        receipt: function (resolve) {
            require(['../Receipte/index.jsx'], resolve);
        }
    },
};