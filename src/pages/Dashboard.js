import React from 'react';
import "./Dashboard.css";
import DoppleHeader from "../components/DoppleHeader";
import printersLogo from '../assets/3dPrinters.png';
import servicesLogo from '../assets/server.png';

// Add your other components here, like 3DPrinters, NetworkServices, etc.

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <DoppleHeader />
      {/* Add your other components here */}
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
            <tr>
              <td>1</td>
              <td>001</td>
              <td className='columnPrinterStatus'>Free</td>
            </tr>
            <tr>
              <td>2</td>
              <td>003</td>
              <td className='columnPrinterStatus'>Busy</td>
            </tr>
            <tr>
              <td>3</td>
              <td>008</td>
              <td className='columnPrinterStatus'>Broken</td>
            </tr>
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
            <tr>
              <td>1</td>
              <td>39</td>
              <td>19</td>
              <td>19</td>
              <td className='columnOrderStatus'>Created</td>
            </tr>
            <tr>
              <td>2</td>
              <td>80</td>
              <td>8</td>
              <td>5</td>
              <td className='columnOrderStatus'>Locked</td>
            </tr>
            <tr>
              <td>3</td>
              <td>76</td>
              <td>6</td>
              <td>15</td>
              <td className='columnOrderStatus'>Confirmed</td>
            </tr>
            <tr>
              <td>4</td>
              <td>89</td>
              <td>10</td>
              <td>25</td>
              <td className='columnOrderStatus'>In Production</td>
            </tr>
            <tr>
              <td>5</td>
              <td>99</td>
              <td>9</td>
              <td>11</td>
              <td className='columnOrderStatus'>Shipped</td>
            </tr>
            <tr>
              <td>6</td>
              <td>26</td>
              <td>7</td>
              <td>16</td>
              <td className='columnOrderStatus'>Completed</td>
            </tr>
          </table>
        </div>
        <div id="networkServices">
          <h3>Network Services <img src={servicesLogo} alt="Server icon that represents the network services" /></h3>
          <table>
            <tr>
              <td>Service1</td>
              <td>Service2</td>
              <td>Service3</td>
              <td>Service4</td>
              <td>Service5</td>
              <td>Service6</td>
              <td>Service7</td>
              <td>Service8</td>
              <td>Service9</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;