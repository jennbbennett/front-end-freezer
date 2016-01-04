var units;
var categories;

$(document).ready(function () {
    //var units
    //var categoryPromise = getCategoryData();
    //var frozenFoodPromise = getFrozenFoodData();


    //categoryPromise.then(function (categoryData) {
    //    console.log(categoryData.category);
    //    categories = categoryData.category;
    //
    //}).catch(function (error) {
    //    console.log('Couldn’t get category data', error);
    //});
    //getFrozenFoodData().then(function (frozenFoodData, categories) {
    //    console.log(frozenFoodData);
    //    var frozenFoodList = buildFrozenFoodList(frozenFoodData, categories);
    //    renderFrozenFoodList(frozenFoodList);
    //}).catch(function (error) {
    //    console.log('Couldn’t get frozen food data', error);
    //});


    $.when($.ajax({
            method: "GET",
            url: "http://localhost:8000/category"
        }),
        $.ajax({
            method: "GET",
            url: "http://localhost:8000/unit"
        }),
        $.ajax({
            method: "GET",
            url: "http://localhost:8000/food"
        })
    ).done(function (categoryResponse, unitResponse, foodResponse) {
        console.log(categoryResponse[0].category);
        //console.log(unitResponse[0].unit);
        //console.log(foodResponse[0].food);
        //categories = categoryResponse[0].category;
        units = [];
        unitResponse[0].unit.map(function (unitItem, index) {
            units[unitItem.id] = unitItem;
        });
        categories = [];
        categoryResponse[0].category.map(function (categoryItem, index) {
            categories[categoryItem.id] = categoryItem;
        });
        console.log(categories);
        populateUnits();
        populateCategories();
        var frozenFoodData = foodResponse[0];
        var frozenFoodList = buildFrozenFoodList(frozenFoodData, categories, units);
        renderFrozenFoodList(frozenFoodList);
    })
    attachNewFoodHandler();
});

function populateUnits() {
    var unitList = $(".unit-list");
    populateSelect(unitList, units, null);
}

function populateSelect(selectList, options, selId) {
    options.map(function (option, index) {
            var optionText = "<option value='" + option.id + "'";
            if (selId != null && selId == option.id) {
                optionText = optionText + " selected ";
            }
            optionText = optionText + "> " + option.name + " </option>";
            var optionOption = $(optionText);
            selectList.append(optionOption);
        }
    )
}

function populateCategories() {
    var categoryList = $(".category-list");
    populateSelect(categoryList, categories, null);
}

function buildFrozenFoodList(frozenFoodData, categories, units) {
    return frozenFoodData.food.map(function (food, index) {
        return convertFrozenFoodObjectToListItem(food, categories, units);
    });
}


function convertFrozenFoodObjectToListItem(food, categories, units) {
    var frozenFoodNameContainer = $(document.createElement("p"));
    var frozenFoodName = $("<input type='text' name='name' value='" + food.name + "'/>");
    frozenFoodNameContainer.append(frozenFoodName);

    var frozenFoodQuantityContainer = $(document.createElement("p"));

    var quantity = $("<input type='text' name='quantity' size='4' value='" + food.quantity + "'/>");
    var unitSelectList = $("<select id='food-unit' name='unit_id'>");
    populateSelect(unitSelectList, units, food.unit_id);
    frozenFoodQuantityContainer.append(quantity);
    frozenFoodQuantityContainer.append(unitSelectList);


    var frozenFoodCategoryContainer = $(document.createElement("p"));

    var categorySelectList = $("<select id='food-category' name='category_id'>");
    populateSelect(categorySelectList, categories, food.category_id);
    frozenFoodCategoryContainer.append(categorySelectList);


    var frozenFoodListItem = $(document.createElement("li"));
    var frozenFoodUpdateForm = $(document.createElement('form'));
    frozenFoodUpdateForm.append(frozenFoodNameContainer);
    frozenFoodUpdateForm.append(frozenFoodQuantityContainer);
    frozenFoodUpdateForm.append(frozenFoodCategoryContainer);

    var buttonContainer = $(document.createElement("p"));
    var removeButton = $('<button id="remove" type="button" class="remove-button btn btn-default btn-xs btn-block">Remove from Freezer</button>');
    removeButton.on('click', function () {
        var foodId = this.dataset.foodId;
        $.ajax({
            method: "DELETE",
            url: "http://localhost:8000/food/" + foodId
        }).done(function () {

            refreshFoodList();
        });
        console.log("delete food with id [" + foodId + "]");
    });

    removeButton.attr('data-food-id', food.id);
    buttonContainer.append(removeButton);

    var updateButton = $('<button id="update-button" type="button" class="update-button btn btn-default btn-xs btn-block">Update in Freezer</button>');
    updateButton.on('click', function () {
        var updateForm = $(this).closest("form");
        var foodId = this.dataset.foodId;
    //    var requestData = JSON.stringify(body = {
    //        name: updateForm.find('input[name="name"]').val(),
    //        quantity: updateForm.find('input[name="quantity"]').val(),
    //        unit_id: updateForm.find('select[name="unit_id"]').val(),
    //        category_id: updateForm.find('select[name="category_id"]').val()
    //});


        //console.log(requestData);
        $.ajax({
            method: "PUT",
            url: "http://localhost:8000/food/" + foodId,
            data: updateForm.serialize()
        }).done(function (result) {
    console.log("done with update");
            refreshFoodList();
        });
        console.log("update food with id [" + foodId + "]");
    });
    updateButton.attr('data-food-id', food.id);

    buttonContainer.append(updateButton);
    frozenFoodUpdateForm.append(buttonContainer);
    frozenFoodListItem.append(frozenFoodUpdateForm);
    return frozenFoodListItem;
}

function renderFrozenFoodList(frozenFoodList) {
    // $('.frozenFood-list').append(frozenFoodList);
    var list = $('.frozenFood-list');
    list.empty();
    list.append(frozenFoodList);
}


function getFrozenFoodData() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: "GET",
            url: "http://localhost:8000/food",
            success: resolve,
            error: reject
        });
    });
}

function getCategoryData() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: "GET",
            url: "http://localhost:8000/category",
            success: resolve,
            error: reject
        });
    });
}

function attachNewFoodHandler() {
    $('.new-food-form').submit(function (event) {
        event.preventDefault();
        var formData = getNewFoodData($(this));
        createNewFood(formData).then(function (newFood) {
            addNewFoodToList(newFood);
            flashCreationMessage();
        }).catch(function (error) {
            console.error('Unable to add food', error);
        });
    });
}


function getNewFoodData(form) {
    var formValues = form.serializeArray();
    return formValues.reduce(function (formattedFood, food) {
        formattedFood[food.name] = food.value;
        return formattedFood;
    }, {});
}

function createNewFood(formData) {
    return new Promise(function (resolve, reject) {
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
    var newFoodListItem = convertFrozenFoodObjectToListItem(food, categories, units);
    $(".frozenFood-list").append(newFoodListItem);
}

function flashCreationMessage() {
    $(".creation-message").fadeIn(300).delay(2000).fadeOut(300);
}


function refreshFoodList() {
    console.log(units);
    $.ajax({
        method: "GET",
        url: "http://localhost:8000/food"
    }).done(function (foodResponse) {
        var frozenFoodData = foodResponse;
        var frozenFoodList = buildFrozenFoodList(frozenFoodData, categories, units);
        renderFrozenFoodList(frozenFoodList);
    });
}
