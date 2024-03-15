import Vue from 'vue';

Vue.prototype.$bus = new Vue();

// 自定義名稱 'pageClick'
// page: 傳入頁碼參數，預設值為 1

// 自定義名稱 'message:push'
// message: 傳入參數
// status: 樣式，預設值為 warning