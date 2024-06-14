document.addEventListener("DOMContentLoaded", () => {
  loadProductsForBackOffice();
});

function validateForm() {
  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = document.getElementById("price").value.trim();
  const brand = document.getElementById("brand").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();

  if (!name || !description || !price || !brand || !imageUrl) {
    alert("Tutti i campi sono obbligatori!");
    return false;
  }
  return true;
}

function createProduct() {
  if (!validateForm()) {
    return;
  }

  const product = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    brand: document.getElementById("brand").value,
    imageUrl: document.getElementById("imageUrl").value,
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(product),
  })
    .then((response) => response.json())
    .then(() => {
      alert("Prodotto creato con successo!");
      resetForm();
      loadProductsForBackOffice();
    });
}

function updateProduct() {
  if (!validateForm()) {
    return;
  }

  const productId = document.getElementById("product-form").dataset.productId;
  const product = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    brand: document.getElementById("brand").value,
    imageUrl: document.getElementById("imageUrl").value,
  };

  fetch(`${apiUrl}${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(product),
  })
    .then((response) => response.json())
    .then(() => {
      alert("Prodotto aggiornato con successo!");
      resetForm();
      loadProductsForBackOffice();
    });
}

function deleteProduct(productId) {
  if (!confirm("Sei sicuro di voler cancellare questo prodotto?")) {
    return;
  }

  fetch(`${apiUrl}${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then(() => {
    alert("Prodotto cancellato con successo!");
    loadProductsForBackOffice();
  });
}

function loadProductsForBackOffice() {
  fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((products) => {
      const productContainer = document.getElementById("existing-products");
      productContainer.innerHTML = "";

      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "col-md-4 mb-3";
        productCard.innerHTML = `
          <div class="card">
            <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description}</p>
              <p class="card-text">Prezzo: $${product.price}</p>
              <p class="card-text">Marca: ${product.brand}</p>
              <button class="btn btn-warning" onclick="editProduct('${product._id}')">Modifica</button>
              <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Cancella</button>
            </div>
          </div>
        `;
        productContainer.appendChild(productCard);
      });
    });
}

function editProduct(productId) {
  fetch(`${apiUrl}${productId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((product) => {
      document.getElementById("product-form").dataset.productId = product._id;
      document.getElementById("name").value = product.name;
      document.getElementById("description").value = product.description;
      document.getElementById("price").value = product.price;
      document.getElementById("brand").value = product.brand;
      document.getElementById("imageUrl").value = product.imageUrl;
    });
}

function resetForm() {
  document.getElementById("product-form").reset();
  delete document.getElementById("product-form").dataset.productId;
}
