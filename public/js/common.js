function confirmDelete(deleteUrl) {
  const isConfirmed = confirm("Are you sure you want to delete this?");
  if (isConfirmed) {
    window.location.href = deleteUrl;
  }
}
