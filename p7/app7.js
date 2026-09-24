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
    "status": "Active",
    "imageUrl": "https://i.pravatar.cc/150?img=1"
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
    "status": "Inactive",
    "imageUrl": "https://i.pravatar.cc/150?img=11"
  },
  {
    "customerId": "CUST-003",
    "firstName": "Carol",
    "lastName": "Williams",
    "email": "carol.w@example.com",
    "phone": "555-0103",
    "address": "789 Pine Rd",
    "city": "Gotham",
    "state": "NJ",
    "zipCode": "07001",
    "status": "Active",
    "imageUrl": "https://i.pravatar.cc/150?img=5"
  }
]
`;

const customers = JSON.parse(rawJsonData);
const container = document.getElementById('customer-container');
let currentEditIndex = null;


function renderCustomers() {
  container.innerHTML = '';
  let currentIndex = 0;

  for (const customer of customers) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'customer-card';
    
    // Create URL Parameters from the JSON object!
    // URLSearchParams automatically encodes special characters (like spaces and @ signs) to make them safe for URLs
    const queryParams = new URLSearchParams(customer).toString();
    const disclosureLink = `discloseItem.html?${queryParams}`;

    cardDiv.innerHTML = `
      <!-- Thumbnail Image appended to the DOM dynamically -->
      <img src="${customer.imageUrl || 'https://via.placeholder.com/150'}" alt="${customer.firstName}">
      
      <div class="card-content">
        <h3>${customer.firstName} ${customer.lastName} <span>(#${customer.customerId})</span></h3>
        <p><strong>Contact:</strong> ${customer.email} | ${customer.phone}</p>
        <span class="status status-${customer.status.toLowerCase()}">${customer.status}</span>
        
        <br><br>
        <!-- A button that navigates to the disclosure page using the query string we built -->
        <a href="${disclosureLink}" class="btn-secondary">View Details</a>
      </div>

      <div class="card-actions">
        <button class="action-btn edit-btn" onclick="openModal(${currentIndex})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteCustomer(${currentIndex})">Delete</button>
      </div>
    `;

    container.appendChild(cardDiv);
    currentIndex++;
  }
}

renderCustomers();


function deleteCustomer(indexToRemove) {
  customers.splice(indexToRemove, 1);
  renderCustomers();
}

function openModal(index = null) {
  currentEditIndex = index;
  const modalTitle = document.getElementById('modalTitle');

  if (index !== null) {
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
    document.getElementById('formImageUrl').value = customer.imageUrl || '';
  } else {
    modalTitle.innerText = 'Add New Customer';
    document.querySelectorAll('#customerModal input').forEach(input => input.value = '');
    document.getElementById('formStatus').value = 'Active';
    // Provide a random default image
    document.getElementById('formImageUrl').value = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
  }

  document.getElementById('customerModal').style.display = 'flex';
}

function saveCustomer() {
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
    status: document.getElementById('formStatus').value,
    imageUrl: document.getElementById('formImageUrl').value
  };

  if (currentEditIndex !== null) {
    customers[currentEditIndex] = formData;
  } else {
    customers.push(formData);
  }

  closeModal();
  renderCustomers();
}

function closeModal() {
  document.getElementById('customerModal').style.display = 'none';
  currentEditIndex = null;
}
