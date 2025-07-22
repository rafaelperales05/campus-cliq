// Step 4: Test with routing (will use this next)
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "./index.css";

function HomePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Home Page</CardTitle>
      </CardHeader>
      <CardContent>
        <p>✅ Routing is working!</p>
        <Link to="/test">
          <Button>Go to Test Page</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function TestPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Page</CardTitle>
      </CardHeader>
      <CardContent>
        <p>✅ Navigation is working!</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function App() {
  console.log("✅ App component rendering with routing...");
  
  return (
    <BrowserRouter>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">🎯 Campus Cliq Debug - Step 4</h1>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;