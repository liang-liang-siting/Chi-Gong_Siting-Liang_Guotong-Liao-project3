import PropTypes from 'prop-types'
import Header from './Header'
import './index.css'

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className='container'>{children}</div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}
