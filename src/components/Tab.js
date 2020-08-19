import React from 'react'


import img from '../assets/img/img-token.png'

export default function App({}){
    return(
        <>
        <div className='tab-title'>
            <div className="kdg-row">
                <div className="kdg-col-6 va-t">
                    <div className="group-tab">
                        <div className="tab active">Chức Năng</div>
                        <div className="tab">sứ mệnh</div>
                    </div>
                    <div className="des" dangerouslySetInnerHTML={{__html: '<div> 123</div>'}}>

                    </div>
                </div>
                <div className="kdg-col-6 va-t">
                    <img alt="" src={img} />
                </div>
            </div>
        </div>


        </>
    )
}