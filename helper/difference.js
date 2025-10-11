import transform from 'lodash/transform'
import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'
import isEmpty from 'lodash/isEmpty'
export const differenceObject = (object, base) => {
  const changes = (object, base) => {
    return transform(object, function (result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  const data = changes(object, base)
  return !isEmpty(data) ? data : null;
}
