import React from "react";

const AchievementDetails = (props) => {
  const { achievement, achievements } = props;

  const preceding = achievements.find(
    (ach) => ach.id === achievement.preceding
  );

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row gap-6 space-x-12">
        <div className=" flex justify-center">
          <img className="h-40 w-40 rounded" src={achievement.image} />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="w-24 font-bold">Type</div>
            <div>{achievement.type}</div>
          </div>

          <div className="flex gap-3">
            <div className="w-24 font-bold">Points</div>
            <div>{achievement.points}</div>
          </div>

          <div className="flex gap-3">
            <div className="w-24 font-bold">Frequency</div>
            <div>{achievement.frequency}</div>
          </div>
          {preceding && (
            <div className="flex gap-3">
              <div className="w-24 font-bold">Preceding</div>
              <div>{preceding.name}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementDetails;
