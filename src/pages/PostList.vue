<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="id" width="60">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缩略图" width="200">
        <template slot-scope="scope">
          <img
            :src="$fixImgUrl(scope.row.cover[0].url)"
            class="thumbnail"
            style="margin-left: 10px"
          />
        </template>
      </el-table-column>
      <el-table-column label="标题" width="500">
        <template slot-scope="scope">
          <div style="margin-left: 10px">{{ scope.row.title }}</div>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="500">
        <template slot-scope="scope">
          <div style="margin-left: 10px">{{ scope.row.user.nickname || '未命名'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)" size="mini">编辑</el-button>
          <el-button @click="handleDelete(scope.$index, scope.row)" size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <div class="demonstration" style="height:21px"></div>
      <el-pagination
        :page-sizes="[5, 10, 20, 30]"
        :total="100"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total,sizes,prev, pager, next"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pageIndex: 1,
      pageSize: 2
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getPostList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageIndex = val
      this.getPostList()
    },
    getPostList() {
      this.$axios({
        url: '/post',
        method: 'get',
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      }).then(res => {
        // const { data } = res.data
        // console.log(data)
        this.tableData = res.data
        console.log(this.tableData)
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        path: '/editpost',
        query: { id: row.id }
      })
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  },
  mounted() {
    this.getPostList()
  }
}
</script>
<style lang="less" scoped>
.thumbnail {
  width: 200px;
  height: 120px;
  object-fit: cover;
}
</style>
