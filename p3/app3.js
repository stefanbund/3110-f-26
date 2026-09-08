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
// We use let or const here. 'const' works for arrays because we are pushing to it, not reassigning the variable.
const customers = JSON.parse(rawJsonData);

// Grab the HTML container where we will render the divs
const container = document.getElementById('customer-container');

// --- 1. RENDER FUNCTION ---
// We wrap our loop in a function so we can call it repeatedly whenever the data changes!
function renderCustomers() {
  // First, clear out any existing HTML inside the container
  // Otherwise, we would print duplicates every time we re-render
  container.innerHTML = '';
  
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

    // Inject the data
    cardDiv.innerHTML = `
      <h3>${fullName} <span>(#${id})</span></h3>
      <p><strong>Contact:</strong> ${email} | ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <span class="status ${statusClass}">${status}</span>
    `;

    // Append to the DOM
    container.appendChild(cardDiv);
  }
}

// --- 2. INITIAL RENDER ---
// Run the render function once when the page loads
renderCustomers();


// --- 3. ADD NEW CUSTOMER FUNCTION ---
// This function is triggered by the onclick() event in the HTML button
function addCustomer() {
  // Read values from all the text boxes
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

  // Push the newly constructed object into our global array
  customers.push(newCustomer);

  // Clear the text boxes so the user can enter another one
  document.getElementById('inputId').value = '';
  document.getElementById('inputFirstName').value = '';
  document.getElementById('inputLastName').value = '';
  document.getElementById('inputEmail').value = '';
  document.getElementById('inputPhone').value = '';
  document.getElementById('inputAddress').value = '';
  document.getElementById('inputCity').value = '';
  document.getElementById('inputState').value = '';
  document.getElementById('inputZipCode').value = '';

  // Re-generate the divs on the screen by calling our render function again!
  renderCustomers();
  
  // Log to console to prove it worked behind the scenes
  console.log("Customer added! Total array length is now: " + customers.length);
}
