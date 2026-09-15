// The initial JSON payload
const rawJsonData = `
[
  {
    "customerId": "CUST-001",
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice.smith@example.com",
    "phone": "555-0101",
    "address": "123 Maple St",
    "city": "Springfield",
    "state": "IL",
    "zipCode": "62701",
    "status": "Active"
  },
  {
    "customerId": "CUST-002",
    "firstName": "Bob",
    "lastName": "Johnson",
    "email": "bob.j@example.com",
    "phone": "555-0102",
    "address": "456 Oak Ave",
    "city": "Metropolis",
    "state": "NY",
    "zipCode": "10001",
    "status": "Inactive"
  }
]
`;

// Parse the JSON data into a global array.
const customers = JSON.parse(rawJsonData);

// Grab the HTML container where we will render the divs
const container = document.getElementById('customer-container');

// --- 1. RENDER FUNCTION ---
function renderCustomers() {
  // Clear out any existing HTML inside the container
  container.innerHTML = '';
  
  // We need to keep track of the index so the delete button knows WHICH item to remove
  let currentIndex = 0;

  // Loop through the current state of the array
  for (const customer of customers) {
    const id = customer.customerId;
    const fullName = `${customer.firstName} ${customer.lastName}`;
    const email = customer.email;
    const phone = customer.phone;
    const address = `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`;
    const status = customer.status;

    // Create the div card
    const cardDiv = document.createElement('div');
    cardDiv.className = 'customer-card';
    const statusClass = `status-${status.toLowerCase()}`;

    // Inject the data. Notice the new <button> with an onclick event passing the currentIndex!
    cardDiv.innerHTML = `
      <h3>${fullName} <span>(#${id})</span></h3>
      <button class="delete-btn" onclick="deleteCustomer(${currentIndex})">Delete</button>
      <p><strong>Contact:</strong> ${email} | ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <span class="status ${statusClass}">${status}</span>
    `;

    // Append to the DOM
    container.appendChild(cardDiv);

    // Increment our manual counter for the next loop iteration
    currentIndex++;
  }
}

// --- 2. INITIAL RENDER ---
renderCustomers();


// --- 3. ADD NEW CUSTOMER FUNCTION ---
function addCustomer() {
  const newCustomer = {
    customerId: document.getElementById('inputId').value,
    firstName: document.getElementById('inputFirstName').value,
    lastName: document.getElementById('inputLastName').value,
    email: document.getElementById('inputEmail').value,
    phone: document.getElementById('inputPhone').value,
    address: document.getElementById('inputAddress').value,
    city: document.getElementById('inputCity').value,
    state: document.getElementById('inputState').value,
    zipCode: document.getElementById('inputZipCode').value,
    status: document.getElementById('inputStatus').value
  };

  // Push the newly constructed object into our array
  customers.push(newCustomer);

  // Clear the text boxes
  document.getElementById('inputId').value = '';
  document.getElementById('inputFirstName').value = '';
  document.getElementById('inputLastName').value = '';
  document.getElementById('inputEmail').value = '';
  document.getElementById('inputPhone').value = '';
  document.getElementById('inputAddress').value = '';
  document.getElementById('inputCity').value = '';
  document.getElementById('inputState').value = '';
  document.getElementById('inputZipCode').value = '';

  // Re-generate the divs on the screen
  renderCustomers();
  console.log("Customer added! Total array length is now: " + customers.length);
}

// --- 4. DELETE CUSTOMER FUNCTION (NEW) ---
// This function receives the index of the item that the user clicked on
function deleteCustomer(indexToRemove) {
  // Array.splice() removes items from an array. 
  // It takes two arguments: the index to start at, and how many items to remove.
  customers.splice(indexToRemove, 1);

  // Re-generate the divs on the screen based on the updated array
  renderCustomers();
  
  console.log("Customer deleted at index " + indexToRemove + "! Total array length is now: " + customers.length);
}
