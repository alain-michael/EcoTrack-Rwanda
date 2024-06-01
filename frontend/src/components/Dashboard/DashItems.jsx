import React from "react";

export const DashItems = () => {
    const houseHoldSidebarItems = ['Schedule', 'Achievements', 'Recycle', 'Settings', 'Logout'];

    return (
        <div className="flex">
            {houseHoldSidebarItems.map((item) => (
                <h1>{item === 'Schedule' ? "Schedule a collection" : item}</h1>
            ))}
        </div>
    );
}