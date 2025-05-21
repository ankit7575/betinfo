import "./Terms.css";
import termsData from "./termsData.json";

const Terms = () => {
  // Function to render points, handling nested lists
  const renderPoints = (points) => {
    if (!points) return null; // Handle undefined case

    return points.map((point, i) => {
      if (typeof point === "string") {
        return <li key={i}>{point}</li>;
      } else if (Array.isArray(point)) {
        // Nested List Handling
        return (
          <ul key={i} className="nested-list">
            {renderPoints(point)}
          </ul>
        );
      }
      return null;
    });
  };

  return (
    <div className="container" id="sectionpadding">
      <div className="terms-content">
        <h1>{termsData.title}</h1>
        <p className="intro">{termsData.introduction}</p>

        {termsData.sections.map((section, index) => (
          <div key={index} className="terms-section">
            <h2>{section.heading}</h2>
            <ul>{renderPoints(section.points)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terms;
