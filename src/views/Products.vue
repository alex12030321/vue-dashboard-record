<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="d-flex justify-content-end my-3">
            <button class="btn btn-primary" @click="openModal(true)">建立新的產品</button>
        </div>
        <table class="table">
            <thead>
                <th>產品分類</th>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>編輯</th>
            </thead>
            <tbody>
                <tr v-for="item in products" :key="item.id">
                    <td width="120">{{ item.category }}</td>
                    <td>{{ item.title }}</td>
                    <td width="80" class="text-right">{{ item.origin_price | currency }}</td>
                    <td width="80" class="text-right">{{ item.price | currency }}</td>
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
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
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
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label for="image">輸入圖片網址</label>
                                    <input type="text" class="form-control" id="image" placeholder="請輸入圖片連結"
                                        v-model="tempProduct.imageUrl">
                                </div>
                                <div class="form-group">
                                    <label for="customFile">或 上傳圖片
                                        <!-- <i class="fas fa-spinner fa-spin"></i> -->
                                        <font-awesome-icon v-if="status.fileUploading" :icon="['fas', 'spinner']" spin
                                            spin-reverse />
                                    </label>
                                    <input type="file" id="customFile" class="form-control" ref="files"
                                        @change="uploadFile">
                                </div>
                                <img :src="tempProduct.imageUrl" class="img-fluid" alt="">
                            </div>
                            <div class="col-sm-8">
                                <div class="form-group">
                                    <label for="title">標題</label>
                                    <input type="text" class="form-control" id="title" placeholder="請輸入標題"
                                        v-model="tempProduct.title">
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="category">分類</label>
                                        <input type="text" class="form-control" id="category" placeholder="請輸入分類"
                                            v-model="tempProduct.category">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="price">單位</label>
                                        <input type="unit" class="form-control" id="unit" placeholder="請輸入單位"
                                            v-model="tempProduct.unit">
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="origin_price">原價</label>
                                        <input type="number" class="form-control" id="origin_price" placeholder="請輸入原價"
                                            v-model="tempProduct.origin_price">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="price">售價</label>
                                        <input type="number" class="form-control" id="price" placeholder="請輸入售價"
                                            v-model="tempProduct.price">
                                    </div>
                                </div>
                                <hr>

                                <div class="form-group">
                                    <label for="description">產品描述</label>
                                    <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述"
                                        v-model="tempProduct.description"></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="content">說明內容</label>
                                    <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容"
                                        v-model="tempProduct.content"></textarea>
                                </div>
                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="is_enabled"
                                            v-model="tempProduct.is_enabled" :true-value="1" :false-value="0">
                                        <label class="form-check-label" for="is_enabled">
                                            是否啟用
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="exampleModalLabel">
                            <span>刪除產品</span>
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-danger"
                            @click="deleteProduct(tempProduct.id)">確認刪除</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import currency from '@/filters/currency';

export default {
    name: 'Products',
    data() {
        return {
            products: [],
            tempProduct: {
                title: '',
                category: '',
                origin_price: '',
                price: '',
                unit: '',
                image: '',
                description: '',
                content: '',
                is_enabled: '',
                imageUrl: ''
            },
            isNew: false,
            updateTitle: '',
            
            status: {
                fileUploading: false
            },
            pagination: {},
        }
    },
    computed: {
        isLoading() {
            return this.$store.state.isLoading;
        }
    },
    methods: {
        getProducts(page = 1) {
            const vm = this;
            vm.$store.dispatch('updateLoading', true);
            const apiPath = process.env.VUE_APP_API_PATH;
            const apiCustom = process.env.VUE_APP_API_CUSTOM;
            // console.log(apiPath, apiCustom);
            vm.$http.get(`${apiPath}/api/${apiCustom}/admin/products?page=${page}`)
                .then((response) => {
                    // console.log(response.data);
                    vm.products = response.data.products;
                    vm.pagination = response.data.pagination;
                    vm.$store.dispatch('updateLoading', false);
                });
        },
        openModal(isNew, item) {
            if (isNew) {
                this.tempProduct = {};
                this.isNew = true;
                this.updateTitle = '新增產品'
            } else {
                this.tempProduct = Object.assign({}, item);
                this.isNew = false;
                this.updateTitle = `編輯：${this.tempProduct.title}`
            }
            $('#productModal').modal('show');
        },
        updateProduct() {
            const vm = this;
            const apiPath = process.env.VUE_APP_API_PATH;
            const apiCustom = process.env.VUE_APP_API_CUSTOM;
            let api = `${apiPath}/api/${apiCustom}/admin/product`;
            let httpMethod = 'post';
            if (!vm.isNew) {
                api = `${apiPath}/api/${apiCustom}/admin/product/${vm.tempProduct.id}`;
                httpMethod = 'put';
            }
            vm.$http[httpMethod](api, { data: vm.tempProduct })
                .then((response) => {
                    if (response.data.success) {
                        $('#productModal').modal('hide');
                        alert(response.data.message);
                        vm.getProducts();
                    } else {
                        $('#productModal').modal('hide');
                        vm.$bus.$emit('message:push', response.data.message, 'danger');
                        vm.getProducts();
                    }
                });
        },
        openDeleteModal(item) {
            this.tempProduct = { ...item };
            $('#delProductModal').modal('show');
        },
        deleteProduct(id) {
            const vm = this;
            const apiPath = process.env.VUE_APP_API_PATH;
            const apiCustom = process.env.VUE_APP_API_CUSTOM;
            let api = `${apiPath}/api/${apiCustom}/admin/product/${id}`;
            let httpMethod = 'delete';
            vm.$http[httpMethod](api)
                .then((response) => {
                    if (response.data.success) {
                        $('#delProductModal').modal('hide');
                        vm.getProducts();
                        alert(response.data.message);
                    } else {
                        $('#delProductModal').modal('hide');
                        vm.getProducts();
                        vm.$bus.$emit('message:push', response.data.message, 'danger');
                    }
                });
        },
        uploadFile() {
            const uploadedFile = this.$refs.files.files[0];
            const vm = this;
            vm.status.fileUploading = true;
            const formData = new FormData();
            formData.append('file-to-upload', uploadedFile);
            const api = `${process.env.VUE_APP_API_PATH}/api/${process.env.VUE_APP_API_CUSTOM}/admin/upload`;
            this.$http.post(api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((response) => {
                    vm.status.fileUploading = false;
                    if (response.data.success) {
                        vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
                        document.querySelector('#customFile').value = '';
                    } else {
                        vm.$bus.$emit('message:push', response.data.message, 'danger');
                    }
                });
        }
    },
    created() {
        this.getProducts();
        // this.$bus.$emit('message:push', 'A Message', 'success');

        // 自定義名稱 'pageClick'
        // page: 傳入頁碼參數，預設值為 1
        this.$bus.$on('pageClick', (page = 1) => {
            this.getProducts(page);
        });
    },
}
</script>