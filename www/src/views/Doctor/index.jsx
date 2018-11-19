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
            receipt_in: false,
            receipt_input: ""
        }
    },
    created: function () {

    },
    methods: {
        new_receipt: function () {
            this.receipts.push(this.receipt_input);
            this.receipt_input="";
            this.receipt_in= false;

        },
        cancel_receipt: function () {
            this.receipt_input="";
            this.receipt_in= false;

        }
    },
    components: {
        receipt: function (resolve) {
            require(['../Receipte/index.jsx'], resolve);
        }
    },
};