$(document).ready(function() {
  getFrozenFoodData().then(function(frozenFoodData) {
    console.log(frozenFoodData);
    var frozenFoodList = buildFrozenFoodList(frozenFoodData);
    renderFrozenFoodList(frozenFoodList);
  }).catch(function(error) {
    console.log('Couldn’t get frozen food data', error);
  });
});


function getFrozenFoodData(){
  return new Promise(function(resolve, reject) {
    $.ajax({
      method: "GET",
      url: "https://localhost:8000/frozenFoods",
      success: resolve,
      error: reject
    });
  });
}

function buildFrozenFoodList(frozenFoodData){
  return frozenFoodData.frozenFoods.map(function(frozenFood, index){
    return convertFrozenFoodObjectToListItem(frozenFood);
  });
}


function convertFrozenFoodObjectToListItem(frozenFood){
    var frozenFoodNameContainer = document.createElement("p");
    var frozenFoodName = document.createTextNode(frozenFood.name);
    frozenFoodNameContainer.appendChild(frozenFoodName);

    var frozenFoodQuantityContainer = document.createElement("p");
    var quantity = document.createTextNode(frozenFood.quantity);
    frozenFoodQuantityContainer.appendChild(quantity);

    var frozenFoodUnitContainer = document.createElement("p");
    var unit = document.createTextNode(frozenFood.unit);
    frozenFoodNameContainer.appendChild(unit);

    var frozenFoodListItem = document.createElement("li");
    frozenFoodListItem.appendChild(frozenFoodNameContainer);
    frozenFoodListItem.appendChild(frozenFoodQuantityContainer);
    frozenFoodListItem.appendChild(frozenFoodUnitContainer);

    return frozenFoodListItem;
  }



function renderFrozenFoodList(frozenFoodList){
  $('.frozenFood-list').append(frozenFoodList);
}
