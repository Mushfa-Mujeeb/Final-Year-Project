// browser onload event
window.addEventListener("load", () => {

  //check ths with under PrivilegeController after deleteMapping
  userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/DRESS_REQUEST");

  //call table refresh function
  refreshDressPReqTable();

  //call form refresh function
  // refreshDressPReqForm();

  // refreshDressForm();
});

const refreshDressPReqTable = () => {
  dprequests = [];
  dprequests = getServiceAjaxRequest("/dresspuchasereq/findAll");

  const displayProperty = [
    { dataType: "function", propertyName: getDesignerName },
    { dataType: "function", propertyName: getDressName },
    { dataType: "text", propertyName: 'required_date' },
    { dataType: "function", propertyName: getUrgencyLevel },
    { dataType: "function", propertyName: getPRStatus }

  ];

  fillDataIntoTable(
    tableDressPReq,
    dprequests,
    displayProperty,
    DressPRFormRefill,
    printDressPR,
    deleteDressPR,
    false,
    userPrivilege
  );

  //disable delete button
  dprequests.forEach((element, index) => {
    if (element.purchase_request_status_id.name == "Cancelled") {
      if (userPrivilege.delete) {
        tableDressPReq.children[1].children[index].children[6].children[1].disabled = "disabled";
      }
    }
  });

  //call jquery datatable function
  $("#tableDressPReq").dataTable();


  tableDressPReq_length.children[0].style.color = "white";
  tableDressPReq_length.children[0].children[0].style.color = "black";

  tableDressPReq_filter.children[0].style.color = "white";
  tableDressPReq_filter.children[0].children[0].style.color = "black";
}

// const refreshDressPReqForm = () => {

//   //create empty object
//   dprequest = {};

//   //designers list
//   designers = getServiceAjaxRequest("/designer/findAll");
//   fillDataIntoSelect(SelectDesigner, 'Select Designer', designers, 'designer_name');

//   //Dress Purchase Request Type list
//   prtypes = getServiceAjaxRequest("/purchasereqtype/findall");
//   fillDataIntoSelect(dressPReqType, 'Select Dress Purchase Request Type', prtypes, 'name');

//   //dress list
//   dresses = getServiceAjaxRequest("/dress/findAll");
//   fillDataIntoSelect(dressNamePR, 'Select Dress', dresses, 'dress_name');
//   dressNamePR.disabled = true;
//   btnAddNewDressPR.disabled = true;
//   isValid([dressNamePR]);

//   //urgency level list
//   urgencylevels = getServiceAjaxRequest("/urgencylevel/findall");
//   fillDataIntoSelect(urgencyLevel, 'Select Urgency Level', urgencylevels, 'name');

//   //Purchase  request Status list
//   prstatuses = getServiceAjaxRequest("/purchasereqstatus/findall");
//   fillDataIntoSelect(PRequestStatus, 'Select Request Status', prstatuses, 'name');


//   //required date max min
//   let currentDate = new Date(); // current date time
//   let maxDate = new Date(); // current date time 

//   let minMonth = currentDate.getMonth() + 1;
//   if (minMonth < 10) {
//     minMonth = '0' + minMonth;
//   }

//   let minDay = currentDate.getDate();
//   if (minDay < 10) {
//     minDay = '0' + minDay;
//   }
//   requiredDate.min = currentDate.getFullYear() + '-' + minMonth + '-' + minDay;


//   maxDate.setDate(maxDate.getDate() + 90);

//   let maxMonth = maxDate.getMonth() + 1;
//   if (maxMonth < 10) {
//     maxMonth = '0' + maxMonth;
//   }

//   let maxDay = maxDate.getDate();
//   if (maxDay < 10) {
//     maxDay = '0' + maxDay;
//   }
//   requiredDate.max = maxDate.getFullYear() + '-' + maxMonth + '-' + maxDay;


//   //set default input feild styles                                             
//   SelectDesigner.className = "gradient-border form-select shadow-sm";
//   dressPReqType.className = "gradient-border form-select shadow-sm";
//   dressNamePR.className = "gradient-border form-select shadow-sm";
//   urgencyLevel.className = "gradient-border form-select shadow-sm";
//   PRequestStatus.className = "gradient-border form-select shadow-sm";


//   dressQuantity.className = "gradient-border form-control shadow-sm";
//   allocBudget.className = "gradient-border form-control shadow-sm";
//   actualBudget.className = "gradient-border form-control shadow-sm";
//   requiredDate.className = "gradient-border form-control shadow-sm";
//   textNote.className = "gradient-border form-control shadow-sm";

//   // resetIntoDefault([dressType, dressStyle, dressCategory, dressSize,dressCondition, dressAvailability, dressName, dressPrice, dressImage, textNote])

//   //set to default color to feilds if after refreshing for
//   // Remove validation classes
//   var elements = document.getElementById("DressPReqForm").querySelectorAll(".is-invalid");
//   elements.forEach(function (element) {
//     element.classList.remove("is-invalid");
//   });

//   //--------------------------------------//

//   if (userPrivilege.insert_privilege) {
//     btnEditDressPReq.disabled = false;
//     btnEditDressPReq.style.cursor = "pointer";
//   } else {
//     btnEditDressPReq.disabled = true;
//     btnEditDressPReq.style.cursor = "not-allowed";
//   }


//   btnEditDressPReq.disabled = true;
//   btnEditDressPReq.style.cursor = "not-allowed";
//   btnSubmitDressPReq.disabled = false;
//   btnSubmitDressPReq.style.cursor = "pointer";
//   // btnSubmitDressPReq

// }

// const DressPRFormRefill = (ob, rowIndex) => {
//   console.log("Edit");

//   dprequest = JSON.parse(JSON.stringify(ob)); //
//   olddprequest = JSON.parse(JSON.stringify(ob));

//   //open modal
//   $("#dressPReqForm").tab("show");
//   //set value into static element
//   //elementid.value = ob.relevantPropertyName

//   dressQuantity.value = dprequest.quantity;
//   allocBudget.value = dprequest.budget_allocated;
//   actualBudget.value = dprequest.actual_budget;
//   requiredDate.value = dprequest.required_date;


//   if (dprequest.note != null) textNote.value = dprequest.note; else textNote.value;


//   //designers list
//   designers = getServiceAjaxRequest("/designer/findAll");
//   fillDataIntoSelect(SelectDesigner, 'Select Designer', designers, 'designer_name', dprequest.designer_id.designer_name);
//   SelectDesigner.disabled = true;

//   //Dress Purchase Request Type list
//   prtypes = getServiceAjaxRequest("/purchasereqtype/findall");
//   fillDataIntoSelect(dressPReqType, 'Select Dress Purchase Request Type', prtypes, 'name', dprequest.purchase_request_type_id.name);
//   dressPReqType.disabled = true;

//   //dress list
//   dresses = getServiceAjaxRequest("/dress/findAll");
//   fillDataIntoSelect(dressNamePR, 'Select Dress', dresses, 'dress_name', dprequest.dress_id.dress_name);
//   dressNamePR.disabled = true;

//   //urgency level list
//   urgencylevels = getServiceAjaxRequest("/urgencylevel/findall");
//   fillDataIntoSelect(urgencyLevel, 'Select Urgency Level', urgencylevels, 'name', dprequest.urgency_level_id.name);

//   //Purchase requeste status list
//   prstatuses = getServiceAjaxRequest("/purchasereqstatus/findall");
//   fillDataIntoSelect(PRequestStatus, 'Select Request Status', prstatuses, 'name', dprequest.purchase_request_status_id.name);


//   //----------------------------------------------//

//   if (userPrivilege.update_privilege) {
//     btnEditDressPReq.disabled = false;
//     btnEditDressPReq.style.cursor = "pointer";
//   } else {
//     btnEditDressPReq.disabled = true;
//     btnEditDressPReq.style.cursor = "not-allowed";
//   }

//   btnSubmitDressPReq.disabled = true;
//   btnEditDressPReq.disabled = false;

//   btnSubmitDressPReq.style.cursor = "not-allowed";
//   btnEditDressPReq.style.cursor = "pointer";
// }


const getDesignerName = (ob) => {
  return ob.designer_id.designer_name;
}


const getDressName = (ob) => {
  return ob.dress_id.dress_name;
}


const getUrgencyLevel = (ob) => {
  return ob.urgency_level_id.name;
}


const getPRStatus = (ob) => {
  if (ob.purchase_request_status_id.name == 'Received') {
    return '<p style="border-radius:10px " class="btn-dressavailability-Available text-center fw-bold">' + ob.purchase_request_status_id.name + '</p>';
  }

  if (ob.purchase_request_status_id.name == 'Requested') {
    return '<p style="border-radius:10px " class="btn-dressavailability-Under-Maintenance text-center fw-bold">' + ob.purchase_request_status_id.name + '</p>';
  }

  if (ob.purchase_request_status_id.name == 'Cancelled') {
    return '<p style="border-radius:10px "  class="btn-dressavailability-OutofStock text-center fw-bold">' + ob.purchase_request_status_id.name + '</p>';
  }

}

//
// const generateDressNamePR = () => {
//   dressNamePR.value = "";
//   dressNamePR.className = "gradient-border form-select shadow-sm"; //this shud checked bcz when u select existing dres 1st and later decides to design a new dress this field must be check empty and remove valid color function
//   if (dressPReqType.value != "") {

//     if (dprequest.purchase_request_type_id.name == 'Choose From Existing') {
//       btnAddNewDressPR.disabled = true;
//       dressNamePR.disabled = false;

//     }

//     if (dprequest.purchase_request_type_id.name == 'Design New Dress') {
//       $('#modalDressAdd').offcanvas('show');
//       dressNamePR.disabled = true;
//       btnAddNewDressPR.disabled = false;

//     }
//   }
// }

// const checkDPRFormUpdate = () => {
//   let updates = "";

//   if (dprequest.designer_id.designer_name != olddprequest.designer_id.designer_name) {
//     updates = updates + "Designer has changed " + olddprequest.designer_id.designer_name + " into " + dprequest.designer_id.designer_name + " \n";
//   }

//   if (dprequest.dress_id.dress_name != olddprequest.dress_id.dress_name) {
//     updates = updates + "Dress Name has changed " + olddprequest.dress_id.dress_name + " into " + dprequest.dress_id.dress_name + " \n";
//   }

//   if (dprequest.purchase_request_type_id.name != olddprequest.purchase_request_type_id.name) {
//     updates = updates + "Dress Category has changed " + olddprequest.purchase_request_type_id.name + " into " + dprequest.purchase_request_type_id.name + " \n";
//   }


//   if (dprequest.quantity != olddprequest.quantity) {
//     updates = updates + "Quantity has changed " + olddprequest.quantity + " into " + dprequest.quantity + " \n";
//   }

//   if (dprequest.budget_allocated != olddprequest.budget_allocated) {
//     updates = updates + "Allocated Budget has changed " + olddprequest.budget_allocated + " into " + dprequest.budget_allocated + " \n";
//   }


//   if (dprequest.actual_budget != olddprequest.actual_budget) {
//     updates = updates + "Actual Budget has changed " + olddprequest.actual_budget + " into " + dprequest.actual_budget + " \n";
//   }

//   if (dprequest.required_date != olddprequest.required_date) {
//     updates = updates + "Required Date has changed " + olddprequest.required_date + " into " + dprequest.required_date + " \n";
//   }

//   if (dprequest.urgency_level_id.name != olddprequest.urgency_level_id.name) {
//     updates = updates + "Dress Condition has changed " + olddprequest.urgency_level_id.name + " into " + dprequest.urgency_level_id.name + " \n";
//   }

//   if (dprequest.purchase_request_status_id.name != olddprequest.purchase_request_status_id.name) {
//     updates = updates + "Dress Availability has changed " + olddprequest.purchase_request_status_id.name + " into " + dprequest.purchase_request_status_id.name + " \n";
//   }


//   if (dprequest.note != olddprequest.note) {
//     updates = updates + "Note has changed " + olddprequest.note + " into " + dprequest.note + " \n";
//   }


//   return updates;
// }

// const editDressPReq = () => {
//   console.log('Edit');
//   //check form error
//   let errors = checkDPRFormError();
//   if (errors == "") {

//     //check form update
//     let updates = checkDPRFormUpdate();
//     if (updates != "") {
//       //user confirmation
//       let userConfirm = confirm(updates + "\n Are you sure to update following changes ?");
//       if (userConfirm) {
//         //call put serive request
//         let putServiceResponse;
//         $.ajax("/dresspuchasereq", {
//           async: false,
//           type: "PUT",
//           contentType: "application/json",
//           data: JSON.stringify(dprequest),
//           success: function (successOb) {
//             console.log("Success");
//             putServiceResponse = successOb;
//           },
//           error: function (errorOb) {
//             console.log("error");
//             putServiceResponse = errorOb;
//           }
//         });

//         //check put service responce
//         if (putServiceResponse == "OK") {
//           alert("Succesfully updated...!");
//           $('#tablDressPReq').tab('show'); //change tab
//           refreshDressPReqTable();//it refreshes the Employee table
//           DressPReqForm.reset(); // this is an id of dress form and it refreshs static element
//           refreshDressPReqForm(); //it refreshs dynamic behaviour

//         } else {
//           alert("Failed to Update changes...!\n" + putServiceResponse)
//         }
//       }



//     } else {
//       alert("Nothing has updated...!")
//     }

//   } else {
//     alert("Form Has Following errors...!\n" + errors);
//   }

// }

// //define function to check form error
// const checkDPRFormError = () => {
//   let errors = '';

//   if (dprequest.designer_id == null) {
//     isInValid([SelectDesigner]);
//     errors = errors + "Please Select Designer..! \n"
//   }


//   if (dprequest.purchase_request_type_id == null) {
//     isInValid([dressPReqType]);
//     errors = errors + "Please Select Request Type..! \n"
//   }


//   if (dprequest.dress_id == null) {
//     isInValid([dressNamePR]);
//     errors = errors + "Please Select Dress Name..! \n"
//   }


//   if (dprequest.urgency_level_id == null) {
//     isInValid([urgencyLevel]);
//     errors = errors + "Please Select Urgency Level..! \n"
//   }


//   if (dprequest.purchase_request_status_id == null) {
//     isInValid([PRequestStatus]);
//     errors = errors + "Please Select Status..! \n"
//   }


//   if (dprequest.required_date == null) {
//     isInValid([requiredDate]);
//     errors = errors + "Please Select Required Date..! \n"
//   }

//   if (dprequest.quantity == null) {
//     isInValid([dressQuantity]);
//     errors = errors + "Please Enter Valid Quantity..! \n"
//   }

//   if (dprequest.budget_allocated == null) {
//     isInValid([allocBudget]);
//     errors = errors + "Please Enter Valid Allocated Budget..! \n"
//   }



//   return errors;
// }

// const buttonDressPRSumbit = () => {
//   //
//   // console.log(dprequest);
//   // need to check form error
//   let errors = checkDPRFormError();
//   if (errors == "") {
//     //get user confirmation
//     const userResponse = confirm("Are you sure to add following Purchase Request Details....?" +
//       "\n Designer Name : " + dprequest.designer_id.designer_name +
//       "\n Dress Name : " + dprequest.dress_id.dress_name +
//       "\n Required Date : " + dprequest.required_date);

//     if (userResponse) {
//       //call post service
//       const postServiceResponse = getHTTPBodyAjaxRequest("/dresspuchasereq", "POST", dprequest);

//       if (postServiceResponse == "OK") {
//         alert("Dress Purchase Request form saved successfully...!");
//         $('#tablDressPReq').tab('show'); //change tab
//         refreshDressPReqTable();
//         DressPReqForm.reset(); // this is an id of dresspr form
//         refreshDressPReqForm(); // 
//       } else {
//         alert("Failed to submit Purchase Request record!\n" + postServiceResponse);
//       }
//     }


//   } else {
//     alert("Dress Purchase Request Form has Errors...!\n" + errors);
//   }
// }


const printDressPR = () => { }


const deleteDressPR = (ob, rowIndex) => {
  //get user confirmation
  const userConfirm = confirm('Are you sure to Delete following Purchase Request..? \n' +
    "\n Designer Name : " + ob.designer_id.designer_name +
    "\n Dress Name : " + ob.dress_id.dress_name);




  if (userConfirm) {
    console.log(dprequest);
    //call delete service response
    const deleteServiceRespone = getHTTPBodyAjaxRequest('/dresspuchasereq', 'DELETE', ob);
    if (deleteServiceRespone == "OK") {
      alert('Purchase Request Deleted Successfully..!');
      refreshDressPReqTable();
    } else {
      alert('Failed delete purchase request : You have folllowing errors \n' + deleteServiceRespone);
    }
  } else {
    refreshDressPReqTable();
  }
}


