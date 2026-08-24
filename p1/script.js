// We can simulate receiving a JSON file by storing the raw JSON string in a variable.
// This allows the project to run locally in the browser without an HTTP server.
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

// "Ingest" the JSON document by parsing the raw string into JavaScript objects
const customers = JSON.parse(rawJsonData);

console.log("=== CUSTOMER DATA REPORT ===\n\n");

// Use iteration (a for...of loop) to go through each customer in the array
for (const customer of customers) {
  // Variables to hold the marshalled contents
  const id = customer.customerId;
  const fullName = `${customer.firstName} ${customer.lastName}`;
  const email = customer.email;
  const phone = customer.phone;
  const address = `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`;
  const status = customer.status;

  // Reformat the data for human reading and print it to the console
  console.log(`Customer ID: ${id}`);
  console.log(`Name:        ${fullName}`);
  console.log(`Contact:     ${email} | ${phone}`);
  console.log(`Address:     ${address}`);
  console.log(`Status:      ${status}`);
  console.log("--------------------------------------------------");
}

console.log(`\nTotal Customers Processed: ${customers.length}`);
