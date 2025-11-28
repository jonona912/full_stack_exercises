const Header = (props) => {
  // console.log(props)
  return (
  <>
    <h1>{props.course}</h1>
  </>
  )
}

const Content = ({ parts }) => {
  console.log("parts")
  // console.log(parts[0].name)
  const items = parts.map((part, index) => (
    <p key={index}>{part.name} {part.exercises}</p>
  ))
  console.log(items)
  return (
    <>
      {items}
    </>
  )
}

const Total = ({ parts } ) => {
  let sum = 0
  parts.forEach(arg => {
    sum += arg.exercises
  })

  return (
    <>
      <p>Number of exercises {sum}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
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
  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App
