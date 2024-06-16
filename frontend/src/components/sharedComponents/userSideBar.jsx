// SiderBar.js

import React from 'react';
import TodayIcon from '@mui/icons-material/Today';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RecyclingIcon from '@mui/icons-material/Recycling';
import GroupIcon from '@mui/icons-material/Group';
import GridViewIcon from '@mui/icons-material/GridView';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import ForumIcon from '@mui/icons-material/Forum';
function SiderBar() {
    const houseHoldSidebarItems = {
        "Household User": {
            "General": [
                { goto: "Dashboard", action: "Dashboard", icon: <GridViewIcon sx={{ marginRight: 1 }} /> },
                { goto: "Schedule", action: "Schedule", icon: <TodayIcon sx={{ marginRight: 1 }} /> },
                { goto: "Achievements", action: "Achievements", icon: <EmojiEventsIcon sx={{ marginRight: 1 }} /> },
                { goto: "Messages", action: "Messages", icon: <ForumIcon sx={{ marginRight: 1 }} /> },
            ],
        },
        "Waste Collector": {
            "General": [
                { goto: "Dashboard", action: "Dashboard", icon: <GridViewIcon sx={{ marginRight: 1 }} /> },
                { goto: "Achievements", action: "Achievements", icon: <EmojiEventsIcon sx={{ marginRight: 1 }} /> },
                { goto: "Collections", action: "Collections", icon: <RecyclingIcon sx={{ marginRight: 1 }} /> },
                { goto: "Messages", action: "Messages", icon: <ForumIcon sx={{ marginRight: 1 }} /> },
            ],
        },
        "admin": {
            "General": [
                { goto: "Dashboard", action: "Dashboard", icon: <GridViewIcon sx={{ marginRight: 1 }} /> },
                { goto: "User Achievements", action: "User Achievements", icon: <EmojiEventsIcon sx={{ marginRight: 1 }} /> },
                { goto: "Manage Users", action: "Manage Users", icon: <GroupIcon sx={{ marginRight: 1 }} /> },
                { goto: "All Schedules", action: "All Schedules", icon: <AvTimerIcon sx={{ marginRight: 1 }} /> },
                { goto: "Messages", action: "Messages", icon: <ForumIcon sx={{ marginRight: 1 }} /> },
            ],
        },
    };

    return houseHoldSidebarItems;
}

export default SiderBar;
