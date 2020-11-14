import '../../assets/css/form-gamehub.scss';
import React from 'react';
import ReactDOM from 'react-dom';

import { useHistory } from 'react-router-dom';

const FormGameHub = () => {
    const history = useHistory();

    return ReactDOM.createPortal(
        <div className="form-gamehub" onClick={() => history.push('/gamehub-landing')}>
            <div className="form" onClick={e => e.stopPropagation()}>
                This is a Form of Game Hub
            </div>
        </div>,
        document.getElementById("form-gamehub")
    );
}

export default FormGameHub;