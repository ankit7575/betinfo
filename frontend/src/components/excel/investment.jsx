import React, { useState } from "react";

const Investment = () => {
  const [name, setName] = useState("");
  const [toBack, setToBack] = useState("");
  const [toLay, setToLay] = useState("");
  const [investmentList, setInvestmentList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      name,
      to_back: parseFloat(toBack),
      to_lay: parseFloat(toLay),
    };

    const updatedData = [...investmentList, newEntry];
    setInvestmentList(updatedData);

    // Create the JSON blob and trigger download
    const json = {
      investment_limit: 10000,
      data: updatedData,
    };

    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "1.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);

    // Clear form
    setName("");
    setToBack("");
    setToLay("");
  };

  return (
    <div>
      <h2>Add Investment</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          value={toBack}
          onChange={(e) => setToBack(e.target.value)}
          placeholder="To Back"
          required
          type="number"
          step="0.01"
        />
        <input
          value={toLay}
          onChange={(e) => setToLay(e.target.value)}
          placeholder="To Lay"
          required
          type="number"
          step="0.01"
        />
        <button type="submit">Add & Download JSON</button>
      </form>
    </div>
  );
};

export default Investment;
