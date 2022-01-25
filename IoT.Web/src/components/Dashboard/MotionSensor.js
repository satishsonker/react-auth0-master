import React from 'react'
import { common } from '../../Configurations/common'

export default function MotionSensor({ deviceData, index }) {
    return (
        <ol className="device-desc">
            <li>
                <div className="row row-cols-2">
                    <div className="col">
                        <p className="fs-6 text-center mb-0">{common.defaultIfEmpty(deviceData.motion, 0)===1?"Detected":"Not Detected"}</p>
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
                </div>
            </li>
        </ol>

    )
}
