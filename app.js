const addSaveBtn = document.querySelector('.button'),
      phone      = document.querySelector('#phone'),
      email      = document.querySelector('#email'),
      fullName   = document.querySelector('#name'),
      address    = document.querySelector('#address'),
      table      = document.querySelector('.AddressBook').querySelector('tbody'),
      addForma   = document.querySelector('.FormaAddingNotice'),
      FormaSF    = document.querySelector('.FormaSF'),
      searchFd   = FormaSF.querySelector('.searchField'),
      searchBtn  = FormaSF.querySelector('.button'),
      adrBkName  = table.querySelector('.name'),
      errField   = addForma.querySelector('.errField'),
      addRow     = addForma.querySelectorAll('.row'),
      fields     = addForma.querySelectorAll('.colum');

let isEdit   = false,
    editRow  = null,
    id       = 0;
// Load data from local storage
LoadRowsFromLocalStore();

// Edd event block
addSaveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    ClearErrors();
    if(isEdit){
        let vphone    = phone.value,
            vemail    = email.value,
            vfullName = fullName.value,
            vaddress  = address.value;

        if(Validation(vphone, vemail, vfullName, vaddress)){
            SaveEditRow(editRow, vphone, vfullName, vemail, vaddress);
            ClearInputs();
        }
    }else{
        let vphone    = phone.value,
            vemail    = email.value,
            vfullName = fullName.value,
            vaddress  = address.value;

        if(Validation(vphone, vemail, vfullName, vaddress)){
            id++;
            let tr = CreateRow(vphone, vemail, vfullName, vaddress, id);
            localStorage.setItem(0, JSON.stringify(id));
            AddRowToLocalStor(tr, id);
            ClearInputs();
        }
    }
});

adrBkName.addEventListener('click', (e) => {
    let rows  = table.querySelectorAll('.row')
        names = [];
    for(let i = 0; i < rows.length; i++){
        names.push(rows[i].querySelector('.name').textContent);
    }
    bubbleSort(names);
})

searchBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    let rows      = table.querySelectorAll('.row'),
        outputRow = FormaSF.querySelector('.outputRow'),
        names     = [],
        p         = document.createElement('p'),
        currRow   = null;
    for(let i = 0; i < rows.length; i++){
        names.push(rows[i].querySelector('.name').textContent);
    }
    if(outputRow.querySelector('.row')){console.log('+');outputRow.querySelector('.row').remove()}
    bubbleSort(names);    // first sort because of binarySearch
    p.className = "row";
    currRow = binarySearch(searchFd.value, names);
    if(currRow === -1) {Errors('Name is not found');}
    p.innerHTML = `Number in the list is:  ${currRow+1} | ${rows[currRow].querySelector('.phone').textContent} | ${searchFd.value} | ${rows[currRow].querySelector('.email').textContent} | ${rows[currRow].querySelector('.address').textContent}`  ;
    outputRow.append(p);
})


function CreateRow(phone, email, fullName, address, id){
    let tr = document.createElement('tr');
    tr.className = "row";
    tr.innerHTML = `<td class='colum phone'>${phone}</td>
                    <td class='colum name'>${fullName}</td>
                    <td class='colum email'>${email}</td>
                    <td class='colum address'>${address}</td>
                    <td class='colum'>
                        <button class='editButton'>Edit</button>
                        <button class='deleteButton'>Delete</button>
                    </td>
                `;

    tr.querySelector('.editButton').addEventListener('click', e=>{
        if(isEdit){
            ClearEditFlag(editRow);
            isEdit = true;
            EditRow(tr);
        }else{
            isEdit = true;
            EditRow(tr);
        }
        
    });

    tr.querySelector('.deleteButton').addEventListener('click', ()=>{
        DeleteRow(tr, id);
    });

    table.append(tr); 
    
    return tr;
}

//Validation block

function Validation(phone, email, fullName, address){
        if(CheckEmpty() && PhoneValidation(phone) && EmailValidation(email) && NameValidation(fullName) && AddressValidation(address)){
            return true;
        }
}

function CheckEmpty(){
    if(fields[0].value && fields[1].value && fields[2].value && fields[3].value){
        return true;
    }
    else{
        for(let i = 0; i < fields.length; i++){
            if(!fields[i].value){
                addRow[i].style.cssText = "border:0.5px solid red; border-bottom: none;";
                Errors(`Empty field ${fields[i].id}`);
            }
        }
    }   
}

function PhoneValidation(phone){
    let regex = /^[\d\(\)\ -]{9}\d$/;
    if(!regex.test(phone)){
        Errors('Wrong phone');
    }else{
        return true;
    }
}

function EmailValidation(email){
    let regex = /^[\w]{1}[\w-\.]*@[\w-]+\.[a-z]{2,4}$/i;
    if(!regex.test(email)){
        Errors('Wrong email');
    }else{
        return true;
    }
}

function NameValidation(fullName){
    let regex = /^[a-z A-Z ]+$/;

    if(!regex.test(fullName)){
        Errors('Wrong name');
    }else{
        return true;
    }
}

function AddressValidation(address){
    let regex = /^[a-z A-Z]+,+[\d a-z A-Z ]+,+[ \d]+$/;

    if(!regex.test(address)){
        Errors('Wrong address');
    }else{
        return true;
    }
}

function Errors(err){
    let p = document.createElement('p');
    p.className = "error";
    p.innerHTML = err;
    errField.append(p);
}

function ClearErrors(){
    let errors = errField.querySelectorAll('.error');
    for(let i = 0; i < errors.length; i++){
        errors[i].remove();
    }
}

function ClearInputs(){
    phone.value    = '';
    email.value    = '';
    fullName.value = '';
    address.value  = '';
}

//Edit|Delete block

function EditRow(row){
    const _phone   = row.querySelector('.phone').textContent,
          _name    = row.querySelector('.name').textContent,
          _email   = row.querySelector('.email').textContent,
          _address = row.querySelector('.address').textContent;
    row.style.cssText = "background-color:#f2e580;";
    phone.value = _phone;
    fullName.value = _name;
    email.value =_email;
    address.value = _address;
    editRow = row;
}

function SaveEditRow(row, phone, name, email, address){
    row.querySelector('.phone').textContent   = phone;
    row.querySelector('.name').textContent    = name;
    row.querySelector('.email').textContent   = email;
    row.querySelector('.address').textContent = address;
    row.querySelector('.phone').value = phone.value;
    ClearEditFlag(row);
}

function ClearEditFlag(row){
    row.style.cssText = "background-color:white;";
    isEdit = false;
    editRow = null;
}

function DeleteRow(row, index){
    row.remove();
    localStorage.removeItem(index);
}

//Input data to local stor and Load it

function AddRowToLocalStor(row, id){
    const obj = {
        id     : id,
        phone  : row.querySelector('.phone').textContent,
        name   : row.querySelector('.name').textContent,
        email  : row.querySelector('.email').textContent,
        address: row.querySelector('.address').textContent
    };

    let serilObj = JSON.stringify(obj);
    try {
        localStorage.setItem(id, serilObj);
      } catch (e) {
        if (e == QUOTA_EXCEEDED_ERR) {
            Errors('limith, pleas delete notice');
        }
      } 
}

function LoadRowsFromLocalStore(){
    let currentLocalStoreg = null;
    id = JSON.parse(localStorage.getItem(0));
    numOfRow = localStorage.length-1;
    for(let i = 1; i <= id; i++){ // 0 element is index, so start from 1
        if(localStorage.getItem(i) !== null){
            currentLocalStoreg = JSON.parse(localStorage.getItem(i));
            CreateRow(currentLocalStoreg.phone, currentLocalStoreg.email, currentLocalStoreg.name, currentLocalStoreg.address, currentLocalStoreg.id);
        }
        
    }
}


//Algorithms bubbleSort and binarySearch
const bubbleSort = arr => {
    const rows = table.querySelectorAll('.row');
    for (let i = 0, endI = arr.length - 1; i < endI; i++) {
        let wasSwap = false;
        for (let j = 0, endJ = endI - i; j < endJ; j++) {
            if (arr[j] > arr[j + 1]) {
            let index = rows[j],
                nextRow = rows[j+1];
                temp = index.innerHTML;
                index.innerHTML = nextRow.innerHTML;
                nextRow.innerHTML = temp;
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                wasSwap = true;
            }
        }
        if (!wasSwap) break;
    }
    return arr;
};

function binarySearch(value, list) {

    let first    = 0,    
        last     = list.length-1,   
        position = -1,
        found    = false,
        middle   = null;
 
    while (found === false && first <= last) {
        middle = Math.floor((first + last)/2);
        if (list[middle] == value) {
            found = true;
            position = middle;
        } else if (list[middle] > value) { 
            last = middle - 1;
        } else { 
            first = middle + 1;
        }
    }
    return position;
}

