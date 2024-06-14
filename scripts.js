document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

const apiUrl = "https://striveschool-api.herokuapp.com/api/product/";
const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZjMDE0NDdjMjM5YzAwMTUyZjRiNzciLCJpYXQiOjE3MTgzNTQyNDQsImV4cCI6MTcxOTU2Mzg0NH0.sUMd4VVUKxaWeuEx2ODSTJBL2r9i-6NzMNX9T_pexac";

function loadProducts() {
  fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((products) => {
      const productList = document.getElementById("product-list");
      productList.innerHTML = "";
      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "col-md-4";
        productCard.innerHTML = `
                    <div class="card mb-4 shadow-sm">
                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-primary" onclick="window.location.href='details.html?id=${product._id}'">Dettagli</button>
                            </div>
                        </div>
                    </div>
                `;
        productList.appendChild(productCard);
      });
    });
}

function showProductDetail(productId) {
  fetch(`${apiUrl}${productId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((product) => {
      const productInfo = document.getElementById("product-info");
      productInfo.innerHTML = `
                <div class="card">
                    <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>Prezzo:</strong> ${product.price} €</p>
                        <p class="card-text"><strong>Marca:</strong> ${product.brand}</p>
                    </div>
                </div>
            `;
    });
}

function createProduct() {
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
      resetForm();
      loadProductsForBackOffice();
    });
}

function updateProduct() {
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
      resetForm();
      loadProductsForBackOffice();
    });
}

function deleteProduct(productId) {
  fetch(`${apiUrl}${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  }).then(() => {
    loadProducts();
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
      window.location.href = `backoffice.html?id=${product._id}`;
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
      const existingProducts = document.getElementById("existing-products");
      existingProducts.innerHTML = "";
      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "col-md-4";
        productCard.innerHTML = `
                    <div class="card mb-4 shadow-sm">
                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <button class="btn btn-warning" onclick="loadProductForEditing('${product._id}')">Modifica</button>
                                <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Cancella</button>
                            </div>
                        </div>
                    </div>
                `;
        existingProducts.appendChild(productCard);
      });
    });

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  if (productId) {
    fetch(`${apiUrl}${productId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((product) => {
        document.getElementById("name").value = product.name;
        document.getElementById("description").value = product.description;
        document.getElementById("price").value = product.price;
        document.getElementById("brand").value = product.brand;
        document.getElementById("imageUrl").value = product.imageUrl;
        document.getElementById("product-form").dataset.productId = product._id;
      });
  }
}
