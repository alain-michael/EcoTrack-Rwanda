import React from 'react';
import TodayTime from '@mui/icons-material/Today';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; 
import RecyclingIcon from '@mui/icons-material/Recycling';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

const components = {
    'Schedule': TodayTime,
    'Achievements': EmojiEventsIcon,
    'Recycle': RecyclingIcon,
    'Logout': LogoutIcon,
    'Settings': SettingsIcon,
}

export const SideBar = () => {
    const houseHoldSidebarItems = ['Schedule', 'Achievements', 'Recycle', 'Settings', 'Logout'];
    
    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className='flex flex-col w-1/4 p-2 bg-[green] h-[100vh] text-white'>
            <h1 className='text-[2rem]'>Dashboard</h1>
            <hr />
            {houseHoldSidebarItems.map((item) => {
                const IconComponent = components[item];
                return (
                    <a key={item} onClick={() => handleItemClick(item)} className="flex items-center gap-2 cursor-pointer p-6 hover:underline hover:text-[lightgreen]">
                        {IconComponent && <IconComponent sx={{ fontSize: '40px' }} />}
                        <span>{item}</span>
                    </a>
                );
            })}
        </div>
    );
};
