// browser onload event
window.addEventListener("load", () => {

  //check ths with under PrivilegeController after deleteMapping
  userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/DRESS_REQUEST");

  //call table refresh function
  refreshDressPReqTable();

});

const refreshDressPReqTable = () => {
  dprequests = [];
  dprequests = getServiceAjaxRequest("/pendingpurchaserequestslist");

  const displayProperty = [
    { dataType: "function", propertyName: getDesignerName },
    { dataType: "function", propertyName: getDressName },
    { dataType: "text", propertyName: 'required_date' },
    { dataType: "function", propertyName: getUrgencyLevel },
    { dataType: "function", propertyName: getPRStatus }

  ];

  fillDataIntoTable(
    tableDressPReqPending,
    dprequests,
    displayProperty,
    DressPRFormRefill,
    printDressPR,
    deleteDressPR,
    false,
    userPrivilege
  );


}





const DressPRFormRefill = (ob) => {}
const printDressPR = (ob) => {}
const deleteDressPR = (ob) => {}


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

