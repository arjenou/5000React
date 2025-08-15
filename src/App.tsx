import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import CategoryNav from './components/CategoryNav/CategoryNav';
import ArticleList from './components/ArticleList/ArticleList';
import SpaceDesign from './pages/SpaceDesign/SpaceDesign';
import StudyTours from './pages/StudyTours/StudyTours';
import ExhibitionPlanning from './pages/ExhibitionPlanning/ExhibitionPlanning';
import ProjectDetail from './pages/ProjectDetail/ProjectDetail';
import ApiTest from './components/ApiTest/ApiTest';

function App() {
  const isDev = import.meta.env.DEV;

  return (
    <Router>
      <div className="App">
        {isDev && <ApiTest />}
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
          <Route path="/exhibition-planning" element={<ExhibitionPlanning />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
