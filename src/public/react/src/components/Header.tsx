import React from 'react';
import { SideNav, SideNavItem, TextInput } from 'react-materialize';

interface props{
    sideBarVisible: Boolean;
    setSideBarVisible: Function;
    onContactClick: Function;
    currentUser?: Contact;
    chatUser?: Contact;
    contacts?: Contact[];
}

const Header: React.FC<props> = ({sideBarVisible, setSideBarVisible, onContactClick, currentUser, chatUser, contacts}) => {
    return (
        <header>
            <nav className="top-nav">
                <div className="container">
                    <div className="nav-wrapper">
                        <div className="row">
                            <div className="col s1 m1 full hide-on-large-only center-flex">
                                <button className="btn-flat top-nav sidenav-trigger lateral-bar-btn" onClick={() => setSideBarVisible(!sideBarVisible)}>
                                    <i className="material-icons">menu</i>
                                </button>
                            </div>
                            <div className="col s11 m11 l12">
                                <h2 className="header">
                                    <div className="col s1 circular user-bubble lg">
                                        <img src={chatUser?chatUser.image.toString():"person.jpg"} alt="" className="circle responsive-img" />
                                    </div>
                                    {chatUser?chatUser.name:""}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <SideNav fixed={true} style={sideBarVisible ? { transform: "translateX(0%)" } : { transform: "translateX(-105%)" }}>
                <SideNavItem userView={true} user={{
                    background: "mail.jpg",
                    name: currentUser?currentUser.name:"",
                    email: currentUser?currentUser.email:"",
                    image: currentUser?currentUser.image:"person.jpg"
                }}>
                </SideNavItem>
                <SideNavItem divider={true} />
                <SideNavItem>
                    <TextInput icon="group_add" label="Search user" className="search" />
                </SideNavItem>
                <SideNavItem divider={true} />
                {contacts?contacts.forEach(contact => {
                    return <SideNavItem href="#!icon" icon="person" onClick={()=>{onContactClick(contact)}}>
                        {contact.name} - {contact.email}
                    </SideNavItem>
                }):""}
                
            </SideNav>
        </header>
    )
}

export default Header;