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
    Account,
    LuckySpin,
    Staking,
    StakingHistory,
    StakingEvent,
    Wallet,
    News,
    HomeWallet
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
    }else if(type === 7){
        return {component: Account, haveContainer : true}
    }else if(type === 8){
        return {component: Ecosystem, haveContainer : true}
    }else if(type === 9){
        return {component: HightlightTitle, haveContainer : true}
    }else if(type === 10){
        return {component: Tab, haveContainer : true}
    }else if(type === 11){
        return {component: Footer, haveContainer : false}
    }else if(type === 12){
        return {component: LuckySpin, haveContainer : false}
    }else if(type === 13){
        return {component: Staking, haveContainer : false}
    }else if(type === 14){
        return {component: StakingHistory, haveContainer : false}
    }else if(type === 15){
        return {component: StakingEvent, haveContainer : false}
    }else if(type === 16){
        return {component: Wallet, haveContainer : false}
    }else if(type === 17){
        return {component: News, haveContainer : true}
    }else if(type === 18){
        return {component: HomeWallet, haveContainer : true}
    }
}