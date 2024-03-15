import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'bootstrap'
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import VeeValidate from 'vee-validate';
import zhTWValidate from 'vee-validate/dist/locale/zh_TW.js';

import App from './App.vue'
import router from './router'
import store from './store'
import './bus'
import currencyFilter from './filters/currency';
import Pagination from './views/Pagination';

Vue.use(Vuex)
Vue.use(VueAxios, axios);
Vue.use(VeeValidate);
VeeValidate.Validator.localize('zh_TW', zhTWValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('loading', Loading);
Vue.component('Pagination', Pagination);
Vue.filter('currency', currencyFilter);

library.add(fab, fas, far);

Vue.config.productionTip = false
axios.defaults.withCredentials = true;

new Vue({
  store,
  router,
  render: h => h(App),
  created() {
    const myCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1",
    );
    this.$http.defaults.headers.common.Authorization = myCookie;
  }
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const apiPath = process.env.VUE_APP_API_PATH;
    const api = `${apiPath}/api/user/check`;
    axios.post(api)
      .then((response) => {
        if (response.data.success) {
          next();
        } else {
          alert(response.data.message);
          next({
            path: '/login'
          })
        }
      });
  } else {
    next();
  }
  // ...
})

export { router }