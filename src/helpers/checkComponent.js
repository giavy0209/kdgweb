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
        return {component: Header, haveContainer : false}
    }else if(type === 2){
        return {component: TitleOpacity, haveContainer : true}
    }else if(type === 3){
        return {component: List, haveContainer : true}
    }else if(type === 4){
        return {component: Description, haveContainer : true}
    }else if(type === 5){
        return {component: MainChart, haveContainer : true}
    }else if(type === 6){
        return {component: ListImage, haveContainer : true}
    }else if(type === 8){
        return {component: Ecosystem, haveContainer : true}
    }else if(type === 9){
        return {component: HightlightTitle, haveContainer : true}
    }else if(type === 10){
        return {component: Tab, haveContainer : true}
    }else if(type === 11){
        return {component: Footer, haveContainer : false}
    }
}