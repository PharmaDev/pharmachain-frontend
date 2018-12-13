let pharma_web_ip = 'localhost';
let pharma_web_port = '3000';
let pharma_web_adress = 'http://' + pharma_web_ip + ':' + pharma_web_port;


let id_array = [
    "de.pharmachain.Pharmacy/pha_0001",
    "de.pharmachain.Pharmacy/pha_0002",
    "de.pharmachain.Insurance/i_0001",
    "de.pharmachain.Insurance/i_0002",
    "de.pharmachain.Patient/p_0001",
    "de.pharmachain.Patient/p_0002",
    "de.pharmachain.Doctor/doc_0001",
    "de.pharmachain.Doctor/doc_0002"
];

for (id in id_array) {
    remove(pharma_web_adress + "/api/" + id_array[id]);
}

function remove(url) {
    $.ajax({
        type: 'DELETE',
        contentType: "application/json",
        Accept: "application/json",
        url: url,
        success: function () {
            console.log('Deleted ' + url);
        },
        error: function (response) {
            console.log('Error' + url);
            console.log(response)
        }
    });
}