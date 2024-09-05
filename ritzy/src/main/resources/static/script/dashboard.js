// browser onload event
window.addEventListener("load", () => {

    // //check ths with under PrivilegeController after deleteMapping
    // userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/CUSTOMER");


    //call table refresh function
    designerviewTable();

});


//funtion to sign out button


const btnSignOut = () => {
    let userConfirm = confirm("Are you sure to sign out ?");
    if (userConfirm) {
        window.location.assign("/logout");
    }
}

const refreshProfileEditForm = () => {
    loggedUser = getServiceAjaxRequest("/loggeduser");
    oldloggedUser = null;

    userNameSetting.value = loggedUser.username;
    emailIdSetting.value = loggedUser.email;

    userNameSetting.className = "gradient-border form-control shadow-sm";
    textPasswordSetting.className = "gradient-border form-control shadow-sm";
    rePasswordSetting.className = "gradient-border form-control shadow-sm";
    emailIdSetting.className = "gradient-border form-control shadow-sm";

    textPasswordSetting.value = "";
    rePasswordSetting.value = "";

}

// const designerview = () => {

// }

const designerviewTable = () => {

    

    designerviews = [];
    designerviews = getServiceAjaxRequest("/designersview/purchaserequest");

    const displayProperty = [
        { dataType: "function", propertyName: getDesignerName },
        { dataType: "function", propertyName: getDressName },
        { dataType: "text", propertyName: getRequiredDate },
        { dataType: "function", propertyName: getUrgencyLevel },
        { dataType: "function", propertyName: getPRStatus }
    ];

    fillDataIntoTable(
        tabledesignerview,
        designerviews,
        displayProperty,
        customerFormRefill,
        printCustomer,
        deleteCustomer,
        false
    );

};



//top nav setting save button
const buttonUserSettingsSumbit = () => {
    console.log(loggedUser);

    let putServiceResponse;
    //= getHTTPBodyAjaxRequest("/changeuser", "PUT", loggedUser);


    $.ajax("/changeuser", {
        async: false,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(loggedUser),
        success: function (successOb) {
            console.log("Success");
            putServiceResponse = successOb;
        },
        error: function (errorOb) {
            console.log("error");
            if (errorOb.status == 200 && errorOb.responseText == "OK") {
                putServiceResponse = "OK";
            } else {
                putServiceResponse = errorOb;
            }

        }
    });
    console.log(putServiceResponse);
    if (putServiceResponse == "OK") {
        //if (new RegExp('^[0-9]{8}$').test(postServiceResponse)) {
        alert("User Settings Update successfully changed.....!\n")
        window.location.assign("/logout");
    } else {
        alert("Failed to update User Settings! \n" + putServiceResponse);
    }
}


const customerFormRefill = () => { }
const printCustomer = () => { }
const deleteCustomer = () => { }


const getRequiredDate = () => { }


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