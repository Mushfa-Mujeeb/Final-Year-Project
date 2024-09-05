// browser onload event
window.addEventListener("load", () => {

    //check ths with under PrivilegeController after deleteMapping
    userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/RESERVATION");

    console.log(userPrivilege);
    //call table refresh function
    refreshReservationTable();

    //call form refresh function
    refreshReservationForm();
});

const refreshReservationTable = () => {

    reservations = [];
    reservations = getServiceAjaxRequest("/reservation/findAll");


    const displayProperty = [
        { dataType: "function", propertyName: getCustomerName },
        { dataType: "function", propertyName: getReservedDress },
        { dataType: "function", propertyName: getReservationDate },
        { dataType: "function", propertyName: getReservationStatus }

    ];

    fillDataIntoTable(
        tableReservation,
        reservations,
        displayProperty,
        reservationFormRefill,
        printReservation,
        deleteReservation,
        true,
        userPrivilege
    );

    //disable delete button
    reservations.forEach((element, index) => {
        if (element.reservation_status_id.name == "Cancelled") {
            if (userPrivilege.delete) {
                tableReservation.children[1].children[index].children[5].children[1].disabled = "disabled";
                tableReservation.children[1].children[index].children[5].children[0].disabled = "disabled";
            }            
        }
        if (element.reservation_status_id.name == "Completed") {
            if (userPrivilege.delete) {
                tableReservation.children[1].children[index].children[5].children[1].disabled = "disabled";
            }                        
            tableReservation.children[1].children[index].children[5].children[1].disabled = "disabled";
            tableReservation.children[1].children[index].children[5].children[0].disabled = "disabled";
        }
        
    });

    //call jquery datatable function
    $("#tableReservation").dataTable();


    tableReservation_length.children[0].style.color = "white";
    tableReservation_length.children[0].children[0].style.color = "black";

    tableReservation_filter.children[0].style.color = "white";
    tableReservation_filter.children[0].children[0].style.color = "black";

}



const getCustomerName = (ob) => {
    return ob.customer_id.first_name;
}



// const getReservedDress = (ob) => {
//     // return ob.dress_id.dress_name;
//     return "dresses";
// }

const getReservedDress = (ob) => {
    let dresses = "";
    for (const reserveDress of ob.reservationHasDressList) {
        if (reserveDress.rental_status == 'Late return') {
            dresses = dresses + "<tr style='border:solid 5px #BD3E5D'> <td class='p-2'>" + reserveDress.dress_id.dress_code + "</td> <td class='p-2'>" + reserveDress.dress_id.dress_name + "</td><td class='p-2'><p style='border-radius:3px'  class='btn-dressavailability-OutofStock text-center fw-bold'>" +
                reserveDress.rental_status + "</p></td></tr>";
        }
        if (reserveDress.rental_status == 'Not Collected') {
            dresses = dresses + "<tr style='border:solid 5px #ef7930'> <td class='p-2'>" + reserveDress.dress_id.dress_code + "</td> <td class='p-2'>" + reserveDress.dress_id.dress_name + "</td><td class='p-2'><p style='border-radius:3px'  class='btn-dressavailability-Under-Maintenance text-center fw-bold'>" +
                reserveDress.rental_status + "</p></td></tr>";
        }
        if (reserveDress.rental_status == 'Pre-Reserved' || reserveDress.rental_status == 'Fitton Done' || reserveDress.rental_status == 'Dress Collected' || reserveDress.rental_status == 'Dress Returned' || reserveDress.rental_status == 'Completed') {
            dresses = dresses + "<tr> <td class='p-2'>" + reserveDress.dress_id.dress_code + "</td> <td class='p-2'>" + reserveDress.dress_id.dress_name + "</td><td class='p-2'><p style='border-radius:3px'  class='btn-dressavailability-Reserved text-center fw-bold'>" +
                reserveDress.rental_status + "</p></td></tr>";
        }
        if (reserveDress.rental_status == 'Cancelled') {
            dresses = dresses + "<tr> <td class='p-2'>" + reserveDress.dress_id.dress_code + "</td> <td class='p-2'>" + reserveDress.dress_id.dress_name + "</td><td class='p-2'><p style='border-radius:3px'  class='btn-dressavailability-OutofStock text-center fw-bold'>" +
                reserveDress.rental_status + "</p></td></tr>";
        }
        if (reserveDress.rental_status == 'Pending') {
            dresses = dresses + "<tr> <td class='p-2'>" + reserveDress.dress_id.dress_code + "</td> <td class='p-2'>" + reserveDress.dress_id.dress_name + "</td><td class='p-2'><p style='border-radius:3px'  class='btn-pending text-center fw-bold'>" +
                reserveDress.rental_status + "</p></td></tr>";
        }



    }
    return "<table border=1>" + dresses + "</table>";
}

const getReservationDate = (ob) => {
    // return ob.added_datetime;
    // return "dresses";
    const datetime = ob.added_datetime; // Get the datetime string
    const date = datetime.split("T")[0]; // Split by T and take the first part (date)
    return date;
}



const getReservationStatus = (ob) => {
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


const checkRresrvationFormUpdate = () => {
    let updates = "";


    if (reservation.reservation_status_id.name != oldreservation.reservation_status_id.name) {
        updates = updates + "Reservation Status has changed " + oldreservation.reservation_status_id.name + " into " + reservation.reservation_status_id.name + " \n";
    }

    if (reservation.note != oldreservation.note) {
        updates = updates + "Note has changed " + oldreservation.note + " into " + reservation.note + " \n";
    }

    if (reservation.reservationHasDressList.fitton_date != oldreservation.reservationHasDressList.fitton_date) {
        updates = updates + "Fitton Date has changed " + oldreservation.reservationHasDressList.fitton_date + " into " + reservation.reservationHasDressList.fitton_date + " \n";
    }

    if (reservation.reservationHasDressList.rental_status != oldreservation.reservationHasDressList.rental_status) {
        updates = updates + "Rental Status has changed " + oldreservation.reservationHasDressList.rental_status + " into " + reservation.reservationHasDressList.rental_status + " \n";
    }

    if (reservation.reservationHasDressList.length != oldreservation.reservationHasDressList.length) {
        updates = updates + "Reserved Dress hase changed";
    } else {
        let existingDressCount = 0;
        for (const newReservedDress of reservation.reservationHasDressList) {
            for (const oldReservedDress of oldreservation.reservationHasDressList) {
                if (newReservedDress.dress_id.id == oldReservedDress.dress_id.id) {
                    existingDressCount = existingDressCount + 1;
                }
            }
        }
        if (existingDressCount != reservation.reservationHasDressList.length) {
            updates = updates + "Reserved Dress has changed";
        }

        for (const newReservedDress of reservation.reservationHasDressList) {
            for (const oldReservedDress of oldreservation.reservationHasDressList) {
                if (newReservedDress.dress_id.id == oldReservedDress.dress_id.id && newReservedDress.fitton_date != oldReservedDress.fitton_date) {
                    updates = updates + "Reserved Dress fitton date has changed";
                    break;
                }
            }
        }

        for (const newReservedDress of reservation.reservationHasDressList) {
            for (const oldReservedDress of oldreservation.reservationHasDressList) {
                if (newReservedDress.dress_id.id == oldReservedDress.dress_id.id && newReservedDress.rental_status != oldReservedDress.rental_status) {
                    updates = updates + "Reserved Dress rental status has changed";
                    break;
                }
            }
        }
    }


    return updates;
}

const EditReservationButton = () => {
    console.log('Edit');
    //check form error
    let errors = checkReservationFormError();
    if (errors == "") {

        //check form update
        let updates = checkRresrvationFormUpdate();
        if (updates != "") {
            //user confirmation
            let userConfirm = confirm(updates + "\n Are you sure to update following changes ?");
            if (userConfirm) {
                //call put serive request
                let putServiceResponse;
                $.ajax("/reservation", {
                    async: false,
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(reservation),
                    success: function (successOb) {
                        console.log("Success");
                        putServiceResponse = successOb;
                    },
                    error: function (errorOb) {
                        console.log("error");
                        putServiceResponse = errorOb;
                    }
                });



                //check put service responce
                if (putServiceResponse == "OK") {
                    alert("Succesfully updated...!");
                    $('#tableResv').tab('show'); //change tab
                    refreshReservationTable();//it refreshes the Reservation table
                    reservationForm.reset(); // this is an id of reservation form and it refreshs static element
                    refreshReservationForm(); //it refreshs dynamic behaviour

                } else {
                    alert("Failed to Update changes...!\n" + putServiceResponse)
                }
            }



        } else {
            alert("Nothing has updated...!")
        }

    } else {
        alert("Form Has Following errors...!\n" + errors);
    }

}


const reservationFormRefill = (ob, rowIndex) => {
    console.log("Edit");

    reservation = JSON.parse(JSON.stringify(ob)); //
    oldreservation = JSON.parse(JSON.stringify(ob));

    //open tab
    $("#resvForm").tab("show");
    //set value into static element
    //elementid.value = ob.relevantPropertyName

    weddingDate.value = reservation.wedding_date;
    resCharge.value = reservation.reservation_charge;
    resTotalAmount.value = reservation.total_amount;
    resNetTotalAmount.value = reservation.net_total;





    if (reservation.note != null) textNote.value = reservation.note; else textNote.value;


    //customers list
    customers = getServiceAjaxRequest("/customer/list");
    fillDataIntoSelect(SelectCustomer, 'Select Customer', customers, 'first_name', reservation.customer_id.first_name);
    SelectCustomer.disabled = true;
    weddingDate.disabled = true;

    //resvstatuses list
    resvstatuses = getServiceAjaxRequest("/reservationstatus/findall");
    fillDataIntoSelect(resStatus, 'Select Reservation Status', resvstatuses, 'name', reservation.reservation_status_id.name);

    //----------------------------------------------//

    if (userPrivilege.update_privilege) {
        btnEditReservation.disabled = false;
        btnEditReservation.style.cursor = "pointer";
    } else {
        btnEditReservation.disabled = true;
        btnEditReservation.style.cursor = "not-allowed";
    }

    btnSubmitReservation.disabled = true;
    btnEditReservation.disabled = false;

    btnSubmitReservation.style.cursor = "not-allowed";
    btnEditReservation.style.cursor = "pointer";

    ///
    refreshInnerDressFormAndTable();
}



const printReservation = (rowOb, rowIndex) => {
    reservation = JSON.parse(JSON.stringify(rowOb))

    const datetime = reservation.added_datetime; // Get the datetime string
    const date = datetime.split("T")[0]; // Split by T and take the first part (date)

    reservationNo.innerText = reservation.reservaton_no;
    ReservationStatus.innerText = reservation.reservation_status_id.name;
    ReservedDate.innerText = date;
    customerName.innerText = reservation.customer_id.first_name;
    customerNIC.innerText = reservation.customer_id.nic;
    customerPhone.innerText = reservation.customer_id.phone;
    reservationCharge.innerText = reservation.reservation_charge;
    totalAmount.innerText = reservation.total_amount;
    netTotal.innerText = reservation.net_total;

    let columns = [
        { dataType: "function", propertyName: getDressCode },
        { dataType: "function", propertyName: getDressName },
        { dataType: "function", propertyName: getDressRentalPrice },
        { dataType: "function", propertyName: getDressDeposit },
        { dataType: "function", propertyName: getPreResTotal },
        { dataType: "function", propertyName: getReentalStatus }

    ]

    //refresh inner table function
    fillDataIntoInnerTable(tableReservationDressPrint, reservation.reservationHasDressList, columns, refillInnerDressForm, deleteInnerDressForm, false)

    let newWindow = window.open();
    newWindow.document.write("<head><link rel='stylesheet' href='/bootstrap-5.2.3/bootstrap-5.2.3-dist/css/bootstrap.min.css'/><script src='/bootstrap-5.2.3/bootstrap-5.2.3-dist/js/bootstrap.bundle.min.js'><link rel='stylesheet' href='/style/tableStyles.css'></script></head>"
        + tableReservationPrint.outerHTML + "<script> tableReservationPrint.removeAttribute('style') </script>"
    )

}



const deleteReservation = (ob) => {
    //get user confirmation
    const userConfirm = confirm('Are you sure to Delete following Reservation..? \n' +
        "\n Reservation No : " + ob.reservaton_no +
        "\n Custoer Name : " + ob.customer_id.first_name);

    if (userConfirm) {
        console.log(reservation);
        //call delete service response
        const deleteServiceRespone = getHTTPBodyAjaxRequest('/reservation', 'DELETE', ob);
        if (deleteServiceRespone == "OK") {
            alert('Reservation Deleted Successfully..!');
            refreshReservationTable();
        } else {
            alert('Failed delete reservation : You have folllowing errors \n' + deleteServiceRespone);
        }
    } else {
        refreshReservationTable();
    }
}



const refreshReservationForm = () => {

    //create empty object
    reservation = {};

    reservation.reservationHasDressList = new Array();

    //customers list
    customers = getServiceAjaxRequest("/customer/list");
    fillDataIntoSelect(SelectCustomer, 'Select Customer', customers, 'first_name');

    //resvstatuses list
    resvstatuses = getServiceAjaxRequest("/reservationstatus/findall");
    fillDataIntoSelect2(resStatus, 'Select Reservation Status', resvstatuses, 'name', 'name', "Pending");
    reservation.reservation_status_id = JSON.parse(resStatus.value);


    // #################### Wedding date max min #################### //
    let currentDate = new Date();
    let minDate = new Date();
    minDate.setDate(currentDate.getDate() + 7);
    let maxDate = new Date(); // current date time 

    let minMonthWD = minDate.getMonth() + 1;
    if (minMonthWD < 10) {
        minMonthWD = '0' + minMonthWD;
    }

    let minDayWD = minDate.getDate();
    if (minDayWD < 10) {
        minDayWD = '0' + minDayWD;
    }
    weddingDate.min = minDate.getFullYear() + '-' + minMonthWD + '-' + minDayWD;


    maxDate.setDate(maxDate.getDate() + 150);

    let maxDayWD = maxDate.getDate();
    if (maxDayWD < 10) {
        maxDayWD = '0' + maxDayWD;
    }

    let maxMonthWD = maxDate.getMonth() + 1;
    if (maxMonthWD < 10) {
        maxMonthWD = '0' + maxMonthWD;
    }

    weddingDate.max = maxDate.getFullYear() + '-' + maxMonthWD + '-' + maxDayWD;




    //need to set empty static element 
    weddingDate.value = '';
    
    resCharge.value = '5000.00';
    reservation.reservation_charge = resCharge.value;

    resTotalAmount.value = '';
    textNote.value = '';

    //set default input feild styles                                             
    SelectCustomer.className = "gradient-border form-select shadow-sm";
    resStatus.className = "gradient-border form-select shadow-sm";

    weddingDate.className = "gradient-border form-control shadow-sm";
    resCharge.className = "gradient-border form-control shadow-sm";
    resTotalAmount.className = "gradient-border form-control shadow-sm";
    resNetTotalAmount.className = "gradient-border form-control shadow-sm";
    textNote.className = "gradient-border form-control shadow-sm";

    // resetIntoDefault([dressType, dressStyle, dressCategory, dressSize,dressCondition, dressAvailability, dressName, dressPrice, dressImage, textNote])

    //set to default color to feilds if after refreshing for
    // Remove validation classes
    var elements = document.getElementById("reservationForm").querySelectorAll(".is-invalid");
    elements.forEach(function (element) {
        element.classList.remove("is-invalid");
    });

    //--------------------------------------//

    if (userPrivilege.insert_privilege) {
        btnEditReservation.disabled = false;
        btnEditReservation.style.cursor = "pointer";
    } else {
        btnEditReservation.disabled = true;
        btnEditReservation.style.cursor = "not-allowed";
    }


    btnEditReservation.disabled = true;
    btnEditReservation.style.cursor = "not-allowed";
    btnSubmitReservation.disabled = false;
    btnSubmitReservation.style.cursor = "pointer";
    // btnSubmitReservation

    //call refreshInnerDressFormAndTable form to refresh when main for is refreshing
    refreshInnerDressFormAndTable();

}

//define function to check form error
const checkReservationFormError = () => {
    let errors = '';

    if (reservation.customer_id == null) {
        isInValid([SelectCustomer]);
        errors = errors + "Please Select Customer..! \n"
    }

    if (reservation.wedding_date == null) {
        isInValid([weddingDate]);
        errors = errors + "Please Select Wedding Date..! \n"
    }

    if (reservation.total_amount == null) {
        isInValid([resTotalAmount]);
        errors = errors + "Please Add a Dress to Reserve..! \n"
    }

    if (reservation.reservation_status_id == null) {
        isInValid([resStatus]);
        errors = errors + "Please Select Reservation Status..! \n"
    }

    if (reservation.reservationHasDressList.length == 0) {
        errors = errors + "Please Add a Dress to Reserve..! \n"
    }


    return errors;
}

// funtion for submit reservation form
const submitReservation = () => {
    //
    // console.log(reservation);
    // need to check form error
    let errors = checkReservationFormError();
    if (errors == "") {
        //get user confirmation
        const userResponse = confirm("Are you sure to add following Reservation Details....?" +
            "\n Customer Name : " + reservation.customer_id.first_name +
            "\n Wedding Date : " + reservation.wedding_date);

        if (userResponse) {
            //call post service
            const postServiceResponse = getHTTPBodyAjaxRequest("/reservation", "POST", reservation);

            if (postServiceResponse == "OK") {
                alert("Reservation has saved successfully...!");
                $('#tableResv').tab('show'); //change tab
                refreshReservationTable();
                reservationForm.reset(); // this is an id of dresspr form
                refreshReservationForm(); // 
            } else {
                alert("Failed to submit Reservation!\n" + postServiceResponse);
            }
        }
    } else {
        alert("Reservation Form has Errors...!\n" + errors);
    }
}

// ########################################################################################## //
// ################################### Inner form Section ################################### //
// ########################################################################################## //

//function for inner form and table (dress form)
const refreshInnerDressFormAndTable = () => {
    reserveDress = new Object();
    oldreserveDress = null;

    //availdresses list
    availdresses = getServiceAjaxRequest("/dress/availablelist");
    fillDataIntoSelect(SelectDressRes, 'Select Dress', availdresses, 'dress_name');
    SelectDressRes.disabled = true;



    //disable auto generated fiedls when refreshing
    rentStrtDate.disabled = true;
    rentEndDate.disabled = true;
    dressRentPrice.disabled = true;
    depositAmount.disabled = true;
    preResTotal.disabled = true;
    fittonDate.disabled = true;


    //set value empty
    dressRentPrice.value = "";
    depositAmount.value = "";
    preResTotal.value = "";
    rentStrtDate.value = "";
    rentEndDate.value = "";
    fittonDate.value = "";
    rentalStatus.value = "";


    //set default input feild styles                                             
    SelectDressRes.className = "gradient-border form-select shadow-sm";
    rentalStatus.className = "gradient-border form-select shadow-sm";

    dressRentPrice.className = "gradient-border form-control shadow-sm";
    depositAmount.className = "gradient-border form-control shadow-sm";
    preResTotal.className = "gradient-border form-control shadow-sm";
    rentStrtDate.className = "gradient-border form-control shadow-sm";
    rentEndDate.className = "gradient-border form-control shadow-sm";
    fittonDate.className = "gradient-border form-control shadow-sm";

    //--------------------------------------//

    if (userPrivilege.insert_privilege) {
        btnEditDressResv.disabled = false;
        btnEditDressResv.style.cursor = "pointer";
    } else {
        btnEditDressResv.disabled = true;
        btnEditDressResv.style.cursor = "not-allowed";
    }


    btnEditDressResv.disabled = true;
    btnEditDressResv.style.cursor = "not-allowed";
    btnAddDressResv.disabled = false;
    btnAddDressResv.style.cursor = "pointer";
    // btnAddDressResv


    // ################################## Inner Table Function Start ################################## //

    let columns = [
        { dataType: "function", propertyName: getDressCode },
        { dataType: "function", propertyName: getDressName },
        { dataType: "function", propertyName: getDressRentalPrice },
        { dataType: "function", propertyName: getDressDeposit },
        { dataType: "function", propertyName: getPreResTotal },
        { dataType: "function", propertyName: getReentalStatus }

    ]

    //refresh inner table function
    fillDataIntoInnerTable(tableReservationDress, reservation.reservationHasDressList, columns, refillInnerDressForm, deleteInnerDressForm)


    let totalAmount = 0.00;

    reservation.reservationHasDressList.forEach(element => {
        totalAmount = parseFloat(totalAmount) + parseFloat(element.pre_reservation_total)
    });

    resTotalAmount.value = parseFloat(totalAmount).toFixed(2);
    resTotalAmount.disabled = true;
    generateNetTotal();

    if (totalAmount == 0.00) {
        reservation.total_amount = null;
        resTotalAmount.className = "gradient-border form-control shadow-sm";
    } else {
        isValid([resTotalAmount]);
        reservation.total_amount = resTotalAmount.value;
    }


    // ########################################################################################################## //



}


//function to generate Start end date from Wedding date
const generateStartEnd = () => {

    // #################### rental start date max min #################### //
    SelectDressRes.disabled = false;
    fittonDate.disabled = false;
    let weddingDateValue = weddingDate.value;
    let weddingDateOb = new Date(weddingDateValue);

    let minDate = new Date(weddingDateValue);
    minDate.setDate(weddingDateOb.getDate() - 2);


    let minMonthRS = minDate.getMonth() + 1;
    if (minMonthRS < 10) {
        minMonthRS = '0' + minMonthRS;
    }

    let minDayRS = minDate.getDate();
    if (minDayRS < 10) {
        minDayRS = '0' + minDayRS;
    }
    rentStrtDate.min = minDate.getFullYear() + '-' + minMonthRS + '-' + minDayRS;
    rentStrtDate.value = minDate.getFullYear() + '-' + minMonthRS + '-' + minDayRS;
    //
    isValid([rentStrtDate]);
    reserveDress.rental_start_date = rentStrtDate.value;
    rentStrtDate.max = weddingDateValue;




    // #################### rental fitton date max min #################### //

    

    let RSDateValue = rentStrtDate.value;
    let RSDateOb = new Date(RSDateValue);

    let minDateFD = new Date(RSDateValue);
    minDateFD.setDate(RSDateOb.getDate() - 5);


    let minMonthFD = minDateFD.getMonth() + 1;
    if (minMonthFD < 10) {
        minMonthFD = '0' + minMonthFD;
    }

    let minDayFD = minDateFD.getDate();
    if (minDayFD < 10) {
        minDayFD = '0' + minDayFD;
    }
    fittonDate.min = minDateFD.getFullYear() + '-' + minMonthFD + '-' + minDayFD;
    fittonDate.value = minDateFD.getFullYear() + '-' + minMonthFD + '-' + minDayFD;
    //
    isValid([fittonDate]);
    reserveDress.fitton_date = fittonDate.value;
    fittonDate.max = RSDateValue;



}


//function to generate rental end date from rental start date
const generateRentalEnd = () => {

    //rental End date date max min
    let rentalStartDate = new Date(rentStrtDate.value);
    let rentalEndDate = new Date(rentStrtDate.value);

    let minMonthRE = rentalStartDate.getMonth() + 1;
    if (minMonthRE < 10) {
        minMonthRE = '0' + minMonthRE;
    }

    let minDayRE = rentalStartDate.getDate();
    if (minDayRE < 10) {
        minDayRE = '0' + minDayRE;
    }
    rentEndDate.min = rentalStartDate.getFullYear() + '-' + minMonthRE + '-' + minDayRE;


    rentalEndDate.setDate(rentalEndDate.getDate() + 5);

    let maxMonthRE = rentalEndDate.getMonth() + 1;
    if (maxMonthRE < 10) {
        maxMonthRE = '0' + maxMonthRE;
    }

    let maxDayRE = rentalEndDate.getDate();
    if (maxDayRE < 10) {
        maxDayRE = '0' + maxDayRE;
    }
    rentEndDate.value = rentalEndDate.getFullYear() + '-' + maxMonthRE + '-' + maxDayRE;
    isValid([rentEndDate]);
    rentEndDate.disabled = true;
    reserveDress.rental_end_date = rentEndDate.value;


}



const filterDresses = () => {
    //availdresses list
    if(oldreserveDress == null){
        availdresses = getServiceAjaxRequest("/dress/availablelistbyfded/" + fittonDate.value + "/" + rentEndDate.value);
         fillDataIntoSelect(SelectDressRes, 'Select Dress', availdresses, 'dress_name');
         reserveDress.dress_id = null;

    }
    

}


const getDressCode = (ob) => {
    return ob.dress_id.dress_code;
}


const getDressName = (ob) => {
    return ob.dress_id.dress_name;
}

const getDressRentalPrice = (ob) => {
    return parseFloat(ob.dress_rental_price).toFixed(2);
}


const getDressDeposit = (ob) => {
    return parseFloat(ob.deposit_amount).toFixed(2);
}

const getPreResTotal = (ob) => {
    return parseFloat(ob.pre_reservation_total).toFixed(2);
}

const getReentalStatus = (ob) => {
    return ob.rental_status;
}

const refillInnerDressForm = (rowOb, rowIndex) => {

    innerRowId = rowIndex;
    oldreserveDress = JSON.parse(JSON.stringify(rowOb));

    //availdresses list
    availdresses = getServiceAjaxRequest("/dress/availablelist");
    fillDataIntoSelect(SelectDressRes, 'Select Dress', availdresses, 'dress_name', rowOb.dress_id.dress_name);
    SelectDressRes.disabled = true;

    dressRentPrice.value = parseFloat(rowOb.dress_rental_price).toFixed(2);
    dressRentPrice.disabled = true;

    depositAmount.value = parseFloat(rowOb.deposit_amount).toFixed(2);
    depositAmount.disabled = true;

    preResTotal.value = parseFloat(rowOb.pre_reservation_total).toFixed(2);
    preResTotal.disabled = true;

    rentStrtDate.value = rowOb.rental_start_date;
    rentStrtDate.disabled = true;

    rentEndDate.value = rowOb.rental_end_date;
    rentEndDate.disabled = true;

    fittonDate.value = rowOb.fitton_date;
    fittonDate.disabled = false;

    rentalStatus.value = rowOb.rental_status;

    //disable inner add button
    btnAddDressResv.disabled = true;

    //enable inner edit button
    btnEditDressResv.disabled = false;
    btnEditDressResv.style.cursor = "pointer";

    generateStartEnd();
    generateRentalEnd();

}

// inner form edit button
const EditDressResvButton = () => {
    if ((fittonDate.value != reservation.reservationHasDressList[innerRowId].fitton_date) || (rentalStatus.value != reservation.reservationHasDressList[innerRowId].rental_status)) {
        let userConfirm = confirm("Are you sure to update?");
        if (userConfirm) {
            reservation.reservationHasDressList[innerRowId].fitton_date = fittonDate.value;
            reservation.reservationHasDressList[innerRowId].rental_status = rentalStatus.value;
            refreshInnerDressFormAndTable();


        }
    } else {
        alert("Nothing has Updated...!")
    }
}


const deleteInnerDressForm = (ob, rowIndex) => {
    //user confirmation
    let userConfirm = confirm("Are you sure to remove following dress from your reservation...?\n" +
        "\n Dress Code : " + ob.dress_id.dress_code +
        "\n Dress Name : " + ob.dress_id.dress_name +
        "\n Dress Rental Price : " + ob.dress_rental_price);
    if (userConfirm) {
        reservation.reservationHasDressList.splice(rowIndex, 1);
        alert("Dress Remove Successfully..!");
        refreshInnerDressFormAndTable();
        generateStartEnd();
        generateRentalEnd();
        if (reservation.reservationHasDressList.length == 2) {
            rentStrtDate.value = "";
            rentEndDate.value = "";
            fittonDate.value = "";
            weddingDate.value = "";
            rentStrtDate.className = "gradient-border form-control shadow-sm";
            rentEndDate.className = "gradient-border form-control shadow-sm";
            fittonDate.className = "gradient-border form-control shadow-sm";
            weddingDate.className = "gradient-border form-control shadow-sm";


            btnAddDressResv.disabled = true;
            SelectDressRes.disabled = true;
            rentalStatus.disabled = true;
            rentStrtDate.disabled = true;
            rentEndDate.disabled = true;
            fittonDate.disabled = true;
        } else {
            rentStrtDate.value = "";
            rentEndDate.value = "";
            fittonDate.value = "";
            weddingDate.value = "";
            rentStrtDate.className = "gradient-border form-control shadow-sm";
            rentEndDate.className = "gradient-border form-control shadow-sm";
            fittonDate.className = "gradient-border form-control shadow-sm";
            weddingDate.className = "gradient-border form-control shadow-sm";

            SelectDressRes.disabled = true;
            btnAddDressResv.disabled = false;
            fittonDate.disabled = true;
        }
    }

}


const checkInnerDressFormError = () => {
    let errors = "";

    if (reserveDress.dress_id == null) {
        isInValid([SelectDressRes]);
        errors = errors + "Please Select Dress..! \n ";
    }

    if (reserveDress.dress_rental_price == null) {
        isInValid([dressRentPrice]);
        errors = errors + "Please Enter Valid Rental Price..! \n ";
    }

    if (reserveDress.deposit_amount == null) {
        isInValid([depositAmount]);
        errors = errors + "Please Enter Deposit Amount..! \n ";
    }

    if (reserveDress.pre_reservation_total == null) {
        isInValid([preResTotal]);
        errors = errors + "Please Enter Valid Pre-Reservation Total..! \n ";
    }

    if (reserveDress.rental_start_date == null) {
        isInValid([rentStrtDate]);
        errors = errors + "Please Select Valid Rental Start Date..! \n ";
    }

    if (reserveDress.rental_end_date == null) {
        isInValid([rentEndDate]);
        errors = errors + "Please Select Valid Renatal End Date..! \n ";
    }

    if (reserveDress.fitton_date == null) {
        isInValid([fittonDate]);
        errors = errors + "Please Select Valid Dress Fitton Date..! \n ";
    }

    if (reserveDress.rental_status == null) {
        isInValid([rentalStatus]);
        errors = errors + "Please Select Rental Status ..! \n ";
    }

    return errors;
}



const addDressResv = () => {
    console.log("add inner form dress");
    //need to check errors
    let errors = checkInnerDressFormError();

    if (errors == "") {
        //get user confirmation
        let userConfirm = confirm("Are you sure to add following dress to your reservation...?\n" +
            "\n Dress Code : " + reserveDress.dress_id.dress_code +
            "\n Dress Name : " + reserveDress.dress_id.dress_name +
            "\n Dress Rental Price : " + reserveDress.dress_rental_price +
            "\n Deposit Amount : " + reserveDress.deposit_amount +
            "\n Pre-Reservation Total : " + reserveDress.pre_reservation_total);

        if (userConfirm) {
            //add object into array
            alert("Dress Added to the Reservation Succecfully..!");
            reservation.reservationHasDressList.push(reserveDress);
            if (reservation.reservationHasDressList.length == 1) {
                reservation.rental_start_date = reserveDress.rental_start_date;
                reservation.rental_end_date = reserveDress.rental_end_date;
            } else {
                if (new Date(reservation.rental_start_date).getTime() > new Date(reservation.reservationHasDressList[1].rental_start_date).getTime()) {
                    reservation.rental_start_date = reserveDress.rental_start_date;
                }
                if (new Date(reservation.rental_end_date).getTime() < new Date(reservation.reservationHasDressList[1].rental_end_date).getTime()) {
                    reservation.rental_end_date = reserveDress.rental_end_date;
                }
            }

            refreshInnerDressFormAndTable();
            generateStartEnd();
            generateRentalEnd();

            if (reservation.reservationHasDressList.length == 2) {
                rentStrtDate.value = "";
                rentEndDate.value = "";
                fittonDate.value = "";
                weddingDate.value = "";
                rentStrtDate.className = "gradient-border form-control shadow-sm";
                rentEndDate.className = "gradient-border form-control shadow-sm";
                fittonDate.className = "gradient-border form-control shadow-sm";
                weddingDate.className = "gradient-border form-control shadow-sm";


                btnAddDressResv.disabled = true;
                SelectDressRes.disabled = true;
                rentalStatus.disabled = true;
                rentStrtDate.disabled = true;
                rentEndDate.disabled = true;
                fittonDate.disabled = true;
            } else {
                rentStrtDate.value = "";
                rentEndDate.value = "";
                fittonDate.value = "";
                weddingDate.value = "";
                rentStrtDate.className = "gradient-border form-control shadow-sm";
                rentEndDate.className = "gradient-border form-control shadow-sm";
                fittonDate.className = "gradient-border form-control shadow-sm";
                weddingDate.className = "gradient-border form-control shadow-sm";


                SelectDressRes.disabled = true;
                btnAddDressResv.disabled = false;
                fittonDate.disabled = true;
            }

        }
    } else {
        alert("Form has following Errors..!\n" + errors);
    }

}

const generateDressRentalPrice = () => {
    let selectedDress = JSON.parse(SelectDressRes.value);

    let existingIndex = reservation.reservationHasDressList.map(resDress => resDress.dress_id.id).indexOf(selectedDress.id);//resDress => resDress.dress_id.id ---------> oru resDress da id ya eduthu check pannuram existing aa illaya endu

    if (existingIndex != -1) {
        alert("Dress Already Selected to Reserve...!");
        btnAddDressResv.disabled = true;
    } else {
        dressRentPrice.value = parseFloat(selectedDress.price).toFixed(2);
        reserveDress.dress_rental_price = dressRentPrice.value;
        dressRentPrice.disabled = true;
        isValid([dressRentPrice]);
        btnAddDressResv.disabled = false;
    }
}

const generateDepositAmout = () => {
    let dress_rental_price = dressRentPrice.value;

    if (new RegExp("^(([1-9]{1}[0-9]{0,5})||([1-9]{1}[0-9]{0,5}[.][0-9]{2}))$").test(dress_rental_price)) {
        let deposit_amount = (parseFloat(dress_rental_price) * 0.30).toFixed(2);
        depositAmount.value = deposit_amount;
        reserveDress.deposit_amount = depositAmount.value;
        depositAmount.disabled = true;
        isValid([depositAmount]);
        rentalStatus.value = "Pending";
        reserveDress.rental_status = rentalStatus.value;
        isValid([rentalStatus]);
        // isValid([resStatus]);
    }
}

const generatePreResevTotal = () => {
    let deposit_amount = depositAmount.value;

    if (new RegExp("^(([1-9]{1}[0-9]{0,5})||([1-9]{1}[0-9]{0,5}[.][0-9]{2}))$").test(deposit_amount)) {
        preResTotal.value = (parseFloat(dressRentPrice.value) + parseFloat(deposit_amount)).toFixed(2);
        reserveDress.pre_reservation_total = preResTotal.value;
        preResTotal.disabled = true;
        isValid([preResTotal]);
    }

}


const generateNetTotal = () => {
    let resChargeValue = resCharge.value;
    let totalAmount = resTotalAmount.value;


    if (new RegExp("^(([1-9]{1}[0-9]{0,5})||([1-9]{1}[0-9]{0,5}[.][0-9]{2}))$").test(resChargeValue)) {

        let resNetTotalAmountValue = parseFloat(totalAmount) + parseFloat(resChargeValue);

        resNetTotalAmount.value = resNetTotalAmountValue.toFixed(2);
        resCharge.disabled = true;
        resNetTotalAmount.disabled = true;

        if (resNetTotalAmountValue == 5000.00) {
            resNetTotalAmount.className = "gradient-border form-control shadow-sm";
            resCharge.className = "gradient-border form-control shadow-sm";
        } else {
            isValid([resNetTotalAmount]);
            isValid([resCharge]);
            reservation.net_total = resNetTotalAmount.value;
        }
    }
}



// ##################################################################################### //
// ##################                Customer form JS                    ############### //
// ##################################################################################### //

const refreshCustomerForm = () => {

    //create empty object
    customer = {};

    //get customer status datalist for select element
    customerstatus = getServiceAjaxRequest("/customerstatus/findall");
    isValid([custStatus]);
    custStatus.disabled = true;
    fillDataIntoSelect2(custStatus, "Select Status", customerstatus, "name", 'name', 'Active');
    customer.customerstatus_id = JSON.parse(custStatus.value); // data binding

    //set default input feild styles                                             
    custFName.className = "gradient-border form-control shadow-sm";
    custLName.className = "gradient-border form-control shadow-sm";
    emailId.className = "gradient-border form-control shadow-sm";
    customerNIC.className = "gradient-border form-control shadow-sm";
    custAddress.className = "gradient-border form-control shadow-sm";
    custPhoneNumber.className = "gradient-border form-control shadow-sm";
    custStatus.className = "gradient-border form-select shadow-sm";


    //set to default color to feilds if after refreshing for
    // Remove validation classes
    var elements = document.getElementById("customerForm").querySelectorAll(".is-invalid");
    elements.forEach(function (element) {
        element.classList.remove("is-invalid");
    });


}

//define function to check form error
const checkCustomerFormError = () => {
    let errors = '';

    if (customer.first_name == null) {
        isInValid([custFName]);
        errors = errors + "Please Enter Valid First Name..! \n"
    }

    if (customer.last_name == null) {
        isInValid([custLName]);
        errors = errors + "Please Enter Valid Last Name..! \n"
    }

    if (customer.email == null) {
        isInValid([emailId]);
        errors = errors + "Please Enter Valid Email Address..! \n"
    }

    if (customer.nic == null) {
        isInValid([customerNIC]);
        errors = errors + "Please Enter Valid NIC..! \n"
    }

    if (customer.address == null) {
        isInValid([custAddress]);
        errors = errors + "Please Enter Valid Address..! \n"
    }

    if (customer.phone == null) {
        isInValid([custPhoneNumber]);
        errors = errors + "Please Enter Valid Phone Number..! \n"
    }

    if (customer.customerstatus_id == null) {
        isInValid([custStatus]);
        errors = errors + "Please Select Customer Status..! \n"
    }

    return errors;
}


//define function for submit Customer
const submitCustomer = () => {
    //console.log('submit');
    console.log(customer);

    //checking errors
    const errors = checkCustomerFormError();
    if (errors == '') {
        const userSubmitResponse = confirm('Are you sure to Submit...?');

        if (userSubmitResponse) {
            //call post service
            let postServiceResponse = getHTTPBodyAjaxRequest('/customer', 'POST', customer);

            if (postServiceResponse == "OK") {
                //if (new RegExp('^[0-9]{8}$').test(postServiceResponse)) {
                alert("Customer record successfully saved.....!\n")

                //customers list
                customers = getServiceAjaxRequest("/customer/list");
                fillDataIntoSelect2(SelectCustomer, 'Select Customer', customers, 'first_name', 'phone', custPhoneNumber.value);
                reservation.customer_id = JSON.parse(SelectCustomer.value);
                isValid([SelectCustomer]);
                refreshCustomerForm();//refresh customer form
                customerForm.reset();
                $('#offcanvasAddCustomer').offcanvas("hide");
            } else {
                alert("Failed to submit customer record! \n" + postServiceResponse);
            }
        }
    } else {
        alert("Form has following errors...\n" + errors);
    }
};