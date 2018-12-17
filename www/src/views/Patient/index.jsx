var moment = require('moment');

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
            receipts_open: [],
            receipts_archive: [],
            receipts_progress: [],
            receipts_progress_ids: function () {
                return this.receipts_progress.map(receipt => receipt.id);
            },
            open_offers: [],
            status: "open",
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
        // TODO refactor, this exists in doctor already!
        set_patient() {
            let self = this;
            $.ajax({
                type: 'GET',
                contentType: "application/json",
                Accept: "application/json",
                url: window.baseUrl + '/api/de.pharmachain.Patient',
                success: function (data) {
                    data.forEach(function (patient) {
                        if (self.patient.id === patient.id) {
                            self.patient = patient;
                            self.patient.birthday = moment(patient.birthday).format('L');
                            self.patient.is_signed_in = true;
                            console.log(JSON.stringify(patient));
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
            // rece
            this.receipts_open = [];
            this.receipts_archive = [];
            this.receipts_progress = [];
            this.offers = [];
            this.status = "open";
        },

        // TODO Move to utility class, as it is used my multiple views
        get_patient_receipts: function () {
            console.log("get_patient_receipts()");

            let self = this;
            $.ajax({
                type: 'GET',
                contentType: "application/json",
                Accept: "application/json",
                url: window.baseUrl + '/api/de.pharmachain.Receipt',
                success: function (data) {
                    self.receipts_open = [];
                    self.receipts_archive = [];
                    self.receipts_progress = [];
                    data.forEach(function (receipt) {
                        // TODO remove after authentication is implemented
                        if (receipt.patient.indexOf(self.patient.id) !== -1) {
                            receipt.createdAt_moment = moment(receipt.createdAt).format('L');
                            if (receipt.state === "open") {
                                self.receipts_open.push(receipt);
                            } else if (receipt.state === "progress") {
                                self.receipts_progress.push(receipt);
                            } else {
                                self.receipts_archive.push(receipt);
                            }
                        }
                    });
                    // TODO refactor with jquery .then for readability
                    self.get_patient_offers();
                },
                error: function (response) {
                    console.log(response)
                }
            });
        },
        // TODO Utility class
        get_patient_offers: function () {
            console.log("get_patient_offers()");
            let self = this;
            $.ajax({
                type: 'GET',
                contentType: "application/json",
                Accept: "application/json",
                url: window.baseUrl + '/api/de.pharmachain.Offer',
                success: function (data) {
                    self.open_offers = [];
                    data.forEach(function (offer) {
                        // if offer matches an receipt TODO remove after auth
                        // pharmacy: offer.pharmacy.split('#')[1],
                        if (self.receipts_progress_ids().includes(offer.receipt.split('#')[1])) {
                            self.open_offers.push(offer);
                        }
                    });
                },
                error: function (response) {
                    console.log(response)
                }

            });
        },
        post_OfferAccepted(value) {
            console.log("post_OfferAccepted", JSON.stringify(value));

            let self = this;
            $.ajax({
                type: 'POST',
                contentType: "application/json",
                Accept: "application/json",
                url: window.baseUrl + '/api/de.pharmachain.OfferAccepted',
                data: JSON.stringify({
                    $class: "de.pharmachain.OfferAccepted",
                    receipt: value.receipt,
                    acceptedOffer: "resource:de.pharmachain.Offer#" + value.id,
                    ts: Date.now()
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
        /**
         * 
         */
        selectOption(value) {
            console.log(value);
            this.showDialog = true;
            this.selectedReceipt = value;
            this.street = this.patient.def_street;
            this.city = this.patient.def_city;
            this.post_code = this.patient.def_plz;
        },
        saveOption() {
            let self = this;
            $.ajax({
                type: 'POST',
                contentType: "application/json",
                Accept: "application/json",
                url: window.baseUrl + '/api/de.pharmachain.PositionSelection',
                data: JSON.stringify({
                    $class: "de.pharmachain.PositionSelection",
                    receipt: "resource:de.pharmachain.Receipt#" + self.selectedReceipt.id,
                    deliveryStreet: self.street,
                    deliveryCity: self.city,
                    deliveryPostal: self.post_code,
                    ts: Date.now()
                }),
                success: function (data) {
                    console.log(data)
                },
                error: function (response) {
                    console.log(response)
                }
            });

            this.showDialog = false;
            // TODO auto reload show changes instantly
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