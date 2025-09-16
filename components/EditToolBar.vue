<template>
  <div class="toolbar-container">
    <div class="toolbar">
   

    <!-- Thumbnails Tool -->
    <div class="tool">
      <div class="modern-tool-item" :class="{ active: showThumbnails }" @click="toggleThumbnails">
        <div class="modern-tool-icon">
          <i class="fa-solid fa-th-large"></i>
        </div>
        <div class="modern-tool-label">Thumbnails</div>
      </div>
    </div>

    <!-- Main Tools with Modern Design -->
    <div class="tool">
      <div class="modern-tool-item" :class="{ active: toolShow == 'hand' }" @click="enableSelector">
        <div class="modern-tool-icon">
          <i class="fa-regular fa-hand"></i>
        </div>
        <div class="modern-tool-label">Select</div>
      </div>
    </div>
    <div class="tool">
      <div class="modern-tool-item" :class="{ active: toolShow == 'brush' }" @click="enablePencil">
        <div class="modern-tool-icon">
          <i class="fa fa-pencil"></i>
        </div>
        <div class="modern-tool-label">Draw</div>
      </div>
    </div>
    <div class="tool">
      <div class="modern-tool-item" :class="{ active: toolShow == 'text' }" @click="enableText">
        <div class="modern-tool-icon">
          <i class="fa fa-font"></i>
        </div>
        <div class="modern-tool-label">Text</div>
      </div>
    </div>
    <div class="tool">
      <div class="modern-tool-item" :class="{ active: toolShow == 'shape' }" @click="toolShow = 'shape'">
        <div class="modern-tool-icon">
          <i class="fa-solid fa-shapes"></i>
        </div>
        <div class="modern-tool-label">Shapes</div>
      </div>
    </div>
    <div class="tool">
      <div class="modern-tool-item" @click="$emit('addImage')">
        <div class="modern-tool-icon">
          <i class="fa-regular fa-image"></i>
        </div>
        <div class="modern-tool-label">Image</div>
      </div>
    </div>
    <div class="tool">
      <div class="modern-tool-item" :class="{ active: toolShow == 'highlight' }" @click="enableHighlight">
        <div class="modern-tool-icon">
          <i class="fa-solid fa-highlighter"></i>
        </div>
        <div class="modern-tool-label">Highlight</div>
      </div>
    </div>
    <div class="tool">
      <div class="modern-tool-item" @click="$emit('deleteSelectedObject')">
        <div class="modern-tool-icon">
          <i class="fa fa-trash"></i>
        </div>
        <div class="modern-tool-label">Delete</div>
      </div>
    </div>

    <!-- Edit PDF Button -->
    <div class="tool edit-pdf-tool">
      <div class="modern-tool-item edit-pdf-item" @click="$emit('editPdf')" :class="{ disabled: isRendering }">
        <div class="modern-tool-icon">
          <i class="fa fa-download"></i>
        </div>
        <div class="modern-tool-label">Edit PDF</div>
      </div>
    </div>
  </div>
  <TextToolBar
      v-if="toolShow == 'text'"
      @set_font_family="set_font_family"
      @set_font_size="set_font_size"
      @set_font_style="set_font_style"
      @set_font_weight="set_font_weight"
      @set_font_color="set_font_color"
      @set_font_background_color="set_font_background_color"
      @set_font_underline="set_font_underline"
    />
    <EditTextToolBar
      v-show="toolShow == 'edit_text'"
      @set_font_family="edit_set_font_family"
      @set_font_size="edit_set_font_size"
      @set_font_style="edit_set_font_style"
      @set_font_weight="edit_set_font_weight"
      @set_font_underline="edit_set_font_underline"
      @set_font_color="edit_set_font_color"
      @set_font_background_color="edit_set_font_background_color"
      :fontFamilyProps="fontFamily"
      :fontStyleProps="fontStyle"
      :underlineProps="underline"
      :fontWeightProps="fontWeight"
    />
    <ShapeToolBar
      v-show="toolShow == 'shape'"
      @enableAddArrow="enableAddArrow"
      @enableRectangle="enableRectangle"
      @enableCircle="enableCircle"
      @enableLine="enableAddLine"
      @enableTriangle="enableTriangle"
      @enableStar="enableStar"
      @set_color="set_color"
    />
    <BrushToolBar
      v-show="toolShow == 'brush'"
      @set_color="set_color"
      @set_brushSize="(data) => $emit('set_brushSize', data)"
    />
    <HighlightToolBar
      v-show="toolShow == 'highlight'"
      @set_highlight_color="set_highlight_color"
      @set_highlight_opacity="set_highlight_opacity"
    />
  </div>
</template>
<script>
import EditTextToolBar from "./EditTextToolBar.vue";
import TextToolBar from "./TextToolBar.vue";
import ShapeToolBar from "./ShapeToolBar.vue";
import BrushToolBar from "./BrushToolBar.vue";
import HighlightToolBar from "./HighlightToolBar.vue";
import $ from "jquery";
export default {
  components: {
    EditTextToolBar,
    TextToolBar,
    ShapeToolBar,
    BrushToolBar,
    HighlightToolBar,
  },
  props: [
    "pages",
    "currentPageProps",
    "show_tools",
    "pdf",
    "activeObjectProps",
    "isRendering",
  ],
  data() {
    return {
      currentPage: 1,
      toolShow: null,
      temp: null,
      brushSize: 1,
      fontFamily: "Arial",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "normal",
      underline: false,
      color_pallet: "#000",
      activeObject: null,
      firsted: false,
      showThumbnails: false,
      highlightColor: "#ffff00",
      highlightOpacity: 0.3,
    };
  },
  watch: {
    currentPageProps(newValue) {
      this.currentPage = newValue;
    },
    show_tools(newValue) {
      this.toolShow = "edit_text";
      this.activeObject = this.activeObjectProps;
      console.log(newValue, this.toolShow);
    },
  },
  methods: {
    // Thumbnails functionality
    toggleThumbnails() {
      this.showThumbnails = !this.showThumbnails;
      this.$emit("toggleThumbnails", this.showThumbnails);
    },

    enablePencil() {
      this.toolShow = "brush";
      this.$emit("enablePencil");
    },
    enableSelector() {
      this.toolShow = "hand";
      this.$emit("enableSelector");
    },

    set_color(data) {
      this.pdf.setColor(data);
      this.color_pallet = data;
    },
    enableAddArrow() {
      this.pdf.setColor(this.color_pallet);
      this.pdf.enableAddArrow(function () {
        $('.modern-tool-item:has(.fa-hand)').click();
      });
    },
    enableAddLine() {
      this.pdf.setColor(this.color_pallet);
      this.pdf.enableAddLine(function () {
        $('.modern-tool-item:has(.fa-hand)').click();
      });
    },
    enableRectangle() {
      this.pdf.setColor(this.color_pallet);
      this.pdf.setBorderColor(this.color_pallet);
      // this.pdf.enableRectangle();
      this.pdf.enableRectangle(function () {
        $('.modern-tool-item:has(.fa-hand)').click();
      });
    },
    enableCircle() {
      this.pdf.setColor(this.color_pallet);
      this.pdf.setBorderColor(this.color_pallet);
      this.pdf.enableCircle();
    },
    enableTriangle() {
      this.pdf.setColor(this.color_pallet);
      this.pdf.setBorderColor(this.color_pallet);
      this.pdf.enableTriangle();
    },
    enableStar() {
      this.pdf.setColor(this.color_pallet);
      this.pdf.setBorderColor(this.color_pallet);
      this.pdf.enableStar();
    },
    enableText() {
      this.toolShow = "text";
      this.pdf.enableAddText();
      this.pdf.defaultFontStyle();
    },
    enableHighlight() {
      this.toolShow = "highlight";
      this.pdf.enableHighlight();
    },
    set_font_size(data) {
      this.fontSize = data;
      this.pdf.setFontSize(data);
    },
    set_font_family(data) {
      this.fontFamily = data;
      this.pdf.setFontFamily(data);
    },
    set_font_weight(data) {
      this.fontWeight = data;
      this.pdf.setFontWeight(data);
    },
    set_font_style(data) {
      this.fontStyle = data;
      this.pdf.setFontStyle(data);
    },
    set_font_underline(data) {
      this.underline = data;
      this.pdf.setFontUnderline(data);
    },
    set_font_color(data) {
      this.pdf.setFontColor(data);
      this.color_pallet = data;
    },
    set_font_background_color(data) {
      this.pdf.setFontBackgroundColor(data);
    },
    edit_set_font_color(data) {
      this.firsted = !this.firsted;
      this.activeObject.fill = data;
      if (this.firsted) {
        this.activeObject.fontSize = this.activeObject.fontSize + 1;
      } else {
        this.activeObject.fontSize = this.activeObject.fontSize - 1;
      }
      this.renderCanvas();
    },
    edit_set_font_background_color(data) {
      this.firsted = !this.firsted;
      this.activeObject.backgroundColor = data;
      if (this.firsted) {
        this.activeObject.fontSize = this.activeObject.fontSize + 1;
      } else {
        this.activeObject.fontSize = this.activeObject.fontSize - 1;
      }
      this.renderCanvas();
    },
    edit_set_font_underline(data) {
      this.underline = data;
      this.firsted = !this.firsted;
      this.activeObject.underline = data;
      if (this.firsted) {
        this.activeObject.fontSize = this.activeObject.fontSize + 1;
      } else {
        this.activeObject.fontSize = this.activeObject.fontSize - 1;
      }

      this.renderCanvas();
    },
    edit_set_font_size(data) {
      this.activeObject.fontSize = data;
      this.renderCanvas();
      this.fontSize = data;
    },
    edit_set_font_family(data) {
      this.activeObject.fontFamily = data;
      this.renderCanvas();
      this.fontFamily = data;
    },
    edit_set_font_weight(data) {
      this.activeObject.fontWeight = data;
      this.renderCanvas();
      this.fontWeight = data;
    },
    edit_set_font_style(data) {
      this.activeObject.fontStyle = data;
      this.renderCanvas();
      this.fontStyle = data;
    },
    renderCanvas() {
      var activeObject =
        this.pdf.fabricObjects[this.pdf.active_canvas].getActiveObject();

      if (activeObject?.text) {
        this.pdf.fabricObjects[this.pdf.active_canvas].remove(activeObject);
        this.pdf.fabricObjects[this.pdf.active_canvas].add(this.activeObject);
      }
      // this.pdf.fabricObjects[this.pdf.active_canvas].renderAll();
      // $('.modern-tool-item:has(.fa-hand)').click();
    },
    set_highlight_color(data) {
      this.highlightColor = data;
      this.pdf.setHighlightColor(data);
    },
    set_highlight_opacity(data) {
      this.highlightOpacity = data;
      this.pdf.setHighlightOpacity(data);
    },
  },
};
</script>
<style scoped>
@import "@/assets/css/toolbar.css";

/* Toolbar Container */
.toolbar-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Main Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  background-color: #f5f5fa;
  border-bottom: 1px solid #e0e0e0;
  padding: 8px 16px;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  min-height: 60px;
  flex-wrap: wrap;
}

/* Modern Tool Design */
.modern-tool-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  padding: 8px 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background-color: transparent;
}

.modern-tool-item:hover {
  background-color: #e8e8e8;
}

.modern-tool-item.active {
  background-color: #d0d0ff;
  color: #0000ff;
}

.modern-tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 16px;
  color: #47474f;
  margin-bottom: 4px;
}

.modern-tool-item.active .modern-tool-icon {
  color: #0000ff;
}

.modern-tool-label {
  font-size: 11px;
  font-weight: 500;
  color: #47474f;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
}

.modern-tool-item.active .modern-tool-label {
  color: #0000ff;
}

/* Special styling for thumbnails tool */
.tool:first-of-type .modern-tool-item {
  background-color: #e8e8ff;
  border: 2px solid #d0d0ff;
}

.tool:first-of-type .modern-tool-item.active {
  background-color: #d0d0ff;
  border-color: #a0a0ff;
}

/* Special styling for edit PDF button */
.edit-pdf-tool .edit-pdf-item {
  background-color: #0000ff;
  color: white;
  border: 2px solid #0000ff;
}

.edit-pdf-tool .edit-pdf-item:hover {
  background-color: #0000cc;
  border-color: #0000cc;
}

.edit-pdf-tool .edit-pdf-item.disabled {
  background-color: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.edit-pdf-tool .edit-pdf-item .modern-tool-icon,
.edit-pdf-tool .edit-pdf-item .modern-tool-label {
  color: white;
}

.edit-pdf-tool .edit-pdf-item.disabled .modern-tool-icon,
.edit-pdf-tool .edit-pdf-item.disabled .modern-tool-label {
  color: #666;
}

/* Enhanced Responsive Design */
@media (max-width: 1024px) {
  .toolbar {
    gap: 15px;
    padding: 8px 15px;
    min-height: 55px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
  }
  
  .modern-tool-item {
    min-width: 55px;
    padding: 8px 4px;
    flex-shrink: 0;
  }
  
  .modern-tool-icon {
    width: 24px;
    height: 24px;
    font-size: 16px;
  }
  
  .modern-tool-label {
    font-size: 11px;
  }
  
  .text-toolbar,
  .edit-text-toolbar,
  .brush-toolbar,
  .shape-toolbar {
    padding: 12px 18px;
    gap: 12px;
    overflow-x: auto;
    overflow-y: hidden;
  }
}

@media (max-width: 768px) {
  .toolbar {
    gap: 10px;
    padding: 6px 12px;
    min-height: 50px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }
  
  .modern-tool-item {
    min-width: 50px;
    padding: 6px 3px;
    flex-shrink: 0;
  }
  
  .modern-tool-icon {
    width: 22px;
    height: 22px;
    font-size: 15px;
  }
  
  .modern-tool-label {
    font-size: 10px;
  }
  
  .text-toolbar,
  .edit-text-toolbar,
  .brush-toolbar,
  .shape-toolbar {
    padding: 10px 15px;
    gap: 10px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }
}

@media (max-width: 640px) {
  .toolbar {
    gap: 8px;
    padding: 4px 8px;
    min-height: 45px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }
  
  .modern-tool-item {
    min-width: 45px;
    padding: 4px 2px;
    flex-shrink: 0;
    touch-action: manipulation;
  }
  
  .modern-tool-icon {
    width: 20px;
    height: 20px;
    font-size: 14px;
  }
  
  .modern-tool-label {
    font-size: 9px;
  }
  
  .text-toolbar,
  .edit-text-toolbar,
  .brush-toolbar,
  .shape-toolbar {
    padding: 8px 12px;
    gap: 8px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Hide labels on very small screens to save space */
  .modern-tool-label {
    display: none;
  }
  
  .modern-tool-item {
    min-width: 40px;
    padding: 6px 4px;
  }
}

@media (max-width: 480px) {
  .toolbar {
    gap: 6px;
    padding: 3px 6px;
    min-height: 40px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }
  
  .modern-tool-item {
    min-width: 38px;
    padding: 4px 2px;
    flex-shrink: 0;
    touch-action: manipulation;
  }
  
  .modern-tool-icon {
    width: 18px;
    height: 18px;
    font-size: 13px;
  }
  
  .modern-tool-label {
    display: none;
  }
  
  .text-toolbar,
  .edit-text-toolbar,
  .brush-toolbar,
  .shape-toolbar {
    padding: 6px 10px;
    gap: 6px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }
}

/* Ultra-small screens */
@media (max-width: 360px) {
  .toolbar {
    gap: 4px;
    padding: 2px 4px;
    min-height: 36px;
  }
  
  .modern-tool-item {
    min-width: 36px;
    padding: 3px 1px;
  }
  
  .modern-tool-icon {
    width: 16px;
    height: 16px;
    font-size: 12px;
  }
  
  .text-toolbar,
  .edit-text-toolbar,
  .brush-toolbar,
  .shape-toolbar {
    padding: 4px 8px;
    gap: 4px;
  }
}

/* Ensure sub-toolbars appear under the main toolbar */
.text-toolbar,
.edit-text-toolbar,
.brush-toolbar,
.shape-toolbar {
  position: relative !important;
  top: auto !important;
  padding-left: 0 !important;
  margin-top: 10px;
  border-top: 1px solid #e0e0e0;
  padding-top: 15px;
  background-color: #f8f9fa;
  border-radius: 0 0 8px 8px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding: 15px 20px;
}
</style>
