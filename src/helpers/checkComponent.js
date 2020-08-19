import {
    Header,
    TitleOpacity,
    List,
    Description,
    MainChart,
    ListImage,
    Ecosystem,
    HightlightTitle,
    Tab,
    Footer,
} from '../components'

export default function checkComponents(type){
    if(type === 1){
        return Header
    }else if(type === 2){
        return TitleOpacity
    }else if(type === 3){
        return List
    }else if(type === 4){
        return Description
    }else if(type === 5){
        return MainChart
    }else if(type === 6){
        return ListImage
    }else if(type === 8){
        return Ecosystem
    }else if(type === 9){
        return HightlightTitle
    }else if(type === 10){
        return Tab
    }else if(type === 11){
        return Footer
    }
}