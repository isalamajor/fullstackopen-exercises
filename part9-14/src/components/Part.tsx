import type { CoursePart } from "../types";

export const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <>
          <h3>{part.name}</h3>
          <p>{part.description}</p>
          <p>Exercise count {part.exerciseCount}</p>
        </>
      );
    case "group":
      return (
        <>
          <h3>{part.name}</h3>
          <p>Exercise count {part.exerciseCount}</p>
          <p>Group proejct count {part.groupProjectCount}</p>
        </>
      );
    case "background":
      return (
        <>
          <h3>{part.name}</h3>
          <p>Exercise count {part.exerciseCount}</p>
          <p>{part.description}</p>
          <p>Background material {part.backgroundMaterial}</p>
        </>
      );
    case "special":
      return (
        <>
          <h3>{part.name}</h3>
          <p>{part.description}</p>
          <p>Exercise count {part.exerciseCount}</p>
          <p>Requirements: {part.requirements.join(", ")}</p>
        </>
      );
    default:
      return;
  }
};
