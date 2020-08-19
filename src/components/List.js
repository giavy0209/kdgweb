import React from 'react';

export default function App({data,...prop}){
    return (
        <>
            <div {...prop} className="kdg-row kdg-column-3 function-list text-c">
                {
                    data && data.map(o=>
                    <div className="item">
                        <div className="list">
                            <div className="block-img">
                                <img alt="" src={o.img} />
                            </div>
                            <div dangerouslySetInnerHTML={{__html: o.title}} className="title"></div>
                            <div className="des" dangerouslySetInnerHTML={{__html: o.des}}></div>
                        </div>
                    </div>
                    )
                }
            </div>
        </>
    )
}