import React from 'react'

export default function  App({data,...prop}) {
    return(
        <>
        <div className="kdg-row kdg-column-4 list-2 text-c">
            {
                data && data.map(img =>
                <div className="item">
                    <div className="list-2-item">
                        <div className="image">
                            <img src={img} alt="" />
                        </div>
                    </div>
                </div>
                )
            }
        </div>
        </>
    )
}