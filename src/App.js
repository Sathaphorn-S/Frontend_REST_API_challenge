import React, { useState } from "react";
import axios from "axios";

function App() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({
    id: "",
    title: "",
    description: "",
  });
  const [updateIssue, setUpdateIssue] = useState({
    id: "",
    title: "",
    description: "",
  });
  const [error, setError] = useState(null);

  const fetchIssue = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/issues/${id}`);
      setIssues([response.data]);
      setUpdateIssue(response.data);
      setError(null);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No issue found");
        setIssues([]);
      } else {
        console.error("Error fetching issue:", error);
        setError("An error occurred");
      }
    }
  };

  const createIssue = async () => {
    try {
      const response = await axios.post("http://localhost:3001/issues", newIssue);
      setIssues([...issues, response.data]);
      setUpdateIssue(response.data); 
      setNewIssue({ id: "", title: "", description: "" });
      setError(null);
    } catch (error) {
      console.error("Error creating issue:", error);
      setError("An error occurred");
    }
  };

  const updateIssueData = async () => {
    try {
      if (!updateIssue.id) {
        setError("Issue ID is required for update.");
        return;
      }

      const response = await axios.put(
        `http://localhost:3001/issues/${updateIssue.id}`,
        updateIssue
      );

      setIssues(
        issues.map((issue) =>
          issue.id === parseInt(updateIssue.id) ? response.data : issue
        )
      );
      setUpdateIssue({ id: "", title: "", description: "" });
      setError(null);
    } catch (error) {
      console.error("Error updating issue:", error);
      setError("An error occurred");
    }
  };

  // Delete Issue by ID
  const deleteIssue = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/issues/${id}`);
      setIssues(issues.filter((issue) => issue.id !== parseInt(id)));
      setError(null);
    } catch (error) {
      console.error("Error deleting issue:", error);
      setError("An error occurred");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Issue Tracker</h1>

      {/* Fetch Issue */}
      <div className="mb-6 p-4 bg-white shadow rounded">
        <h2 className="text-2xl font-semibold mb-4">Fetch Issue</h2>
        <input
          type="number"
          placeholder="ID"
          className="input input-bordered w-full mb-4"
          onChange={(e) => fetchIssue(e.target.value)}
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {issues.length > 0 ? (
          issues.map((issue) => (
            <div key={issue.id} className="p-4 bg-gray-100 rounded shadow mb-4">
              <h3 className="text-xl font-semibold">{issue.title}</h3>
              <p>{issue.description}</p>
              <button
                onClick={() => deleteIssue(issue.id)}
                className="btn btn-error mt-4"
              >
                Delete Issue
              </button>
            </div>
          ))
        ) : (
          <p></p>
        )}
      </div>

      {/* Create Issue */}
      <div className="mb-6 p-4 bg-white shadow rounded">
        <h2 className="text-2xl font-semibold mb-4">Create Issue</h2>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="ID"
            className="input input-bordered w-full"
            value={newIssue.id}
            onChange={(e) => setNewIssue({ ...newIssue, id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            value={newIssue.title}
            onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            value={newIssue.description}
            onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
          />
          <button onClick={createIssue} className="btn btn-primary w-full">
            Create Issue
          </button>
        </div>
      </div>

      {/* Update Issue */}
      <div className="mb-6 p-4 bg-white shadow rounded">
        <h2 className="text-2xl font-semibold mb-4">Update Issue</h2>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="ID"
            className="input input-bordered w-full"
            value={updateIssue.id}
            onChange={(e) => setUpdateIssue({ ...updateIssue, id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            value={updateIssue.title}
            onChange={(e) => setUpdateIssue({ ...updateIssue, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            value={updateIssue.description}
            onChange={(e) => setUpdateIssue({ ...updateIssue, description: e.target.value })}
          />
          <button onClick={updateIssueData} className="btn btn-primary w-full">
            Update Issue
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
