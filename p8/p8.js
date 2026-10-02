const rawJsonData = `
[
  {
    "customerId": "CUST-001",
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice.smith@example.com",
    "phone": "555-0101",
    "imageUrl": "https://i.pravatar.cc/150?img=1"
  },
  {
    "customerId": "CUST-002",
    "firstName": "Bob",
    "lastName": "Johnson",
    "email": "bob.j@example.com",
    "phone": "555-0102",
    "imageUrl": "https://i.pravatar.cc/150?img=11"
  },
  {
    "customerId": "CUST-003",
    "firstName": "Carol",
    "lastName": "Williams",
    "email": "carol.w@example.com",
    "phone": "555-0103",
    "imageUrl": "https://i.pravatar.cc/150?img=5"
  }
]
`;

const customers = JSON.parse(rawJsonData);
const container = document.getElementById('customer-container');

// --- 1. SHOPPING CART LOGIC (LOCAL STORAGE) ---

// Function to update the number badge on the cart button
function updateMeetingCount() {
  // Read from LocalStorage. If it doesn't exist, return an empty array string "[]"
  const storedString = localStorage.getItem('meetingCart') || '[]';
  const meetingArray = JSON.parse(storedString);
  
  document.getElementById('meetingCount').innerText = meetingArray.length;
}

// Function triggered by the "Add to Meeting" button on a card
function addToMeeting(index) {
  const selectedUser = customers[index];

  // 1. Get the current cart from memory
  const storedString = localStorage.getItem('meetingCart') || '[]';
  const meetingArray = JSON.parse(storedString);

  // 2. Check if the user is already in the meeting to prevent duplicates
  const alreadyExists = meetingArray.find(u => u.customerId === selectedUser.customerId);
  
  if (alreadyExists) {
    alert(`${selectedUser.firstName} is already in the meeting!`);
    return;
  }

  // 3. Add the user to the array
  meetingArray.push(selectedUser);

  // 4. Save the updated array back to memory (must convert to string first!)
  localStorage.setItem('meetingCart', JSON.stringify(meetingArray));

  // 5. Update the UI badge
  updateMeetingCount();
  
  // Optional: Visual feedback
  alert(`${selectedUser.firstName} was added to the meeting!`);
}

// --- 2. RENDER MAIN DIRECTORY ---
function renderCustomers() {
  container.innerHTML = '';
  let currentIndex = 0;

  for (const customer of customers) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'customer-card';
    
    cardDiv.innerHTML = `
      <img src="${customer.imageUrl}" alt="${customer.firstName}">
      
      <div class="card-content">
        <h3>${customer.firstName} ${customer.lastName}</h3>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phone}</p>
        
        <!-- The Add to Meeting Button -->
        <button class="btn-add-meeting" onclick="addToMeeting(${currentIndex})">
          + Add to Meeting
        </button>
      </div>
    `;

    container.appendChild(cardDiv);
    currentIndex++;
  }
}

// Initialize the page
renderCustomers();
updateMeetingCount();
