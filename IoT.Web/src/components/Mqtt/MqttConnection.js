import React, { useEffect, useState } from 'react'
import mqtt from 'mqtt';
import { common } from '../../Configurations/common';
export default function MqttConnection({ connectionOptions, connectionStatus, mqttClient, setPayload, mqttSubscribeTopic,pubMsg }) {
  const [client, setClient] = useState(null);
  const [clientStatus, setClientStatus] = useState(common.getDefault(common.dataType.string));
  useEffect(() => {
    let option = {
      host: common.defaultIfEmpty(connectionOptions?.host, process.env.REACT_APP_MQTT_BROKER_SERVER),
      port: common.defaultIfEmpty(connectionOptions?.port, process.env.REACT_APP_MQTT_BROKER_PORT),
      clientId: common.defaultIfEmpty(connectionOptions?.clientId, common.generateClientId()),
      username: common.defaultIfEmpty(connectionOptions?.username, undefined),
      password: common.defaultIfEmpty(connectionOptions?.password, undefined)
    }
    const url = `ws://${option.host}:${option.port}/mqtt`;
    const options = {
      keepalive: 30,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
      },
      rejectUnauthorized: false
    };
    options.clientId = option.clientId;
    options.username = option.username;
    options.password = option.password;
    let clientresult = mqtt.connect(url, options);
    var msg = `Connecting ${option.host}...`;
    console.log(msg);
    setClientStatus(msg);
    connectionStatus(msg);
    setClient(clientresult);
    mqttClient(clientresult);
  }, []);
  useEffect(() => {
    if (client && mqttSubscribeTopic && mqttSubscribeTopic?.length > 0) {
      mqttSubscribeTopic.map(ele => {
        client.subscribe(ele, 0, (error) => {
          if (error) {
            setStatus('Subscribe to topics error');
            return
          }
          setStatus('Subscribe Topic ' + ele)
        });
      });
    }
  }, [mqttSubscribeTopic]);
  useEffect(() => {
    if(pubMsg && mqttSubscribeTopic.length>0)
    {
      debugger;
      let pubData=typeof pubMsg==="string"?pubMsg:JSON.stringify(pubMsg);
      client.publish(mqttSubscribeTopic[0].replace('/server',''),pubData,1, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  }, [pubMsg])
  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setStatus('new MQTT connected');
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        setStatus('Connection error: ');
        client.end();
      });
      client.on('reconnect', () => {
        setStatus('Reconnecting new MQTT connected');
      });
      client.on('message', (topic, message) => {
        setStatus(' message received from new MQTT connected')
        const payload = { topic, message: message.toString() };
        console.log(payload);
        setPayload(payload);
      });
    }
  }, [client]);
  const setStatus = (msg) => {
    console.log(msg);
    setClientStatus(msg);
    connectionStatus(msg);
  }
  return (
    <div>

    </div>
  )

}
