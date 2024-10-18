// Sample notification counts
let avatarNotifications = 2;
let shopNotifications = 5;
let collectionNotifications = 3;

function navigateTo(section) {
  alert(`Navigating to ${section} screen...`);
  // Implement actual navigation logic here
}

function playGame(event) {
  event.stopPropagation(); // Prevent triggering the parent onclick
  // Navigate to the Super Streak screen
  window.location.href = 'super_streak.html';
}

function handleNotificationClick(event, type) {
  event.stopPropagation(); // Prevent triggering parent onclick events
  openModal(type);
}

function openModal(type) {
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');

  let content = '';

  switch (type) {
    case 'avatar':
      content = `
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
      `;
      avatarNotifications = 0;
      break;
    case 'shop':
      content = `
        <h2>Card Shop Notifications</h2>
        <ul>
          <li>
            <img src="assets/Card Shop.png" alt="Card Shop">
            <span>New card packs are available!</span>
          </li>
          <li>
            <img src="assets/Card Shop.png" alt="Card Shop">
            <span>Limited-time offer: 50% off!</span>
          </li>
          <li>
            <img src="assets/Card Shop.png" alt="Card Shop">
            <span>Exclusive items restocked!</span>
          </li>
        </ul>
      `;
      shopNotifications = 0;
      break;
    case 'collection':
      content = `
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
      `;
      collectionNotifications = 0;
      break;
    default:
      content = `<p>No notifications.</p>`;
      break;
  }

  modalBody.innerHTML = content;
  modalOverlay.style.display = 'flex';
  updateNotifications();
}

function closeModal(event) {
  event.stopPropagation(); // Prevent triggering parent events
  const modalOverlay = document.getElementById('modalOverlay');
  if (event.target.id === 'modalOverlay' || event.target.classList.contains('modal-close')) {
    modalOverlay.style.display = 'none';
  }
}

function updateNotifications() {
  document.getElementById('avatarNotifications').innerText = avatarNotifications > 0 ? avatarNotifications : '';
  document.getElementById('shopNotifications').innerText = shopNotifications > 0 ? shopNotifications : '';
  document.getElementById('collectionNotifications').innerText = collectionNotifications > 0 ? collectionNotifications : '';

  // Hide notification badges if count is zero
  document.getElementById('avatarNotifications').style.display = avatarNotifications > 0 ? 'flex' : 'none';
  document.getElementById('shopNotifications').style.display = shopNotifications > 0 ? 'flex' : 'none';
  document.getElementById('collectionNotifications').style.display = collectionNotifications > 0 ? 'flex' : 'none';
}

window.onload = updateNotifications;
