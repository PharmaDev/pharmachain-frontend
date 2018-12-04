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
            receipts: [
                {id: "xxx", name: "Paracetamol 500mg 50x", date: "12.04.2018"},

            ],

            open_receipt_ids: [],
            receipts_archive: [],
            archive_receipt_ids: [],
            open_offers: [
                // {id: "xxx", name: "Paracetamol 500mg 50x", date: "40 min", dist: "1.3km"},
            ],
            // offer_choosing:{
            //
            // },
            offer_view: "active",
            showDialog: false,
            selectedReceipt: null,
            newPosts: 0,
            currentTab: "tab-receipts",
            showDialogOffer: false,
            selectedOffer: null,
            post_code: "",
            city: "",
            street: ""
        }
    },
    created: function () {
        this.checkNewPosts();

        this.clear_patient();


    },
    methods: {
        set_patient() {
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
            this.receipts_archive = [];
            this.open_receipt_ids = [];
            this.receipts_archive = [];
            this.offers = [];
            this.status = "active";
        },

        get_patient_receipts: function () {
            console.log("get_patient_receipts()");

            let self = this;
            $.ajax({
                type: 'GET',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.Receipt',
                success: function (data) {
                    self.receipts = [];
                    self.receipts_archive = [];
                    self.open_receipt_ids = [];
                    self.receipts_archive = [];
                    console.log("receipt", data)
                    data.forEach(function (receipt) {
                        if (receipt.patient.indexOf(self.patient.id) !== -1) {
                            if (receipt.state === "open") {
                                self.open_receipt_ids.push(receipt.id)
                                self.receipts.push({
                                    id: receipt.id,
                                    name: receipt.prescription,
                                    date: "20.11.2018"
                                });
                            } else {
                                self.archive_receipt_ids.push(receipt.id)
                                self.receipts_archive.push({
                                    id: receipt.id,
                                    name: receipt.prescription,
                                    date: "20.11.2018"
                                });

                            }
                        }
                    });
                    self.get_patient_offers();
                },
                error: function (response) {
                    console.log(response)
                }
            });
        },
        get_patient_offers: function () {
            console.log("get_patient_offers()");

            let self = this;
            $.ajax({
                type: 'GET',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.Offer',
                success: function (data) {

                    self.open_offers = [];
                    data.forEach(function (offer) {

                        console.log("x1", self.open_receipt_ids.includes(offer.receipt.split('#')[1]), offer.receipt.split('#')[1]);

                        if (self.open_receipt_ids.includes(offer.receipt.split('#')[1])) {
                            self.open_offers.push({
                                id: offer.id,
                                name: offer.description,
                                date: "20.11.2018",
                                dist: offer.delivery,
                                insuranceCost: 3,
                                patientCost: 3,
                                pharmacy: offer.pharmacy.split('#')[1],
                                receipt: offer.receipt
                            });
                        }


                    })
                },
                error: function (response) {
                    console.log(response)
                }
            });
        },
        post_OfferAccepted(value) {
            console.log("post_OfferAccepted", value)

            let self = this;
            $.ajax({
                type: 'POST',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.OfferAccepted',
                data: JSON.stringify({
                    $class: "de.pharmachain.OfferAccepted",
                    receipt: value.receipt,
                    acceptedOffer: "resource:de.pharmachain.Offer#" + value.id
                }),
                success: function (data) {
                    self.showDialogOffer = false
                    self.get_patient_receipts();
                },
                error: function (response) {
                    console.log(response)
                }
            });
        },
        selectOption(value) {
            console.log(value)

            this.showDialog = true;
            this.selectedReceipt = value;

        },
        saveOption() {
            let self = this;
            $.ajax({
                type: 'POST',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.PositionSelection',
                data: JSON.stringify({
                    $class: "de.pharmachain.PositionSelection",
                    receipt: "resource:de.pharmachain.Receipt#0001",
                    deliveryStreet: self.street,
                    deliveryCity: self.city,
                    deliveryPostal: self.post_code
                }),
                success: function (data) {
                    console.log(data)
                },
                error: function (response) {
                    console.log(response)
                }
            });

            this.showDialog = false;
        },
        selectOffer(value) {
            this.showDialogOffer = true;
            this.selectedOffer = value;

        },
        reload() {
            this.showDialog = false;
            this.selectedReceipt = null;
        },
        changeTab(newTab) {
            this.clearNewPosts();
            this.currentTab = newTab;
        },
        clearCheckPosts() {
            window.clearInterval(this.checkInterval)
            this.checkInterval = null
        },
        clearNewPosts() {
            this.clearCheckPosts()
            this.newPosts = 0
        },
        checkNewPosts(activeTab) {
            if (activeTab !== 'tab-open_offers' && !this.checkInterval) {
                this.checkInterval = window.setInterval(() => {
                    if (this.newPosts === 99) {
                        this.newPosts = '99+'
                        this.clearCheckPosts()
                    } else {
                        this.newPosts++
                    }
                }, 1000)
            }
        }
    },
    components: {
        receipt: function (resolve) {
            require(['../Receipte/index.jsx'], resolve);
        },
        offer: function (resolve) {
            require(['../Offer/index.jsx'], resolve);
        }
    },
};