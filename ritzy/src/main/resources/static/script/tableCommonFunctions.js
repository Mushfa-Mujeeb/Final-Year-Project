//
const fillDataIntoTable = (
  tableId,
  datalist,
  displayColumnList,
  editFunction,
  printFunction,
  deleteFunction,
  buttonVisibility = true,
  privilegeOb = null
) => {
  //Create variable called employee table and assign table element

  const tableBody = tableId.children[1];
  tableBody.innerHTML = "";

  datalist.forEach((element, index) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayColumnList.forEach((column) => {
      const td = document.createElement("td");
      if (column.dataType == "text") {
        td.innerText = element[column.propertyName];
      }
      if (column.dataType == "function") {
        td.innerHTML = column.propertyName(element);
      }

      if (column.dataType == "photoarray") {

        let img = document.createElement("img");
        img.style.width = "75px";
        img.style.height = "100px";
        if (element[column.propertyName] == null) {
          img.src = "/image/imagePerview.jpg"
        } else {
          img.src = atob(element[column.propertyName]);
        }

        td.appendChild(img);
      }


      if (column.dataType == "amount") {

        td.innerHTML = "<b>Rs. </b>" + parseFloat(element[column.propertyName]).toFixed(2);

      }
      tr.appendChild(td);
    });

    const tdButton = document.createElement("td");

    const buttonEdit = document.createElement("button");
    buttonEdit.className = "btn btn-edit me-2";
    buttonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Edit';
    buttonEdit.onclick = function () {
      console.log("Edit");
      editFunction(element, index);
    };


    const buttonPrint = document.createElement("button");
    buttonPrint.className = "btn btn-view";
    buttonPrint.innerHTML = '<i class="fa-solid fa-print"></i> Print';
    buttonPrint.onclick = function () {
      console.log("print");
      printFunction(element, index);
    };


    // const buttonEdit = document.createElement("button");
    // buttonEdit.className = "btn btn-view";
    // buttonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Edit';
    // buttonEdit.onclick = function () {
    //   console.log("view");
    //   editFunction(element, index);
    // };
    // tdButton.appendChild(buttonEdit); //add edit button into column

    const buttonDelete = document.createElement("button");
    buttonDelete.className = "btn btn-cancel  me-2";
    buttonDelete.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';
    buttonDelete.onclick = function () {
      // console.log("Delete");
      deleteFunction(element, index);
    };


    if (buttonVisibility) {

      if (privilegeOb != null && privilegeOb.update) {
        tdButton.appendChild(buttonEdit); //add edit button into column
      }
      if (privilegeOb != null && privilegeOb.delete) {
        tdButton.appendChild(buttonDelete); //add delete button into column
      }



      tdButton.appendChild(buttonPrint); //add print button into column


      tr.appendChild(tdButton); //append tdbutton into table row
    }

    tableBody.appendChild(tr);
  });
};


const fillDataIntoTableResvCollRet = (
  tableId,
  datalist,
  displayColumnList,
  editFunction
  // buttontext
) => {
  //Create variable called employee table and assign table element

  const tableBody = tableId.children[1];
  tableBody.innerHTML = "";

  datalist.forEach((element, index) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayColumnList.forEach((column) => {
      const td = document.createElement("td");
      if (column.dataType == "text") {
        td.innerText = element[column.propertyName];
      }
      if (column.dataType == "function") {
        td.innerHTML = column.propertyName(element);
      }
      if (column.dataType == "amount") {

        td.innerHTML = "<b>Rs. </b>" + parseFloat(element[column.propertyName]).toFixed(2);

      }
      tr.appendChild(td);
    });

    const tdButton = document.createElement("td");

    const buttonEdit = document.createElement("button");
    buttonEdit.className = "btn btn-edit me-2";
    buttonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Edit Reservation' ;
    // buttonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>' + buttontext;
    buttonEdit.onclick = function () {
      console.log("Edit");
      editFunction(element, index);
    };


    tdButton.appendChild(buttonEdit); //add edit button into column


    tr.appendChild(tdButton); //append tdbutton into table row


    tableBody.appendChild(tr);
  });
};

// this table function is only for Payment module(reservation Table)
const fillDataIntoTableReservationPayment = (
  tableId,
  datalist,
  displayColumnList,
  editFunction1,
  editFunction2,
  editFunction3,
  buttonVisibility = true
) => {
  //Create variable called employee table and assign table element

  const tableBody = tableId.children[1];
  tableBody.innerHTML = "";

  datalist.forEach((element, index) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayColumnList.forEach((column) => {
      const td = document.createElement("td");
      if (column.dataType == "text") {
        td.innerText = element[column.propertyName];
      }
      if (column.dataType == "function") {
        td.innerHTML = column.propertyName(element);
      }
      if (column.dataType == "amount") {

        td.innerHTML = "<b>Rs. </b>" + parseFloat(element[column.propertyName]).toFixed(2);

      }
      tr.appendChild(td);
    });

    const tdButton = document.createElement("td");

    const buttonEdit1 = document.createElement("button");
    buttonEdit1.className = "btn btn-pay2 mb-3";
    buttonEdit1.style = "width: 200px";
    buttonEdit1.innerHTML = 'Reservation Payment';
    buttonEdit1.onclick = function () {
      console.log("Edit");
      editFunction1(element, index);
    };


    const buttonEdit2 = document.createElement("button");
    buttonEdit2.className = "btn btn-pay1 mb-3";
    buttonEdit2.style = "width: 200px";
    buttonEdit2.innerHTML = 'Deposit Payment';
    buttonEdit2.onclick = function () {
      console.log("Edit");
      editFunction2(element, index);
    };



    const buttonEdit3 = document.createElement("button");
    buttonEdit3.className = "btn btn-pay mb-2";
    buttonEdit3.style = "width: 200px";
    buttonEdit3.innerHTML = 'Rental Payment';
    buttonEdit3.onclick = function () {
      console.log("Edit");
      editFunction3(element, index);
    };

    if (buttonVisibility) {

      tdButton.appendChild(buttonEdit1); //add payement1 button into column
      tdButton.appendChild(buttonEdit2); //add payement2 button into column
      tdButton.appendChild(buttonEdit3); //add payement3 button into column

      tr.appendChild(tdButton); //append tdbutton into table row
    }


    tableBody.appendChild(tr);
  });
};


// this table function is only for Payment module(Payment Table)
const fillDataIntoPaymentTable = (
  tableId,
  datalist,
  displayColumnList,
  printFunction,
  buttonVisibility = true
) => {
  //Create variable called employee table and assign table element

  const tableBody = tableId.children[1];
  tableBody.innerHTML = "";

  datalist.forEach((element, index) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayColumnList.forEach((column) => {
      const td = document.createElement("td");
      if (column.dataType == "text") {
        td.innerText = element[column.propertyName];
      }
      if (column.dataType == "function") {
        td.innerHTML = column.propertyName(element);
      }
      if (column.dataType == "amount") {

        td.innerHTML = "<b>Rs. </b>" + parseFloat(element[column.propertyName]).toFixed(2);

      }
      tr.appendChild(td);
    });

    const tdButton = document.createElement("td");

    const buttonPrint = document.createElement("button");
    buttonPrint.className = "btn btn-view me-2";
    buttonPrint.innerHTML = '<i class="fa-solid fa-print"></i> Print';
    buttonPrint.onclick = function () {
      console.log("Edit");
      printFunction(element, index);
    };

    if (buttonVisibility) {

      tdButton.appendChild(buttonPrint); //add edit button into column


      tr.appendChild(tdButton); //append tdbutton into table row

    }



    tableBody.appendChild(tr);
  });
};



const fillDataIntoInnerTable = (
  tableId,
  datalist,
  displayColumnList,
  editFunction,
  deleteFunction,
  buttonVisibility = true
) => {
  //Create variable called employee table and assign table element

  const tableBody = tableId.children[1];
  tableBody.innerHTML = "";

  datalist.forEach((element, index) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.innerText = index + 1;
    tr.appendChild(tdIndex);

    displayColumnList.forEach((column) => {
      const td = document.createElement("td");
      if (column.dataType == "text") {
        td.innerText = element[column.propertyName];
      }
      if (column.dataType == "function") {
        td.innerHTML = column.propertyName(element);
      }
      if (column.dataType == "amount") {

        td.innerHTML = "<b>Rs. </b>" + parseFloat(element[column.propertyName]).toFixed(2);

      }
      tr.appendChild(td);
    });

    const tdButton = document.createElement("td");

    const buttonEdit = document.createElement("button");
    buttonEdit.type = 'button';
    buttonEdit.className = "btn btn-edit me-2";
    buttonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    buttonEdit.onclick = function () {
      console.log("Edit");
      editFunction(element, index);
    };


    const buttonDelete = document.createElement("button");
    buttonDelete.type = 'button';
    buttonDelete.className = "btn btn-cancel  me-2";
    buttonDelete.innerHTML = '<i class="fa-solid fa-trash"></i>';
    buttonDelete.onclick = function () {
      // console.log("Delete");
      deleteFunction(element, index);
    };


    if (buttonVisibility) {
      tdButton.appendChild(buttonEdit); //add edit button into column

      tdButton.appendChild(buttonDelete); //add delete button into column

      tr.appendChild(tdButton); //append tdbutton into table row
    }

    tableBody.appendChild(tr);
  });
};