interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescripted extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescripted {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescripted {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartReq extends CoursePartDescripted {
  requirements: string[];
  kind: "special";
}

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartReq;
