import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from './contexts/AuthContext';

import { Home } from './pages/home';
import { NewRoom } from './pages/newRoom';
import { Room } from './pages/room';
import { AdminRoom } from './pages/adminRoom';
import { Error404 } from './pages/error';

import './styles/global.scss';

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms/new' element={<NewRoom />}/>
          <Route path='rooms/:id' element={<Room />} />
          <Route path='/admin/rooms/:id' element={<AdminRoom />} />
          <Route path='/error' element={<Error404 />} />
        </Routes>
      </AuthContextProvider>
    </Router>
  );
};

export default App;
