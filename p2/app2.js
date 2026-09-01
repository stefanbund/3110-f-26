// The same raw JSON data string as before
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
    "status": "Active"
  },
  {
    "customerId": "CUST-004",
    "firstName": "David",
    "lastName": "Brown",
    "email": "dbrown@example.com",
    "phone": "555-0104",
    "address": "321 Elm St",
    "city": "Star City",
    "state": "CA",
    "zipCode": "90210",
    "status": "Active"
  },
  {
    "customerId": "CUST-005",
    "firstName": "Eve",
    "lastName": "Davis",
    "email": "eve.davis@example.com",
    "phone": "555-0105",
    "address": "654 Birch Blvd",
    "city": "Central City",
    "state": "OH",
    "zipCode": "43215",
    "status": "Pending"
  }
]
`;

// 1. Ingest the data
const customers = JSON.parse(rawJsonData);

// 2. Find the container element in our HTML document
const container = document.getElementById('customer-container');

console.log("=== CUSTOMER DATA REPORT ===\n\n");

// 3. Iterate over the dataset
for (const customer of customers) {
  // Marshalling data into variables
  const id = customer.customerId;
  const fullName = `${customer.firstName} ${customer.lastName}`;
  const email = customer.email;
  const phone = customer.phone;
  const address = `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`;
  const status = customer.status;

  // --- PART A: Console Printing (from App 1) ---
  console.log(`Customer ID: ${id}`);
  console.log(`Name:        ${fullName}`);
  console.log(`Contact:     ${email} | ${phone}`);
  console.log(`Address:     ${address}`);
  console.log(`Status:      ${status}`);
  console.log("--------------------------------------------------");

  // --- PART B: HTML Body Printing (New in App 2) ---
  
  // Create a new 'div' element for this specific customer row
  const cardDiv = document.createElement('div');
  cardDiv.className = 'customer-card'; // Give it a class for CSS styling
  
  // Create a helper class string for the status badge color
  const statusClass = `status-${status.toLowerCase()}`;

  // Build the inner HTML structure using a template literal
  cardDiv.innerHTML = `
    <h2>${fullName} <span>(#${id})</span></h2>
    <p><strong>Contact:</strong> ${email} | ${phone}</p>
    <p><strong>Address:</strong> ${address}</p>
    <span class="status ${statusClass}">${status}</span>
  `;

  // Append the newly created div into the container on the page
  container.appendChild(cardDiv);
}

console.log(`\nTotal Customers Processed: ${customers.length}`);
