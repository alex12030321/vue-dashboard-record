<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <table class="table my-5">
            <thead>
                <th>購買時間</th>
                <th>Email</th>
                <th>購買款項</th>
                <th>應付金額</th>
                <th>是否付款</th>
                <!-- <th>編輯</th> -->
            </thead>
            <tbody>
                <tr v-for="item in orders" :key="item.id">
                    <td width="80">{{ new Date(item.create_at * 1000).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }) }}</td>
                    <td width="120">{{ item.user ? item.user.email : '' }}</td>
                    <td width="150">
                        <div v-for="product in item.products">{{ product.product.title }}：{{ product.qty }} {{ product.product.unit }}</div>
                    </td>
                    <td width="150" class="text-right">{{ item.total | currency }}</td>
                    <td width="120" v-if="item.is_paid" class="text-success">已付款</td>
                    <td width="120" v-else>尚未付款</td>
                    <!-- <td width="140">
                        <div class="btn-group">
                            <button class="btn btn-outline-primary">編輯</button>
                            <button class="btn btn-outline-danger">刪除</button>
                        </div>
                    </td> -->
                </tr>
            </tbody>
        </table>
        <Pagination :pagination="pagination" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            pagination: {},
            orders: [],
            
        }
    },
    computed: {
        isLoading() {
            return this.$store.state.isLoading;
        }
    },
    methods: {
        getOrders(page = 1) {
            const vm = this;
            vm.$store.dispatch('updateLoading', true);
            const apiPath = process.env.VUE_APP_API_PATH;
            const apiCustom = process.env.VUE_APP_API_CUSTOM;
            // console.log(apiPath, apiCustom);
            vm.$http.get(`${apiPath}/api/${apiCustom}/admin/orders?page=${page}`)
                .then((response) => {
                    // console.log(response.data);
                    vm.orders = response.data.orders;
                    vm.pagination = response.data.pagination;
                    vm.$store.dispatch('updateLoading', false);
                });
        },
    },
    created() {
        this.getOrders();
        this.$bus.$on('pageClick', (page = 1) => {
            this.getOrders(page);
        });
    }
}
</script>