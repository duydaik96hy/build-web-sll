<template>
  <div class="field-main">
    <span
      class="field-text"
      :class="[{ 'user-select': isFocus || model }, { 'current-border': model && !isFocus }]"
      v-if="props.label"
      @click="($refs as any).input.focus()"
      >{{ props.label }}</span
    >
    <input
      :type="props.type"
      v-model="model"
      ref="input"
      @focus="isFocus = true"
      @blur="isFocus = false"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  label: String,
  type: {
    type: String,
    default: 'text',
  },
})

const model = defineModel()

const isFocus = ref(false)
</script>

<style lang="scss" scoped>
.field-main {
  position: relative;
  margin: 20px 0 10px 0;
  background: #ffffff;
  .field-text {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    user-select: none;
    transition: all 0.15s linear;
    background: #ffffff;
    padding: 2px 5px;
    display: inline-block;
    color: gray;
  }
  .user-select {
    top: 0;
    border: 1px solid var(--el-color-primary);
    border-bottom-width: 0;
    border-radius: 6px;
    color: black;
  }
  .current-border {
    border: 1px solid rgba(180, 180, 180, 0.4);
    border-bottom-width: 0;
  }
  input {
    transition: all linear 0.15s;
    &:focus {
      border: 1px solid var(--el-color-primary);
    }
  }
}
</style>
