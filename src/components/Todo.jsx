import React, { useState, useRef } from "react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [nextId, setNextId] = useState(1);
  const lastPromise = useRef(Promise.resolve());

  const handleAddNow = () => {
    const id = nextId;
    setNextId(id + 1);
    setTodos((t) => [...t, { id, status: "done" }]);
  };

  const handleAddApi = (delayMs, shouldFail = false) => {
    const id = nextId;
    setNextId(id + 1);

    setTodos((t) => [...t, { id, status: "loading" }]);

    lastPromise.current = lastPromise.current.then(() =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          shouldFail ? reject(new Error("Mock API failure")) : resolve();
        }, delayMs);
      })
        .then(() => {
          setTodos((t) =>
            t.map((x) => (x.id === id ? { id, status: "done" } : x))
          );
        })
        .catch(() => {
          setTodos((t) =>
            t.map((x) => (x.id === id ? { id, status: "error" } : x))
          );
        })
    );
  };

  return (
    <div style={{ display: "flex", padding: 20 }}>
      <div style={{ flex: 1, marginRight: 20 }}>
        {todos.map(({ id, status }) => (
          <div
            key={id}
            style={{
              padding: 10,
              marginBottom: 8,
              borderRadius: 4,
              background:
                status === "loading"
                  ? "#f0f0f0"
                  : status === "error"
                  ? "#f8d7da"
                  : "#d1e7dd",
            }}
          >
            {status === "loading"
              ? "Loading…"
              : status === "error"
              ? `Error – ${id}`
              : `Todo – ${id}`}
          </div>
        ))}
      </div>

      <div style={{ width: 200 }}>
        <button
          onClick={handleAddNow}
          style={{ width: "100%", marginBottom: 8 }}
        >
          Add Todo
        </button>
        <button
          onClick={() => handleAddApi(2000, false)}
          style={{ width: "100%", marginBottom: 8 }}
        >
          Add After 2s (success)
        </button>
        <button
          onClick={() => handleAddApi(2000, true)}
          style={{ width: "100%", marginBottom: 8 }}
        >
          Add After 2s (error)
        </button>
        <button
          onClick={() => handleAddApi(5000, false)}
          style={{ width: "100%" }}
        >
          Add After 5s (success)
        </button>
      </div>
    </div>
  );
}
