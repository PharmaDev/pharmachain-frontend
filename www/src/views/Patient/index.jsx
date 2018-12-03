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
                // {name: "Paracetamol 500mg 50x", date: "12.04.2018"},
                // {name: "Protozoen 50mg 10x", date: "21.09.2018"}
            ],
            offers: [
                {name: "Paracetamol 500mg 50x", date: "40 min", dist: "1.3km"},
                // {name: "Protozoen 50mg 10x", date: "21.09.2018", dist: "500m"}
            ],
            status: "active",
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
        set_patient(){
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
        },
        acceptOrder(){
            let self = this;
            this.showDialogOffer = false

            $.ajax({
                type: 'POST',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.OfferAccepted',
                data: JSON.stringify({
                    $class: "de.pharmachain.OfferAccepted",
                    receipt: "resource:de.pharmachain.Receipt#0001",
                    acceptedOffer: "resource:de.pharmachain.Offer#0009"
                }),
                success: function (data) {
                    console.log(data)
                },
                error: function (response) {
                    console.log(response)
                }
            });
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
            if (activeTab !== 'tab-offers' && !this.checkInterval) {
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