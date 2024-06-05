import React from "react";

import { useState } from "react";
import { Archivements } from "./Archivements";
import { Schedule_form } from "./Schedule_form";
import { useSelector } from "react-redux";

export const DashItems = () => {
  const [serverError, setServerError] = useState("");
  const selectedItem = useSelector(state => state.sharedData.selectedItem);
  return (
    <div className="flex flex-col w-full rounded-lg mx-auto justify-around bg-white p-4 text-primary">
      <div className="mb-10">
        <h1 className="text-[2rem] text-center ">
          {selectedItem === "Schedule" ? "Schedule a collection" : selectedItem}
        </h1>
      </div>
      {selectedItem == "Schedule" && <Schedule_form />}
      {selectedItem == "Achievements" && <Archivements />}
    </div>
  );
};
