// Aura Villas CMS - Admin Client Scripts
document.addEventListener('DOMContentLoaded', () => {
  // 1. Confirm Delete Actions
  const deleteLinks = document.querySelectorAll('.confirm-delete');
  deleteLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const msg = link.dataset.message || 'Are you sure you want to permanently delete this item?';
      if (!confirm(msg)) {
        e.preventDefault();
      }
    });
  });

  // 2. Image upload preview
  const fileInput = document.getElementById('imageUploadInput');
  const previewImg = document.getElementById('imagePreviewTarget');
  if (fileInput && previewImg) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImg.src = e.target.result;
          previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }
});
