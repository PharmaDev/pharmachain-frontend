

module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function () {
        return {
            patient: false,
            showDialog: false,
            receipts: [
                // {name: "Paracetamol 500mg 50x", date: "12.04.2018"},
                // {name: "Protozoen 50mg 10x", date: "21.09.2018"}
            ],
            med_name: "",
            med_dosage: "",
            med_qan: "",
            r_index:0,
        }
    },
    created: function () {
        Vue.use(VueMaterial.default)

        let self=this;

        $.ajax({
            type: 'GET',
            contentType: "application/json",
            Accept: "application/json",
            url: 'http://192.168.99.101:3000/api/de.pharmachain.Receipt',
            success: function (data) {
                console.log(data);
                data.forEach(function (d) {
                    console.log(d.prescription)
                    self.receipts.push({
                        name: d.prescription,
                        date: "20.11.2018"
                    });
                    self.r_index=d.id
                })
            },
            error: function (response) {
                console.log(response)
            }
        });


    },
    methods: {
        new_receipt: function () {

            let self=this;

            $.ajax({
                type: 'POST',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.99.101:3000/api/de.pharmachain.Receipt',
                data: JSON.stringify({

                    $class: "de.pharmachain.Receipt",
                    id:  "000"+ (parseInt(self.r_index)+1).toString(),
                    prescription: this.med_name + ' ' + this.med_dosage + ' ' + this.med_qan,
                    doctor: "resource:de.pharmachain.Doctor#1111",
                    patient: "resource:de.pharmachain.Patient#2222"

                }),
                success: function (data) {
                    self.receipts.push({
                        name: self.med_name + ' ' + self.med_dosage + ' ' + self.med_qan,
                        date: "20.11.2018"
                    })
                },
                error: function (response) {
                    console.log(response)
                }
            });



            this.showDialog = false
        }
    },
    components: {
        receipt: function (resolve) {
            require(['../Receipte/index.jsx'], resolve);
        }
    },
};