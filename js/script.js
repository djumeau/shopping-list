const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemFilter = document.getElementById("filter");
const clearButton = document.getElementById("clear");

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
    if (itemInput.value === "") {
        alert("Please add an item.");
        return;
    }

    // Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(newItem));

    const button = createButton('remove-item btn-link text-red');

    li.appendChild(button);

    // Add li to the DOM
    itemList.appendChild(li);
    checkUI();

    itemInput.value = "";
}

function removeItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        // Are you sure?
        if (confirm('Are you sure?')) {
            e.target.parentElement.parentElement.remove();
            checkUI();
        }
    }    
}

function removeAllItems(e) {
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    checkUI();
}

function filterItems(e) {
    const items = document.querySelectorAll("li");
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) > -1) {
            console.log("Found:" + itemName);
            item.style.display = 'flex';
        } else {
            // Hide item
            item.style.display = 'none';
        }
            
    });

    console.log(text);
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

// Event Listeners
itemForm.addEventListener("submit", addItem);
itemList.addEventListener("click", removeItem)
clearButton.addEventListener("click", removeAllItems);
itemFilter.addEventListener("input", filterItems);

checkUI();