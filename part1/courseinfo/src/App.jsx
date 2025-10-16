import Header from "./components/header";
import Content from "./components/content";
import Total from "./components/total";


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name}></Header>
      <Content parts={course.parts}></Content>
      <Total total={
        (() => { 
          let sum = 0; 
          course.parts.forEach(part => sum += part.exercises );
          return sum;
        })()}
      ></Total>
    </div>
  )
}

export default App