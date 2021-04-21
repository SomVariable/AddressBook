
const REQUESTURL       = 'http://my-json-server.typicode.com/achubirka/db/products',
      SHOPINNER        = document.querySelector('.shop').querySelector('.container').querySelector('.shop__inner'),
      BASKET           = SHOPINNER.querySelector('.basket'),
      ITEMS            = BASKET.querySelector('.items'),
      REDUCER          = (accumulator, currtentValue)=>{return accumulator + currtentValue;};

let AVAILABLEPRODUCT = [],
    PRODUCTSINBASKET = [],
    CountersProducts = [],
    PRODUCTPRICE     = [],
    TOTAL            = SHOPINNER.querySelector('.total').querySelector('.total__price');


function sendRequest(method, url) {

return fetch(url, {
  method: method
  }).then(response => {
    if (response.ok) {
      return response.json()
    }

    return response.json().then(error => {
        const e = new Error('Что-то пошло не так')
        e.data = error
        throw e
    })
  })
}

sendRequest('GET', REQUESTURL)
  .then(data => {
  addProductList(data);
  LoadRowsFromLocalStore();
  })
  .catch(err => console.log(err))

function addProductList(data){
  const SHOPITEMS = SHOPINNER.querySelector('.shop__item');
  let ul = document.createElement('ul');
  ul.className = 'list_ul';
  for(let i = 0; i<data.length; i++){
    AVAILABLEPRODUCT.push(data[i].available);
    let li = document.createElement('li');
    li.innerHTML = `<p class = 'name'>${data[i].name}</p>
                    <p>som short description</p>
                    <div>price: <span class = 'price'>${data[i].price}</span> <button class = '${data[i].available>0?'active':'disablet'}' data-index="${i}">ADD</button></div>`;
    ul.append(li);
    CountersProducts[i] = 0;
  }
  SHOPITEMS.append(ul);

}

SHOPINNER.addEventListener('click', e=>{
  if(e.target.className === 'active' || e.target.className === 'btn add'  || e.target.className ==='btn delete'){
  const target = e.target,
    LIST       = SHOPINNER.querySelector('.shop__item').querySelector('.list_ul').querySelectorAll('li'),
    DIV        = LIST[target.dataset.index].querySelector('div'),
    ADDBUTTON  = DIV.querySelector('.active')?DIV.querySelector('.active'):DIV.querySelector('.disablet'),
    id         = Array.prototype.indexOf.call(ITEMS.children, target.parentNode);
  if (target.className === 'active' && AVAILABLEPRODUCT[target.dataset.index] > 0) {
    const name   = LIST[target.dataset.index].querySelector('.name').textContent,
          price  = LIST[target.dataset.index].querySelector('.price').textContent;

    if(!PRODUCTSINBASKET[target.dataset.index]){
      addProductTobasket(ADDBUTTON, name, price, target.dataset.index);
    }
  }
  if (target.className === 'btn add' && AVAILABLEPRODUCT[target.dataset.index] > 0 ) {
    incrementProduct(id, ADDBUTTON.dataset.index, ADDBUTTON, DIV);
  }else if(target.className === 'btn delete' && CountersProducts[target.dataset.index] > 0){
    decProduct(id, ADDBUTTON.dataset.index, ADDBUTTON, DIV);
  }
  TOTAL.textContent = PRODUCTPRICE.reduce(REDUCER).toFixed(2);


  AddElementToLocalstorage('AVAILABLEPRODUCT', AVAILABLEPRODUCT);
  AddElementToLocalstorage('PRODUCTSINBASKET', PRODUCTSINBASKET);
  AddElementToLocalstorage('CountersProducts', CountersProducts);
  AddElementToLocalstorage('PRODUCTPRICE', PRODUCTPRICE);
  AddElementToLocalstorage('TOTAL', TOTAL.textContent);
}
});

window.addEventListener('storage', e=>{
  const LIST = SHOPINNER.querySelector('.shop__item').querySelector('.list_ul').querySelectorAll('li');
  let currLocStorObj = null,
      products       = [];
  // Заполнение массива названиями товаров
  for(let i = 0; i < LIST.length; i++){
    products.push(LIST[i].querySelector('.name').textContent);
  }
  if(e.key === 'AVAILABLEPRODUCT'){
    AVAILABLEPRODUCT =  JSON.parse(e.newValue);
  }
  if(e.key === 'PRODUCTSINBASKET'){
    PRODUCTSINBASKET = JSON.parse(e.newValue);
  }
  if(e.key === 'CountersProducts'){
    CountersProducts = JSON.parse(e.newValue);
  }
  if(e.key === 'PRODUCTPRICE'){
    PRODUCTPRICE = JSON.parse(e.newValue);
  }
  if(e.key === 'TOTAL'){
    TOTAL.textContent = JSON.parse(e.newValue);
  }
  if(e.key === products.find((currentValue => {
    let first = e.key;
    let second = currentValue;
    if(first === second){
      return true;
    }
  }))){
    currLocStorObj = JSON.parse(localStorage.getItem(e.key));

    changeProduct(currLocStorObj);
  }
})
function changeProduct(jsonObj){
   let items = ITEMS.querySelectorAll('.item');
    //console.log(jsonObj.idInBasket);

   //items[jsonObj.idInBasket].querySelector('.price').textContent = jsonObj.price;
   //items[jsonObj.idInBasket].querySelector('.number').textContent = jsonObj.number;
  // console.log(CountersProducts[jsonObj.idInList]);
  //  if(CountersProducts[jsonObj.idInList] === 0){
  //    console.log("+");
  //    deleteProduct(items[jsonObj.idInBasket], jsonObj.idInList, jsonObj.name);
  //  }
}
function addProductTobasket(target, product, price, id){
  CountersProducts[id]++;
  PRODUCTSINBASKET[id] = true;
  AVAILABLEPRODUCT[id]--; 
  PRODUCTPRICE[id] = price - 0; // string into number
  createProduct(product, price,id);
  AddBasketToLocalstorage(ITEMS.querySelectorAll('.item').length-1, product, price, CountersProducts[id], id);
  disabletBtn(target);
}

function createProduct(product, price, id){
  let div = document.createElement('div');
  div.className = 'item';
  div.innerHTML = `<span class = 'name'>${product}</span> <span class = 'price'>${price}</span>
                    <button class = 'btn add' data-index="${id}">+</button>
                    <button class = 'btn delete' data-index="${id}">-</button>
                    <span class = 'number'>${CountersProducts[id]}</span>
                `;
  ITEMS.append(div);
}

function incrementProduct(idInBasket, idInList, btn, div){
  let CURRITEM   = ITEMS.querySelectorAll('.item')[idInBasket],
      price      = Number.parseFloat(div.querySelector('.price').textContent);
  CountersProducts[idInList]++;
  AVAILABLEPRODUCT[idInList]--;
  CURRITEM.querySelector('.number').textContent = CountersProducts[idInList];
  disabletBtn(btn);
  ChengePrice(CURRITEM, idInList, price,'+');
  AddBasketToLocalstorage(idInBasket, CURRITEM.querySelector('.name').textContent, CURRITEM.querySelector('.price').textContent, CURRITEM.querySelector('.number').textContent, idInList);
}

function decProduct(idInBasket, idInList, btn, div){
  const CURRITEM   = ITEMS.querySelectorAll('.item')[idInBasket],
        price      = Number.parseFloat(div.querySelector('.price').textContent);;
  CountersProducts[idInList]--;
  AVAILABLEPRODUCT[idInList]++;
  CURRITEM.querySelector('.number').textContent = CountersProducts[idInList];
  activeBtn(btn);
  ChengePrice(CURRITEM, idInList, price,'-');
  AddBasketToLocalstorage(idInBasket, CURRITEM.querySelector('.name').textContent, div.querySelector('.price').textContent, CURRITEM.querySelector('.number').textContent, idInList);
  if(CountersProducts[idInList] === 0){
    deleteProduct(CURRITEM, idInList, CURRITEM.querySelector('.name').textContent);
  }
}
function deleteProduct(target, idInList, name){
  PRODUCTSINBASKET[idInList] = false;
  localStorage.getItem(name)?localStorage.removeItem(name):null;
  target.remove();
}

function disabletBtn(target){
  if(AVAILABLEPRODUCT[target.dataset.index] === 0){
  target.className = 'disablet';
  }
}
function activeBtn(target){
  if(AVAILABLEPRODUCT[target.dataset.index] > 0){
  target.className = 'active';
  }
}
function ChengePrice(currentItem, idInList , price, operator){
  operator === '+'? PRODUCTPRICE[idInList] += price : PRODUCTPRICE[idInList] -= price;
  currentItem.querySelector('.price').textContent = PRODUCTPRICE[idInList].toFixed(2);
}

function AddElementToLocalstorage(name ,element){
  let serilObj = JSON.stringify(element);
  try {
      localStorage.setItem(name, serilObj);
  } catch (e) {
    if (e == QUOTA_EXCEEDED_ERR) {
        Errors('limith, pleas delete notice');
    }
  }
}

function AddBasketToLocalstorage(idInBasket, name, price, number, idInList){
  const obj = {
        name      : name,
        price     : price,
        number    : number,
        idInList  : idInList,
        idInBasket: idInBasket
      };
  let serilObj = JSON.stringify(obj);
  try {
      localStorage.setItem(name, serilObj);
  } catch (e) {
    if (e == QUOTA_EXCEEDED_ERR) {
        Errors('limith, pleas delete notice');
    }
  }
}

function LoadRowsFromLocalStore(){
  const LIST = SHOPINNER.querySelector('.shop__item').querySelector('.list_ul').querySelectorAll('li');
  let currLocStorObj = null,
      products       = [];
  // Заполнение массива названиями товаров
  for(let i = 0; i < LIST.length; i++){
    products.push(LIST[i].querySelector('.name').textContent);
  }
  //Проверка есть ли значения в локал localStorage
  if(JSON.parse(localStorage.getItem('AVAILABLEPRODUCT')) !== null) AVAILABLEPRODUCT = JSON.parse(localStorage.getItem('AVAILABLEPRODUCT'));
  if(JSON.parse(localStorage.getItem('PRODUCTSINBASKET')) !== null) PRODUCTSINBASKET = JSON.parse(localStorage.getItem('PRODUCTSINBASKET'));
  if(JSON.parse(localStorage.getItem('CountersProducts')) !== null) CountersProducts = JSON.parse(localStorage.getItem('CountersProducts'));
  if(JSON.parse(localStorage.getItem('PRODUCTPRICE')) !== null) PRODUCTPRICE = JSON.parse(localStorage.getItem('PRODUCTPRICE'));
  if(JSON.parse(localStorage.getItem('TOTAL')) !== null) TOTAL.textContent = JSON.parse(localStorage.getItem('TOTAL'));
  //Поиск по ключу из массива в котором хранятся имена продуктов
  for(let i = 0; i <= localStorage.length; i++){
    if(products.find((currentValue => {
      let first = localStorage.key(i);
      let second = currentValue;
      //сравнение localStorage.key(i) === currentValue всегда возвращало false
      if(first === second){
        currLocStorObj = first;
        return true;
      }
    })))
    {
      currLocStorObj = JSON.parse(localStorage.getItem(currLocStorObj));
      createProduct(currLocStorObj.name, currLocStorObj.price, currLocStorObj.idInList);
      disabletBtn(LIST[currLocStorObj.idInList].querySelector('div').querySelector('button'))
    }
  }
}

