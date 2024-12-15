import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RoutesConfig from './routes';

function App() {
  return (
    <Router>
      <RoutesConfig />
    </Router>
  );
}

export default App;
