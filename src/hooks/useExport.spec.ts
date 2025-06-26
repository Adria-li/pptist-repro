import { describe, it, expect, vi, beforeEach } from 'vitest'
import useExport from './useExport'

// mock file-saver
vi.mock('file-saver', () => ({ saveAs: vi.fn() }))
// mock pptxgenjs
const addSlideMock = vi.fn(() => ({
  addText: vi.fn(),
  addImage: vi.fn(),
  addChart: vi.fn(),
  addTable: vi.fn(),
  addNotes: vi.fn(),
  addShape: vi.fn(),
  addMedia: vi.fn(),
}))
const writeFileMock = vi.fn(() => Promise.resolve())
const defineLayoutMock = vi.fn()
const defineSlideMasterMock = vi.fn()
let pptxInstance: any = null
vi.mock('pptxgenjs', () => {
  return vi.fn().mockImplementation(() => {
    pptxInstance = {
      addSlide: addSlideMock,
      writeFile: writeFileMock,
      defineLayout: defineLayoutMock,
      defineSlideMaster: defineSlideMasterMock,
      layout: '',
    }
    return pptxInstance
  })
})
// mock tinycolor2
vi.mock('tinycolor2', () => {
  return () => ({
    getAlpha: () => 1,
    setAlpha: () => ({ toHexString: () => '#000000' }),
    toHexString: () => '#000000',
    analogous: () => [{ toHexString: () => '#000000' }],
  })
})
// mock html-to-image
vi.mock('html-to-image', () => ({ toPng: vi.fn(), toJpeg: vi.fn() }))
// mock @/store
vi.mock('@/store', () => ({
  useSlidesStore: () => ({
    slides: [
      {
        id: 'slide1',
        background: { type: 'solid', color: '#fff' },
        elements: [
          {
            type: 'text',
            left: 0, top: 0, width: 100, height: 50,
            content: '<p>hello</p>',
            fill: '#fff',
            opacity: 1,
          },
        ],
      },
    ],
    theme: { backgroundColor: '#fff' },
    viewportRatio: 0.5625,
    title: 'TestPPT',
    viewportSize: 960,
  }),
  storeToRefs: (store: any) => store,
}))
// mock @/utils/message
vi.mock('@/utils/message', () => ({ default: { error: vi.fn(), success: vi.fn() } }))
// mock @/utils/crypto
vi.mock('@/utils/crypto', () => ({ encrypt: (str: string) => str }))
// mock @/utils/svg2Base64
vi.mock('@/utils/svg2Base64', () => ({ svg2Base64: vi.fn(() => 'data:image/svg+xml;base64,xxx') }))
// mock @/utils/element
vi.mock('@/utils/element', () => ({ getElementRange: vi.fn(() => ({ minX: 0, maxX: 100, minY: 0, maxY: 50 })), getLineElementPath: vi.fn(), getTableSubThemeColor: vi.fn(() => ['#fff', '#eee']) }))
// mock @/utils/htmlParser
vi.mock('@/utils/htmlParser', () => ({ toAST: vi.fn(() => [{ tagName: 'p', content: 'hello', attributes: [] }]) }))
// mock @/utils/svgPathParser
vi.mock('@/utils/svgPathParser', () => ({ toPoints: vi.fn(() => [{ x: 0, y: 0, type: 'M' }]) }))

describe('useExport - 导入json后导出pptx', () => {
  it('should export PPTX from imported JSON', async () => {
    const { exportPPTX } = useExport()
    // 假设这是你导入的json内容
    const importedJson = require('D:/intern/HKGAI/ppt/嘻嘻嘻01 (1).json')
    // 只取 slides 字段
    await exportPPTX(importedJson.slides, true, false)
    expect(writeFileMock).toHaveBeenCalled()
  })
})