/*
Global variables
*/
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formButton = itemForm.querySelector('button');
let isEditMode = false;

/*
Loops through and displays the items from local storage
*/
function displayItems() {
	const itemsFromStorage = getItemsFromStorage();
	itemsFromStorage.forEach((item) => addItemToDom(item));
	resetUI();
}

/*
Add a new list item
*/
function onAddItemSubmit(e) {
	e.preventDefault();

	const newItem = itemInput.value;

	// Validate Input
	if (newItem === '') {
		alert('Please add an item');
		return;
	}

	// Check for edit mode
	if (isEditMode) {
		const itemToEdit = itemList.querySelector('.edit-mode');

		removeItemFromStorage(itemToEdit.textContent);
		itemToEdit.classList.remove('edit-mode');
		itemToEdit.remove();
		isEditMode = false;
	} else {
		if (checkIfItemExists(newItem)) {
			alert('Item already exists!');
			return;
		}
	}

	// Create item DOM element
	addItemToDom(newItem);

	// Add Item to local storage
	addItemToStorage(newItem);

	resetUI();

	itemInput.value = '';
}

/*
Handles outputing the new element to the DOM - Creates a new li and appends a button to it and then
appends the li to the itemList
*/
function addItemToDom(item) {
	// Create List Item
	const li = document.createElement('li');
	li.appendChild(document.createTextNode(item));

	const button = createButton('remove-item btn-link text-red');
	li.appendChild(button);

	// Add li to the DOM
	itemList.appendChild(li);
}

/*
Creates the button with its classes and adds the close icon as a child
*/
function createButton(classes) {
	const button = document.createElement('button');
	button.className = classes;
	const icon = createIcon('fa-solid fa-xmark');
	button.appendChild(icon);
	return button;
}

/*
Creates the close icon and adds it's classes
*/
function createIcon(classes) {
	const icon = document.createElement('i');
	icon.className = classes;
	return icon;
}

/*
Add items to local storage in a stringified array
*/
function addItemToStorage(item) {
	const itemsFromStorage = getItemsFromStorage();

	// Add new Item to array
	itemsFromStorage.push(item);

	// Convert to JSON String and set to Local Storage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

/*
Retrieves the items from local storage and parses the string back into an array
*/
function getItemsFromStorage() {
	let itemsFromStorage;

	if (localStorage.getItem('items') === null) {
		itemsFromStorage = [];
	} else {
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
	}

	return itemsFromStorage;
}

function onClickItem(e) {
	if (e.target.parentElement.classList.contains('remove-item')) {
		removeItem(e.target.parentElement.parentElement);
	} else {
		setItemToEdit(e.target);
	}
}

function checkIfItemExists(item) {
	const itemsFromStorage = getItemsFromStorage();
	const lowerCaseItem = item.toLowerCase();

	// Check if any item in storage matches the new item, ignoring case
	return itemsFromStorage.some(
		(storedItem) => storedItem.toLowerCase() === lowerCaseItem
	);
}

function setItemToEdit(item) {
	isEditMode = true;

	itemList
		.querySelectorAll('li')
		.forEach((i) => i.classList.remove('edit-mode'));

	item.classList.add('edit-mode');

	formButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';

	formButton.style.backgroundColor = '#228b22';

	itemInput.value = item.textContent;
}

/*
Remove an item from the list
*/
function removeItem(item) {
	if (confirm('Are you sure?')) {
		// remove item from DOM
		item.remove();
		// Remove item from storage
		removeItemFromStorage(item.textContent);

		resetUI();
	}
}

function removeItemFromStorage(item) {
	let itemsFromStorage = getItemsFromStorage();

	// Filter out item to be removed
	itemsFromStorage = itemsFromStorage.filter((i) => i != item);

	// Re-set to local storage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

/*
Clear all items from the list
*/
function clearItems() {
	if (confirm('Are you sure?')) {
		while (itemList.firstChild) {
			itemList.removeChild(itemList.firstChild);
		}

		// Clear all from local storage
		localStorage.removeItem('items');

		resetUI();
	}
}

/*
Filter items by name
*/
function filterItems(e) {
	const items = itemList.querySelectorAll('li');
	const text = e.target.value.toLowerCase();

	items.forEach((item) => {
		const itemName = item.firstChild.textContent.toLowerCase();
		if (itemName.indexOf(text) != -1) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
	});
}

/*
Hide filter and clear all UI elements if the list is empty
*/
function resetUI() {
	itemInput.value = '';

	const items = itemList.querySelectorAll('li');

	if (items.length === 0) {
		clearButton.style.display = 'none';
		itemFilter.style.display = 'none';
	} else {
		clearButton.style.display = 'block';
		itemFilter.style.display = 'block';
	}

	formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';

	formButton.style.backgroundColor = '#333';

	isEditMode = false;
}

// initialize App
function init() {
	// Event Listeners
	itemForm.addEventListener('submit', onAddItemSubmit);
	itemList.addEventListener('click', onClickItem);
	clearButton.addEventListener('click', clearItems);
	itemFilter.addEventListener('input', filterItems);
	document.addEventListener('DOMContentLoaded', displayItems);

	resetUI();
}

init();
