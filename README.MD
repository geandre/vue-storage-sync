# VueStorageSync

> A plugin to sync vue data to a storage system

<img src="https://badgen.net/badge/NPM/1.1.0/blue"/>&nbsp;
<img src="https://badgen.net/badge/License/ISC/green"/>&nbsp;
<img src="https://badgen.net/badge/Style%20Guide/Airbnb/grey"/>&nbsp;
<img src="https://badgen.net/badge/Language/JS/orange"/>&nbsp;

---

## What is it for?

VueStorageSync provides capability to Vue.js components to persist it's data to client storage
(for now localStorage and sessionStorage).  
It also provides possibility to use specific options component by component besides plugin
registration options.  
When called by a component the plugin will automatically store the specified properties to a
selected storage system and mantain it updated. With this your component will behave as a keep-alive.

## Installing

```bach
npm install --save vue-storage-sync
```

## Using

main.js

```js
import VueStorageSync from "vue-storage-sync";

// Vue.use(VueStorageSync [, options={}]);
Vue.use(VueStorageSync);
```

### Options

VueStorageSync accept an options object, this object can have the following properties:

- `key` Of type string that will be used as the default store key name if omitted 'vue-data-sync' will
  be assumed.
- `duration` An integer number of seconds that the storage must self keep. if omitted 0 will be
  assumed, this means to never expire.
- `storage` A string indicating what type of storage will be used, for now 'local' and 'session' are
  available, if omitted 'local' will be assumed.
- `suffix` A string to be appended to key, this is changeable at runtime by setting `VueStorageSync.userDefaultOptions.suffix`.

```js
const options = {
  key: "vue-data-sync",
  duration: 0,
  storage: "local",
  suffix: ""
};
```

### On component

Using preseted options

```js
export default {
  data() {
    return {
      name: "Jhon Doe",
      birth: "1990-06-03"
    };
  },
  storage: ["name", "birth"]
};
```

Using a single storage system and customizing options on component

```js
export default {
  data() {
    return {
      name: "Jhon Doe",
      birth: "1990-06-03"
    };
  },
  storage: {
    key: "my-key",
    storage: "local",
    duration: 0, // forever
    suffix: "user:6",
    entries: ["name", "birth"]
  }
};
```

Using multiple storage system and customizing options on component

```js
export default {
  data() {
    return {
      name: "Jhon Doe",
      birth: "1990-06-03",
      chatOn: true
    };
  },
  storage: {
    local: {
      key: "my-key",
      duration: 0, // forever
      suffix: "user:6",
      entries: ["name", "birth"]
    },
    session: {
      key: "my-key",
      duration: 0, // forever, while the session is alive
      suffix: "user:6",
      entries: ["chatOn"]
    }
  }
};
```

The `storage` object can be directlly passed to `vm.$storageSync` function

```js
export default {
  data() {
    return {
      name: "Jhon Doe",
      birth: "1990-06-03"
    };
  },
  mounted() {
    // Like this
    this.$storageSync(["name", "birth"]);
    // OR this.$storageSync({...});
};
```
