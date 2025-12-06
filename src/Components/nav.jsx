

import { Menubar } from 'primereact/menubar';

import { useNavigate } from 'react-router-dom';

import { supabase } from "../Client.js";

export default function NAVBAR() {
    const navigate = useNavigate();


  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            command: () => navigate('/creators')
        },
        {
            label: 'View Creators',
            icon: 'pi pi-star',
              command: () => navigate('/creators/1')
        }
        ,
        {
            label: 'Add Creator',
            icon: 'pi pi-plus',
              command: () => navigate('/creators/add')
        },
       
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
              command: () => handleLogout()
        }   
    ];

    return (
        <div className="card">
            <Menubar model={items} />
        </div>
    )
}
        