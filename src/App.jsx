import PropTypes from 'prop-types'
import { useState } from 'react'
import Header from './Header'
import { UserContext } from './Context'
import './index.css'

export default function App({ children }) {
  const [loginUserName, setLoginUserName] = useState('')

  return (
    <UserContext.Provider
      value={{
        loginUserName,
        setLoginUserName,
      }}
    >
      <Header />
      <div className='container'>{children}</div>
    </UserContext.Provider>
  )
}

App.propTypes = {
  children: PropTypes.node.isRequired,
}