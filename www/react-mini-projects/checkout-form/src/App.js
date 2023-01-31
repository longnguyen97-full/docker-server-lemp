import './App.css';
import Form from './components/Form.js';

function App() {
  return (
    <div className="container-fluid">
      <button type="button" class="btn btn-primary">Checkout</button>
      <Form name="Checkout form" />
    </div>
  );
}

export default App;
