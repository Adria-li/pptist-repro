<template>
  <div class="export-pptx-demo">
    <input type="file" accept=".json" @change="onFileChange" />
    <Button type="primary" :disabled="!slides" @click="exportSlides">导出 PPTX</Button>
    <FullscreenSpin :loading="exporting" tip="正在导出..." />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useExport from '@/hooks/useExport'
import Button from '@/components/Button.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'
import message from '@/utils/message'

const { exportPPTX, exporting } = useExport()
const slides = ref<any>(null)

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (evt) => {
    try {
      const json = JSON.parse(evt.target?.result as string)
      // 直接保存整个json对象
      slides.value = json
      if (!json.slides || !Array.isArray(json.slides)) {
        message.error('JSON 文件格式不正确，未找到 slides 数组')
      }
    } 
    catch (err) {
      message.error('JSON 解析失败')
      slides.value = null
    }
  }
  reader.readAsText(file)
}

function exportSlides() {
  if (!slides.value) return
  exportPPTX(slides.value, true, false)
}
</script>

<style scoped>
.export-pptx-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 20px;
}
</style>