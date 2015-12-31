$(document).ready(function() {
  getFrozenFoodData().then(function(frozenFoodData) {
    console.log(frozenFoodData);
    var frozenFoodList = buildFrozenFoodList(frozenFoodData);
    renderFrozenFoodList(frozenFoodList);
  }).catch(function(error) {
    console.log('Couldn’t get frozen food data', error);
  });
  attachNewFoodHandler();
});

function buildFrozenFoodList(frozenFoodData) {
  return frozenFoodData.food.map(function(food, index) {
    return convertFrozenFoodObjectToListItem(food);
  });
}


function convertFrozenFoodObjectToListItem(food) {
  var frozenFoodNameContainer = document.createElement("p");
  var frozenFoodName = document.createTextNode(food.name);
  frozenFoodNameContainer.appendChild(frozenFoodName);

  var frozenFoodQuantityContainer = document.createElement("p");
  var quantity = document.createTextNode(food.quantity);
  frozenFoodQuantityContainer.appendChild(quantity);

  var frozenFoodUnitContainer = document.createElement("p");
  var unit = document.createTextNode(food.unit_id);
  frozenFoodNameContainer.appendChild(unit);

  var frozenFoodCategoryContainer = document.createElement("p");
  var category = document.createTextNode(food.category_id);
  frozenFoodNameContainer.appendChild(category);


  var frozenFoodListItem = document.createElement("li");
  frozenFoodListItem.appendChild(frozenFoodNameContainer);
  frozenFoodListItem.appendChild(frozenFoodQuantityContainer);
  frozenFoodListItem.appendChild(frozenFoodUnitContainer);
  frozenFoodListItem.appendChild(frozenFoodCategoryContainer);

  return frozenFoodListItem;
}

function renderFrozenFoodList(frozenFoodList) {
  // $('.frozenFood-list').append(frozenFoodList);
  var list = $('.frozenFood-list');
  list.append(frozenFoodList);
}


function getFrozenFoodData() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      method: "GET",
      url: "http://localhost:8000/food",
      success: resolve,
      error: reject
    });
  });
}


function attachNewFoodHandler() {
  $('.new-food-form').submit(function(event) {
    event.preventDefault();
    var formData = getNewFoodData($(this));
    createNewFood(formData).then(function(newFood) {
      addNewFoodToList(newFood);
      flashCreationMessage();
    }).catch(function(error) {
      console.error('Unable to add food', error);
    });
  });
}


function getNewFoodData(form) {
  var formValues = form.serializeArray();
  return formValues.reduce(function(formattedFood, food){
          formattedFood[food.name] = food.value;
          return formattedFood;
      }, {});
}

function createNewFood(formData){
    return new Promise(function(resolve, reject){
        $.ajax({
            method: "POST",
            url: "http://localhost:8000/food",
            data: formData,
            success: resolve,
            error: reject
        });
    });
}


function addNewFoodToList(food) {
  var newFoodListItem = convertFrozenFoodObjectToListItem(food);
  $(".frozenFood-list").append(newFoodListItem);
}

function flashCreationMessage() {
  $(".creation-message").fadeIn(300).delay(2000).fadeOut(300);
}

var units;
var categories;
