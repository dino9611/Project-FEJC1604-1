import React, { Component } from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
class Header extends Component {
    state = {
        isOpen: false
    };

    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };
    render() {
        return (
            <Navbar color="primary" light expand="ml">
                <NavbarBrand href="/" className='mx-3'>Fournir</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className='mx-auto' navbar>
                        <NavItem>
                            <NavLink href="/profile">My Profile</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/address">Address List</NavLink>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Options
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>
                                    Option 1
                                </DropdownItem>
                                <DropdownItem>
                                    Option 2
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem>
                                    Reset
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

export default Header;