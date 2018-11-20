var numeral = require("numeral");
module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function () {
        return {
            orders: [
                {name: "Paracetamol 500mg 50x", date: "12.04.2018", dist: "1.3km"},
                {name: "Protozoan 50mg 10x", date: "21.09.2018", dist: "500m"}
            ],
            deliveries: [
                {name: "Paracetamol 500mg 50x", details: "details", address: "address", delivery: "delivery info"},
                {name: "Protozoen 50mg 10x", details: "details", address: "address", delivery: "delivery info"}
            ],
            billings: [
                {name: "Paracetamol 500mg 50x", details: "details", address: "address", price: "price"},
            ],
            status: "active",
            showDialog: false,
            selectedReceipt: null,
            newPosts: 0,
            currentTab: "tab-orders",
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
    },
    methods: {
        selectOption(value) {
            this.showDialog = true;
            this.selectedReceipt = value;
        },
        selectOrder(value) {
            this.showDialogOrder = true;
            this.selectedOrder = value;
        },
        reload() {
            this.showDialog = false;
            this.selectedReceipt = null;
        },
        changeTab(newTab) {
            this.clearNewPosts();
            this.currentTab = newTab;
        },
        clearCheckPosts () {
            window.clearInterval(this.checkInterval)
            this.checkInterval = null
        },
        clearNewPosts () {
            this.clearCheckPosts()
            this.newPosts = 0
        },
        checkNewPosts (activeTab) {
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