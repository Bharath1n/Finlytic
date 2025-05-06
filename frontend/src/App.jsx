import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error("Error fetching:", error));
  }, []);

  return (
    <div>
      <h1>AI-Powered Financial Insights</h1>
      <p>Backend Message: {message}</p>
    </div>
  );
}

export default App;