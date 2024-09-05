// browser onload event
window.addEventListener("load", () => {

  //check ths with under PrivilegeController after deleteMapping
  userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/DRESS_CATALOG");


  dressavailabilities = getServiceAjaxRequest("/dressavailability/findAll");

  availdresses = getServiceAjaxRequest("/dress/findAll");

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



  //call table refresh function
  refreshDressTable();

});






const generateReport = () => {
  //availdresses list

  let fittonDate = generateStartEnd();
  let rentEndDate = generateRentalEnd();

  availdresses = getServiceAjaxRequest("/reportdressdata/availablelistbyfded/" + fittonDate + "/" + rentEndDate);



  //call table refresh function
  refreshDressTable();


}


//function to generate Start end date from Wedding date
const generateStartEnd = () => {

  // #################### rental start date max min #################### //
  let minDateFD = new Date(weddingDate.value);

  minDateFD.setDate(minDateFD.getDate() - 5);


  let minMonthFD = minDateFD.getMonth() + 1;
  if (minMonthFD < 10) {
    minMonthFD = '0' + minMonthFD;
  }

  let minDayFD = minDateFD.getDate();
  if (minDayFD < 10) {
    minDayFD = '0' + minDayFD;
  }

  return minDateFD.getFullYear() + '-' + minMonthFD + '-' + minDayFD;

}


//function to generate rental end date from rental start date
const generateRentalEnd = () => {

  //rental End date date max min
  let rentalEndDate = new Date(weddingDate.value);

  rentalEndDate.setDate(rentalEndDate.getDate() + 2);

  let maxMonthRE = rentalEndDate.getMonth() + 1;
  if (maxMonthRE < 10) {
    maxMonthRE = '0' + maxMonthRE;
  }

  let maxDayRE = rentalEndDate.getDate();
  if (maxDayRE < 10) {
    maxDayRE = '0' + maxDayRE;
  }

  return rentalEndDate.getFullYear() + '-' + maxMonthRE + '-' + maxDayRE;


}


const refreshDressTable = () => {
  const displayProperty = [
    { dataType: "text", propertyName: "dress_code" },
    { dataType: "photoarray", propertyName: "image" },
    { dataType: "text", propertyName: "dress_name" },
    // { dataType: "function", propertyName: getDressRentalPrice },
    { dataType: "amount", propertyName: "price" }

  ];

  fillDataIntoTable(
    tableDressReport,
    availdresses,
    displayProperty,
    DressFormRefill,
    printDress,
    deleteDress,
    false,
    userPrivilege
  );


};





//function for refill dress form
const DressFormRefill = (ob, rowIndex) => {
  console.log("Edit");

  availdress = JSON.parse(JSON.stringify(ob)); //
  oldavaildress = JSON.parse(JSON.stringify(ob));

  //open modal
  $("#dressForm").tab("show");
  //set value into static element
  //elementid.value = ob.relevantPropertyName

  dressName.value = dress.dress_name;
  dressPrice.value = dress.price;
  //dressImage.value = dress.image;


  if (dress.note != null) textNote.value = dress.note; else textNote.value;
  //get dress name list 
  dresstypes = getServiceAjaxRequest("/dresstype/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressType, "Select Dress Type", dresstypes, "name", dress.dress_type_id.name);
  dressType.disabled = true;


  //get dress style list 
  dressstyles = getServiceAjaxRequest("/dressstyle/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressStyle, "Select Dress Style", dressstyles, "name", dress.style_id.name);
  dressStyle.disabled = true;

  //get dress categories list 
  dresscategories = getServiceAjaxRequest("/dresscategory/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressCategory, "Select Dress Category", dresscategories, "name", dress.category_id.name);
  dressCategory.disabled = true;

  //get dress size list 
  dresssizes = getServiceAjaxRequest("/dresssize/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressSize, "Select Dress Size", dresssizes, "name", dress.sizes_id.name);
  dressSize.disabled = true;

  //get dress condition list 
  dressconditions = getServiceAjaxRequest("/dresscondition/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressCondition, "Select Dress Condition", dressconditions, "name", dress.dress_condition_id.name);

  //get dress Availibility list 
  dressavailabilities = getServiceAjaxRequest("/dressavailability/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressAvailability, "Select Dress Availibility", dressavailabilities, "name", dress.dressavailability_id.name);


  //----------------------------------------------//

  if (userPrivilege.update_privilege) {
    btnEditDress.disabled = false;
    btnEditDress.style.cursor = "pointer";
  } else {
    btnEditDress.disabled = true;
    btnEditDress.style.cursor = "not-allowed";
  }

  btnSubmitDress.disabled = true;
  btnEditDress.disabled = false;

  btnSubmitDress.style.cursor = "not-allowed";
  btnEditDress.style.cursor = "pointer";

}

const getDressType = (ob) => {
  return ob.dress_type_id.name;
}

const getDressStyle = (ob) => {
  return ob.style_id.name;
}
const getDressSize = (ob) => {
  return ob.sizes_id.name;
}

const getDressAvailability = (ob) => {
  if (ob.dressavailability_id.name == 'Available') {
    return '<p style="border-radius:10px " class="btn-dressavailability-Available text-center fw-bold">' + ob.dressavailability_id.name + '</p>';
  }

  if (ob.dressavailability_id.name == 'Reserved') {
    return '<p style="border-radius:10px " class="btn-dressavailability-Reserved text-center fw-bold" >' + ob.dressavailability_id.name + '</p>';
  }

  if (ob.dressavailability_id.name == 'Under - Maintenance') {
    return '<p style="border-radius:10px " class="btn-dressavailability-Under-Maintenance text-center fw-bold">' + ob.dressavailability_id.name + '</p>';
  }

  if (ob.dressavailability_id.name == 'Out of Stock') {
    return '<p style="border-radius:10px "  class="btn-dressavailability-OutofStock text-center fw-bold">' + ob.dressavailability_id.name + '</p>';
  }

}





const printDress = () => {

}


const deleteDress = (ob, rowIndex) => {

};

