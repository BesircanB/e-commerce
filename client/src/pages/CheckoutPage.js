import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAddress } from "../context/AddressContext";
import { useOrders } from "../context/OrderContext";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const { address } = useAddress();
  const { addOrder } = useOrders();

  useEffect(() => {
    const isAddressEmpty =
      !address.fullName ||
      !address.street ||
      !address.city ||
      !address.postalCode ||
      !address.country;

    if (isAddressEmpty) {
      alert("Lütfen önce profil sayfasından adres bilgilerinizi girin.");
      navigate("/profile");
    }
  }, [address, navigate]);

  const [form, setForm] = useState({
    name: address.fullName || "",
    address:
      `${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`,
    phone: "",
  });

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.phone) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Sepetiniz boş. Sipariş verilemez.");
      return;
    }

    // ✅ Siparişi oluştur ve kaydet
    const newOrder = {
      date: new Date().toISOString(),
      name: form.name,
      phone: form.phone,
      address: form.address,
      items: cartItems,
      total,
    };

    addOrder(newOrder);
    clearCart();

    alert("Siparişiniz başarıyla oluşturuldu!");
    navigate("/");
  };

  return (
    <div>
      <Header />
      <div style={{ padding: "2rem" }}>
        <h2>Siparişi Tamamla</h2>

        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          <div>
            <label>Ad Soyad:</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Adres:</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Telefon:</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: "1rem" }}>
            Siparişi Tamamla
          </button>
        </form>

        <div>
          <h3>Sepet Özeti:</h3>
          {cartItems.map((item) => (
            <p key={item.id}>
              {item.title} x {item.quantity} = {(item.price * item.quantity).toFixed(2)} ₺
            </p>
          ))}
          <p><strong>Toplam:</strong> {total.toFixed(2)} ₺</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
