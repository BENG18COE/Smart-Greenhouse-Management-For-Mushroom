/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Switch from '@material-ui/core/Switch'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const Switches = ({ switches }) => {
    const [state, setState] = useState({
        fan: '0',
        window: '0',
        irrigation: '0'
    });

    const onUpdateState = (field, value) => {
        const currentState = { ...state };
        currentState[field] = value;
        setState(currentState);
        fetch('/api/updatecontrols' + `?fan=${currentState.fan}&window=${currentState.window}&irrigation=${currentState.irrigation}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
            }).catch((e) => {
                console.log(e.message);
            });
    }

    useEffect(() => {
        if (switches) {
            setState(switches);
        }
    }, [switches]);

    return (
        <FormGroup row >
            <FormControlLabel control={<Switch checked={parseInt(state.fan) !== 0} onChange={(e) => onUpdateState('fan', e.target.checked ? '1' : '0')} />} label="Fan" />
            <FormControlLabel control={<Switch checked={parseInt(state.window) !== 0} onChange={(e) => onUpdateState('window', e.target.checked ? '1' : '0')} />} label="Window" />
            <FormControlLabel control={<Switch checked={parseInt(state.irrigation) !== 0} onChange={(e) => onUpdateState('irrigation', e.target.checked ? '1' : '0')} />} label="Irrigation" />
        </FormGroup>
    )
}

export default Switches
