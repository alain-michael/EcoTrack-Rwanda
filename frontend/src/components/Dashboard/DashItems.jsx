import React from "react";

export const DashItems = () => {

    return (
        <div className="flex">
            <div>
                <h1>{item === 'Schedule' ? "Schedule a collection" : item}</h1>
                
            </div>
        </div>
    );
}