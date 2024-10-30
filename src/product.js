let allProducts = []; 
let filteredProducts = []; 
let sortedProducts = []; 

function displayProducts(products = filteredProducts) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    products.forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image_link || 'placeholder-image-url.jpg'}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p><strong>Brand:</strong> ${product.brand || 'Unknown'}</p>
            <p><strong>Price:</strong> $${product.price || 'N/A'}</p>
            <p><strong>Type:</strong> ${product.product_type || 'N/A'}</p>
            <p><strong>Rating:</strong> ${product.rating || 'Not rated'}</p>
            <a href="${product.website_link}" target="_blank">Visit Website</a>
            <a href="${product.product_link}" target="_blank">View Product</a>
            <div class="button-group">
                <button class="description-btn" onclick="toggleDescription(${index}, '${products === sortedProducts ? 'sorted' : 'filtered'}')">View Description</button>
                <br>
                <button class="wishlist-btn" onclick="addToWishlist(${index}, '${products === sortedProducts ? 'sorted' : 'filtered'}')">Add to Wishlist</button>
            </div>
            <p id="description-${index}" class="product-description" style="display: none;">
                ${product.description || 'No description available'}
            </p>
        `;
        productsContainer.appendChild(productItem);
    });
}
function fetchProducts() {
    fetch(`http://makeup-api.herokuapp.com/api/v1/products.json`)
        .then((response) => response.json())
        .then((data) => {
            allProducts = data;
            filteredProducts = allProducts; 
            displayProducts(); 
        })
        .catch((error) => {
            console.error('Error fetching the product data:', error);
        });
}
function toggleDescription(index, listType) {
    const description = document.getElementById(`description-${index}`);
    description.style.display = description.style.display === 'block' ? 'none' : 'block';
}
function addToWishlist(index, listType) {
    const product = listType === 'sorted' ? sortedProducts[index] : filteredProducts[index];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (!wishlist.some(item => item.id === product.id)) {
        wishlist.push(product); 
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert(`${product.name} has been added to your wishlist!`);
    } else {
        alert(`${product.name} is already in your wishlist.`);
    }
}
function applyFilters() {
    const brandFilter = document.getElementById('brand-filter').value.toLowerCase();
    const minPrice = parseFloat(document.getElementById('min-price').value);
    const maxPrice = parseFloat(document.getElementById('max-price').value);
    filteredProducts = allProducts.filter(product => {
        const brandMatch = brandFilter ? (product.brand && product.brand.toLowerCase() === brandFilter) : true;
        const price = parseFloat(product.price);
        const priceMatch = (!isNaN(minPrice) ? price >= minPrice : true) && (!isNaN(maxPrice) ? price <= maxPrice : true);
        return brandMatch && priceMatch;
    });
    displayProducts(filteredProducts);
}
function sortProducts(criteria) {
    sortedProducts = [...filteredProducts]; 
    if (criteria === 'price') {
        sortedProducts.sort((a, b) => {
            const priceA = parseFloat(a.price) || 0;
            const priceB = parseFloat(b.price) || 0;
            return priceA - priceB;
        });
    } else if (criteria === 'rating') {
        sortedProducts.sort((a, b) => {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            return ratingB - ratingA; 
        });
    }
    displayProducts(sortedProducts); 
}
function clearFiltersAndSort() {
    document.getElementById('brand-filter').value = '';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';
    document.getElementById('sort-products').value = ''; 
    document.getElementById('sort-products').selectedIndex = 0;
    filteredProducts = allProducts;
    sortedProducts = [];
    displayProducts(filteredProducts);
}
window.onload = fetchProducts;
