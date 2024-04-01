import React, { useState }  from 'react';
import "./Dashboard.css";
import DoppleHeader from "../components/DoppleHeader";
import printersLogo from '../assets/3dPrinters.png';
import servicesLogo from '../assets/server.png';
import ReactPlayer from 'react-player';

const Dashboard = () => {
  const [printerData, setPrinterData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [networkServiceData, setNetworkServiceData] = useState([]);
  const streams = [
    "http://localhost:3000/index.m3u8",
    "http://localhost:3000/index.m3u8",
    "http://localhost:3000/index.m3u8",
    "http://localhost:3000/index.m3u8",
    "http://localhost:3000/index.m3u8",
   ];
  return (
    <div className="dashboard-container">
      <DoppleHeader />
      <div><h3>Camera View</h3></div>
      <div className="content">
        <div id="cameraFeeds">
          <div className="camera-grid">
            {streams.map((streamUrl, index) => (
              <div className="camera" key={index}>
                <ReactPlayer
                  url={streamUrl}
                  playing
                  controls
                  width="280px"
                  height="160px"
                  muted={true}
                />
              </div>
            ))}
          </div>
        </div>
        <div id="printers">
          <h3>3D Printer Status <img src={printersLogo} alt="Chip icon that represents the printers" /></h3>
          <table>
            <tr>
              <th></th>
              <th>Printer No</th>
              <th className='columnPrinterStatus'>Status</th>
            </tr>
            {printerData.map((printer) => (
              <tr key={printer.id}>
                <td>{printer.id}</td>
                <td>{printer.no}</td>
                <td className='columnPrinterStatus'>{printer.status}</td>
              </tr>
            ))}
          </table>
        </div>
        <div id="orderStatus">
          <table>
            <tr>
              <th></th>
              <th>#</th>
              <th>Earsonly</th>
              <th>Reduson</th>
              <th>Status</th>
            </tr>
            {orderData.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.orderNumber}</td>
                <td>{order.earsOnly}</td>
                <td>{order.reduson}</td>
                <td className='columnOrderStatus'>{order.status}</td>
              </tr>
            ))}
          </table>
        </div>
        <div id="networkServices">
          <h3>Network Services <img src={servicesLogo} alt="Server icon that represents the network services" /></h3>
          <table>
            {networkServiceData.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.status}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;