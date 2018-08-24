/* eslint no-undef: 'off' */
/**
 * @module VueStorageSync
 * @description A plugin to sync vue data to a storage system
 */

/**
 * @prop pluginDefaultOptions
 * @desc Stores plugin default options
 * @type Object
 */
const pluginDefaultOptions = {
  key: 'vue-data-sync',
  duration: 0,
  storage: 'local',
};

/**
 * @func storageSystems
 * @desc Plugin storage systems supported
 * @type {Array}
 */
const storageSystems = {
  local: {
    set(key, value) {
      return window.localStorage.setItem(key, value);
    },
    get(key) {
      return window.localStorage.getItem(key);
    },
    remove(key) {
      return window.localStorage.removeItem(key);
    },
  },
  session: {
    set(key, value) {
      return window.sessionStorage.setItem(key, value);
    },
    get(key) {
      return window.sessionStorage.getItem(key);
    },
    remove(key) {
      return window.sessionStorage.removeItem(key);
    },
  },
};

/**
 * @func getOptions
 * @desc get current options
 * @return Object
 */
const getOptions = function (options) {
  // Plugin instance default options
  const defaultOptions = Object.assign(
    {},
    VueStorageSync.pluginDefaultOptions,
    VueStorageSync.userDefaultOptions,
  );

  // For array like settings
  if (Array.isArray(options)) {
    defaultOptions.entries = options;
    return [defaultOptions];
  }

  // Check multiple storage systems
  const isMultipleStorage = Object.keys(options).some(key => Object.keys(storageSystems).includes(key));

  if (isMultipleStorage) {
    // eslint-disable-next-line array-callback-return, consistent-return
    return Object.keys(storageSystems).map((system) => {
      if (options[system] != null) {
        return Object.assign({}, defaultOptions, options[system], { storage: system });
      }
    });
  }

  // Single storage system
  return [Object.assign({}, defaultOptions, options)];
};

/**
 * @func isExpired
 * @desc Check if a time is minor tha now
 * @return Boolean
 */
const isExpired = (time) => {
  time = Number.parseInt(time, 10);
  if (time === 0) return false;
  return time < new Date().getTime() / 1000;
};

/**
 * @func getData
 * @desc Retrieves a data object
 * @return Object|null
 */
const getData = function (options) {
  const store = storageSystems[options.storage];
  const storedObject = JSON.parse(store.get(options.key));

  if (!storedObject) return {};
  if (isExpired(storedObject.expires)) {
    store.remove(options.key);
    return {};
  }
  return storedObject.data;
};

/**
 * @func getData
 * @desc Retrieves a data object
 * @return Object|null
 */
const setData = function (prop, value, options) {
  const store = storageSystems[options.storage];
  const data = getData(options);
  data[prop] = value;
  const expires = options.duration > 0 ? options.duration + new Date().getTime() / 1000 : 0;
  const newData = { data, expires };
  return store.set(options.key, JSON.stringify(newData));
};

/**
 * @func storageSync
 * @desc main sync function
 */
const storageSync = function (options) {
  // Get current options
  options = getOptions(options);
  // Each storage
  options.forEach((option) => {
    const storedData = getData(option);
    if (storedData) {
      Object.keys(storedData).forEach((item) => {
        this[item] = storedData[item];
      });
    }
    // Register watchers
    option.entries.forEach((prop) => {
      this.$watch(
        prop,
        // eslint-disable-next-line prefer-arrow-callback
        function (value) {
          setData(prop, value, option);
        },
        {
          deep: true,
        },
      );
    });
  });
};

/**
 * @func onBeforeCreate
 * @desc Mixin function for beforeCreate hook
 */
const onBeforeCreate = function () {
  this.$storageSync = storageSync;
};

/**
 * @func onMounted
 * @desc Mixin function for beforeCreate hook
 */
const onMounted = function () {
  const { storage } = this.$options;
  if (storage) this.$storageSync(storage);
};

/**
 * @func install
 * @desc Install the plugin
 * @param {Vue} Vue the vuejs object
 * @param {Object} userDefaultOptions Options object
 */
const install = function (Vue, userDefaultOptions = {}) {
  // Get default options
  this.pluginDefaultOptions = pluginDefaultOptions;
  this.userDefaultOptions = userDefaultOptions;
  // Set the mixin
  Vue.mixin({
    beforeCreate: onBeforeCreate,
    mounted: onMounted,
  });
};

/**
 * @exports VueStorageSync
 * @type {Object}
 * @desc Object module
 */
export default {
  install,
};
