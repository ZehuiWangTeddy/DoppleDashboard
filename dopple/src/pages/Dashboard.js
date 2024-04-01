import React, { useEffect, useState } from 'react';
import "./Dashboard.css";
import DoppleHeader from "../components/DoppleHeader";
import printersLogo from '../assets/3dPrinters.png';
import servicesLogo from '../assets/server.png';
import mqtt from 'mqtt';

const Dashboard = () => {
  const [printerData, setPrinterData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [networkServiceData, setNetworkServiceData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  
  const completed = 'completed';
  const confirmed = 'confirmed';
  const created = 'created';
  const inProduction = 'in_production';
  const locked = 'locked';
  const shipped = 'shipped';
  const statusData = [created, locked, confirmed, inProduction, shipped, completed];

  useEffect(() => {
    const MQTT_URI = "ws://localhost:8000/mqtt"
    try {
      var client = mqtt.connect(MQTT_URI, {
        resubscribe: true,
        clientId: "dopple-dashboard-client",
        clean: true
      });

      client.subscribe('tailor/#', function (err) {
        if (!err) {
          console.log("MQTT_SUBSCRIBED")
        }
      });

      client.on('error', (error) => {
        console.log("MQTT_ERROR", error)
        // client.reconnect();
      })

      client.on('message', function (topic, message) {
        // split topic 
        let topicParts = topic.split('/');
        let type = topicParts[1];
        var orderDatas = JSON.parse(message.toString());

        console.log(type, orderDatas);
        if (type === 'ORDER-PORTAL') {
          let companies = [];
          let cleanData = {};
          Object.keys(orderDatas.values).forEach((key) => {
            let splitKey = key.split('_');
            let company = splitKey[2];
            // let status = splitKey[3];
            let status = key.replace('total_orders_', '').replace(company + '_', '');

            if (!companies.includes(company)) {
              companies.push(company);
            }

            cleanData[company] = {
              ...cleanData[company],
              [status]: orderDatas.values[key]
            }
          });

          console.log(cleanData)
          setCompanyData(companies);
          setOrderData(cleanData);
        }

        if (type === 'STATUS-REPORTER') {
          let services = Object.keys(orderDatas.values).map((key) => {
            let name = key.replace('_status', '');
            name = name.split('_').map((word) => {
              return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(' ');
            return (
              <div key={key} className={`networkItem ${serviceStatusLabel(orderDatas.values[key])}`} > {name} {orderDatas.values[key]}</div>
            )
          });
          // services = orderDatas.values;
          console.log(services);
          setNetworkServiceData(services);
        }
      }
      );
    } catch (error) {
      console.log(error)
    }
  }, []);

  const toHump = (name) => {
    return name.replace(/_(\w)/g, function (all, letter) {
      return letter.toUpperCase();
    });
  }

  const serviceStatusLabel = (status) => {
    switch (status) {
      case 'ONLINE':
        return 'online';
      case 'OFFLINE':
        return 'offline';
      case 'WARNING':
        return 'warning';
      default:
        return 'unknown';
    }
  }

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
              <th>#</th>
              {companyData.map((company) => (
                <th key={company}>{company}</th>
              ))}
              <th>Status</th>
            </tr>
            {statusData.map((key, index) => (
              <tr key={index} className='statusLast'>
                <td>{index+1}</td>
                {companyData.map((company) => (
                  <td className='numberfield' key={company}>{orderData[company][key] || 0}</td>
                ))}
                <td><div className='columnOrderStatus'>{toHump(key)}</div></td>
              </tr>
            ))}
          </table>
        </div>
        <div id="networkServices">
          <h3>Network Services <img src={servicesLogo} alt="Server icon that represents the network services" /></h3>
          <div className='networkFlow'>
            { networkServiceData }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;