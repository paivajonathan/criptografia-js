function setItem(key, value) {
  console.log(key, value);
  sessionStorage.setItem(key, JSON.stringify(value));
}

function deleteItem(key) {
  sessionStorage.removeItem(key);
}

function getItem(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

export { setItem, deleteItem, getItem };
