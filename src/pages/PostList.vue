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
      <el-table-column prop="create_date" label="日期" width="180">
        <template slot-scope="scope">{{scope.row.create_time|dataFormat}}</template>
      </el-table-column>
      <el-table-column label="昵称" width="500">
        <template slot-scope="scope">
          <div style="margin-left: 10px">{{ scope.row.nickname || '未命名'}}</div>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:20px">
      </el-pagination>
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
  filters: {
    dataFormat: (data, spe) => {
      data = new Date(data)
      spe = spe || '/'
      var nn = data.getFullYear()
      var mm = data.getMonth() + 1
      var dd = data.getDate()
      return nn + spe + mm + spe + dd
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
        this.total = res.data.num
        this.tableData = res.data.topics
        console.log(this.tableData.topics)
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
