var md5 = require('js-md5');
var moment = require('moment');

module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function () {
        return {
            // TODO remove demo value
            doctor_id_preset: "doc_0001",
            patient_id_preset: "p_0001",
            doctor_id: "doc_0001",
            patient: {
                is_signed_in: false,
                id: "p_0001",
                firstName: null,
                lastName: null,
                money: null,
                insurance: null,
                birthday: null,
                def_street: null,
                def_city: null,
                def_plz: null,
            },
            showDialog: false,
            receipts: [],
            insurance: null,
            new_prescription: {
                name: "",
                dosage: "",
                quantity: "",
            },
            medications: [{
                    name: "Paracetamol",
                    dosages: ["250 mg", "500 mg"],
                    quantities: ["25x", "50x", "100x"]
                },
                {
                    name: "Ibuprofen",
                    dosages: ["200 mg", "400 mg", "600 mg", "800 mg"],
                    quantities: ["50x", "100x", "200x"]
                },
                {
                    name: "Ampicillin ",
                    dosages: ["1000 mg", "2000 mg"],
                    quantities: ["10x", "15x"]
                },
                {
                    name: "Clindamycin ",
                    dosages: ["150 mg", "300 mg", "600 mg"],
                    quantities: ["5x", "10x"]
                }
            ]
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
                url: window.baseUrl + '/api/de.pharmachain.Patient',
                success: function (data) {
                    data.forEach(function (patient) {
                        if (self.patient.id === patient.id) {
                            console.log(patient);
                            self.patient = patient;
                            self.patient.birthday = moment(patient.birthday).format('L');
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
                id: "p_0001",
                firstName: null,
                lastName: null,
                money: null,
                insurance: null
            };
            this.receipts = [];
            this.clear_new_prescription();
        },
        clear_new_prescription: function () {
            this.new_prescription = {
                name: "",
                dosage: "",
                quantity: "",
            }
        },
        get_patient_insurance: function () {
            // TODO would be nice
        },
        get_doctor: function () {
            // TODO would be really, really nice #2
        },
        get_patient_receipts: function () {

            let self = this;

            $.ajax({
                type: 'GET',
                contentType: "application/json",
                Accept: "application/json",
                url: window.baseUrl + '/api/de.pharmachain.Receipt',
                success: function (data) {
                    self.receipts = [];
                    data.forEach(function (receipt) {
                        if (receipt.patient.indexOf(self.patient.id) !== -1) {
                            receipt.createdAt_moment = moment(receipt.createdAt).format('L');
                            self.receipts.push(receipt);
                        }
                    })
                    self.receipts = self.receipts.reverse();
                },
                error: function (response) {
                    console.log(response)
                }
            });
        },
        get_date_time() {
            var d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear(),
                hours = d.getHours(),
                minute = d.getMinutes(),
                second = d.getSeconds();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-') + ' ' + [hours, minute, second].join(':');
        },
        new_receipt: function () {
            if (this.new_prescription.name === "") {
                alert("Please specify the medication!")
            } else if (this.new_prescription.dosage === "") {
                alert("Please specify the dosage!")
            } else if (this.new_prescription.quantity === "") {
                alert("Please specify the quantity!")
            } else {

                let self = this;
                $.ajax({
                    type: 'POST',
                    contentType: "application/json",
                    Accept: "application/json",
                    url: window.baseUrl + '/api/de.pharmachain.Receipt',
                    data: JSON.stringify({
                        $class: "de.pharmachain.Receipt",
                        id: md5(self.new_prescription.name + ' ' + self.new_prescription.dosage + ' ' + self.new_prescription.quantity + Date.now().toString()),
                        // prescription: self.new_prescription.name + ' ' + self.new_prescription.dosage + ' ' + self.new_prescription.quantity + ' ' + self.get_date_time(),
                        stateChangeAt: Date.now(),
                        createdAt: Date.now(),
                        name: self.new_prescription.name,
                        dosage: self.new_prescription.dosage,
                        quantity: self.new_prescription.quantity,
                        // TODO validate
                        doctor: "resource:de.pharmachain.Doctor#" + self.doctor_id,
                        patient: "resource:de.pharmachain.Patient#" + self.patient.id

                    }),
                    success: function (data) {
                        self.get_patient_receipts();
                        self.clear_new_prescription();
                    },
                    error: function (response) {
                        console.log(response)
                        alert('Error: POST /api/de.pharmachain.Receipt')
                    }
                });
                this.showDialog = false
            }
        },
        get_dosages: function () {
            let d = [];
            for (let i = 0; i < this.medications.length; i++) {
                if (this.medications[i].name.toString() === this.new_prescription.name) {
                    for (let j = 0; j < this.medications[i].dosages.length; j++) {
                        d.push(this.medications[i].dosages[j]);
                    }
                }
            }
            return d;
        },
        get_quantities: function () {
            let q = [];
            for (let i = 0; i < this.medications.length; i++) {
                if (this.medications[i].name.toString() === this.new_prescription.name) {
                    for (let j = 0; j < this.medications[i].quantities.length; j++) {
                        q.push(this.medications[i].quantities[j]);
                    }
                }
            }
            return q;
        },
    },
    components: {
        receipt: function (resolve) {
            require(['../Receipte/index.jsx'], resolve);
        }
    },
};