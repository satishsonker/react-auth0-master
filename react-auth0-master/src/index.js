import React,{useState,useEffect} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

import * as mqtt from 'react-paho-mqtt';
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
/* const [client, setClient] = useState(null);
const _topic = ["testtopic/1"];
const _options = {};
const _sendPayload = () => {
  const payload = mqtt.parsePayload(_topic[1], "World"); // topic, payload
  client.send(payload);
}

// called when client lost connection
const _onConnectionLost = responseObject => {
  if (responseObject.errorCode !== 0) {
    console.log(responseObject);
  }
}

// called when messages arrived
const _onMessageArrived = message => {
  console.log("onMessageArrived: " + message.payloadString);
}

// called when subscribing topic(s)
const _onSubscribe = () => {
  client.connect({
    onSuccess: () => {
      for (var i = 0; i < _topic.length; i++) {
        client.subscribe(_topic[i], _options);
        console(_topic[i]);
      }
    }
  }); // called when the client connects
}

// called when subscribing topic(s)
const _onUnsubscribe = () => {
  for (var i = 0; i < _topic.length; i++) {
    client.unsubscribe(_topic[i], _options);
  }
}

// called when disconnecting the client
const _onDisconnect = () => {
  client.disconnect();
}
useEffect(() => {
  const c = mqtt.connect("broker.mqttdashboard.com", Number(8000), "clientId-qKzc3Da3eL", _onConnectionLost, _onMessageArrived); // mqtt.connect(host, port, clientId, _onConnectionLost, _onMessageArrived)
  setClient(c);
},[setClient,client]); */
ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}>
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);
