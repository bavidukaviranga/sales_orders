import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/slices/store';
import SSRoutes from './routes/SSRoutes';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <SSRoutes />
      </div>
    </Provider>
  );
}

export default App;
