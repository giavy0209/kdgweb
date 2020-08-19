import React from 'react'

export default function App({title}){
    return(
        <>
        <div className='tab-title'>
            <div className="kdg-row">
                <div className="kdg-col-12 va-m">
                    <div className="des" dangerouslySetInnerHTML={{__html: '<div> 123</div>'}}>

                    </div>
                </div>
            </div>
        </div>


        </>
    )
}