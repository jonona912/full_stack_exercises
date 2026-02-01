import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hidePropsChildren = { display: visible ? 'none' : '' }
  const showPropsChildren = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hidePropsChildren}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showPropsChildren}>
        {props.children}
        <button onClick={toggleVisibility}>{props?.buttonLabel2 ?? 'cancel'}</button>
      </div>
    </div>
  )
}

export default Togglable
