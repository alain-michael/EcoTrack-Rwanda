import React, { useState } from "react";
import {
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createAchievement, updateAchievement } from "../../api/achievements";
import toast from "react-hot-toast";
import DataProgressLoad from "../Loads/DataProgressLoad";

const AchievementForm = (props) => {
  const { close, achievements, onSuccess, achievement } = props;
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: achievement?.name || "",
      points: achievement?.points || "",
      image: null, // Changing to null to represent file upload
      preceding: achievement?.preceding || "",
      is_earned_once: achievement?.is_earned_once || false,
      frequency: achievement?.frequency || "",
      type: achievement?.type || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      points: Yup.number().required("Required"),
      image: achievement ? undefined : Yup.mixed().required("Required"),
      preceding: Yup.string(),
      frequency: Yup.number().required("Required"),
      type: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      // Handle form submission
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("points", values.points);
      if (values.image != null) formData.append("image", values.image[0]);
      formData.append("preceding", values.preceding);
      formData.append("is_earned_once", values.is_earned_once);
      formData.append("frequency", values.frequency);
      formData.append("type", values.type);

      console.log(formData.get("image"));

      setLoading(true);
      if (achievement) {
        await updateAchievement(achievement.id, formData).then((res) => {
          toast.success("Updated");
          onSuccess();
          close();
        });
      } else {
        await createAchievement(formData).then((res) => {
          toast.success("Created");
          onSuccess();
          close();
        });
      }
      setLoading(false);
    },
  });

  return (
    <form
      className="flex gap-4 flex-col"
      encType="multipart/form-data"
      onSubmit={formik.handleSubmit}
    >
      <div className="w-full">
        <InputLabel htmlFor="name" className="label">
          Name
        </InputLabel>
        <TextField
          className="w-full"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
        />
      </div>

      <div className="w-full">
        <InputLabel htmlFor="image" className="label">
          Image URL
        </InputLabel>
        <input
          type="file"
          accept="image/*"
          id="image"
          name="image"
          onChange={(event) => {
            formik.setFieldValue("image", event.currentTarget.files);
          }}
          className="w-full"
        />
        {formik.errors.image && (
          <div className="text-red-500">{formik.errors.image}</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="w-full">
          <InputLabel htmlFor="frequency" className="label">
            Frequency
          </InputLabel>
          <TextField
            className="w-full"
            id="frequency"
            name="frequency"
            type="number"
            value={formik.values.frequency}
            onChange={formik.handleChange}
            error={formik.touched.frequency && Boolean(formik.errors.frequency)}
          />
        </div>
        <div className="w-full">
          <InputLabel htmlFor="points" className="label">
            Points
          </InputLabel>
          <TextField
            className="w-full"
            id="points"
            name="points"
            type="number"
            value={formik.values.points}
            onChange={formik.handleChange}
            error={formik.touched.points && Boolean(formik.errors.points)}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="w-full">
          <InputLabel htmlFor="type" className="label">
            Type
          </InputLabel>
          <FormControl className="w-full">
            <Select
              className="w-full select-input"
              id="type"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <MenuItem value={"REGISTER"}>REGISTER</MenuItem>
              <MenuItem value={"SHARE"}>SHARE</MenuItem>
              <MenuItem value={"SCHEDULE"}>SCHEDULE</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="w-full">
          <InputLabel htmlFor="is_earned_once" className="label">
            Is Earned Once
          </InputLabel>
          <FormControl className="w-full">
            <Select
              className="w-full select-input"
              id="is_earned_once"
              name="is_earned_once"
              value={formik.values.is_earned_once}
              onChange={formik.handleChange}
              error={
                formik.touched.is_earned_once &&
                Boolean(formik.errors.is_earned_once)
              }
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="w-full">
        <InputLabel htmlFor="type" className="label">
          Preceeding
        </InputLabel>
        <FormControl className="w-full">
          <Select
            className="w-full select-input"
            id="preceding"
            name="preceding"
            value={formik.values.preceding}
            onChange={formik.handleChange}
            error={formik.touched.preceding && Boolean(formik.errors.preceding)}
          >
            {achievements.map((achievement) => (
              <MenuItem key={achievement.id} value={achievement.id}>
                {achievement.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="w-full">
        <Button type="submit" disabled={loading}>
          {loading ? <DataProgressLoad /> : <span>Submit</span>}
        </Button>
      </div>
    </form>
  );
};

export default AchievementForm;
