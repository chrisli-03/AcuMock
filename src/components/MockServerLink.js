import React from 'react'
import { Link } from 'react-router-dom'

const MockServerLink = ({ children }) => {
  const link = children ? `/mock_server/${children}` : 'mock_server'
  return (
    <Link to={link}>{children || '+'}</Link>
  )
}

export default MockServerLink
