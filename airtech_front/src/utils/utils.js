import swal from 'sweetalert';

class Utils {
    
    static alertAirtech = (text, type, title) => {
        swal({
            title: title,
            text: text,
            icon: type,
            button: "Ok",
        });
    }

    static validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    
    static isEmpty = (obj) => {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    static getBaseUrl = () => {
        var getUrl = window.location;
        let baseUrl = getUrl .protocol + "//" + getUrl.host + "/";

        return baseUrl;
    }

}

export default Utils;
