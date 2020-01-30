<template>
  <el-form :model="form" label-width="80px" ref="form">
    <el-form-item label="标题">
      <el-input v-model="form.title"></el-input>
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
    <el-form-item label="内容">
      <vue-editor
        v-if="form.type===1"
        :editorToolbar="customToolbar"
        @image-added="imgUpload"
        id="editor"
        useCustomImageHandler
        v-model="form.content"
      ></vue-editor>
      <el-upload
        v-if="form.type===2"
        class="upload-demo"
        action="http://localhost:8080/api/upload/"
        :headers="setToken()"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-success="successUpload"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
      </el-upload>
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
      fileList: [],
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
    //   上传视频，上传前判断是否为视频文件
    beforeUpload (file) {
      console.log(file)
      if (file.type.indexOf('video/') !== 0) {
        this.$message.warning('请选择视频文件')
      }
    },
    // 视频上传成功将视频路径赋值给content
    successUpload (response) {

      console.log('successUpload')
      console.log(response.data)
      console.log(response.message)
      if (response.message === '文件上传成功') {
        this.form.content = response.data.url
        console.log(response.data.url)
      }
    },
    // 获取token值
    setToken () {
      let token = localStorage.getItem('token')
      return { Authorization: token }
    },
    handleSuccess(res) {
      console.log('handleSuccess')
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
        // this.fileList.push({
        //   uid: 0,
        //   url: this.form.content
        // })
        // this.fileList.push(this.form.content)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
