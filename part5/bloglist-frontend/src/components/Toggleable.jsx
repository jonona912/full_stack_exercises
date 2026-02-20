// import { useState } from 'react'
import { useState, forwardRef, useImperativeHandle } from 'react'


const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hidePropsChildren = { display: visible ? 'none' : '' }
  const showPropsChildren = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => ({
    toggleVisibility,
    hide: () => setVisible(false),
    show: () => setVisible(true)
  }))
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
})

export default Togglable
