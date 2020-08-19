export default function filterStatus (status){
    if(status === 0){
        return `Đang chờ xác nhận`
    }else if(status === 1){
        return `Đã xác nhận, chờ giao hàng`
    }else if(status === 2 ){
        return `Đã giao hàng cho đơn vị vận chuyển`
    }else if(status === 3){
        return `Hàng đã được nhận. Cảm ơn quý khách`
    }else if(status === 4){
        return `Sản phẩm không đủ hàng`
    }else if(status === 5){
        return `Khách hủy hàng`
    }else if(status === 6){
        return `Yêu cầu trả hàng`
    }
}