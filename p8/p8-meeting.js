const container = document.getElementById('meeting-container');
const emptyState = document.getElementById('empty-state');

// --- READ FROM LOCAL STORAGE ---
function loadMeetingData() {
  // Pull the string from memory, parse it back into a true JavaScript array
  const storedString = localStorage.getItem('meetingCart') || '[]';
  return JSON.parse(storedString);
}

// --- RENDER THE MEETING SPACE ---
function renderMeeting() {
  const meetingArray = loadMeetingData();
  
  container.innerHTML = ''; // Clear container

  // Check if the meeting is empty
  if (meetingArray.length === 0) {
    emptyState.style.display = 'block';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  // Iterate over the array and build the UI
  let currentIndex = 0;
  for (const person of meetingArray) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'participant-card';
    
    cardDiv.innerHTML = `
      <img src="${person.imageUrl}" alt="${person.firstName}">
      <h3>${person.firstName} ${person.lastName}</h3>
      <p>${person.email}</p>
      
      <!-- Button to remove this specific person, passing their current index -->
      <button class="btn-remove" onclick="removeFromMeeting(${currentIndex})">Remove</button>
    `;

    container.appendChild(cardDiv);
    currentIndex++;
  }
}

// --- REMOVE (DELETE) FROM LOCAL STORAGE ---
function removeFromMeeting(indexToRemove) {
  // 1. Load the array from memory
  const meetingArray = loadMeetingData();

  // 2. Remove the specific person using splice
  meetingArray.splice(indexToRemove, 1);

  // 3. Save the modified array back to local storage!
  localStorage.setItem('meetingCart', JSON.stringify(meetingArray));

  // 4. Re-render the UI
  renderMeeting();
}

// Initialize the page on load
renderMeeting();
