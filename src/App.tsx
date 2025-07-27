import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import CategoryNav from './components/CategoryNav/CategoryNav';
import ArticleList from './components/ArticleList/ArticleList';
import SpaceDesign from './pages/SpaceDesign/SpaceDesign';
import StudyTours from './pages/StudyTours/StudyTours';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <CategoryNav />
              <ArticleList />
            </>
          } />
          <Route path="/space-design" element={<SpaceDesign />} />
          <Route path="/study-tours" element={<StudyTours />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
