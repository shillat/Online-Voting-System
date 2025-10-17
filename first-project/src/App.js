import './App.css';
import MyComponent from './MyComponent';

function App() {
  const handleClick = () => {
    alert('You clicked the button!');
  }
  return (
    <div className="App">
      <h1>Hey, Welcome to my React Playground!</h1>
      <p>
        Here, we learn React step by step and build cool stuff.
      </p>
      <button onClick={handleClick} className="btn">
        Click Me for more info!
      </button>

      <MyComponent />
    </div>
  );
}

export default App;
