const Header = (props) => <h1>{props.courseName}</h1>

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => 
        <Part key={part.id} part={part} />
      )}
      <Total total={
        parts.reduce((sum, part) => {
          console.log('what is happening', sum, part)
          return sum + part.exercises
        }, 0)
      } />

    </div>
  )
}

const Part = ({part}) => (
  <p>
    {part.name} {part.exercises}
  </p>
)

const Total = (props) => <p><strong>Total of {props.total} exercises</strong></p>

const Course = ({ course }) => {
  console.log(course.name)
  return (
    <>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
    </>
  )
}

const Courses = ({courses}) => {
  console.log("Courses: ", courses)
  return(
    <>
      {courses.map(course => <Course key={course.id} course={course} />)}
    </>
  )
}


export default Courses