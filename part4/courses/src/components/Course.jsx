const Course = ({ course }) => {
  return (
    <>
    <h2>{course.name}</h2>
    <ul>
    {course.parts.map((part) => <li key={part.id}>{part.name} {part.exercises}</li>)}
    </ul>
    <p style={{fontWeight:'bold'}}>Total of exercises: {course.parts.reduce((total, part) => total + part.exercises, 0)}</p>
    </>
  )
}

export default Course;