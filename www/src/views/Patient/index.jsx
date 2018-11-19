module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function () {
        return {
            receipts: [
                "Paracetamol 500mg 50x",
                "Protozoen 50mg 10x",
                "Vitamins 10mg 5x",


            ],
            menu: "Receipts"
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