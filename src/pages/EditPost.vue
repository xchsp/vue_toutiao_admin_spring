<template>
  <el-form :model="form" label-width="80px" ref="form">
    <el-form-item label="标题">
      <el-input v-model="form.title"></el-input>
    </el-form-item>
    <el-form-item label="内容">
      <vue-editor
        :editorToolbar="customToolbar"
        @image-added="imgUpload"
        id="editor"
        useCustomImageHandler
        v-model="form.content"
      ></vue-editor>
    </el-form-item>

    <el-form-item label="栏目">
      <el-checkbox-group v-model="form.categories">
        <el-checkbox
          :key="index"
          :label="item.id"
          v-for="(item,index) in categoryList"
        >{{item.name}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <!-- 图片上传组件 -->
    <el-form-item label="封面">
      <el-upload
        :action="$axios.defaults.baseURL + '/upload/'"
        :file-list="form.cover"
        :headers="{Authorization :token}"
        :on-remove="coverRemoved"
        :on-success="handleSuccess"
        list-type="picture-card"
        multiple
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>

    <el-form-item label="类型">
      <el-radio-group v-model="form.type">
        <el-radio :label="1">文章</el-radio>
        <el-radio :label="2">视频</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item style="margin-left: 40px;">
      <el-button @click="onSubmit" type="primary">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { VueEditor } from 'vue2-editor'
export default {
  components: {
    VueEditor
  },
  data() {
    return {
      postId: this.$route.query.id,
      token: 'Bearer '+ localStorage.getItem('token'),
      form: {
        title: '',
        categories: [],
        type: 1,
        content: '',
        cover: []
      },
      categoryList: [],
      customToolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image', 'code-block']
      ]
    }
  },
  methods: {
    handleSuccess(res) {
      this.form.cover.push({
        id: res.data.id,
        url: this.$fixImgUrl(res.data.url)
      })
      console.log(this.form.cover)
    },
    coverRemoved(file, fileList) {
      console.log(file) //file被删除图片
      console.log(fileList) //fileList  剩下的图片
      this.form.cover = fileList
    },
    imgUpload(file, Editor, cursorLocation, resetUploader) {
      var formData = new FormData()
      formData.append('file', file)
      this.$axios({
        url: '/upload/',
        method: 'POST',
        data: formData
      })
        .then(res => {
          console.log(res.data)
          let url = this.$axios.defaults.baseURL.replace("api","") + res.data.data.url // Get url from response
          Editor.insertEmbed(cursorLocation, 'image', url)
          resetUploader()
        })
        .catch(err => {
          console.log(err)
        })
    },
    onSubmit() {
      // 分类格式转换
      // const newList = []
      // this.form.categories.forEach(element => {
      //   newList.push({
      //     id: element
      //   })
      // })
      // this.form.categories = newList

      console.log(this.form)
      this.$axios({
        url: this.postId ? '/post_update/' + this.postId : '/posts',
        method: 'POST',
        data: this.form
      }).then(res => {
        console.log(res)
        alert('success')
      })
    }
  },
  mounted() {
    // 挂载完毕马上获取分类
    this.$axios({
      url: '/category',
      method: 'get'
    }).then(res => {
      // const { data } = res.data
      // console.log(data)
      let newCategoryList = []
      res.data.forEach(element => {
        // 过滤掉id=0关注和id=999的头条
        if (element.id != 0 && element.id != 999) {
          newCategoryList.push(element)
        }
      })
      this.categoryList = newCategoryList
    })

    // 路径带有id,获取文章详情
    if (this.postId) {
      this.$axios({
        url: '/post/' + this.postId,
        method: 'get'
      }).then(res => {
        // const { data } = res.data
        // console.log(data)
        const newList = []
        res.data.categories.forEach(element => {
          newList.push(element.id)
        })
        res.data.categories = newList

        res.data.cover.forEach((element, index) => {
          ;(element.url = this.$fixImgUrl(element.url)), (element.uid = index)
        })
        this.form = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
