/**
 * @module keeper
 * @description A vue plugin to keep component's data alive in memory
 */

/**
 * @func initKeepStore
 * @desc Initializes an object at global scope to store data
 */
const initKeepStore = () => {
  if (window.keepStore == null) {
    const keepStore = {};
    window.keepStore = keepStore;
  }
};

/**
 * @func getPath
 * @desc Build a path base on components hierarchy
 * @return string
 */
const getPath = function getPath(component, tags = []) {
  if (component.$parent == null) {
    tags = tags.reverse();
    tags = tags.join('.');
    return tags;
  }

  const currentPath = _.get(component, '$vnode.tag', 'app').replace(/[^0-9]/gi, '');

  tags.push(`__${currentPath}`);
  return getPath(component.$parent, tags);
};

/**
 * @func sync
 * @desc Sync component's data to keepAlive global object
 */
const sync = function sync() {
  initKeepStore();
  const store = window.keepStore;
  const path = getPath(this);
  const { keepAlive } = this.$options;

  if (!Array.isArray(keepAlive)) return;

  keepAlive.forEach((key) => {
    const storePath = `${path}.${key}`;
    const alreadyExists = _.has(store, storePath);
    if (alreadyExists && Object.keys(this.$data).includes(key)) this[key] = _.get(store, storePath);
    if (!alreadyExists && Object.keys(this.$data).includes(key)) _.set(store, storePath, this[key]);
  });
};

// Install the plugin
Vue.use({
  install(vue) {
    vue.prototype.$sync = sync;
  },
});
