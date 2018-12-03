var md5 = require('js-md5');
var numeral = require("numeral");
module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function () {
        return {
            pharmacy: {
                is_signed_in: false,
                id: null,
                name: null,
                money: null

            },
            open_receipts: [
                // {id: "xxx"
                // description: "Paracetamol 500mg 50x",
                // date: "12.04.2018",
                // dist: "1.3km"},
            ],

            new_offer: {
                selectedReceipt: null,
                manufacturer: null,
                delivery: null,
                insuranceCost: null,
                patientCost: null

            },
            offer_manufacturers: [
                "Bayer",
                "Lilly",
                "Pfizer"
            ],
            offers: [
                // {id: "xxx",
                // description: "Paracetamol 500mg 50x",
                // details: "details",
                // address: "address",
                // delivery: "delivery info"},
            ],
            offer_receipts_ids: [],
            billings: [
                {description: "Paracetamol 500mg 150x", details: "Bayer", address: "address", price: "20 Euro"},
            ],
            status: "active",
            showDialog: false,
            // selectedReceipt: null,
            newPosts: 0,
            currentTab: "tab-receipts",
            showDialogOrder: false,
            selectedOrder: null,
            selectedYears: [2018, 2017],
            datasets: {
                2018: {
                    label: 'Paracetamol',
                    borderColor: 'rgba(50, 115, 220, 0.5)',
                    backgroundColor: 'rgba(50, 115, 220, 0.1)',
                    data: [300, 700, 450, 750, 450]
                },
                2017: {
                    label: 'Protozoan',
                    borderColor: 'rgba(255, 56, 96, 0.5)',
                    backgroundColor: 'rgba(255, 56, 96, 0.1)',
                    data: [600, 550, 750, 250, 700]
                }
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: value => numeral(value).format('$0,0')
                        }
                    }]
                },
                tooltips: {
                    mode: 'index',
                    callbacks: {
                        label(tooltipItem, data) {
                            const label = data.datasets[tooltipItem.datasetIndex].label;
                            const value = numeral(tooltipItem.yLabel).format('$0,0');
                            return `${label}: ${value}`;
                        }
                    }
                }
            }
        }
    },
    created: function () {
        this.checkNewPosts()
        this.clear_pharmacy();


    },
    methods: {
        get_offers: function () {
            console.log('get_Offer()');

            let self = this;
            $.ajax({
                type: 'GET',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.Offer',
                success: function (data) {
                    self.offers = [];
                    self.offer_receipts_ids = [];
                    data.forEach(function (offer) {
                        if (offer.pharmacy.indexOf(self.pharmacy.id) !== -1) {
                            self.offer_receipts_ids.push(offer.receipt.split('#')[1]);
                            self.offers.push({
                                id: offer.id,
                                description: offer.description,
                                insuranceCost: 10,
                                patientCost: 10,
                                details: "details",
                                address: "address",
                                delivery: "delivery info"
                            });
                        }

                    });
                    self.get_open_receipts();
                },
                error: function (response) {
                    console.log(response)
                }
            });
        },
        get_open_receipts: function () {
            console.log('get_open_receipts()');

            let self = this;

            $.ajax({
                type: 'GET',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.Receipt',
                success: function (data) {
                    self.open_receipts = [];
                    data.forEach(function (receipt) {
                        if (receipt.state === 'open') {
                            if (!self.offer_receipts_ids.includes(receipt.id)) {
                                self.open_receipts.push({
                                    id: receipt.id,
                                    description: receipt.prescription,
                                    date: "20.11.2018",
                                    dist: "1 km"
                                });
                            }
                        }
                    })
                },
                error: function (response) {
                    console.log(response)
                }
            });
        },
        set_pharmacy() {
            let self = this;
            $.ajax({
                type: 'GET',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.Pharmacy',
                success: function (data) {
                    data.forEach(function (pharmacy) {
                        if (self.pharmacy.id === pharmacy.id) {
                            self.pharmacy.name = pharmacy.name;
                            self.pharmacy.money = pharmacy.money;
                            self.pharmacy.is_signed_in = true;
                            self.get_offers();
                        }
                    });

                    if (self.pharmacy.is_signed_in === false) {
                        alert('Error: GET /api/de.pharmachain.Pharmacy');
                        self.clear_pharmacy();
                    }

                },
                error: function (response) {
                    console.log(response)
                }
            });
        },
        clear_pharmacy: function () {
            this.pharmacy = {
                is_signed_in: false,
                id: 'pha_0001',
                name: null,
                money: null,

            };
            this.receipts = [];
        },
        post_offer() {
            this.showDialogOrder = false;

            let self = this;
            console.log('post_offer()')
            $.ajax({
                type: 'POST',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.Offer',
                data: JSON.stringify({
                    $class: "de.pharmachain.Offer",
                    id: md5(Date.now().toString()),
                    description: self.new_offer.selectedOrder.description + ' von ' + self.new_offer.manufacturer + '; ' + self.pharmacy.name,
                    delivery: self.new_offer.delivery,
                    insuranceCost: parseInt(self.new_offer.patientCost),
                    patientCost: parseInt(self.new_offer.patientCost),
                    pharmacy: "resource:de.pharmachain.Pharmacy#" + self.pharmacy.id,
                    receipt: "resource:de.pharmachain.Receipt#" + self.new_offer.selectedOrder.id

                }),
                success: function (data) {
                    self.get_offers();
                },
                error: function (response) {
                    console.log(response)
                }
            });
        },
        delete_offer: function (value) {
            console.log("delete_offer()");

            let self = this;
            $.ajax({
                type: 'DELETE',
                contentType: "application/json",
                Accept: "application/json",
                url: 'http://192.168.41.131:3000/api/de.pharmachain.Offer/' + value.id,
                success: function () {
                    self.get_offers()
                },
                error: function (response) {
                    console.log(response)
                }
            });

        },
        selectOption(value) {
            this.showDialog = true;
            this.selectedReceipt = value;
        },
        selectOrder(value) {
            console.log(value);

            this.showDialogOrder = true;
            this.new_offer.selectedOrder = value;
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
        },
        linechart: function (resolve) {
            require(['../Chart/index.jsx'], resolve);
        },
    },
    computed: {
        displayedDatasets() {
            return this.selectedYears.map(year => this.datasets[year]);
        }
    }
};