import './App.css';
import Header from './components/Header/Header';
import CategoryNav from './components/CategoryNav/CategoryNav';
import ArticleList from './components/ArticleList/ArticleList';

function App() {
  return (
    <div className="App">
      <Header />
      <CategoryNav />
      <ArticleList />
    </div>
  );
}

export default App;
