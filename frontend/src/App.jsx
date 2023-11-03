import React, {useState, useEffect} from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Fetch products from the server when the component mounts
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    const updatedProducts = products.map(product => {
      if (product.id === productId) {
        return {...product, quantity: parseInt(quantity)};
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleOrder = () => {
    const orderedProducts = products.filter(product => product.quantity > 0);
    // Send the order to the server
    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderedProducts)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Order placed successfully:', data);
        setOrder(data); // Update order details
      })
      .catch(error => console.error('Error placing order:', error));
  };

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price} -
            <span style={{paddingLeft: '10px', paddingRight: '10px'}}>Quantity to order:</span>
            <input
              type="number"
              value={product.quantity || 0}
              min={0}
              onChange={e => handleQuantityChange(product.id, e.target.value)}
            />
          </li>
        ))}
      </ul>
      <button onClick={handleOrder}>Place Order</button>

      {order && (
        <div>
          <h2>Order Details</h2>
          <ul>
            {order.orders.map((item) => (
              <li key={item.product.id}>
                {item.product.name} - ${item.product.price} x {item.quantity} = ${item.subTotal}
              </li>
            ))}
          </ul>
          <p>Total: ${order.total}</p>
        </div>
      )}
    </div>
  );
};

export default App;
