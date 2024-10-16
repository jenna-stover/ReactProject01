import React, { useState, useEffect } from "react";
import axios from "axios";
import Product from "./components/Product";
import Modal from "./components/Modal";
import './Home.css'

const Home = () => {
  const [desserts, setDesserts] = useState([]);
  const [cart, setCart] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
       "/data/data.json"
      );
      setDesserts(response.data);
    })();
  }, []);

const addToCart = (item) => {
  setCart((prevCart) => {
    if (item.quantity <= 0) {
      const { [item.name]: _, ...rest } = prevCart;
      return rest;
    }

    return {
      ...prevCart,
      [item.name]: {...item, quantity: item.quantity,
      },
    };
  });
};

const handleOrderConfirm = () => {
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
};

const totalQuantity = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

return (
  <div className="section-container">
    <section className="section three">
      <h1 className="header">Desserts</h1>
      <div className="desserts-container columns">
        {desserts.map((dessert) => (
          <div key={dessert.name}>
          <Product 
              key={dessert.name}
              category={dessert.category}
              name={dessert.name}
              image={dessert.image.desktop}
              price={dessert.price}
              addToCart={addToCart}
            />
          </div>
        ))}
      </div>
    </section>

    <section className="section one">
      <div className="cart-container">
        <h2 id="cart-title">Your Cart ({totalQuantity})</h2>
        {Object.keys(cart).length === 0 ? (
          <div id="empty-container">
            <img id="empty-cart-img" src="/assets/images/illustration-empty-cart.svg" alt="empty img"></img>
            <p>Your added items will appear here</p>
          </div>
          ) : (
          <ul id="cart-item-info">
            {Object.values(cart).map((item) => (
              <li key={item.name}>
                <div>{item.name}</div>
                <div id="align-cart-items">
                  <div id="quantity-cart">{item.quantity}x</div>
                  <div id="price-cart">@${item.price.toFixed(2)}</div>
                  <div id="total-price-cart">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              </li>
            ))}
            <div id="confirm-order-button" onClick={handleOrderConfirm}>Confirm Order</div>
          </ul>
        )}
      </div>
    </section>
    <Modal show={isModalOpen} onClose={handleCloseModal} cart={cart} />
</div>
);
};

export default Home;