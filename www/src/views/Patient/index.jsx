module.exports = {
    template: require('./template.html'),
    replace: true,
    data: function () {
        return {
            receipts: [
                "Paracetamol 500mg 50x",
                "Protozoen 50mg 10x",
                "Vitamins 10mg 5x",


            ],
            menu: "Receipts",
            show_pharmacy: false,
            address: false,
            address_in: false,
        }
    },
    created: function () {

    },
    methods: {
        get_d_adress: function(){
            if(this.address){
                this.address_in= true;
            }else{
                this.show_map();
            }
        },
        show_map: function () {

            this.show_pharmacy=true;

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            async function await_map() {

                await sleep(200);
                var map = new google.maps.Map(
                    document.getElementById('map'), {zoom: 15, center: {lat: 51.332, lng: 12.367}});
                // The marker, positioned at Uluru
                var marker = new google.maps.Marker({position: {lat:  51.331, lng: 12.368}, map: map});
                var marker = new google.maps.Marker({position: {lat:  51.330, lng: 12.373}, map: map});
                var marker = new google.maps.Marker({position: {lat:  51.329, lng: 12.375}, map: map});
            }

            await_map();




        }
    },
    components: {
        receipt: function (resolve) {
            require(['../Receipte/index.jsx'], resolve);
        }
    },
};