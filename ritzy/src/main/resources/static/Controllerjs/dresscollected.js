//browser onload event
window.addEventListener("load", () => {


    //check ths with under PrivilegeController after deleteMapping
    userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/DRESS_COLLECTED");

    //call table refresh function
    refreshDressCollectedTable();

    //call Dress Collected Person form function
    refreshDressCollectedPerson();
});

//define function table refresh
const refreshDressCollectedTable = () => {
    //create array for store find all data
    // DrCollPersons = new Object();
    // dresscollpersons = getServiceAjaxRequest("/returendcollectedperson/byresstatus");

    dresscollpersons = [];
    dresscollpersons = getServiceAjaxRequest("/reservation/byresstatus");


    //define display property
    const displaypropertyList = [
        { dataType: "function", propertyName: getReservationNo },
        { dataType: "function", propertyName: getCustomerName },
        { dataType: "function", propertyName: getCustomerPhone },
        { dataType: "function", propertyName: getReservedDress },
        { dataType: "function", propertyName: getWeddingDate },
        { dataType: "function", propertyName: getReservationStatus }

    ];

    //call filldatainto table function
    fillDataIntoTableResvCollRet(
        tableDressColl,
        dresscollpersons,
        displaypropertyList,
        refillDressCollForm
    );

    dressCollForm.disabled = true;

    //call jQuery dataTables
    $('#tableDressColl').dataTable();

    tableDressColl_length.children[0].style.color = "white";
    tableDressColl_length.children[0].children[0].style.color = "black";

    tableDressColl_filter.children[0].style.color = "white";
    tableDressColl_filter.children[0].children[0].style.color = "black";
};


const refillDressCollForm = (ob, rowIndex) => {

    //create empty object
    // dresscollperson = {};


    console.log("Edit");

    dressCollForm.disabled = false;

    dresscollperson = JSON.parse(JSON.stringify(ob)); //
    olddresscollperson = JSON.parse(JSON.stringify(ob));

    //open modal
    $("#dressCollForm").tab("show");
    //set value into static element
    //elementid.value = ob.relevantPropertyName

    textCustName.value = dresscollperson.customer_id.first_name;
    textReservationNo.value = dresscollperson.reservaton_no;


    if (dresscollperson.note != null) textNote.value = dresscollperson.note; else textNote.value;


    btnAddNewDCPerson.disabled = true;
    textcollectedPerson.disabled = true;

    // get extcollectedperson name list
    extcollectedperson = getServiceAjaxRequest("/returendcollectedperson/findall");
    // call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
    fillDataIntoSelect(textcollectedPerson, "Select Collected Person", extcollectedperson, "person_name");
    dresscollperson.returned_collected_person_detail_id = textcollectedPerson.value;
    // isValid([textcollectedPerson]);


    textCustName.disabled = true;
    textReservationNo.disabled = true;
    textcollectedDate.disabled = true;
    let currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    textcollectedDate.value = date;

    // dress
    SelectDress.innerHTML = "";
    SelectDress.className = "shadow-sm gradient-border row m-0 d-flex";
    dresscollperson.reservationHasDressList.forEach((rhdress, index) => {

        if (rhdress.rental_status == "Fitton Done") {

            div = document.createElement('div');
            div.className = "form-check form-check-inline col-6 m-0 mt-2";
            inputCHK = document.createElement('input');
            inputCHK.type = "checkbox";
            inputCHK.value = index;
            inputCHK.className = "form-check-input mt-2 m-2";
            label = document.createElement('label');
            label.className = "form-check-label checkbx-text-customization mt-1 m-2"
            label.innerText = rhdress.dress_id.dress_name;


            //this code section is to checked selected checkboxes properly
            inputCHK.onchange = function () {
                if (this.checked) {
                    dresscollperson.reservationHasDressList[parseInt(this.value)].rental_status = "Dress Collected";
                    displayDressDetails(dresscollperson.reservationHasDressList[parseInt(this.value)], true);

                    //set Current date
                    let currentDate = new Date();
                    const date = currentDate.toISOString().split("T")[0]
                    dresscollperson.reservationHasDressList[parseInt(this.value)].collected_date = date;
                    textcollectedDate.value = date;
                } else {
                    displayDressDetails(dresscollperson.reservationHasDressList[parseInt(this.value)], false);
                    dresscollperson.reservationHasDressList[parseInt(this.value)].rental_status = "Fitton Done";
                    dresscollperson.reservationHasDressList[parseInt(this.value)].collected_date = null;
                    dresscollperson.reservationHasDressList[parseInt(this.value)].collected_by = null;
                    dresscollperson.reservationHasDressList[parseInt(this.value)].collected_person_detail_id = null;
                }
            }
            //get reserved Dress to refill
            if (rhdress.rental_status == "Dress Collected") {
                inputCHK.checked = true;
            }

            div.appendChild(inputCHK);
            div.appendChild(label)

            SelectDress.appendChild(div)
        }


    });


}



// check form update for edit reservation return
const checkDCFormUpdates = () => {
    let updates = "";

    if (dresscollperson.reservationHasDressList.length != olddresscollperson.reservationHasDressList.length) { //will be usefull for attendance
        updates = updates + "Reservation Dress is changed  \n";
    } else {

        for (let newrhdress of dresscollperson.reservationHasDressList) { //have to check element count in list 
            for (let oldrhdress of olddresscollperson.reservationHasDressList) {
                if ((newrhdress.id == oldrhdress.id) && (newrhdress.rental_status != oldrhdress.rental_status)) { //
                    updates = updates + "Reservation Dress is changed  \n";
                    break;
                }
            }

        }
    }

    return updates;
}

// edit reservation return button
const EditDCPButton = () => {
    //
    // need to check form error
    let updates = checkDCFormUpdates();
    if (updates != "") {
        //get user confirmation
        const userResponse = confirm("Are you sure to edit following details....?");

        if (userResponse) {
            //call post service
            const userPostServiceResponse = getHTTPBodyAjaxRequest("/reservationcolllected", "PUT", dresscollperson);

            if (userPostServiceResponse == "OK") {
                alert("Dress Collected form saved successfully...!");
                refreshDressCollectedTable();
                $('#tableDressCollected').tab('show'); //change tab
                DressCollForm.reset(); // this is an id of user form
            } else {
                alert("Dress Collected Form Has Errors...!\n" + userPostServiceResponse);
            }
        }


    } else {
        alert("Dress Collected Form hasn't any changers...!\n");
    }

}

const displayDressDetails = (rhdress, checked) => {

    if (checked) {
        let dressDetails = document.createElement("div");
        dressDetails.className = "col-6";
        dressDetails.id = rhdress.id;
        let dressName = document.createElement("p");
        let dressRentalPrice = document.createElement("p");
        let depositAmount = document.createElement("p");
        let preResTotal = document.createElement("p");
        let RentalSDate = document.createElement("p");
        let RentalEDate = document.createElement("p");
        let rentalalStatus = document.createElement("p");

        dressName.innerHTML = "<b>" + rhdress.dress_id.dress_name + "</b>";
        dressRentalPrice.innerText = "Dress Rental Price: " + rhdress.dress_rental_price;
        depositAmount.innerText = "Deposit Amount: " + rhdress.deposit_amount;
        preResTotal.innerText = "Pre-Reservation Total: " + rhdress.pre_reservation_total;;
        RentalSDate.innerText = "Renatl Start Date: " + rhdress.rental_start_date;
        RentalEDate.innerText = "Renatl End Date: " + rhdress.rental_end_date;
        rentalalStatus.innerText = "Renatl Status: " + rhdress.rental_status;

        dressDetails.appendChild(dressName);
        dressDetails.appendChild(dressRentalPrice);
        dressDetails.appendChild(depositAmount);
        dressDetails.appendChild(preResTotal);
        dressDetails.appendChild(RentalSDate);
        dressDetails.appendChild(RentalEDate);
        dressDetails.appendChild(rentalalStatus);
        divDisplayDressDetails.appendChild(dressDetails);

    } else {
        let divDressChildrens = divDisplayDressDetails.children;
        for (let index = 0; index < divDressChildrens.length; index++) {
            if (parseInt(divDressChildrens[index].id) == rhdress.id) {
                divDressChildrens[index].remove();
            }

        }
    }


}

const getReservationNo = (ob) => {
    return ob.reservaton_no;
}

const getCustomerPhone = (ob) => {
    return ob.customer_id.phone;
}


const getCustomerName = (ob) => {
    return ob.customer_id.first_name;
}

const getReservedDress = (ob) => {
    // check renatal start date == current datee
    // return "dress";

    let dresses = "";
    for (const reserveDress of ob.reservationHasDressList) {

        if ((reserveDress.rental_status == 'Fitton Done') && (ob.reservation_status_id.name == "Confirmed" || ob.reservation_status_id.name == "On Process")) {
            dresses = dresses + "<tr> <td class='p-2'>" + reserveDress.dress_id.dress_code + "</td> <td class='p-2'>" + reserveDress.dress_id.dress_name + "</td><td class='p-2'><p style='border-radius:3px'  class='btn-dressavailability-Reserved text-center fw-bold'>" +
                reserveDress.rental_status + "</p></td></tr>";
        }

    }
    return "<table border=1>" + dresses + "</table>";

}

const getWeddingDate = (ob) => {
    return ob.wedding_date;
}

const getReservationStatus = (ob) => {
    // return ob.reservation_status_id.name;

    if (ob.reservation_status_id.name == 'Pending') {
        return '<p style="border-radius:10px " class="btn-pending text-center fw-bold">' + ob.reservation_status_id.name + '</p>';
    }

    if (ob.reservation_status_id.name == 'Confirmed') {
        return '<p style="border-radius:10px " class="btn-confirmed text-center fw-bold">' + ob.reservation_status_id.name + '</p>';
    }

    if (ob.reservation_status_id.name == 'On Process') {
        return '<p style="border-radius:10px "  class="btn-dressavailability-Under-Maintenance text-center fw-bold">' + ob.reservation_status_id.name + '</p>';
    }

    if (ob.reservation_status_id.name == 'Completed') {
        return '<p style="border-radius:10px " class="btn-dressavailability-Available text-center fw-bold">' + ob.reservation_status_id.name + '</p>';
    }

    if (ob.reservation_status_id.name == 'Cancelled') {
        return '<p style="border-radius:10px "  class="btn-dressavailability-OutofStock text-center fw-bold">' + ob.reservation_status_id.name + '</p>';
    }
}



//function for filter dress category and dress type
const generateCollectedPersonDetails = () => {


    if (SelectCollectedBy.value == 'Customer') {
        isValid([SelectCollectedBy]);
        document.getElementById("divcollectedperson").style.display = "none";



        for (const rhdress of dresscollperson.reservationHasDressList) {
            if (rhdress.rental_status == "Dress Collected" && rhdress.collected_date == getCurrentDate()) {
                rhdress.collected_by = SelectCollectedBy.value;
            }
        }
    }

    if (SelectCollectedBy.value == 'Existing Collected Person') {

        textcollectedPerson.value = "";
        textcollectedPerson.className = "gradient-border form-select shadow-sm"; //this shud checked bcz when u select existing dres 1st and later decides to design a new dress this field must be check empty and remove valid color function


        document.getElementById("divcollectedperson").style.display = "block";
        btnAddNewDCPerson.disabled = true;
        textcollectedPerson.disabled = false;
        isValid([SelectCollectedBy]);


    }

    if (SelectCollectedBy.value == 'New Collected Person') {
        textcollectedPerson.value = "";
        textcollectedPerson.className = "gradient-border form-select shadow-sm"; //this shud checked bcz when u select existing dres 1st and later decides to design a new dress this field must be check empty and remove valid color function


        isValid([SelectCollectedBy]);
        document.getElementById("divcollectedperson").style.display = "block";
        console.log(SelectCollectedBy);
        $('#modalDCPerson').offcanvas('show');
        textcollectedPerson.disabled = true;
        btnAddNewDCPerson.disabled = false;

    }


    dresscollperson.reservationHasDressList.forEach(rhdress => {
        if (rhdress.rental_status == "Dress Collected" && rhdress.collected_date == textcollectedDate.value) {
            rhdress.collected_by = SelectCollectedBy.value;
        }
    });



}

//
const selectSelectedPersonCH = () => {

    if (textcollectedPerson.value != "") {

        for (const rhdress of dresscollperson.reservationHasDressList) {
            if (rhdress.rental_status == "Dress Collected" && rhdress.collected_date == getCurrentDate()) {
                rhdress.collected_by = SelectCollectedBy.value;
                rhdress.returned_person_detail_id = JSON.parse(textcollectedPerson.value);
                // set valid color for textcollectedPerson
                isValid([textcollectedPerson]);

            }
        }
    }

}

// ##################################################################################### //
// ##################         new dress collected Person form JS         ############### //
// ##################################################################################### //


//dress collected Person form refresh
const refreshDressCollectedPerson = () => {
    //create empty object
    dresscollpersonob = new Object();


    CollectedPersonName.value = "";
    CollectedPersonNIC.value = "";
    CollectedPersonPhone.value = "";
    CollectedPersonName.className = "gradient-border form-control shadow-sm";
    CollectedPersonNIC.className = "gradient-border form-control shadow-sm";
    CollectedPersonPhone.className = "gradient-border form-control shadow-sm";



    // set to default color to feilds if after refreshing for
    // Remove validation classes

    var elements = document.getElementById("DCollectedPersonForm").querySelectorAll(".is-invalid");
    elements.forEach(function (element) {
        element.classList.remove("is-invalid");
    })
}

//define function to check form error
const checkDCPFormError = () => {
    let errors = '';

    if (dresscollpersonob.person_name == null) {
        isInValid([CollectedPersonName]);
        errors = errors + "Please Enter Valid Name..! \n"
    }

    if (dresscollpersonob.person_nic == null) {
        isInValid([CollectedPersonNIC]);
        errors = errors + "Please Enter Valid NIC..! \n"
    }

    if (dresscollpersonob.person_mobile == null) {
        isInValid([CollectedPersonPhone]);
        errors = errors + "Please Enter Valid Phone Number..! \n"
    }

    return errors;
}



//define function for submit Dress Collected Person
const submitDCPerson = () => {
    //console.log('submit');
    console.log(dresscollpersonob);

    //checking errors
    const errors = checkDCPFormError();
    if (errors == '') {
        const userSubmitResponse = confirm('Are you sure to Submit...?');

        if (userSubmitResponse) {
            //call post service
            let postServiceResponse = getHTTPBodyAjaxRequest('/returendcollectedperson', 'POST', dresscollpersonob);

            if (postServiceResponse == "OK") {

                alert("Dress Collected Person record successfully saved.....!\n")

                //dresscollpersons list
                dresscollpersons = getServiceAjaxRequest("/returendcollectedperson/findall");
                fillDataIntoSelect2(textcollectedPerson, 'Select Collected Person', dresscollpersons, 'person_name', 'person_mobile', CollectedPersonPhone.value);
                selectSelectedPersonCH();
                isValid([textcollectedPerson]);
                DCollectedPersonForm.reset();
                refreshDressCollectedPerson();//refresh form
                $('#modalDCPerson').offcanvas("hide");

            } else {
                alert("Failed to submit Dress Collected Person record! \n" + postServiceResponse);
            }
        }
    } else {
        alert("Form has following errors...\n" + errors);
    }
};


