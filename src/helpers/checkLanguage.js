export default function checkLang(text, language){
    if(text){
        const {text_en, text_vi} = text
        if(language === 'en') return text_en
        if(language === 'vi') return text_vi
    }
}