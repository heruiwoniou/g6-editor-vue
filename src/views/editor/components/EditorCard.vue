<script>
import Vue from 'vue'
import draggable from '../common/draggable'

const EditorCardHeader = {
  functional: true,
  render(createElement, context) {
    return (
      <li
        class={[context.props.active ? 'active' : null]}
        disabled={context.props.disabled || false}
        on={context.listeners}
      >
        {context.props.name}
      </li>
    )
  }
}
export const EditorCardContent = {
  inject: ['context'],
  props: {
    name: String,
    disabled: Boolean
  },
  mounted() {
    this.context.headers.push({
      id: this._uid,
      name: this.name,
      disabled: this.disabled
    })
  },
  watch: {
    name(val) {
      const header = this.context.headers.find(({ id }) => id === this._uid)
      if (header) {
        header.name = val
      }
    },
    disabled(val) {
      const header = this.context.headers.find(({ id }) => id === this._uid)
      if (header) {
        header.disabled = val
      }
    }
  },
  render() {
    return <div class="editor-card__content">{this.$scopedSlots.default()}</div>
  }
}
export default {
  components: { EditorCardHeader },
  inject: ['context'],
  beforeCreate() {
    this._provided = {
      context: Vue.observable({
        headers: []
      })
    }
  },
  props: {
    vertical: Boolean,
    size: {
      type: Array,
      default() { return [200, 600] } 
    }
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  methods: {
    toggle(index) {
      this.$set(this, 'currentIndex', index)
    },
    bind() {
      const dragElement = this.$el.querySelector('.editor-card__daggable')
      const contentElement = this.$el.querySelector('.editor-card__content-wrapper')
      const attr = {
        from: this.vertical ? 'clientX' : 'clientY',
        to: this.vertical ? 'width' : 'height'
      }
      const [ min, max ] = this.size
      let startVal;
      let originalVal;
      draggable(dragElement, {
        start({ [attr.from]: val }) {
          startVal = val
          originalVal = contentElement.getBoundingClientRect()[attr.to]
        },
        drag({ [attr.from]: val }) {
          let distanceVal = startVal - val
          let finalVal = distanceVal + originalVal
          if (max && finalVal > max) {
            finalVal = max
          } else if (finalVal < min) {
            finalVal = min
          } else {
            requestAnimationFrame(() => contentElement.style[attr.to] = `${finalVal}px`)
          }
        },
        end() {
          startVal = 0
          originalVal = 0
        },
      })
    }
  },
  mounted() {
    this.$el && this.bind()
  },
  render() {
    const children = this.$scopedSlots.default && this.$scopedSlots.default()
    return (
      children && (
        <div class={['editor-card__wrapper', this.vertical && 'editor-card--vertical']}>
          <div class="editor-card__daggable"></div>
          <div class="editor-card">
            <div class="editor-card__header">
              <ul>
                {this.context.headers.map((headerProps, index) => {
                  const props = {
                    key: headerProps.id,
                    props: {
                      ...headerProps,
                      active: this.currentIndex === index
                    },
                    on: {
                      click: () => this.toggle(index)
                    }
                  }
                  return <EditorCardHeader {...props} />
                })}
              </ul>
            </div>
            <div class="editor-card__content-wrapper" style={{ [this.vertical ? 'width' : 'height']: `${this.size[0]}px` }}>
              {children.map((vnode, index) => {
                return (
                  <div style={this.currentIndex === index ? {} : { display: 'none' }}>{vnode}</div>
                )
              })}
            </div>
          </div>
        </div>
      )
    )
  }
}
</script>
<style lang="less">
.editor-card__wrapper {
  display: flex;
  flex-direction: column;
  .editor-card {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    .editor-card__header {
      background-color: #f5f7fa;
      border-bottom: 1px solid #e4e7ed;
      margin: 0;
      ul,
      li {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      ul {
        display: flex;
        flex-direction: row;
        margin-bottom: -1px;
        li {
          padding: 0 20px;
          height: 30px;
          box-sizing: border-box;
          line-height: 30px;
          display: inline-block;
          list-style: none;
          font-size: 14px;
          font-weight: 500;
          color: #303133;
          position: relative;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          border: 1px solid transparent;
          color: #909399;
          cursor: pointer;

          &.active {
            color: #409eff;
            background-color: #fff;
            border-right-color: #dcdfe6;
            border-left-color: #dcdfe6;
          }

          &:first-child {
            margin-left: -1px;
          }
        }
      }
    }
    .editor-card__content {
      text-align: left;
      padding: 15px;
    }
  }
  .editor-card__daggable {
    height: 5px;
    width: 100%;
    cursor: ns-resize;
  }

  &.editor-card--vertical {
    height: 100%;
    flex-direction: row;
    .editor-card {
      height: 100%;
      flex-direction: row;
      .editor-card__header {
        border-right: 1px solid #e4e7ed;
        border-bottom-color: transparent;
        ul {
          display: flex;
          flex-direction: column;
          margin-bottom: 0px;
          margin-right: -1px;
          li {
            padding: 20px 0px;
            height: auto;
            width: 30px;
            writing-mode: tb;
            line-height: 30px;
            border: 1px solid transparent;

            &.active {
              border-top-color: #dcdfe6;
              border-bottom-color: #dcdfe6;
            }

            &:first-child {
              margin-top: -1px;
              margin-left: 0px;
            }
          }
        }
      }
    }
    .editor-card__daggable {
      width: 5px;
      height: 100%;
      cursor: ew-resize
    }
  }
}
</style>
