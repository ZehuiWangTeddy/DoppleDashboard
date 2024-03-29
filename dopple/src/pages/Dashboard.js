import React, { useState }  from 'react';
import "./Dashboard.css";
import DoppleHeader from "../components/DoppleHeader";
import printersLogo from '../assets/3dPrinters.png';
import servicesLogo from '../assets/server.png';

const Dashboard = () => {
  const [printerData, setPrinterData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [networkServiceData, setNetworkServiceData] = useState([]);

  return (
    <div className="dashboard-container">
      <DoppleHeader />
      <div className="content">
        <div id="cameraFeeds">
          <h3>Camera View</h3>
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
              <th>Order Number</th>
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