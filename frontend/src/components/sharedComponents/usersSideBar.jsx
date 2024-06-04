import LandscapeIcon from '@mui/icons-material/Landscape';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import HomeIcon from '@mui/icons-material/Home';
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import InfoIcon from '@mui/icons-material/Info';
import RestoreIcon from '@mui/icons-material/Restore';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';

import { useSelector } from 'react-redux';

const UserType = () => {
    const userType = {
        User: {
            "General": [
                { action: "Dashboard", icon: <HomeIcon sx={{ marginRight: 1 }} />, goto: 'Home Page' },
                { action: "View All Plots", icon: <AssignmentIcon sx={{ marginRight: 1 }} />, goto: lang.ViewPlotsTitle },
                { action: "Download All Your UPIs", icon: <CloudDownloadIcon sx={{ marginRight: 1 }} />, goto: lang.DownloadUpi }
            ],
        },
        waste_collectors: {
            "Parcel Info": [
                { action: 'Dashboard', icon: <HomeIcon sx={{ marginRight: 1 }} />, goto: lang.DashboardTitle },
                { action: 'Plot info With UPI', icon: <LandscapeIcon sx={{ marginRight: 1 }} />, goto: lang.PlotWithUPI },
                { action: 'Update Irembo Applications', icon: <ContactEmergencyIcon sx={{ marginRight: 1 }} />, goto: "Irembo Applications" },
                { action: 'Latis', icon: <ShareLocationIcon sx={{ marginRight: 1 }} />, goto: 'Latis' }
            ],
        },
        admin: {
            "Parcel Info": [
                { action: 'Dashboard', icon: <HomeIcon sx={{ marginRight: 1 }} />, goto: lang.DashboardTitle },
                { action: 'Plot info With UPI', icon: <LandscapeIcon sx={{ marginRight: 1 }} />, goto: lang.PlotWithUPI },
                { action: 'Update Irembo Applications', icon: <ContactEmergencyIcon sx={{ marginRight: 1 }} />, goto: "Irembo Applications" },
                { action: 'Latis', icon: <ShareLocationIcon sx={{ marginRight: 1 }} />, goto: 'Latis' }
            ],
        },
    };

    return userType;
}
export default UserType;