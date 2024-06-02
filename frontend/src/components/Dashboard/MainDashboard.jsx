import React from 'react'
import { SideBar } from './SideBar'
import { DashItems } from './DashItems';

export const MainDashboard = () => {
  const [selectedItem, setSelectedItem] = React.useState('Schedule');
  return (
    <div className='flex text-[1.4rem]'>
      <SideBar selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
      <DashItems />
    </div>
  )
}
