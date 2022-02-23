import React, { useEffect, useState } from 'react'
import { common } from '../../Configurations/common'
import { Link } from "react-router-dom";
export default function AddUpdateButton({ userRole, option, isUpdateAction }) {
    const [role, setRole] = useState(userRole);
    isUpdateAction = common.defaultIfEmpty(isUpdateAction, false);
    option.buttonText = common.defaultIfEmpty(option.buttonText, "Action");
    option.handler = common.defaultIfEmpty(option.handler, () => { });
    option.changeButtonTextOnAction = common.defaultIfEmpty(option.changeButtonTextOnAction, true);
    option.buttonColor = common.defaultIfEmpty(option.buttonColor, 'btn-primary');
    option.icon = common.defaultIfEmpty(option.icon, '');
    option.onlyIcon = common.defaultIfEmpty(option.onlyIcon, false);
    option.backButtonLink = common.defaultIfEmpty(option.backButtonLink, '');
    option.resetModel = common.defaultIfEmpty(option.resetModel, '');
    option.modelSetter = common.defaultIfEmpty(option.modelSetter, () => { });
    useEffect(() => {
        setRole({ ...userRole });
    }, [userRole?.canCreate, userRole?.canUpdate])
    if (option.onlyIcon && option.icon !== '') {
        option.changeButtonTextOnAction = false;
        option.buttonText = '';
    }

    const resetPage = () => {
        let modelType = typeof (option.resetModel);
        var data = common.cloneObject(option.resetModel);
        if (modelType === 'object') {
            for (var key in data) {
                var propType=typeof(data[key]);
                if(propType==='string')
                data[key]='';
                if(propType==='number')
                data[key]=0;
                if(propType==='boolean')
                data[key]=false;
                if(propType==='object')
                data[key]={};
                if(propType==='array')
                data[key]=[];
            }
            option.modelSetter(data);
        }
    }
    return (
        <>
            {
                ((role?.canCreate && !isUpdateAction) || (role?.canUpdate && isUpdateAction)) &&
                (
                    <>
                        <button type="button" onClick={e => option.handler(e)}
                            className={`btn ${option.buttonColor}`}>
                            {option.icon !== '' ? <i className={option.icon}></i> : ''}
                            {option.changeButtonTextOnAction ? (!isUpdateAction ? ' Add ' : ' Update ') : ''} {option.buttonText}
                        </button>
                        {
                            common.hasValue(option.resetModel) && option.resetModel !== '' && (
                                <button className='btn btn-warning' onClick={e=>resetPage()} type='button' title='Reset' to={option.backButtonLink}><i className="fas fa-undo"></i></button>
                            )}
                        {
                            common.hasValue(option.backButtonLink) && option.backButtonLink !== "" && (
                                <Link className='btn btn-warning' title='Back' to={option.backButtonLink}><i className="fas fa-arrow-left"></i></Link>
                            )}
                    </>
                )
            }
        </>
    )
}
