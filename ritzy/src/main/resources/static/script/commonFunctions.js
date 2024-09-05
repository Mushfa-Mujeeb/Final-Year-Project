//create funtion for get service request
const getServiceAjaxRequest = (url) => {
  let getSeviceResponse = [];

  //call jquert ajax fuction
  //aja("URL" option)
  $.ajax(url, {
    contentType: "json",
    type: "GET",
    async: false, //assycroness true enda response warum warakum wait pannathu and executes the next line, but Asyncroness false enda response warum wara wait pannum,
    success: function (data) {
      console.log("Success" + data);
      getSeviceResponse = data;
    },

    error: function (resData) {
      console.log("Error" + resData);
      getSeviceResponse = [];
    },
  });

  return getSeviceResponse;
};

//create common function for POST, PUT, DELETE mapping
const getHTTPBodyAjaxRequest = (url, method, ob) => {
  let serviceResponse;

  $.ajax(url, {
    type: method,
    contentType: "application/json",
    data: JSON.stringify(ob),
    async: false, //assycroness true enda response warum warakum wait pannathu and executes the next line, but Asyncroness false enda response warum wara wait pannum,
    success: function (data) {
      console.log("Success " + data);
      serviceResponse = data;
    },

    error: function (resData) {
      console.log("Error " + resData);
      serviceResponse = resData;
    },
  });

  return serviceResponse;

};

// create function filldatainto select element
const fillDataIntoSelect = (
  feild,
  message,
  dataList,
  property,
  selectedValue
) => {
  feild.innerHTML = "";
  const optionMsg = document.createElement("option");
  optionMsg.value = "";
  optionMsg.selected = "Selected";
  optionMsg.disabled = "Disabled";
  optionMsg.innerText = message;
  feild.appendChild(optionMsg);

  dataList.forEach((element) => {
    const option = document.createElement("option");
    option.value = JSON.stringify(element);
    option.innerText = element[property];
    if (selectedValue == element[property]) {
      option.selected = true;
    }
    feild.appendChild(option);
  });
};


// create function filldatainto select element
const fillDataIntoSelect2 = (
  feild,
  message,
  dataList,
  property, 
  selectedProperty,
  selectedValue
) => {
  feild.innerHTML = "";
  const optionMsg = document.createElement("option");
  optionMsg.value = "";
  optionMsg.selected = "Selected";
  optionMsg.disabled = "Disabled";
  optionMsg.innerText = message;
  feild.appendChild(optionMsg);

  dataList.forEach((element) => {
    const option = document.createElement("option");
    option.value = JSON.stringify(element);
    option.innerText = element[property];
    if (selectedValue == element[selectedProperty]) {
      option.selected = true;
    }
    feild.appendChild(option);
  });
};



// calculate late return days for Dress return Module
const calculateDifferentBetwTwoDays = (dateTwo, dateOne) => {
  let date1 = new Date(dateOne);
  let date2 = new Date(dateTwo);

  // Calculating the time difference
  // of two dates
  let Difference_In_Time =
    date2.getTime() - date1.getTime();

  // Calculating the no. of days between
  // two dates
  let Difference_In_Days =
    Math.round
      (Difference_In_Time / (1000 * 3600 * 24));

      return Difference_In_Days;

}



// const resetIntoDefault = (elementArray) => {
//   elementArray.forEach(element => {
//     feildId.classList.remove("is-valid");
//     feildId.classList.remove("gradient-border");
//     feildId.classList.add("is-invalid");
//   });
// }

const getCurrentDate = () => {
  let currentDate = new Date();
  const date = currentDate.toISOString().split("T")[0];
  return date;
}