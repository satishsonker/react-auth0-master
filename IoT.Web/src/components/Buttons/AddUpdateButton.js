import React,{useEffect,useState} from 'react'
import { common } from '../../Configurations/common'

export default function AddUpdateButton({ userRole, option,isUpdateAction }) {
    const [role, setRole] = useState(userRole);
    isUpdateAction=common.defaultIfEmpty(isUpdateAction,false);
    option.buttonText = common.defaultIfEmpty(option.buttonText, "Action");
    option.handler = common.defaultIfEmpty(option.handler, () => { });
    option.changeButtonTextOnAction = common.defaultIfEmpty(option.changeButtonTextOnAction, true);
    option.buttonColor = common.defaultIfEmpty(option.buttonColor, 'btn-primary');
    option.icon=common.defaultIfEmpty(option.icon,'');
    option.onlyIcon=common.defaultIfEmpty(option.onlyIcon,false);
    useEffect(() => {
        debugger;
       setRole({...userRole});
    }, [userRole?.canCreate,userRole?.canUpdate])
    if(option.onlyIcon && option.icon!=='')
    {
        option.changeButtonTextOnAction=false;
        option.buttonText='';
    }
    return (
        <>
            {
            ((role?.canCreate && !isUpdateAction) || (role?.canUpdate && isUpdateAction)) &&
                (
                    <button type="button" onClick={e => option.handler(e)} 
                    className={`btn ${option.buttonColor}`}>
                        {option.icon!==''?<i className={option.icon}></i>:''}
                        {option.changeButtonTextOnAction ? (!isUpdateAction ? ' Add ' : ' Update ') : ''} {option.buttonText}
                        </button>
                )
            }
        </>
    )
}
