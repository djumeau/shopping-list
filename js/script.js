const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemFilter = document.getElementById("filter");
const clearButton = document.getElementById("clear");
let items = []; // Item List

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;

    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);

    return button;
}

function addItem(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate Input
    if (newItem === "") {
        // alert("Please add an item.");
        return;
    }

    items.push(newItem);

    addItemToDOM(newItem);
    
    updateItemsToLocalStorage();

    checkUI();

    itemInput.value = "";
}

function addItemToDOM(item) {

    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');

    li.appendChild(button);

    // Add li to the DOM
    itemList.appendChild(li);

}

function updateItemsToLocalStorage() {

    // console.log("Update items to local storage > " + items);

    if (items.length > 0) {
        localStorage.setItem("items", items.toString());
    } else {
        localStorage.removeItem("items");
    }

}

function getItemsFromLocalStorage() {
    const itemStr = localStorage.getItem("items");

    // console.log("getItemsFromLocalStorage > " + itemStr);

    if (itemStr != null) {
        return itemStr.split(",");
    } else {
        return [];
    }
    
}

function displayItems() {
    
    items = getItemsFromLocalStorage();

    items.forEach((i) => {
        // console.log(i);
        addItemToDOM(i);
    });

    // console.log("displayItems ... items [" + items + "]");

    checkUI();

}

function clickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        // Remove Item
        removeItem(e);
    } else {
        // Edit Item
    }
}

// Removes first occurence of target name.
function removeItem(e) {

    // Are you sure?
    if (confirm('Are you sure?')) {
        
        let itemName = e.target.parentElement.parentElement.textContent.toLowerCase();

        // console.log("removeItem ... Remove [" + itemName + "] from " + items);

        e.target.parentElement.parentElement.remove();

        // Remove item from array
        for (let i=0; i<items.length; i++) {

            if (itemName === items[i].toLowerCase()) {
                console.log("Remove [" + items[i] + "] " + items.length);
                if (items.length === 1) {
                    items = [];
                } else {
                    items.splice(i, 1);
                }
                break;
            }
                
        };

        // console.log("items >" + items);            

        updateItemsToLocalStorage();
        
        checkUI();
    }

}

function removeAllItems(e) {

    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    items = [];

    localStorage.clear();

    checkUI();
}

function filterItems(e) {

    const itemLi = document.querySelectorAll("li");
    const text = e.target.value.toLowerCase();

    itemLi.forEach((key) => {
        const itemName = key.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) > -1) {
            console.log("Found:" + itemName);
            key.style.display = 'flex';
        } else {
            // Hide item
            key.style.display = 'none';
        }
            
    });

    console.log("filterItems ... " + text);
}

function checkUI() {

    const items = document.querySelectorAll("li");

    if (items.length === 0) {
        // Hide clear button
        clearButton.style.display = "none";
        // Hide filter
        itemFilter.style.display = "none";
    } else {
        // Hide clear button
        clearButton.style.display = "block";
        // Hide filter
        itemFilter.style.display = "block";
    }
}

function init() {
    // Event Listeners
    itemForm.addEventListener("submit", addItem);
    itemList.addEventListener("click", clickItem);
    clearButton.addEventListener("click", removeAllItems);
    itemFilter.addEventListener("input", filterItems);
    document.addEventListener("DOMContentLoaded", displayItems);

    checkUI();
}

init();