let pharma_web_ip = 'localhost';
let pharma_web_port = '3000';
let pharma_web_adress = 'http://' + pharma_web_ip + ':' + pharma_web_port;
let suffix_insurance = '/api/de.pharmachain.Insurance';
let suffix_doctor = '/api/de.pharmachain.Doctor';
let suffix_patient = '/api/de.pharmachain.Patient';
let suffix_pharmacy = '/api/de.pharmachain.Pharmacy';
// Insurance
let i_0001 = {
    "$class": "de.pharmachain.Insurance",
    "money": "0.0",
    "id": "i_0001",
    "name": "AOK"
};
let i_0002 = {
    "$class": "de.pharmachain.Insurance",
    "money": "0.0",
    "id": "i_0002",
    "name": "TK"
}
// Doctor
let doc_0001 = {
    "$class": "de.pharmachain.Doctor",
    "id": "doc_0001",
    "name": "Doctor Who"
}
let doc_0002 = {
    "$class": "de.pharmachain.Doctor",
    "id": "doc_0002",
    "name": "Doctor Freud"
}
// Patient
let p_0001 = {
    "$class": "de.pharmachain.Patient",
    "id": "p_0001",
    "firstName": "Tom",
    "lastName": "Riddle",
    "birthday": new Date(1996, 11, 24),
    "def_street": "Riddle House",
    "def_city": "Little Hangleton",
    "def_plz": "15745",
    "money": "0.0",
    "insurance": "resource:de.pharmachain.Insurance#i_0001"
}
let p_0002 = {
    "$class": "de.pharmachain.Patient",
    "id": "p_0002",
    "firstName": "Harry",
    "lastName": "Potter",
    "birthday": new Date(2018, 24, 12),
    "def_street": "Leipziger Straße",
    "def_city": "Leipzig",
    "def_plz": "15746",
    "money": "0.0",
    "insurance": "resource:de.pharmachain.Insurance#i_0002"
}
// Pharmacy
let pha_0001 = {
    "$class": "de.pharmachain.Pharmacy",
    "money": "0.0",
    "id": "pha_0001",
    "name": "Hainbuchen-Apotheke"
}
let pha_0002 = {
    "$class": "de.pharmachain.Pharmacy",
    "money": "0.0",
    "id": "pha_0002",
    "name": "Blumen-Apotheke"
}

create(pharma_web_adress + suffix_insurance, i_0001)
create(pharma_web_adress + suffix_patient, p_0001)
create(pharma_web_adress + suffix_patient, p_0002)
create(pharma_web_adress + suffix_insurance, i_0002);
create(pharma_web_adress + suffix_pharmacy, pha_0001);
create(pharma_web_adress + suffix_pharmacy, pha_0002);
create(pharma_web_adress + suffix_doctor, doc_0002);
create(pharma_web_adress + suffix_doctor, doc_0001)

function create(url, data) {
    console.log(Date.now() + "data + id")
    aj = ($.ajax({
        // TODO Fuck it, who need sync requests anyway. Tried and failed with $.done/$.then
        async: false,
        type: 'POST',
        contentType: "application/json",
        Accept: "application/json",
        url: url,
        data: JSON.stringify(data),
        beforeSend: function () {
            console.log("BFS" + Date.now() + data.id);
        },
        success: function () {
            console.log('Build ' + Date.now() + data.id);
        },
        error: function (response) {
            console.log('Error ' + Date.now() + data.id);
            console.log(response)
        }
    }));
    return aj;
}