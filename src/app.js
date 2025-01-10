document.addEventListener('alpine:init', () => {
  Alpine.data('products', () => ({
    items: [
      { id: 1, name: 'Robusta Brazil', img: '1.jpg', price: 25000 },
      { id: 2, name: 'Arabica Blend', img: '2.jpg', price: 25000 },
      { id: 3, name: 'Primo Passo', img: '3.jpg', price: 30000 },
      { id: 4, name: 'Aceh Gayo', img: '4.jpg', price: 35000 },
      { id: 5, name: 'Sumatra Mandheling', img: '5.jpg', price: 40000 },
    ],
  }));

  Alpine.store('cart', {
    items: [], 
    total: 0,
    quantity: 0,
    add(newItem) {
      // Cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // Jika belum ada / cart masih kosong
      if(!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        //Jika barangnya sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
        this.items = this.items.map((item) => {
          // Jika barang berbeda
          if(item.id !== newItem.id) {
            return item; 
          } else {
            // Jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item; 
          }
        });
      }     
    },
    remove(id) {
      // Ampil item yang mau diremove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // Jika item lebih dari 1
      if(cartItem.quantity > 1) {
        // Telusuri 1 1
        this.items = this.items.map((item) => {
          //Jika bukan barang yang diklik
          if(item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // Jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

// Event listener untuk memeriksa validasi form
form.addEventListener('keyup', function () {
  let allFieldsFilled = true;

  for (let i = 0; i < form.elements.length; i++) {
    // Pastikan elemen adalah input (bukan tombol atau lainnya)
    if (form.elements[i].tagName === 'INPUT' || form.elements[i].tagName === 'TEXTAREA') {
      if (form.elements[i].value.trim() === '') {
        allFieldsFilled = false;
        break;
      }
    }
  }

  // Aktifkan atau nonaktifkan tombol berdasarkan validasi
  if (allFieldsFilled) {
    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
  } else {
    checkoutButton.disabled = true;
    checkoutButton.classList.add('disabled');
  }
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener('click', function(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  window.open('http://wa.me/6283149879915?text=' + encodeURIComponent(message));
});

//format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No HP: ${obj.phone}
Data Pesanan
  ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
TOTAL: ${rupiah(obj.total)}
Terima Kasih.`;
};


// Konversi ke Rupiah
const rupiah = (Number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number); 
};
