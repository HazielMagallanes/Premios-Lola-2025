import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import NotFound from './components/NotFound';
import VotePanel from './components/VotePanel';

function App() {
  console.log('temp log: ', import.meta.env.VITE_FIREBASE_API_KEY);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VotePanel />} />
        <Route path="/group/:groupId" element={<VotePanel />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
