import React from 'react'
import { common } from "../../Configurations/common";
import GaugeChart from 'react-gauge-chart'

export default function SoundSensor({ deviceData, index }) {
    return (
        <ol style={{fontSize:'10px',padding:'5px',listStyle:'none'}}>
            <li>
                <div className="row row-cols-2">
                    <div className="col">
                        <GaugeChart id={"gauge-chart" + index}
                            nrOfLevels={20}
                            arcsLength={[0.33, 0.22, 0.45]}
                            colors={['#5BE12C', '#F5CD19', '#EA4228']}
                            percent={common.defaultIfEmpty(deviceData.sound, 1)/common.defaultIfEmpty(deviceData.soundMax, 1024)}
                            arcPadding={0.00} style={{ height: '70%' }} />
                    </div>
                    <div className="col">
                        <ol className="device-desc">
                            <li key={index + "1"} title="Device ID"><i className="fas fa-server"></i><div className="text-ecllips">{deviceData?.deviceKey}</div> <i onClick={e => common.copyToClipboard(deviceData?.deviceKey)} title="Copy device Id" className="fas fa-copy id-copy"></i></li>
                            <li key={index + "2"} title="SSID"><i className="fas fa-wifi"></i><span>{!common.hasValue(deviceData?.wifi) ? 'No Connected' : deviceData.wifi}</span></li>
                            <li key={index + "3"} title="IP Address"><i className="fas fa-network-wired"></i><span>{!common.hasValue(deviceData?.ip) ? 'No Connected' : deviceData.ip}</span></li>
                            <li key={index + "4"} title="Power" className={deviceData?.status?.toLowerCase() === 'on' ? 'text-success' : 'text-danger'}><i className={deviceData?.status?.toLowerCase() === 'on' ? 'text-success fas fa-power-off' : 'text-danger fas fa-power-off'}></i><span>{!common.hasValue(deviceData?.status) ? 'No Connected' : deviceData.status === "OFF" ? "OFF" : "ON"}</span></li>
                            <li key={index + "6"} title="Device Type"><i className="fas fa-history"></i><span>{!common.hasValue(deviceData?.lastConnected) ? 'No Connected' : deviceData.lastConnected}</span></li>

                        </ol>
                    </div>
                    <div className="col-12">
                        <div className="row row-cols-3">
                        <div className="col p-0">
                                <span>Threshold dB</span>
                                <span>{common.defaultIfEmpty(deviceData.soundThreshold, 400)}</span>
                            </div>
                            <div className="col p-0">
                                <span>Current dB</span>
                                <span>{common.defaultIfEmpty(deviceData.sound, 0)}</span>
                            </div>
                            <div className="col p-0">
                                <span>Max dB</span>
                                <span>{common.defaultIfEmpty(deviceData.soundMax, 1024)}</span>
                            </div>
                            <div className="col p-0">
                                <span>Percent %</span>
                                <span>{((common.defaultIfEmpty(deviceData.sound, 0)/common.defaultIfEmpty(deviceData.soundMax, 1024))*100).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ol>
    )
}
