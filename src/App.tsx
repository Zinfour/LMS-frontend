import { Routes, Route } from 'react-router';
import MainScreensLayout from './components/MainScreensLayout';
import ScreenLayout from './components/ScreenLayout';
import Home from './screens/Home';
import About from './screens/About';
import Movies from './screens/Movies';
import FormExample from './screens/FormExample';
import Movie from './screens/Movie';
import MovieAgain from './screens/MovieAgain';

function App() {
  return (
    <div className="dark bg-background text-foreground">
      <Routes>
        <Route path="/" element={<MainScreensLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="movies" element={<Movies />} />
          <Route path="form-example" element={<FormExample />} />
        </Route>

        <Route element={<ScreenLayout />}>
          <Route path="/movie/:id" element={<Movie />} />
          <Route path="/secretMovie/:id" element={<MovieAgain />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
