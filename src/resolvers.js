// @flow

const _ = require('./utils');

/**
 * @param {array} list - The array to sort
 * @param {string} prop - The key from object
 * @returns {array} Returns array ordered according to the prop
 */
function orderBy(list: Array<Object> = [], prop: string) : Array<Object> {
  return list.sort((a, b) => parseFloat(a[prop]) - parseFloat(b[prop]));
};

/**
 * @param {string} argName - The key from object
 * @param {string} customResolvers - Object of resolvers
 * @param {array} data - The array to filter
 * @param {string} value - The value to use for filter
 * @returns {*} Returns data filtered according to the prop
 */
const filterKey = (argName: string, customResolvers: Object) => {
  return (data: Array<Object>, value: any): Array<Object>=> {
    const fnCustomResolver = _.prop(argName, customResolvers);
    if(fnCustomResolver) {
      return fnCustomResolver(data, value);
    }

    if(!Array.isArray(data)) {
      throw new Error(`Resolver "${argName}" does not exist.`)
    }

    return data.filter(item => _.prop(argName, item) == value);
  };
}

/**
 * @param {Array} list - The array to query.
 * @returns {*} Returns the first element of `list`.
 */
const first = (list: Array<any> = []) => _.prop(0, list);

/**
 * @param {Array} list - The array to query.
 * @returns {*} Returns the last element of `list`.
 */
const last = (list: Array<any> = []) => _.last(list);

/**
 * @param {*} value - The value from data.
 * @param {string} prop - Default value to when `value` is undefined.
 * @returns {*} Returns `prop` when `value` is undefined if not it returns prop.
 */
const defaultValue = (value: any, prop: string) => {
  const number = Number(prop);
  const valueChanged = number ? number : prop;
  return _.isNil(value) ? valueChanged : value;
};

/**
 * @param {*} value - A value to parse.
 * @returns {*} Returns a new value parsed to number.
 */
const toNumber = (value: string) => {
  return Number(value) || value;
};

/**
 * @param {*} value - A value to parse.
 * @returns {array} Returns object parsed to array.
 */
const toArray = _.pipe(
  _.toPairs,
  _.map(_.pipe(_.of, _.fromPairs))
);

/**
 * @param {*} value - A value to parse.
 * @returns {array} Returns only values from object.
 */
const getObjectValues = _.ifElse(
  _.is(Object),
  Object.values,
  _.identity
);

/**
 * @param {*} value - A value to parse.
 * @param {*} right - A condition.
 * @returns {*} Returns value if condition is true.
 */
const condIf = (value: any, right: string) => {
  try {
    const cond = JSON.parse(right);
    return cond ? value : null ;
  } catch(e) {
    throw new Error('Resolver \'if\' needs to receive a boolean type.');
  }
};

/**
 * @param {*} value - A value to parse.
 * @param {*} right - A condition.
 * @returns {*} Returns value if condition is true.
 */
const merge = (value: any, right: string) => {
  if(Array.isArray(value) && Array.isArray(right)) {
    return [...value, ...right];
  }

  if(_.is(Object, value) && _.is(Object, right)) {
    return { ...value, ...right };
  }

  return value;
};

module.exports = {
  filterKey,
  orderBy,
  first,
  last,
  toNumber,
  defaultValue,
  toArray,
  getObjectValues,
  merge,
  if: condIf
};
