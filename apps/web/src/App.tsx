import { Routes, Route } from 'react-router-dom';
import { CasesList } from './routes/CasesList';
import { CaseDetail } from './routes/CaseDetail';
import { Layout } from './components';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<CasesList />} />
        <Route path='/cases/:id' element={<CaseDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
