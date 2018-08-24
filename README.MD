# VueStorageSync

> A plugin to sync vue data to a storage system

<img src="https://badgen.net/badge/npm/1.0.0/blue"/>&nbsp;
<img src="https://badgen.net/badge/license/ISC/green"/>&nbsp;

---

## Installing

```bach
npm install --save vue-storage-sync
```

## Using

main.js

```js
import VueStorageSync from "vue-storage-sync";

Vue.use(VueStorageSync);
```

### Options

At instace set time i.e `Vue.use()` is possible to provide an options object, this object
can have the following properties

- `key` Of type string that will be used as the default store key name if omitted 'vue-data-sync' will
  be assumed.
- `duration` An integer number of seconds that the storage must self keep. if omitted 0 will be
  assumed, this means to never expire.
- `storage` A string indicating what type of storage will be used, for now 'local' and 'session' are
  available, if omitted 'local' will be assumed.

```js
const options = {
  key: "vue-data-sync",
  duration: 0,
  storage: "local"
};
```

### On component

```js
export default {
  name: "MyComponent",
  data() {
    return {
      name: "Jhon Doe",
      birth: "1990-06-03"
    };
  },
  // Option 1: Array of entries
  storage: ["name", "birth"],
  // Option 2: Object with options and an additional entries list
  storage: {
    key: "my-component-storage-key",
    storage: "session",
    duration: 72000, // 20 minutes
    entries: ["name", "birth"]
  }
};
```

## Contributing

1. Fork the project.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -a -m 'Add feature'`
4. Push the branch: `git push origin feature-name`
5. Make a pull request
