function getWishlistItems() {
    if (typeof(Storage) === "undefined") {
        console.error("LocalStorage is not supported by this browser.");
        return [];
    }
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

function saveWishlist(items) {
    localStorage.setItem('wishlist', JSON.stringify(items));
}
function displayWishlist() {
    const wishlistContainer = document.getElementById('wishlist-container');
    const items = getWishlistItems();

    wishlistContainer.innerHTML = ''; 

    if (items.length === 0) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>';
        return;
    }

    items.forEach((item, index) => {
        const productItem = document.createElement('div');
        productItem.classList.add('wishlist-item');
        productItem.innerHTML = `
            <img src="${item.image_link || 'placeholder-image-url.jpg'}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p><strong>Brand:</strong> ${item.brand || 'Unknown'}</p>
            <p><strong>Price:</strong> $${item.price || 'N/A'}</p>
            <p><strong>Type:</strong> ${item.product_type || 'N/A'}</p>
            <p><strong>Rating:</strong> ${item.rating || 'Not rated'}</p>
            <a href="${item.website_link}" target="_blank">Visit Website</a>
            <a href="${item.product_link}" target="_blank">View Product</a>
            <button onclick="removeFromWishlist(${index})">Remove</button>
        `;
        wishlistContainer.appendChild(productItem);
    });
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Wishlist';
    clearButton.classList.add('clear-wishlist');
    clearButton.onclick = clearWishlist;
    wishlistContainer.appendChild(clearButton);
}
function removeFromWishlist(index) {
    const items = getWishlistItems();
    items.splice(index, 1);
    saveWishlist(items); 
    displayWishlist(); 
}
function clearWishlist() {
    saveWishlist([]); 
    displayWishlist(); 
}

window.onload = displayWishlist;
