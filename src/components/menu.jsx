import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { Disconnect } from './index'
import { PropTypes } from 'prop-types'

const Menu = ({ user }) => {
  const { isLoggedIn, isAdmin } = user
  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Link className='navbar-brand' to='/'>FFXIV-Roster Helper</Link>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse id='responsive-navbar-nav'>
        <Nav className='mr-auto'>
          {/* si l'utilisateur est connecté */
            isLoggedIn &&
              <>
                {/* <NavLink className="nav-link" to="/item">Item</NavLink> NOT USED */}
                <NavLink className='nav-link' to='/chr'><i className='fas fa-gamepad' />Mes persos - roster</NavLink>
                <NavLink className='nav-link' to='/param'><i className='fas fa-cog' />Mes paramètres</NavLink>
              </>
          }
        </Nav>
        <Nav>
          {/* si l'utilisateur n'est pas connecté */
            !isLoggedIn &&
              <>
                <NavLink className='nav-link login' to='/login'><i className='fas fa-sign-in-alt' />Login</NavLink>
                <NavLink className='nav-link' to='/signup'><i className='fas fa-user-plus' />Inscription</NavLink>
              </>
          }
          {/* si l'utilisateur est admin */
            isAdmin && <>
              <NavLink className='nav-link' to='/admin'><i className='fas fa-meteor' />Admin</NavLink>
            </>
          }
          {/* Si l'utilisateur est connecté */
            isLoggedIn && <Disconnect />
          }

        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
Menu.propTypes = {
  user: PropTypes.object.isRequired
}
export default Menu
