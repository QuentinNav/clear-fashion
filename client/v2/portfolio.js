// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let favorites =[];


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectRecentlyReleased= document.querySelector('#recently-released');
const selectReasonablePrice=document.querySelector('#reasonable-price');
const selectSort = document.querySelector('#sort-select');
const selectNbProduct = document.querySelector('#nbProducts');
const selectNbNewProducts = document.querySelector('#nbNewProducts');
const selectP50 =document.querySelector('#p50');
const selectP90 =document.querySelector('#p90');
const selectP95 =document.querySelector('#p95');
const selectLastReleasedDate=  document.querySelector('#lastReleasedDate');
const selectFavoriteButton= document.querySelector('.favorite');

const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

/**
const test = document.querySelector('#test084a85edbb995cb89170d032480455bf');

test.addEventListener("mouseover",async (event) => {
  console.log("test");
});
*/

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};




/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
        var str= ""
        if(favorites.includes(product.uuid))
        {
            str=`<div class="product" id="${product.uuid}">
                 <button class="favorite" id="uuid${product.uuid}" type="button" value="uuid${product.uuid}">remove from favorites</button>
                 <span>${product.brand}</span>
                 <a href="${product.link}" target="_blank">${product.name}</a>
                 <span>${product.price}</span>
                 </div>`;
        }
        else{
            str=`<div class="product" id="${product.uuid}">
                 <button class="favorite" id="uuid${product.uuid}" type="button" value="uuid${product.uuid}">add to favorites</button>
                 <span>${product.brand}</span>
                 <a href="${product.link}" target="_blank">${product.name}</a>
                 <span>${product.price}</span>
                 </div>`;
        }
      console.log(str);
      return str;
    })
    .join('');


  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');
  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const renderBrands = brand_names =>{
    var template =[];
    for(let i=0; i<brand_names.length;i++){
        template[i]=`<option value="${brand_names[i]}">${brand_names[i]}</option>`
    };
    template=template.join('');
    selectBrand.innerHTML = template;
}

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);

};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


/**
*Select the number of the page to display
*/
selectPage.addEventListener('change',async (event) =>{
    const pagination =await fetchProducts(parseInt(event.target.value), currentProducts.products);

    setCurrentProducts(pagination);
    render(currentProducts,currentPagination);
});


selectBrand.addEventListener('change',async(event)=>{
    if(event.target.value=="-"){
        const products = await fetchProducts();
        setCurrentProducts(products);
        render(currentProducts, currentPagination);
    }
    else{
        var products_brand = await fetchProducts(1,999);
        const brands_dict =dict_by_brand(products_brand.result, event.target.value);
        products_brand.result=brands_dict;
        setCurrentProducts(products_brand,1);
        render(currentProducts,currentPagination);
    }

});




document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  const products_max= await fetchProducts(1,999);

  selectNbProduct.innerHTML = products_max.result.length;

  selectNbNewProducts.innerHTML=recently_released(products_max.result).length;
  selectP50.innerHTML=String(pPriceValue(products_max.result,50)) + " €";
  selectP90.innerHTML=String(pPriceValue(products_max.result,90)) + " €";
  selectP95.innerHTML=String(pPriceValue(products_max.result,95)) + " €";
  selectLastReleasedDate.innerHTML= products_max.result.sort(sort_date_asc)[0].released;


  const brand_names= brand_names_extract(products_max.result)
  brand_names.unshift("-");
  renderBrands(brand_names);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);

  const selectFavoriteButton= document.querySelectorAll('.favorite');
  selectFavoriteButton.forEach(item => {
      item.addEventListener('click', async(event)=>{
          if(favorites.includes(event.target.value)){
              favorites.splice(favorites.indexOf(event.target.value),1);
              document.querySelector("#"+event.target.value).innerHTML="add to favorites";
          }else{
              favorites.push(event.target.value);
              document.querySelector("#"+event.target.value).innerHTML="remove from favorites";
          }
      })
  })



});



selectRecentlyReleased.addEventListener("click",async() =>{
    var products =currentProducts;
    products= recently_released(products);
    render(products,currentPagination);
})

selectReasonablePrice.addEventListener("click",async()=>{
    var products = currentProducts;
    products=reasonable_price(products);
    render(products, currentPagination);
})

selectSort.addEventListener('change',async(event)=>{

    var products =[]

    switch(event.target.value)
    {
        case "price-asc":
            products =currentProducts.sort(function(a,b){return a.price -b.price});
            break;
        case "price-desc":
            products =currentProducts.sort(function(a,b){return b.price -a.price});
            break;
        case "date-asc":
            products=currentProducts.sort(sort_date_asc);
            break;
        case "date-desc":
            products=currentProducts.sort(sort_date_desc);
            break;
        default :
            products = await fetchProducts();
            setCurrentProducts(products);
    }
    render(currentProducts, currentPagination);
});



function pPriceValue(list_products, number){
    var sorted_list_products = list_products.sort(function(a,b){return a.price -b.price});
    return sorted_list_products[Math.trunc((sorted_list_products.length)*(1-number*0.01))].price;

}

function sort_date_desc(a, b){
    return new Date(a.released).getTime() - new Date(b.released).getTime();
}

function sort_date_asc(a,b){
    return new Date(b.released).getTime() - new Date(a.released).getTime();
}


function reasonable_price(products){
    return products.filter(product=>(product.price<50));
}

function recently_released(list_products){
    return list_products.filter(product=>(check_New(new Date(product.released))));
}

function check_New(date){
    var currentTime= new Date(Date.now());
    date.setDate(date.getDate()+14)
    return date>currentTime
}


function dict_by_brand(products,brand_name){
    return products.filter(product =>(product.brand===brand_name));
}

function brand_names_extract(data){
    let brand_names= [];
    for (let i=0; i<data.length; i++){
        if(brand_names.includes(data[i].brand)==false){
            brand_names.push(data[i].brand);
        }
    };
    return brand_names
}
