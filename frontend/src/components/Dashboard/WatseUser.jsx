import React, { useEffect, useState } from 'react'
import SummaryGrid from './Summary'
import DataTable from './dataUser'
import createAxiosInstance from '../../features/AxiosInstance';
import { useSelector } from 'react-redux';

export const HouseShedule = () => {
    const userInfo = useSelector((state) => state.sharedData.usersLogin);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const instance = createAxiosInstance();

    useEffect(() => {
        instance.get(`jobs/completed`)
        .then(response => {
          setData(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }, []);
  
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }
    return (
        <>
            <div className="min-h-screen p-4 ">
                <h1 className="text-2xl font-bold mb-4">Viewing Waste Collection Summary</h1>
                <DataTable data={data} />
                <SummaryGrid data={data} />
            </div>
        </>
    )
}
