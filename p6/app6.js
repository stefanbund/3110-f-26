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

const customers = JSON.parse(rawJsonData);
const container = document.getElementById('customer-container');

// A single variable to track if we are editing an existing item (holds an index) 
// or creating a new item (holds null).
let currentEditIndex = null;


// --- 1. READ (RENDER DOM) ---
function renderCustomers() {
  container.innerHTML = '';
  let currentIndex = 0;

  for (const customer of customers) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'customer-card';
    
    cardDiv.innerHTML = `
      <h3>${customer.firstName} ${customer.lastName} <span>(#${customer.customerId})</span></h3>
      <div class="card-actions">
        <!-- Passing the index opens the modal in 'Edit' mode -->
        <button class="action-btn edit-btn" onclick="openModal(${currentIndex})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteCustomer(${currentIndex})">Delete</button>
      </div>
      <p><strong>Contact:</strong> ${customer.email} | ${customer.phone}</p>
      <p><strong>Address:</strong> ${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}</p>
      <span class="status status-${customer.status.toLowerCase()}">${customer.status}</span>
    `;

    container.appendChild(cardDiv);
    currentIndex++;
  }
}

// Initial render
renderCustomers();


// --- 2. DELETE ---
function deleteCustomer(indexToRemove) {
  customers.splice(indexToRemove, 1);
  renderCustomers();
}


// --- 3. UNIFIED MODAL LOGIC (CREATE & UPDATE) ---

// This function acts as a toggle. If an index is provided, it's an Edit. If not, it's an Add.
function openModal(index = null) {
  currentEditIndex = index;
  const modalTitle = document.getElementById('modalTitle');

  if (index !== null) {
    // EDIT MODE: Populate fields with existing data
    modalTitle.innerText = 'Edit Customer';
    const customer = customers[index];
    
    document.getElementById('formId').value = customer.customerId;
    document.getElementById('formFirstName').value = customer.firstName;
    document.getElementById('formLastName').value = customer.lastName;
    document.getElementById('formEmail').value = customer.email;
    document.getElementById('formPhone').value = customer.phone;
    document.getElementById('formAddress').value = customer.address;
    document.getElementById('formCity').value = customer.city;
    document.getElementById('formState').value = customer.state;
    document.getElementById('formZipCode').value = customer.zipCode;
    document.getElementById('formStatus').value = customer.status;
  } else {
    // ADD MODE: Clear all fields for a fresh entry
    modalTitle.innerText = 'Add New Customer';
    
    document.querySelectorAll('#customerModal input').forEach(input => input.value = '');
    document.getElementById('formStatus').value = 'Active'; // Default
  }

  // Display the modal
  document.getElementById('customerModal').style.display = 'flex';
}


// --- 4. UNIFIED SAVE LOGIC ---
function saveCustomer() {
  // Construct the object from the form fields
  const formData = {
    customerId: document.getElementById('formId').value,
    firstName: document.getElementById('formFirstName').value,
    lastName: document.getElementById('formLastName').value,
    email: document.getElementById('formEmail').value,
    phone: document.getElementById('formPhone').value,
    address: document.getElementById('formAddress').value,
    city: document.getElementById('formCity').value,
    state: document.getElementById('formState').value,
    zipCode: document.getElementById('formZipCode').value,
    status: document.getElementById('formStatus').value
  };

  if (currentEditIndex !== null) {
    // UPDATE: Overwrite existing array element
    customers[currentEditIndex] = formData;
  } else {
    // CREATE: Push new element to the end of the array
    customers.push(formData);
  }

  // Cleanup: Close modal and refresh UI
  closeModal();
  renderCustomers();
}

function closeModal() {
  document.getElementById('customerModal').style.display = 'none';
  currentEditIndex = null;
}
