// script.js

// Define notification data
const notifications = {
  avatar: {
    count: 2,
    content: `
      <h2>Avatar Notifications</h2>
      <ul>
        <li>
          <img src="assets/avatar.png" alt="Avatar">
          <span>You have unlocked a new skill!</span>
        </li>
        <li>
          <img src="assets/avatar.png" alt="Avatar">
          <span>Your avatar reached level 11!</span>
        </li>
      </ul>
    `
  },
  shop: {
    count: 5,
    content: `
      <h2>Card Shop Notifications</h2>
      <ul>
        <li>
          <img src="assets/Card_Shop.png" alt="Card Shop">
          <span>New card packs are available!</span>
        </li>
        <li>
          <img src="assets/Card_Shop.png" alt="Card Shop">
          <span>Limited-time offer: 50% off!</span>
        </li>
        <li>
          <img src="assets/Card_Shop.png" alt="Card Shop">
          <span>Exclusive items restocked!</span>
        </li>
      </ul>
    `
  },
  collection: {
    count: 3,
    content: `
      <h2>Collection Notifications</h2>
      <ul>
        <li>
          <img src="assets/Collection.png" alt="Collection">
          <span>You have collected a rare item!</span>
        </li>
        <li>
          <img src="assets/Collection.png" alt="Collection">
          <span>New customization options unlocked!</span>
        </li>
      </ul>
    `
  }
};

// Function to handle navigation
function navigateTo(section) {
  // Implement actual navigation logic here
  // For demonstration, we'll navigate to specific HTML pages
  switch(section) {
    case 'superStreak':
      window.location.href = 'super_streak.html';
      break;
    case 'worldRankings':
      window.location.href = 'world_rankings.html';
      break;
    case 'shop':
      window.location.href = 'shop.html'; // Assuming shop.html exists
      break;
    case 'playerProfile':
      window.location.href = 'player_profile.html'; // Assuming player_profile.html exists
      break;
    case 'collection':
      window.location.href = 'collection.html'; // Assuming collection.html exists
      break;
    default:
      console.warn(`Unknown section: ${section}`);
  }
}

// Play the Super Streak game
function playGame(event) {
  event.stopPropagation(); // Prevent triggering the parent onclick
  // Navigate to the Super Streak screen
  window.location.href = 'super_streak.html';
}

// Handle notification badge clicks
function handleNotificationClick(event, type) {
  event.stopPropagation(); // Prevent triggering parent onclick events
  openModal(type);
}

// Open the modal with specific content
function openModal(type) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');

  if (notifications[type]) {
    modalBody.innerHTML = notifications[type].content;
    notifications[type].count = 0; // Reset notification count
  } else {
    modalBody.innerHTML = `<p>No notifications.</p>`;
  }

  modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  updateNotifications();
}

// Close the modal
function closeModal(event) {
  event.stopPropagation(); // Prevent triggering parent events
  const modalOverlay = document.getElementById('modalOverlay');
  if (event.target.id === 'modalOverlay' || event.target.classList.contains('modal-close')) {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Update notification badges
function updateNotifications() {
  Object.keys(notifications).forEach(type => {
    const badge = document.getElementById(`${type}Notifications`);
    if (badge) {
      badge.innerText = notifications[type].count > 0 ? notifications[type].count : '';
      badge.style.display = notifications[type].count > 0 ? 'flex' : 'none';
    }
  });
}

// Show toast notifications
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Handle keyboard navigation (Enter or Space key)
function handleKeyPress(event, section) {
  if (event.key === 'Enter' || event.key === ' ') {
    navigateTo(section);
  }
}

// Initialize notifications on window load
window.onload = () => {
  updateNotifications();
};

// Handle ESC key to close modal
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal(event);
  }
});
