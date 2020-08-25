import React, { useEffect } from 'react'

export default function  App({data,...prop}) {
    useEffect(()=>{
        var listImgBlock = document.querySelectorAll('.list-2')
        listImgBlock.forEach(el=>{
            var listImg = el.querySelectorAll('.list-2-item')
            var heightest = 0
            setTimeout(() => {
                listImg.forEach(img =>{
                    if(img.offsetHeight > heightest) heightest = img.offsetHeight
                })
                listImg.forEach(img =>{
                    img.style.height = (heightest + 46) + 'px'
                })
            }, 3000);

            
        })

    },[])
    return(
        <>
        <div className="kdg-row kdg-column-4 list-2 text-c">
            {
                data && data.map((img,index) =>
                <div key={index} className="item">
                    <div className="list-2-item">
                        <div className="image">
                            <img src={img.url_img} alt="" />
                        </div>
                    </div>
                </div>
                )
            }
        </div>
        </>
    )
}