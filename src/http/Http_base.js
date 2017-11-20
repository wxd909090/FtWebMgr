import env from '../env.js'

var baseUrl = env.apiUrl;
export default {
    baseUrl: baseUrl,
    authHttp: {
        post: function(url, data) {
            return $.ajax({
                type: 'POST',
                url: baseUrl + url,
                data: data
            })
        }
    }
}