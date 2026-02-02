import { Part } from "./Part";
import type { CoursePart } from "../types";

interface ContentProps {
  courseParts: CoursePart[];
}

export const Content = ({ courseParts }: ContentProps) => {
  return (
    <>
      {courseParts.map((course) => (
        <Part part={course} />
      ))}
    </>
  );
};
