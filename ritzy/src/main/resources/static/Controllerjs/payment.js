//browser onload event
window.addEventListener("load", () => {


    //check ths with under PrivilegeController after deleteMapping
    userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/PAYMENT");

    //call reservation table refresh function
    refreshReservationPayTable();

    //call payment table refresh function
    refreshPaymentTable();

    //call Invoice form function
    refreshReservationInvoiceForm();
});

const refreshReservationInvoiceForm = () => {

    //create empty object
    invoice = {};

    reservationtypes = getServiceAjaxRequest("/invoicetype/findall");
    SelectPaymentType.disabled = true;
    fillDataIntoSelect(SelectPaymentType, 'Select Payment Type', reservationtypes, 'name');

   

    //set default input feild styles                                             
    textCustName.className = "gradient-border form-control shadow-sm";
    textReservationNo.className = "gradient-border form-control shadow-sm";

    textResPayDate.className = "gradient-border form-control shadow-sm";
    resCharge.className = "gradient-border form-control shadow-sm";

    textDepositPayDate.className = "gradient-border form-control shadow-sm";
    depositAmount.className = "gradient-border form-control shadow-sm";

    textRentalPayDate.className = "gradient-border form-control shadow-sm";
    totalDressRental.className = "gradient-border form-control shadow-sm";
    refundableAmount.className = "gradient-border form-control shadow-sm";
    rentalNetTotal.className = "gradient-border form-control shadow-sm";

    textNote.className = "gradient-border form-control shadow-sm";

    SelectPaymentType.className = "gradient-border form-select shadow-sm";
    SelectResPaymentMethod.className = "gradient-border form-select shadow-sm";
    SelectDepositPaymentMethod.className = "gradient-border form-select shadow-sm";
    SelectRentalPaymentMethod.className = "gradient-border form-select shadow-sm";

    //set to default color to feilds if after refreshing for
    // Remove validation classes
    var elements = document.getElementById("InvoiceForm").querySelectorAll(".is-invalid");
    elements.forEach(function (element) {
        element.classList.remove("is-invalid");
    });

}

//define function table refresh
const refreshReservationPayTable = () => {
    //create array for store find all data

    payreservations = [];
    // payreservations = getServiceAjaxRequest("/reservation/findAll");
    payreservations = getServiceAjaxRequest("/reservation/bypayforreservation");


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
    fillDataIntoTableReservationPayment(
        tablePaymentReservation,
        payreservations,
        displaypropertyList,
        refillReservationInvoice,
        refillDepositInvoice,
        refillRentalInvoice,
        true
    );

    //disable delete button
    payreservations.forEach((element, index) => {

        if ((element.reservation_status_id.name == "Confirmed")) {
            tablePaymentReservation.children[1].children[index].children[7].children[0].style.display = "none";
        }
        if ((element.reservation_status_id.name == "On Process")) {
            tablePaymentReservation.children[1].children[index].children[7].children[0].style.display = "none";
            tablePaymentReservation.children[1].children[index].children[7].children[1].style.display = "none";
        }
    });

    //call jQuery dataTables
    $('#tablePaymentReservation').dataTable();

    tablePaymentReservation_length.children[0].style.color = "white";
    tablePaymentReservation_length.children[0].children[0].style.color = "black";

    tablePaymentReservation_filter.children[0].style.color = "white";
    tablePaymentReservation_filter.children[0].children[0].style.color = "black";
};

//define function table refresh
const refreshPaymentTable = () => {
    //create array for store find all data
    // DrCollPersons = new Object();
    // dressretpersons = getServiceAjaxRequest("/returendcollectedperson/byresstatus");

    payments = [];
    payments = getServiceAjaxRequest("/payment/findAll");


    //define display property
    const displaypropertyList = [
        { dataType: "function", propertyName: getInvoiceNo },
        { dataType: "function", propertyName: getPaidReservationNo },
        { dataType: "function", propertyName: getPaidCustomerName },
        // { dataType: "function", propertyName: getPaidAmount },
        { dataType: "amount", propertyName: "paid_amount" },
        { dataType: "function", propertyName: getPaymentDate },
        { dataType: "function", propertyName: getPaymentType }
    ];

    //call filldatainto table function
    fillDataIntoPaymentTable(
        TablePayment,
        payments,
        displaypropertyList,
        PrintPaymentButton,
        true
    );


    //call jQuery dataTables
    $('#TablePayment').dataTable();

    TablePayment_length.children[0].style.color = "white";
    TablePayment_length.children[0].children[0].style.color = "black";

    TablePayment_filter.children[0].style.color = "white";
    TablePayment_filter.children[0].children[0].style.color = "black";
};

// ############################################################################################ -- >
// ###############################    1  Reservation Invoice      ############################# -- >
// ############################################################################################ -- >

const refillReservationInvoice = (ob, rowIndex) => {

    console.log("Edit");


    payreservation = JSON.parse(JSON.stringify(ob)); //
    oldpayreservation = JSON.parse(JSON.stringify(ob));

    invoice = new Object();
    oldInvoice = null;
    invoice.reservation_id = payreservation;
    //open modal
    $("#invoiceForm").tab("show");
    //set value into static element
    //elementid.value = ob.relevantPropertyName

    textCustName.value = payreservation.customer_id.first_name;
    textCustName.disabled = true;
    textReservationNo.value = payreservation.reservaton_no;
    textReservationNo.disabled = true;

    resCharge.value = parseFloat(payreservation.reservation_charge).toFixed(2);
    invoice.total_amount = parseFloat(resCharge.value).toFixed(2);

    let currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    textResPayDate.value = date;

    //display dress
    divReservationDisplayDressDetails.innerHTML = "";
    payreservation.reservationHasDressList.forEach((rhdress, index) => {
        displayonlyDressDetails(rhdress);
    });


    reservationtypes = getServiceAjaxRequest("/invoicetype/findall");
    isValid([SelectPaymentType]);
    SelectPaymentType.disabled = true;
    fillDataIntoSelect2(SelectPaymentType, 'Select Payment Type', reservationtypes, 'name', 'name', 'Reservation Invoice');
    invoice.invoice_type_id = JSON.parse(SelectPaymentType.value); // data binding

    paymentmethods = getServiceAjaxRequest("/paymentmethod/findall");
    fillDataIntoSelect2(SelectResPaymentMethod, 'Select Payment Method', paymentmethods, 'name', 'name', 'CASH');
    isValid([SelectResPaymentMethod]);
    invoice.payment_method_id = JSON.parse(SelectResPaymentMethod.value); // data binding

    DivReservationInvoice.style.display = "block";
    DivDepositInvoice.style.display = "none";
    DivRentalInvoice.style.display = "none";
}


const displayonlyDressDetails = (rhdress) => {

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
    divReservationDisplayDressDetails.appendChild(dressDetails);




}

//calculate balance amount for payment
const calculateResBalanceAmount = () => {
    if (invoice.invoice_type_id.name == "Reservation Invoice") {
        let paidAmount = txtpaidAmount.value;
        let reservationCharge = resCharge.value;


        if (parseFloat(paidAmount) >= parseFloat(reservationCharge)) {
            txtbalanceAmount.value = parseFloat(paidAmount) - parseFloat(reservationCharge);
            invoice.balance_amount = txtbalanceAmount.value;

            invoice.paid_amount = parseFloat(paidAmount).toFixed(2);
            isValid([txtbalanceAmount]);
            isValid([txtpaidAmount]);

        } else {

            invoice.balance_amount = null;
            invoice.paid_amount = null;
            isInValid([txtbalanceAmount]);
            isInValid([txtpaidAmount]);
        }
    }
}





// ############################################################################################ -- >
// ###############################    2  Deposit Invoice      ################################# -- >
// ############################################################################################ -- >

const refillDepositInvoice = (ob, rowIndex) => {

    console.log("Edit");


    payreservation = JSON.parse(JSON.stringify(ob)); //
    oldpayreservation = JSON.parse(JSON.stringify(ob));

    invoice = new Object();
    oldInvoice = null;
    invoice.reservation_id = payreservation;

    //open modal
    $("#invoiceForm").tab("show");
    //set value into static element
    //elementid.value = ob.relevantPropertyName

    textCustName.value = payreservation.customer_id.first_name;
    textCustName.disabled = true;
    textReservationNo.value = payreservation.reservaton_no;
    textReservationNo.disabled = true;



    let currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    textDepositPayDate.value = date;
    depositAmount.value = "0.00";
    let depositamount = 0.00;
    //display dress
    divDisplayDressDetailsforDeposit.innerHTML = "";
    payreservation.reservationHasDressList.forEach((rhdress, index) => {
        displayDepositDressDetails(rhdress);
        if (rhdress.collected_date == getCurrentDate()) {
            depositamount = parseFloat(depositamount) + parseFloat(rhdress.deposit_amount);
        }

    });

    depositAmount.value = depositamount.toFixed(2);
    invoice.total_deposit_amount = depositAmount.value;



    reservationtypes = getServiceAjaxRequest("/invoicetype/findall");
    isValid([SelectPaymentType]);
    SelectPaymentType.disabled = true;
    fillDataIntoSelect2(SelectPaymentType, 'Select Payment Type', reservationtypes, 'name', 'name', 'Deposit Invoice');
    invoice.invoice_type_id = JSON.parse(SelectPaymentType.value); // data binding

    paymentmethods = getServiceAjaxRequest("/paymentmethod/findall");
    fillDataIntoSelect2(SelectDepositPaymentMethod, 'Select Payment Method', paymentmethods, 'name', 'name', 'CASH');
    isValid([SelectDepositPaymentMethod]);
    invoice.payment_method_id = JSON.parse(SelectDepositPaymentMethod.value); // data binding


    DivDepositInvoice.style.display = "block";
    DivReservationInvoice.style.display = "none";
    DivRentalInvoice.style.display = "none";

}

const displayDepositDressDetails = (rhdress, checked) => {

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
    divDisplayDressDetailsforDeposit.appendChild(dressDetails);



}

//calculate balance amount for payment
const calculateDepositBalanceAmount = () => {

    if (invoice.invoice_type_id.name == "Deposit Invoice") {
        let paidAmount = txtpaidAmount.value;
        let depositamount = depositAmount.value;


        if (parseFloat(paidAmount) >= parseFloat(depositamount)) {
            txtbalanceAmount.value = parseFloat(paidAmount) - parseFloat(depositamount);
            invoice.balance_amount = txtbalanceAmount.value;

            invoice.paid_amount = parseFloat(paidAmount).toFixed(2);
            isValid([txtbalanceAmount]);
            isValid([txtpaidAmount]);

        } else {

            invoice.balance_amount = null;
            invoice.paid_amount = null;
            isInValid([txtbalanceAmount]);
            isInValid([txtpaidAmount]);
        }
    }

}


// ############################################################################################ -- >
// ###############################    3  Rental Invoice      ################################## -- >
// ############################################################################################ -- >

const refillRentalInvoice = (ob, rowIndex) => {

    console.log("Edit");


    payreservation = JSON.parse(JSON.stringify(ob)); //
    oldpayreservation = JSON.parse(JSON.stringify(ob));

    invoice = new Object();
    oldInvoice = null;
    invoice.reservation_id = payreservation;

    //open modal
    $("#invoiceForm").tab("show");
    //set value into static element
    //elementid.value = ob.relevantPropertyName

    textCustName.value = payreservation.customer_id.first_name;
    textCustName.disabled = true;
    textReservationNo.value = payreservation.reservaton_no;
    textReservationNo.disabled = true;



    let currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    textRentalPayDate.value = date;

    let totlRentalAmount = 0.00;
    let totlRefundAmount = 0.00;



    //display dress
    payreservation.reservationHasDressList.forEach((rhdress, index) => {
        divDisplayDressDetailsforRental.innerHTML = "";
        displayRentalPayDressDetails(rhdress);
        if (rhdress.rental_status == "Dress Returned") {
            totlRefundAmount = parseFloat(totlRefundAmount) + parseFloat(rhdress.refundable_amount)
            totlRentalAmount = parseFloat(totlRentalAmount) + parseFloat(rhdress.dress_rental_price)
        }

    });


    totalDressRental.value = totlRentalAmount.toFixed(2);
    refundableAmount.value = totlRefundAmount.toFixed(2);
    rentalNetTotal.value = (totlRentalAmount - totlRefundAmount).toFixed(2);
    invoice.total_dress_rental_price = totalDressRental.value;
    invoice.refundable_amount = refundableAmount.value;
    invoice.total_amount = rentalNetTotal.value;
    isValid([totalDressRental, refundableAmount, rentalNetTotal]);

    reservationtypes = getServiceAjaxRequest("/invoicetype/findall");
    isValid([SelectPaymentType]);
    SelectPaymentType.disabled = true;
    fillDataIntoSelect2(SelectPaymentType, 'Select Payment Type', reservationtypes, 'name', 'name', 'Dress Rental Invoice');
    invoice.invoice_type_id = JSON.parse(SelectPaymentType.value); // data binding


    paymentmethods = getServiceAjaxRequest("/paymentmethod/findall");
    fillDataIntoSelect2(SelectRentalPaymentMethod, 'Select Payment Method', paymentmethods, 'name', 'name', 'CASH');
    isValid([SelectRentalPaymentMethod]);
    invoice.payment_method_id = JSON.parse(SelectRentalPaymentMethod.value); // data binding


    DivRentalInvoice.style.display = "block";
    DivReservationInvoice.style.display = "none";
    DivDepositInvoice.style.display = "none";

}

const displayRentalPayDressDetails = (rhdress, checked) => {

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
    divDisplayDressDetailsforRental.appendChild(dressDetails);



}

//calculate balance amount for payment
const calculateRenatlBalanceAmount = () => {
    if (invoice.invoice_type_id.name == "Dress Rental Invoice") {
        let paidAmount = txtpaidAmount.value;
        let rentaltotal = rentalNetTotal.value;


        if (parseFloat(paidAmount) >= parseFloat(rentaltotal)) {
            txtbalanceAmount.value = parseFloat(paidAmount) - parseFloat(rentaltotal);
            invoice.balance_amount = txtbalanceAmount.value;

            invoice.paid_amount = parseFloat(paidAmount).toFixed(2);
            isValid([txtbalanceAmount]);
            isValid([txtpaidAmount]);

        } else {

            invoice.balance_amount = null;
            invoice.paid_amount = null;
            isInValid([txtbalanceAmount]);
            isInValid([txtpaidAmount]);
        }
    }
}


// ################################################################################# //

//define function to check form error
const checkFormError = () => {
    let errors = '';

    if (invoice.paid_amount == null) {
        isInValid([txtpaidAmount]);
        errors = errors + "Please Enter a Valid Paid Amount..! \n"
    }



    return errors;
}


const SubmitPaymentButton = (ob) => {
    //console.log('submit');
    console.log(invoice);

    //checking errors
    const errors = checkFormError();
    if (errors == '') {
        const userSubmitResponse = confirm('Are you sure to Submit...?' +
            "\n Reservation No : " + invoice.reservation_id.reservaton_no +
            "\n Customer Name : " + invoice.reservation_id.customer_id.first_name +
            "\n Payment Type : " + invoice.invoice_type_id.name);

        if (userSubmitResponse) {
            //call post service
            let postServiceResponse = getHTTPBodyAjaxRequest('/payment', 'POST', invoice);

            if (postServiceResponse == "OK") {
                alert("Payment record successfully saved.....!\n")
                //change tab
                $('#tablePayment').tab('show');
                refreshReservationPayTable();
                refreshPaymentTable();
                refreshReservationInvoiceForm();
                InvoiceForm.reset();
            } else {
                alert("Failed to submit payment record! \n" + postServiceResponse);
            }
        }
    } else {
        alert("Form has following errors...\n" + errors);
    }
}



// ################################################################################# //

// ########################################## Payment (Paid) Table ########################################## //

const getInvoiceNo = (ob) => {
    return ob.invoice_no;
}

const getPaidReservationNo = (ob) => {
    return ob.reservation_id.reservaton_no;
}
const getPaidCustomerName = (ob) => {
    return ob.reservation_id.customer_id.first_name;
}
// const getPaidAmount = (ob) => {
//     // return ob.reservation_id.customer_id.phone;
//     return ob.paid_amount;
// }

const getPaymentDate = (ob) => {
    const datetime = ob.added_datetime; // Get the datetime string
    const date = datetime.split("T")[0]; // Split by T and take the first part (date)
    return date;
}

const getPaymentType = (ob) => {
    // return ob.invoice_type_id.name;
    if (ob.invoice_type_id.name == 'Reservation Invoice') {
        return '<p style="border-radius:10px" class="btn-dressavailability-Under-Maintenance text-center fw-bold">' + ob.invoice_type_id.name + '</p>';
    }
    if (ob.invoice_type_id.name == 'Deposit Invoice') {
        return '<p style="border-radius:10px" class="btn-dressavailability-Reserved text-center fw-bold">' + ob.invoice_type_id.name + '</p>';
    }
    if (ob.invoice_type_id.name == 'Dress Rental Invoice') {
        return '<p style="border-radius:10px" class="btn-dressavailability-Available text-center fw-bold">' + ob.invoice_type_id.name + '</p>';
    }

}


// ########################################## Pay Reservation Table ########################################## //

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


const PrintPaymentButton = (rowOb) => {
console.log("print");
    
    payreservation = JSON.parse(JSON.stringify(rowOb))

    
    invoice = new Object();
    invoice.reservation_id = payreservation;

    const datetime = invoice.reservation_id.added_datetime; // Get the datetime string
    const date = datetime.split("T")[0]; // Split by T and take the first part (date)
    
    invoiceNo.innerText = invoice.reservation_id.invoice_no;
    PaymentDate.innerText = date;
    reservationType.innerText = invoice.reservation_id.invoice_type_id.name;
    totalAmount.innerText = invoice.reservation_id.total_amount;
    paidAmount.innerText = invoice.reservation_id.paid_amount;
    balanceAmount.innerText = invoice.reservation_id.balance_amount;

    let newWindow = window.open();
    newWindow.document.write("<head><link rel='stylesheet' href='/bootstrap-5.2.3/bootstrap-5.2.3-dist/css/bootstrap.min.css'/><script src='/bootstrap-5.2.3/bootstrap-5.2.3-dist/js/bootstrap.bundle.min.js'><link rel='stylesheet' href='/style/tableStyles.css'></script></head>"
        + tablePaymentPrint.outerHTML + "<script> tablePaymentPrint.removeAttribute('style') </script>"
    )
}