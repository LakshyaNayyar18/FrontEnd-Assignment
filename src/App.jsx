
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadImagePage from './UploadImagePage';
import CropImagePage from './CropImagePage';
import ViewImagePage from './ViewImagePage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadImagePage />} />
        <Route path="/crop-image" element={<CropImagePage />} />
        <Route path="/view-image" element={<ViewImagePage />} />
      </Routes>
    </Router>
  );
};

export default App;







