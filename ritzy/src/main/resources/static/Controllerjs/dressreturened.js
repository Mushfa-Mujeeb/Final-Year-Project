//browser onload event
window.addEventListener("load", () => {


    //check ths with under PrivilegeController after deleteMapping
    userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/DRESS_RETURNED");

    //call table refresh function
    refreshDressReturnedTable();

    //call Dress Returned Person form function
    refreshDressReturnedPerson();
});

//define function table refresh
const refreshDressReturnedTable = () => {
    //create array for store find all data
    // DrCollPersons = new Object();
    // dressretpersons = getServiceAjaxRequest("/returendcollectedperson/byresstatus");

    dressretpersons = [];
    dressretpersons = getServiceAjaxRequest("/reservation/byresstatusforreturn");


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
        tableDressRet,
        dressretpersons,
        displaypropertyList,
        refillDressRetForm
    );

    dressRetForm.disabled = true;

    //call jQuery dataTables
    $('#tableDressRet').dataTable();

    tableDressRet_length.children[0].style.color = "white";
    tableDressRet_length.children[0].children[0].style.color = "black";

    tableDressRet_filter.children[0].style.color = "white";
    tableDressRet_filter.children[0].children[0].style.color = "black";
};


const refillDressRetForm = (ob, rowIndex) => {

    //create empty object
    // dressretperson = {};


    console.log("Edit");

    dressRetForm.disabled = false;

    dressretperson = JSON.parse(JSON.stringify(ob)); //
    olddressretperson = JSON.parse(JSON.stringify(ob));

    //open modal
    $("#dressRetForm").tab("show");
    //set value into static element
    //elementid.value = ob.relevantPropertyName

    textCustName.value = dressretperson.customer_id.first_name;
    textReservationNo.value = dressretperson.reservaton_no;


    if (dressretperson.note != null) textNote.value = dressretperson.note; else textNote.value;


    btnAddNewDRPerson.disabled = true;
    textReturnedPerson.disabled = true;

    // get extreturnedperson name list
    extreturnedperson = getServiceAjaxRequest("/returendcollectedperson/findall");
    // call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
    fillDataIntoSelect(textReturnedPerson, "Select Returned Person", extreturnedperson, "person_name");
    dressretperson.returned_collected_person_detail_id = textReturnedPerson.value;
    // isValid([textReturnedPerson]);


    textCustName.disabled = true;
    textReservationNo.disabled = true;
    textReturnedDate.disabled = true;
    let currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    textReturnedDate.value = date;


    // dress
    SelectDress.innerHTML = "";
    SelectDress.className = "shadow-sm gradient-border row m-0 d-flex";
    dressretperson.reservationHasDressList.forEach((rhdress, index) => {

        if (rhdress.rental_status == "Dress Collected") {

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
                    rhdress.rental_status = "Dress Returned";
                    displayDressDetails(dressretperson.reservationHasDressList[parseInt(this.value)], true, parseInt(this.value) );
                    
                    //set Current date
                    let currentDate = new Date();
                    const date = currentDate.toISOString().split("T")[0]
                    rhdress.returned_date = date;
                    textReturnedDate.value = date;
                    //calculate total deposit
                    // depositAmount.value = (parseFloat(depositAmount.value) + parseFloat(rhdress.deposit_amount)).toFixed(2);

                } else {
                    displayDressDetails(dressretperson.reservationHasDressList[parseInt(this.value)], false);
                    rhdress.rental_status = "Dress Collected";
                    rhdress.returned_date = null;
                    // depositAmount.value = (parseFloat(depositAmount.value) - parseFloat(rhdress.deposit_amount)).toFixed(2);
                }
            }
            //get reserved Dress to refill
            if (rhdress.rental_status == "Dress Returned") {
                inputCHK.checked = true;
            }

            div.appendChild(inputCHK);
            div.appendChild(label)

            SelectDress.appendChild(div)

        }



    });


}



// check form update for edit reservation return
const checkDRFormUpdates = () => {
    let updates = "";

    if (dressretperson.reservationHasDressList.length != olddressretperson.reservationHasDressList.length) { //will be usefull for attendance
        updates = updates + "Reservation Dress is changed  \n";
      } else {
       
        for (let newrhdress of dressretperson.reservationHasDressList) { //have to check element count in list 
          for (let oldrhdress of olddressretperson.reservationHasDressList) {
            if ((newrhdress.id == oldrhdress.id) &&  (newrhdress.rental_status != oldrhdress.rental_status)) { //
                updates = updates + "Reservation Dress is changed  \n";
                break;
            }
          }
    
        }
      }

    return updates;
}

// edit reservation return button
const EditDRPButton = () => {
    //
    // need to check form error
    let updates = checkDRFormUpdates();
    if (updates != "") {
        //get user confirmation
        const userResponse = confirm("Are you sure to edit following details....?");

        if (userResponse) {
            //call post service
            const userPostServiceResponse = getHTTPBodyAjaxRequest("/reseravtionreturned", "PUT", dressretperson);

            if (userPostServiceResponse == "OK") {
                alert("Dress Returned form saved successfully...!");
                refreshDressReturnedTable();
                $('#tableDressReturned').tab('show'); //change tab
                DressRetForm.reset(); // this is an id of user form
            } else {
                alert("Dress Returned Form Has Errors...!\n" + userPostServiceResponse);
            }
        }


    } else {
        alert("Dress Returned Form hasn't any changers...!\n");
    }

}

const displayDressDetails = (rhdress, checked, listIndex) => {

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
        let refundableAmount = document.createElement("p");

        let inputDamagedCharge = document.createElement("input");
        inputDamagedCharge.type = "text";
        inputDamagedCharge.placeholder = "Enter Damaged Charge";
        inputDamagedCharge.className = "form-control shadow-sm gradient-border";

        let inputDamagedNote = document.createElement("input");
        inputDamagedNote.type = "text";
        inputDamagedNote.placeholder = "Enter Damaged Note";
        inputDamagedNote.className = "form-control shadow-sm gradient-border";

        inputDamagedCharge.id = listIndex;
        inputDamagedCharge.onchange = function() {
            console.log(this.parentNode.children[11]);
            if ((parseFloat(this.value) > 0) && (parseFloat(this.value) <= parseFloat(dressretperson.reservationHasDressList[parseInt(this.id)].deposit_amount))) {
                this.classList.remove("is-invalid");
                this.classList.remove("gradient-border");
                this.classList.add("is-valid");
                dressretperson.reservationHasDressList[parseInt(this.id)].damaged_charge = (parseFloat(this.value)).toFixed(2);
                dressretperson.reservationHasDressList[parseInt(this.id)].refundable_amount = (parseFloat(dressretperson.reservationHasDressList[parseInt(this.id)].deposit_amount) - (parseFloat(dressretperson.reservationHasDressList[parseInt(this.id)].late_returned_charge) + parseFloat(dressretperson.reservationHasDressList[parseInt(this.id)].damaged_charge))).toFixed(2) ;
                this.parentNode.children[11].innerText = "Refundable Amount : " + dressretperson.reservationHasDressList[parseInt(this.id)].refundable_amount;
                
            } else {
                this.classList.remove("is-valid");
                this.classList.remove("gradient-border");
                this.classList.add("is-invalid");
            }
        }


        let inputLateReturnCharge = document.createElement("input");
        inputLateReturnCharge.type = "text";
        inputLateReturnCharge.placeholder = "Enter Late Return Charge";
        inputLateReturnCharge.className = "form-control shadow-sm gradient-border";

        let inputLateReturnNote = document.createElement("input");
        inputLateReturnNote.type = "text";
        inputLateReturnNote.placeholder = "Enter Late Return Note";
        inputLateReturnNote.className = "form-control shadow-sm gradient-border";

        let currentDate = new Date();
        const date = currentDate.toISOString().split("T")[0];
        let numberOfLateDays = calculateDifferentBetwTwoDays(date, dressretperson.reservationHasDressList[listIndex].rental_end_date);
        console.log(numberOfLateDays);

        if (numberOfLateDays >= 0) {
            inputLateReturnCharge.value = (parseFloat(numberOfLateDays) * 100).toFixed(2);
            dressretperson.reservationHasDressList[listIndex].refundable_amount = (parseFloat(dressretperson.reservationHasDressList[listIndex].refundable_amount) + parseFloat(inputLateReturnCharge.value)).toFixed(2);
            inputLateReturnNote.value = dressretperson.reservationHasDressList[listIndex].dress_id.dress_name + " Returned Late by " + numberOfLateDays + " days.";
            dressretperson.reservationHasDressList[listIndex].late_returned_note = inputLateReturnNote.value;
            dressretperson.reservationHasDressList[listIndex].late_returned_charge = inputLateReturnCharge.value;
        }



        dressName.innerHTML = "<b>" + rhdress.dress_id.dress_name + "</b>";
        dressRentalPrice.innerText = "Dress Rental Price: " + rhdress.dress_rental_price;
        depositAmount.innerText = "Deposit Amount: " + rhdress.deposit_amount;
        preResTotal.innerText = "Pre-Reservation Total: " + rhdress.pre_reservation_total;;
        RentalSDate.innerText = "Renatl Start Date: " + rhdress.rental_start_date;
        RentalEDate.innerText = "Renatl End Date: " + rhdress.rental_end_date;
        rentalalStatus.innerText = "Renatl Status: " + rhdress.rental_status;
        refundableAmount.innerText = "Refundable Amount : " + dressretperson.reservationHasDressList[listIndex].refundable_amount;

        dressDetails.appendChild(dressName);
        dressDetails.appendChild(dressRentalPrice);
        dressDetails.appendChild(depositAmount);
        dressDetails.appendChild(preResTotal);
        dressDetails.appendChild(RentalSDate);
        dressDetails.appendChild(RentalEDate);
        dressDetails.appendChild(rentalalStatus);
        dressDetails.appendChild(inputDamagedCharge);
        dressDetails.appendChild(inputDamagedNote);
        dressDetails.appendChild(inputLateReturnCharge);
        dressDetails.appendChild(inputLateReturnNote);
        dressDetails.appendChild(refundableAmount);

        divDisplayDressDetails.appendChild(dressDetails);

    } else {
        // to remove dispalaying dress details when unchecking checkbox
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

const getCustomerName = (ob) => {
    return ob.customer_id.first_name;
}

const getCustomerPhone = (ob) => {
    return ob.customer_id.phone;
}

const getReservedDress = (ob) => {
    // check renatal start date == current datee
    // return "dress";

    let dresses = "";
    for (const reserveDress of ob.reservationHasDressList) {

        if (reserveDress.rental_status == 'Dress Collected' && ob.reservation_status_id.name == "On Process") {
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
const generateReturnedPersonDetails = () => {
    textReturnedPerson.value = "";
    textReturnedPerson.className = "gradient-border form-select shadow-sm"; //this shud checked bcz when u select existing dres 1st and later decides to design a new dress this field must be check empty and remove valid color function

    console.log(textReturnedPerson);
    if (SelectReturnedBy.value == 'Customer') {
        isValid([SelectReturnedBy]);
        document.getElementById("divReturnedperson").style.display = "none";

        //get dress name list
        // customers = getServiceAjaxRequest("/customer/reservedlist");
        //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
        // fillDataIntoSelect(ReturnedPersonName, "Select Customer", customers, "first_name");
        // ReturnedPersonName.disabled = true;
    }

    if (SelectReturnedBy.value == 'Existing Returned Person') {

        document.getElementById("divReturnedperson").style.display = "block";
        btnAddNewDRPerson.disabled = true;
        textReturnedPerson.disabled = false;
        isValid([SelectReturnedBy]);


    }

    if (SelectReturnedBy.value == 'New Returned Person') {
        isValid([SelectReturnedBy]);
        document.getElementById("divReturnedperson").style.display = "block";
        console.log(SelectReturnedBy);
        $('#modalDRPerson').offcanvas('show');
        textReturnedPerson.disabled = true;
        btnAddNewDRPerson.disabled = false;

    }


    dressretperson.reservationHasDressList.forEach(rhdress => {
        if (rhdress.rental_status == "Dress Returned" && rhdress.returned_date == textReturnedDate.value) {
            rhdress.returned_by = SelectReturnedBy.value;
        }
    });



}

// ##################################################################################### //
// ##################         new dress Returned Person form JS         ############### //
// ##################################################################################### //


//dress returned Person form refresh
const refreshDressReturnedPerson = () => {
    //create empty object
    dressretpersonob = new Object();


    ReturnedPersonName.value = "";
    ReturnedPersonNIC.value = "";
    ReturnedPersonPhone.value = "";
    ReturnedPersonName.className = "gradient-border form-control shadow-sm";
    ReturnedPersonNIC.className = "gradient-border form-control shadow-sm";
    ReturnedPersonPhone.className = "gradient-border form-control shadow-sm";



    // set to default color to feilds if after refreshing for
    // Remove validation classes

    var elements = document.getElementById("DReturnedPersonForm").querySelectorAll(".is-invalid");
    elements.forEach(function (element) {
        element.classList.remove("is-invalid");
    })
}

//define function to check form error
const checkDCPFormError = () => {
    let errors = '';

    if (dressretpersonob.person_name == null) {
        isInValid([ReturnedPersonName]);
        errors = errors + "Please Enter Valid Name..! \n"
    }

    if (dressretpersonob.person_nic == null) {
        isInValid([ReturnedPersonNIC]);
        errors = errors + "Please Enter Valid NIC..! \n"
    }

    if (dressretpersonob.person_mobile == null) {
        isInValid([ReturnedPersonPhone]);
        errors = errors + "Please Enter Valid Phone Number..! \n"
    }

    return errors;
}



//define function for submit Dress retuned Person
const submitDRPerson = () => {
    //console.log('submit');
    console.log(dressretpersonob);

    //checking errors
    const errors = checkDCPFormError();
    if (errors == '') {
        const userSubmitResponse = confirm('Are you sure to Submit...?');

        if (userSubmitResponse) {
            //call post service
            let postServiceResponse = getHTTPBodyAjaxRequest('/returendcollectedperson', 'POST', dressretpersonob);

            if (postServiceResponse == "OK") {

                alert("Dress Returned Person record successfully saved.....!\n")

                //dressretpersons list
                dressretpersons = getServiceAjaxRequest("/returendcollectedperson/findall");
                fillDataIntoSelect2(textReturnedPerson, 'Select Returned Person', dressretpersons, 'person_name', 'person_mobile', ReturnedPersonPhone.value);
                dressretperson.returned_collected_person_detail_id = JSON.parse(textReturnedPerson.value);
                isValid([textReturnedPerson]);
                DReturnedPersonForm.reset();
                refreshDressReturnedPerson();//refresh form
                $('#modalDRPerson').offcanvas("hide");
            } else {
                alert("Failed to submit Dress Returned Person record! \n" + postServiceResponse);
            }
        }
    } else {
        alert("Form has following errors...\n" + errors);
    }
};


const DisplayDamagedDetails = () => {
    if (checkDamage.checked == true) {
        // damagedCharge.value = rhdress.damaged_charge;
        // textDamagedNote.value = rhdress.damage_note;
        divDisplayDamagedDetails.style.display = "block";
    } else {
        divDisplayDamagedDetails.style.display = "none";
    }
}

const DisplayLateReturnedDetails = () => {
    if (checkLateReturned.checked == true) {
        // lateReturnedCharge.value = rhdress.late_returned_charge;
        // textLateReturnedNote.value = rhdress.late_returned_note;
        divDisplayLateReturnedDetails.style.display = "block";
    } else {
        divDisplayLateReturnedDetails.style.display = "none";
    }
}