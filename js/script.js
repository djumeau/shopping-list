const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemFilter = document.getElementById("filter");
const clearButton = document.getElementById("clear");
let items = []; // Item List
let editMode = false;
const formBtn = itemForm.querySelector("button");

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
        alert("Please add an item.");
        return;
    }

    if (itemExists(newItem)) {
        alert(newItem + " exists.");
        return;
    }

    if (editMode) {
        // In edit mode
        const itemToEdit = itemList.querySelector(".edit-mode");

        // Remove item in list array
        removeItemFromList(itemToEdit.textContent);
        itemToEdit.remove();

    }

    items.push(newItem);

    addItemToDOM(newItem);
    
    updateItemsToLocalStorage();

    checkUI();

    itemInput.value = "";
}

function removeItemFromList(itemName) {

    // console.log("removeItemFromList > " + items);

    for (let i=0; i < items.length; i++) {
        
        if (itemName === items[i]) {
            // console.log("Removing [" + itemName + "]");
            items.splice(i, 1);
            break;
        }

    }

    checkUI();

    // console.log("items > " + items);

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
        // Remove li item
        removeItem(e.target.parentElement.parentElement);
    } else {
        // Edit Item
        setItemToEdit(e.target);
    }
}

function setItemToEdit(item) {
    editMode = true;

    item.classList.add("edit-mode");

    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228b22';

    itemInput.value = item.textContent;
}

function resetButton() {
    itemInput.value = "";

    itemList.querySelectorAll('li').forEach(i => {
        i.classList.remove('edit-mode');
    });

    formBtn.innerHTML = '<i class="fas fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    editMode = false;
}

// Removes first occurence of target name.
function removeItem(item) {

    // Are you sure?
    if (confirm('Are you sure?')) {
        
        let itemName = item.textContent.toLowerCase();

        // console.log("removeItem ... Remove [" + itemName + "]");

        item.remove(); // Remove li

        // Remove from storage
        for (let i=0; i<items.length; i++) {

            if (itemName === items[i].toLowerCase()) {
                // console.log("Found [" + items[i] + "]");
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

    resetButton(); 
}

function itemExists(itemName) {
    let found = false;

    for (let i=0; i<items.length; i++) {
        if (itemName === items[i]) {
            found = true;
            break;
        }
    }

    return found;
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