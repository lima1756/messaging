import React, { useState } from 'react';
import { SideNav, SideNavItem, TextInput } from 'react-materialize';

interface props{
    sideBarVisible: Boolean;
    setSideBarVisible: Function;
    onContactClick: Function;
    addFriend: Function;
    currentUser?: Contact;
    chatUser?: Contact;
    contacts?: any;
}

const changeHandle = (e: React.FormEvent<HTMLInputElement>, setter: Function) => {
    if(e && e.currentTarget && e.currentTarget.value){
        setter(e.currentTarget.value);
    } else if (e && e.currentTarget){
        setter("");
    }
}

const Header: React.FC<props> = ({sideBarVisible, setSideBarVisible, onContactClick, currentUser, chatUser, contacts, addFriend}) => {
    const [searchUser, setSearchUser] = useState("");
    if(chatUser){
        console.log(chatUser.name);
        console.log(chatUser.image);
    }
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
                    <TextInput icon="group_add" label="Search user" className="search" 
                        value={searchUser} onChange={(e:React.FormEvent<HTMLInputElement>) => changeHandle(e, setSearchUser)}
                        onKeyDown={(e: any)=>{if(e.keyCode===13)addFriend(searchUser)}} />
                </SideNavItem>
                <SideNavItem divider={true} />
                {Object.keys(contacts).map(
                    (key)=>
                    (
                        <SideNavItem icon="person" onClick={()=>{onContactClick(contacts[key])}} key={key}>
                            {contacts[key].name} - {key}
                        </SideNavItem>
                    )
                )}
                
            </SideNav>
        </header>
    )
}

export default Header;