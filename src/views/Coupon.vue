<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="d-flex justify-content-end my-3">
            <button class="btn btn-primary" @click="openModal(true)">建立新的優惠券</button>
        </div>
        <table class="table">
            <thead>
                <th>優惠券名稱</th>
                <th>優惠代碼</th>
                <th>有效日期</th>
                <th>折扣數</th>
                <th>是否啟用</th>
                <th>編輯</th>
            </thead>
            <tbody>
                <tr v-for="item in coupons" :key="item.id">
                    <td>{{ item.title }}</td>
                    <td>{{ item.code }}</td>
                    <td>{{ item.due_date | dateToString }}</td>
                    <td width="80" class="text-right">{{ item.percent | percentage }}</td>
                    <td width="120" v-if="item.is_enabled" class="text-success">啟用</td>
                    <td width="120" v-else>未啟用</td>
                    <td width="140">
                        <div class="btn-group">
                            <button class="btn btn-outline-primary" @click="openModal(false, item)">編輯</button>
                            <button class="btn btn-outline-danger" @click="openDeleteModal(item)">刪除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <Pagination :pagination="pagination" />
        <!-- Modal -->
        <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>{{ updateTitle }}</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="title">標題</label>
                            <input type="text" class="form-control" id="title" placeholder="請輸入標題"
                                v-model="tempCoupon.title">
                        </div>
                        <div class="form-group">
                            <label for="code">優惠代碼</label>
                            <input type="text" class="form-control" id="code" placeholder="請輸入優惠代碼"
                                v-model="tempCoupon.code">
                        </div>

                        <div class="form-group">
                            <label for="origin_price">折扣數</label>
                            <input type="number" class="form-control" id="origin_price" placeholder="請輸入折扣"
                                v-model="tempCoupon.percent" max="100" min="0">
                        </div>
                        <div class="form-group">
                            <label for="due_date">有效日期</label>
                            <input type="date" class="form-control" id="due_date" v-model="dateString">
                        </div>
                        <div class="form-group">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="is_enabled"
                                    v-model="tempCoupon.is_enabled" :true-value="1" :false-value="0">
                                <label class="form-check-label" for="is_enabled">
                                    是否啟用
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>刪除優惠券</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠券(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger" @click="deleteCoupon(tempCoupon.id)">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';

export default {
    name: 'Coupon',
    data() {
        return {
            coupons: [],
            pageClick: {},
            tempCoupon: {
                'due_date': Date.now(),
                'id': '',
                'is_enabled': 0,
                'percent': 100,
                'title': '',
                'code': ''
            },
            updateTitle: '',
            isNew: true,
            pagination: {}
        }
    },
    computed: {
        dateString: {
            get() {
                return new Date(this.tempCoupon.due_date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }).replaceAll('/', '-');
            },
            set(newValue) {
                this.tempCoupon.due_date = new Date(newValue);
            }
        },
        isLoading() {
            return this.$store.state.isLoading;
        }
    },
    filters: {
        dateToString(date) {
            return new Date(date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).replaceAll('/', '-');
        },
        percentage(number) {
            return number + ' %';
        }
    },
    methods: {
        getCoupons(page = 1) {
            const vm = this;
            vm.$store.dispatch('updateLoading', true);
            const apiPath = process.env.VUE_APP_API_PATH;
            const apiCustom = process.env.VUE_APP_API_CUSTOM;
            // console.log(apiPath, apiCustom);
            vm.$http.get(`${apiPath}/api/${apiCustom}/admin/coupons?page=${page}`)
                .then((response) => {
                    vm.coupons = response.data.coupons;
                    vm.pagination = response.data.pagination;
                    vm.$store.dispatch('updateLoading', false);
                });
        },
        updateCoupon() {
            const vm = this;
            const apiPath = process.env.VUE_APP_API_PATH;
            const apiCustom = process.env.VUE_APP_API_CUSTOM;
            let api = `${apiPath}/api/${apiCustom}/admin/coupon`;
            let httpMethod = 'post';
            if (!vm.isNew) {
                api = `${apiPath}/api/${apiCustom}/admin/coupon/${vm.tempCoupon.id}`;
                httpMethod = 'put';
            }
            vm.$http[httpMethod](api, { data: vm.tempCoupon })
                .then((response) => {
                    if (response.data.success) {
                        $('#couponModal').modal('hide');
                        alert(response.data.message);
                        vm.getCoupons();
                    } else {
                        $('#couponModal').modal('hide');
                        vm.$bus.$emit('message:push', response.data.message, 'danger');
                        vm.getCoupons();
                    }
                });
        },
        deleteCoupon(id) {
            const vm = this;
            const apiPath = process.env.VUE_APP_API_PATH;
            const apiCustom = process.env.VUE_APP_API_CUSTOM;
            let api = `${apiPath}/api/${apiCustom}/admin/coupon/${id}`;
            let httpMethod = 'delete';
            vm.$http[httpMethod](api)
                .then((response) => {
                    if (response.data.success) {
                        $('#delCouponModal').modal('hide');
                        vm.getCoupons();
                        alert(response.data.message);
                    } else {
                        $('#delCouponModal').modal('hide');
                        vm.getCoupons();
                        vm.$bus.$emit('message:push', response.data.message, 'danger');
                    }
                });
        },
        openModal(isNew, item) {
            if (isNew) {
                this.tempCoupon = {};
                this.isNew = true;
                this.updateTitle = '新增優惠券'
            } else {
                this.tempCoupon = Object.assign({}, item);
                this.isNew = false;
                this.updateTitle = `編輯：${this.tempCoupon.title}`
            }
            $('#couponModal').modal('show');
        },
        openDeleteModal(item) {
            this.tempCoupon = { ...item };
            $('#delCouponModal').modal('show');
        },
    },
    created() {
        this.getCoupons();
    }
}
</script>