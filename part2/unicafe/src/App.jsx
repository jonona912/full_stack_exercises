import { useState } from 'react'

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const total = props.good + props.neutral + props.bad
  const average = total === 0 ? 0 : (props.good - props.bad) / total
  const positive = total === 0 ? 0 : (props.good / total) * 100
  if (total !== 0) {
    return (
      <div>
        <table>
          <tbody>
            <StatisticsLine text="good" value={props.good} />
            <StatisticsLine text="neutral" value={props.neutral} />
            <StatisticsLine text="bad" value={props.bad} />
            <StatisticsLine text="all" value={total} />
            <StatisticsLine text="average" value={average} />
            <StatisticsLine text="positive" value={positive + " %"} />
          </tbody>
        </table>
      </div>
    )
  }
  else {
    return (<div>
      <p>No feedback given</p>
    </div>
    )
  }

}

const Button = ({text, handleIncrement, setter}) => {
  return(
    <button onClick={handleIncrement(setter)}>
      {text}
    </button>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const handleIncrement = (setter) => () => {
    setter(prev => prev + 1)
  }

  // derived values

  return (
    <div>
      <h2>give feedback</h2>
      <Button text="good" handleIncrement={handleIncrement} setter={setGood} />
      <Button text="neutral" handleIncrement={handleIncrement} setter={setNeutral} />
      <Button text="bad" handleIncrement={handleIncrement} setter={setBad} />
      <h2>statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App

