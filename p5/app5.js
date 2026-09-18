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

// Global State Array
const customers = JSON.parse(rawJsonData);

// Global Variable to track which item is currently being edited
let currentEditIndex = null;

const container = document.getElementById('customer-container');

// --- 1. READ (RENDER DOM) ---
function renderCustomers() {
  container.innerHTML = '';
  let currentIndex = 0;

  for (const customer of customers) {
    const id = customer.customerId;
    const fullName = `${customer.firstName} ${customer.lastName}`;
    const email = customer.email;
    const phone = customer.phone;
    const address = `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`;
    const status = customer.status;

    const cardDiv = document.createElement('div');
    cardDiv.className = 'customer-card';
    const statusClass = `status-${status.toLowerCase()}`;

    // Added an Edit button alongside the Delete button
    cardDiv.innerHTML = `
      <h3>${fullName} <span>(#${id})</span></h3>
      <div class="action-buttons">
        <button class="edit-btn" onclick="openEditModal(${currentIndex})">Edit</button>
        <button class="delete-btn" onclick="deleteCustomer(${currentIndex})">Delete</button>
      </div>
      <p><strong>Contact:</strong> ${email} | ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>
      <span class="status ${statusClass}">${status}</span>
    `;

    container.appendChild(cardDiv);
    currentIndex++;
  }
}

renderCustomers();


// --- 2. CREATE ---
function addCustomer() {
  const newCustomer = {
    customerId: document.getElementById('addId').value,
    firstName: document.getElementById('addFirstName').value,
    lastName: document.getElementById('addLastName').value,
    email: document.getElementById('addEmail').value,
    phone: document.getElementById('addPhone').value,
    address: document.getElementById('addAddress').value,
    city: document.getElementById('addCity').value,
    state: document.getElementById('addState').value,
    zipCode: document.getElementById('addZipCode').value,
    status: document.getElementById('addStatus').value
  };

  customers.push(newCustomer);

  // Clear inputs
  document.querySelectorAll('.form-container input').forEach(input => input.value = '');
  
  renderCustomers();
}


// --- 3. DELETE ---
function deleteCustomer(indexToRemove) {
  customers.splice(indexToRemove, 1);
  renderCustomers();
}


// --- 4. UPDATE (EDIT LOGIC) ---

// A. Open Modal & Load Data
function openEditModal(indexToEdit) {
  // Save the index globally so the save function knows which object to update
  currentEditIndex = indexToEdit;
  
  // Get the specific customer object from our array
  const customer = customers[indexToEdit];
  
  // Populate the modal's input fields with the existing data
  document.getElementById('editId').value = customer.customerId;
  document.getElementById('editFirstName').value = customer.firstName;
  document.getElementById('editLastName').value = customer.lastName;
  document.getElementById('editEmail').value = customer.email;
  document.getElementById('editPhone').value = customer.phone;
  document.getElementById('editAddress').value = customer.address;
  document.getElementById('editCity').value = customer.city;
  document.getElementById('editState').value = customer.state;
  document.getElementById('editZipCode').value = customer.zipCode;
  document.getElementById('editStatus').value = customer.status;

  // Show the modal by changing its display style from 'none' to 'flex'
  document.getElementById('editModal').style.display = 'flex';
}

// B. Save Changes to Array
function saveEdit() {
  // Ensure we actually have an index selected
  if (currentEditIndex === null) return;

  // Retrieve the updated values from the modal inputs
  const updatedCustomer = {
    customerId: document.getElementById('editId').value,
    firstName: document.getElementById('editFirstName').value,
    lastName: document.getElementById('editLastName').value,
    email: document.getElementById('editEmail').value,
    phone: document.getElementById('editPhone').value,
    address: document.getElementById('editAddress').value,
    city: document.getElementById('editCity').value,
    state: document.getElementById('editState').value,
    zipCode: document.getElementById('editZipCode').value,
    status: document.getElementById('editStatus').value
  };

  // Replace the old object in the array with the new updated object
  customers[currentEditIndex] = updatedCustomer;

  // Close the modal
  closeModal();

  // Re-render the UI to show the updated data
  renderCustomers();
  
  console.log("Customer updated at index " + currentEditIndex);
}

// C. Close Modal Without Saving
function closeModal() {
  document.getElementById('editModal').style.display = 'none';
  currentEditIndex = null;
}
