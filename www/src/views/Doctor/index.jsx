module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function () {
        return {
            patient:false,
            receipts: [
                "Paracetamol 500mg 50x",
                "Protozoen 50mg 10x",
                "Vitamins 10mg 5x",
                "Vitamins 20mg 5x"
            ],
        }
    },
    created: function () {

    },
    methods: {

    },
    components: {
        receipt: function (resolve) {
            require(['../Receipte/index.jsx'], resolve);
        }
    },
};