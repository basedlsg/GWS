import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-8">
          <h1 className="text-4xl font-bold mb-4">The Great Work Suite</h1>
          <p className="text-lg text-muted-foreground">
            Project scaffold complete. Ready for feature development.
          </p>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
