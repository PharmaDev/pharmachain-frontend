module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function () {
        return {
            receipts: [
                // {name: "Paracetamol 500mg 50x", date: "12.04.2018"},
                // {name: "Protozoen 50mg 10x", date: "21.09.2018"}
            ],
            offers: [
                {name: "Paracetamol 500mg 50x", date: "12.04.2018", dist: "1.3km"},
                {name: "Protozoen 50mg 10x", date: "21.09.2018", dist: "500m"}
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
        this.checkNewPosts()

        let self = this;

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
                        id: d.id,
                        name: d.prescription,
                        date: "20.11.2018"
                    });
                    self.r_index = d.id
                })
            },
            error: function (response) {
                console.log(response)
            }
        });

    },
    methods: {
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
                url: 'http://192.168.99.101:3000/api/de.pharmachain.PositionSelection',
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