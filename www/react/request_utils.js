import request from 'request';
import promisify from 'es6-promisify';

class RequestUtils {
  static getAllSavedData () {
    let payload = {type: 'all'};
    return promisify(request.post)(window.location.origin + '/data', {form: payload}).then((httpResponse) => {
      return JSON.parse(httpResponse.body);
    });
  };

  static getSavedDataForUrl (url) {
    let payload = {type: 'one', url};
    return promisify(request.post)(window.location.origin + '/data', {form: payload}).then((httpResponse) => {
      return JSON.parse(httpResponse.body);
    });
  };

  static saveToDataBase (type, data) {
    let payload = {type, ...data};
    return promisify(request.post)(window.location.origin + '/link', {form: payload}).then((httpResponse) => {
      return JSON.parse(httpResponse.body);
    });
  };
};

export default RequestUtils;