import React from "react";

const UserAchievements = (props) => {
  const { achievements, showImage } = props;

  return (
    <>
      {achievements.map((ach, index) => (
        <div className="shadow-sm border rounded-lg" key={index}>
          {(showImage == undefined || showImage == true) && (
            <img
              src={ach.achievement_img}
              alt="Image"
              className="w-full aspect-square"
            />
          )}
          <div className="p-4">
            <p className="font-bold text-md">{ach.achievement_name}</p>
            <div className="flex justify-between">
              <div
                className={`text-${
                  ach.completedDate == null ? "yellow" : "green"
                }-500`}
              >
                {ach.completedDate == null ? "Pending" : "Completed"}
              </div>
              <div className={``}>
                {ach.completedDate == null
                  ? ((ach.frequency / ach.achievement_frequency) * 100).toFixed(
                      1
                    )
                  : "100"}
                %
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default UserAchievements;
