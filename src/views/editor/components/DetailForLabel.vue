<template>
  <el-form size="mini" ref="form" :model="form" :rules="rules" label-width="60px">
    <el-form-item label="ID" prop="id">
      <el-input size="mini" disabled v-model="form.id"></el-input>
    </el-form-item>
    <el-form-item label="名称" prop="label">
      <el-input size="mini" v-model="form.label" @input="submitForm('form')"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  model: {
    value: 'value',
    event: 'save'
  },
  props: {
    value: Object,
    commit: Function
  },
  data() {
    return {
      form: this.value,
      rules: {
        label: { required: true, message: '名称不能为空' }
      }
    }
  },
  watch: {
    value(val) {
      this.form = val
    } 
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.commit(cloneDeep(this.form))
        } else {
          return false
        }
      })
    }
  }
}
</script>
