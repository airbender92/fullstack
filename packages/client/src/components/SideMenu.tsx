import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, UserOutlined} from '@ant-design/icons'

interface SideMenuProps {
    permissions: string[];
}

const SideMenu: React.FC<SideMenuProps> = ({ permissions}) => {
    const menuItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: <Link to="/">Home</Link>,
            permission: 'home'
        },
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: <Link to="/profile">Profile</Link>,
            permission: 'profile'
        },
        {
            key: 'lottery',
            icon: <HomeOutlined />,
            label: <Link to="/lottery">双色球</Link>,
            permission: 'lottery'
        }
    ];
    const filteredItems = menuItems.filter(item => permissions.includes(item.permission));

    return (
        <Menu
            mode="inline"
        >
            {
                filteredItems.map(item => (
                    <Menu.Item key={item.key} icon={item.icon}>
                        {item.label}
                    </Menu.Item>
                ))
            }
        </Menu>
    )
}

export default SideMenu;