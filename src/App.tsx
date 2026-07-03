import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import CategoryNav from './components/CategoryNav/CategoryNav';
import ArticleList from './components/ArticleList/ArticleList';
import SpaceDesign from './pages/SpaceDesign/SpaceDesign';
import StudyTours from './pages/StudyTours/StudyTours';
import ExhibitionPlanning from './pages/ExhibitionPlanning/ExhibitionPlanning';
import { AdminLogin } from './components/AdminLogin/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { ToastProvider } from './components/Toast/Toast';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              
              {/* Public routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <CategoryNav />
                  <ArticleList />
                </>
              } />
              <Route path="/space-design" element={
                <>
                  <Header />
                  <SpaceDesign />
                </>
              } />
              <Route path="/study-tours" element={
                <>
                  <Header />
                  <StudyTours />
                </>
              } />
              <Route path="/exhibition-planning" element={
                <>
                  <Header />
                  <ExhibitionPlanning />
                </>
              } />
              <Route path="/project/:id" element={
                <>
                  <Header />
                  <div>项目详情页面开发中...</div>
                </>
              } />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
