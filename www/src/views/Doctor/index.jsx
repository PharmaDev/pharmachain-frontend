var md5 = require('js-md5');

module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function () {
        return {
            patient: {
                is_signed_in: false,
                id: null,
                firstName: null,
                lastName: null,
                money: null,
                insurance: null
            },
            showDialog: false,
            receipts: [],
            new_prescription: {
                name: "",
                dosage: "",
                qan: "",
            },
        }
    },
    created: function () {
        Vue.use(VueMaterial.default)

        this.clear_patient();
    },
    methods: {
        set_patient: function () {
            let self = this;
            $.ajax({
                type: 'GET',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.Patient',
                success: function (data) {
                    data.forEach(function (patient) {
                        if (self.patient.id === patient.id) {
                            self.patient.firstName = patient.firstName;
                            self.patient.lastName = patient.lastName;
                            self.patient.money = patient.money;
                            self.patient.insurance = patient.insurance;
                            self.patient.is_signed_in = true;
                            self.get_patient_receipts();
                        }
                    });

                    if (self.patient.is_signed_in === false) {
                        alert('Error: GET /api/de.pharmachain.Patient');
                        self.clear_patient();
                    }

                },
                error: function (response) {
                    console.log(response)
                }
            });
        },
        clear_patient: function () {
            this.patient = {
                is_signed_in: false,
                id: 'p_0001',
                firstName: null,
                lastName: null,
                money: null,
                insurance: null
            };
            this.receipts = [];
            this.new_prescription = {
                name: "",
                dosage: "",
                qan: "",
            }
        },
        get_patient_receipts: function () {
            this.receipts = [];
            let self = this;

            $.ajax({
                type: 'GET',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.Receipt',
                success: function (data) {
                    data.forEach(function (receipt) {
                        if (receipt.patient.indexOf(self.patient.id) !== -1) {
                            self.receipts.push({
                                name: receipt.prescription,
                                date: "20.11.2018"
                            });
                        }

                    })
                },
                error: function (response) {
                    console.log(response)
                }
            });
        },
        new_receipt: function () {
            let self = this;
            $.ajax({
                type: 'POST',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.Receipt',
                data: JSON.stringify({

                    $class: "de.pharmachain.Receipt",
                    id: md5(self.new_prescription.name + ' ' + self.new_prescription.dosage + ' ' + self.new_prescription.qan + Date.now().toString()),
                    prescription: self.new_prescription.name + ' ' + self.new_prescription.dosage + ' ' + self.new_prescription.qan,
                    doctor: "resource:de.pharmachain.Doctor#doc_0001",
                    patient: "resource:de.pharmachain.Patient#" + self.patient.id

                }),
                success: function (data) {
                    self.get_patient_receipts();
                    self.new_prescription = {
                        name: "",
                        dosage: "",
                        qan: "",
                    }
                },
                error: function (response) {
                    console.log(response)
                    alert('Error: POST /api/de.pharmachain.Receipt')
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