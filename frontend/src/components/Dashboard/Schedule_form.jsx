import React, { useState } from 'react';
import {
  TextField,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import axios from 'axios';
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { useJsApiLoader } from '@react-google-maps/api';
import createAxiosInstance from '../../features/AxiosInstance';
import '@reach/combobox/styles.css';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setSelectedItem } from '../../features/SharedDataSlice/SharedData';

const libraries = ['places'];

dayjs.extend(utc);

export const Schedule_form = () => {
  const dispatch = useDispatch();
  const instance = createAxiosInstance();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_API_KEY,
    libraries: libraries,
  });

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({});

  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [repeat, setRepeat] = useState(0);

  const handleSelect = async (address) => {
    setValue(address, false);
    setAddress(address);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      const trimmedLat = Number(lat.toFixed(4));
      const trimmedLng = Number(lng.toFixed(4));

      console.log(
        `${address} Coordinates --> lat: ${trimmedLat} lng:${trimmedLng}`,
      );
      setLat(trimmedLat);
      setLng(trimmedLng);
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Combine date and time into a single datetime object
    const combinedDateTime = dayjs(date)
      .hour(time.hour())
      .minute(time.minute())
      .second(0)
      .millisecond(0);

    // Format the datetime to the required ISO 8601 format with milliseconds and UTC
    const formattedDateTime = combinedDateTime
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    const values = {
      date,
      date_time: formattedDateTime, // Ensure this matches the backend expectation
      address: { latitude: lat, longitude: lng },
      lat,
      lng,
      repeat,
    };

    console.log(values);
    instance
      .post('/schedule', values, {
        headers: {
          'Content-Type': 'application/json', // Ensure the content type is set
        },
      })
      .then((response) => {
        toast.success('Scheduled successfully');
        console.log(response.data);
        dispatch(setSelectedItem('Dashboard'));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="schedule-form flex flex-col justify-around h-[70vh]"
      >
        <label>
          Date* :
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Collection Date"
              name="date"
              value={date}
              onChange={(value) => setDate(value)}
              renderInput={(params) => (
                <TextField {...params} sx={{ width: '30%' }} />
              )}
            />
          </LocalizationProvider>
        </label>
        <hr />
        <label>
          Time* :
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              name="time"
              label="Collection Time"
              value={time}
              onChange={(value) => setTime(value)}
              renderInput={(params) => (
                <TextField {...params} sx={{ width: '30%' }} />
              )}
            />
          </LocalizationProvider>
        </label>
        <hr />
        <label className="">
          Address :
          <Combobox onSelect={handleSelect}>
            <ComboboxInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={!ready}
              placeholder="Select Your Location"
              className="px-5 py-4 outline-none border-[0.5px] border-gray-400 rounded-md"
            />
            <ComboboxPopover>
              <ComboboxList>
                {status === 'OK' &&
                  data.map(({ description, place_id }) => (
                    <ComboboxOption key={place_id} value={description} />
                  ))}
              </ComboboxList>
            </ComboboxPopover>
          </Combobox>
        </label>
        <hr />
        <label>
          Repetition:
          <FormControl sx={{ width: '30%', boxSizing: 'border-box' }}>
            <InputLabel id="demo-simple-select-filled-label">Repeat</InputLabel>
            <Select
              label="Repeat"
              id="demo-simple-select-filled"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
            >
              <MenuItem value={'none'}>None</MenuItem>
              <MenuItem value={'weekly'}>Weekly</MenuItem>
              <MenuItem value={'biweekly'}>Once every 2 weeks</MenuItem>
            </Select>
          </FormControl>
        </label>
        <button
          className="h-9 bg-[#207855] text-white rounded-md mt-4"
          type="submit"
        >
          Submit
        </button>
      </form>
    </>
  );
};
